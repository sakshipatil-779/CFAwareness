import { Router } from 'express';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { LRUCache } from 'lru-cache';

export const analyzeRouter = Router();

// ── In-Memory Cache ─────────────────────────────────────────────────────────────
const analysisCache = new LRUCache<string, unknown>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour
});

// ── Request schema ─────────────────────────────────────────────────────────────
const AnalyzeRequestSchema = z.object({
  userId:           z.string().min(1),
  language:         z.enum(['en', 'hi', 'es', 'fr', 'de', 'pt', 'ar', 'ja', 'zh']),
  totalEcoPoints:   z.number().min(0).max(300),
  totalCarbonSaved: z.number().min(0),
  decisions: z.array(
    z.object({
      scenarioId:  z.string(),
      choiceId:    z.string(),
      ecoPoints:   z.number(),
      carbonSaved: z.number(),
      timestamp:   z.number(),
    }),
  ),
});


type AnalyzeRequest  = z.infer<typeof AnalyzeRequestSchema>;
type DecisionItem    = AnalyzeRequest['decisions'][number];

// ── Grade helper ───────────────────────────────────────────────────────────────
function getGrade(points: number): string {
  if (points >= 180) return 'S';
  if (points >= 140) return 'A';
  if (points >= 100) return 'B';
  if (points >= 60)  return 'C';
  return 'D';
}

const GRADE_LABELS: Record<string, Record<string, string>> = {
  en: { S: 'Eco Legend',    A: 'Eco Hero',    B: 'Green Champion', C: 'Eco Learner', D: 'New Leaf' },
  hi: { S: 'इको लीजेंड',   A: 'इको हीरो',   B: 'ग्रीन चैंपियन',  C: 'इको सीखने वाला', D: 'नई शुरुआत' },
  es: { S: 'Leyenda Eco',   A: 'Héroe Eco',   B: 'Campeón Verde',  C: 'Aprendiz Eco', D: 'Hoja Nueva' },
};

// ── Prompt builder ─────────────────────────────────────────────────────────────
function buildPrompt(
  language: string,
  totalEcoPoints: number,
  totalCarbonSaved: number,
  decisions: DecisionItem[],
  grade: string,
): string {
  const langNames: Record<string, string> = { en: 'English', hi: 'Hindi', es: 'Spanish' };

  const decisionList = decisions
    .map((d) => `  - ${d.scenarioId}: chose "${d.choiceId}" → +${d.ecoPoints} Eco-Points, ${d.carbonSaved.toFixed(1)} kg CO₂ saved`)
    .join('\n');

  const targetLang = langNames[language] ?? 'English';

  return `You are an empathetic AI eco-coach for EcoQuest, a carbon footprint awareness game.
A player just completed all 3 game scenarios. Here are their results:

Grade: ${grade}
Total Eco-Points: ${totalEcoPoints} / 200
Total CO₂ Saved: ${totalCarbonSaved.toFixed(2)} kg
Decisions:
${decisionList}

Your task:
1. Write a SHORT, ENCOURAGING personalized analysis (2-3 sentences, max 80 words) in ${targetLang}.
   - Mention their specific grade and eco-point total.
   - Highlight their best choice (highest ecoPoints decision).
   - If any choice had 0 carbonSaved, gently acknowledge that area for improvement.
   - Keep it warm, motivating, and non-judgmental.

2. Generate exactly 2-3 actionable eco-tips in ${targetLang}.
   - Focus tips on their lower-scoring scenario choices.
   - Keep each tip under 15 words.
   - Be specific and practical (e.g., "Cycle to work 3x/week to save 6 kg CO₂ monthly").

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "analysisText": "...",
  "tips": ["tip1", "tip2", "tip3"]
}`;
}

// ── Gemini client (lazy-init so missing key gives a graceful fallback) ──────────
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

// ── Route handler ──────────────────────────────────────────────────────────────
analyzeRouter.post('/', async (req, res) => {
  const parsed = AnalyzeRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { language, totalEcoPoints, totalCarbonSaved, decisions } = parsed.data;
  const grade      = getGrade(totalEcoPoints);
  const gradeLabel = (GRADE_LABELS[language] ?? GRADE_LABELS['en'])[grade] ?? 'Eco Adventurer';

  const cacheKey = `${language}_${decisions.map(d => d.choiceId).join('-')}`;
  if (analysisCache.has(cacheKey)) {
    res.json(analysisCache.get(cacheKey));
    return;
  }

  const client = getGenAI();

  // ── Gemini path ──────────────────────────────────────────────────────────────
  if (client) {
    try {
      const model = client.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature:      0.7,
          maxOutputTokens:  512,
          responseMimeType: 'application/json',
        },
      });

      const prompt = buildPrompt(language, totalEcoPoints, totalCarbonSaved, decisions, grade);
      const result = await model.generateContent(prompt);
      const text   = result.response.text().trim();

      let geminiData: { analysisText?: string; tips?: string[] } = {};
      try {
        // Strip any accidental markdown fences
        const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
        geminiData = JSON.parse(cleaned) as { analysisText?: string; tips?: string[] };
      } catch {
        console.warn('[analyze] Gemini returned non-JSON, using raw text');
        geminiData = { analysisText: text, tips: [] };
      }

      const payload = {
        analysisText: geminiData.analysisText ?? text,
        tips:         Array.isArray(geminiData.tips) ? geminiData.tips : [],
        audioUrl:     null,
        score: {
          label: gradeLabel,
          value: totalEcoPoints,
          grade,
        },
      };

      analysisCache.set(cacheKey, payload);
      res.json(payload);
      return;
    } catch (err) {
      console.error('[analyze] Gemini API error:', (err as Error).message);
      // Fall through to local fallback below
    }
  } else {
    console.warn('[analyze] GEMINI_API_KEY not set — using local fallback');
  }

  // ── Local fallback (no API key or Gemini error) ───────────────────────────
  const bestDecision  = [...decisions].sort((a, b) => b.ecoPoints - a.ecoPoints)[0];
  const worstDecision = [...decisions].sort((a, b) => a.ecoPoints - b.ecoPoints)[0];

  const fallbackTexts: Record<string, Record<string, string>> = {
    en: {
      S: `Outstanding! You scored ${totalEcoPoints} Eco-Points and saved ${totalCarbonSaved.toFixed(1)} kg CO₂ — truly legendary! Your "${bestDecision?.choiceId}" choice was exceptional. You're an inspiration to eco-warriors everywhere!`,
      A: `Excellent work! ${totalEcoPoints} Eco-Points and ${totalCarbonSaved.toFixed(1)} kg CO₂ saved — you're an eco hero! Your "${bestDecision?.choiceId}" choice stood out. A little more effort on ${worstDecision?.scenarioId} could push you to legend status!`,
      B: `Great effort! You scored ${totalEcoPoints} Eco-Points and saved ${totalCarbonSaved.toFixed(1)} kg CO₂. Your "${bestDecision?.choiceId}" choice was your green highlight. Keep building those eco-habits!`,
      C: `Good start! ${totalEcoPoints} Eco-Points and ${totalCarbonSaved.toFixed(1)} kg CO₂ saved. Every sustainable choice matters. Focus on improving your ${worstDecision?.scenarioId} decisions next time!`,
      D: `Welcome to your eco-journey! You scored ${totalEcoPoints} Eco-Points. There's a lot of room to grow — small changes in your ${worstDecision?.scenarioId} routine can make a big difference!`,
    },
    hi: {
      S: `अविश्वसनीय! आपने ${totalEcoPoints} इको-पॉइंट और ${totalCarbonSaved.toFixed(1)} kg CO₂ बचाया! आप सच्चे इको चैंपियन हैं!`,
      A: `बेहतरीन! ${totalEcoPoints} इको-पॉइंट और ${totalCarbonSaved.toFixed(1)} kg CO₂ की बचत। आपका "${bestDecision?.choiceId}" निर्णय शानदार था!`,
      B: `अच्छा प्रयास! ${totalEcoPoints} इको-पॉइंट और ${totalCarbonSaved.toFixed(1)} kg CO₂ बचत। हरी आदतें बनाते रहें!`,
      C: `अच्छी शुरुआत! ${totalEcoPoints} पॉइंट। हर टिकाऊ विकल्प मायने रखता है। अगली बार और बेहतर करें!`,
      D: `EcoQuest में आपका स्वागत है! ${totalEcoPoints} पॉइंट — आगे बढ़ने की बहुत गुंजाइश है!`,
    },
    es: {
      S: `¡Extraordinario! ${totalEcoPoints} Eco-Puntos y ${totalCarbonSaved.toFixed(1)} kg CO₂ ahorrado. ¡Eres una leyenda ecológica!`,
      A: `¡Excelente! ${totalEcoPoints} Eco-Puntos y ${totalCarbonSaved.toFixed(1)} kg CO₂ ahorrado. Tu elección "${bestDecision?.choiceId}" fue destacada. ¡Sigue así!`,
      B: `¡Buen trabajo! ${totalEcoPoints} Eco-Puntos y ${totalCarbonSaved.toFixed(1)} kg CO₂ ahorrado. ¡Continúa construyendo hábitos ecológicos!`,
      C: `¡Buen comienzo! ${totalEcoPoints} puntos. Cada elección sostenible cuenta. ¡Mejora tu ${worstDecision?.scenarioId} la próxima vez!`,
      D: `¡Bienvenido a EcoQuest! ${totalEcoPoints} puntos — ¡hay mucho margen para crecer!`,
    },
  };

  const fallbackTips: Record<string, Record<string, string[]>> = {
    en: {
      S: ['Share your eco-journey to inspire friends!', 'Try a full zero-emission commute week.'],
      A: ['Cycle for distances under 5 km.', 'Choose plant-based meals 3x per week.'],
      B: ['Use public transport daily to save ~3 kg CO₂/week.', 'Try one plant-based meal each day.', 'Switch to LED bulbs at home.'],
      C: ['Walk or cycle for short trips.', 'Opt for vegetarian meals more often.', 'Unplug idle devices to reduce energy use.'],
      D: ['Replace one car trip with public transport this week.', 'Try a plant-based meal today.', 'Turn off lights and devices when not in use.'],
    },
    hi: {
      S: ['दूसरों को प्रेरित करें!', 'हर रोज साइकिल चलाएं।'],
      A: ['5km से कम दूरी के लिए साइकिल लें।', 'सप्ताह में 3 बार शाकाहारी खाएं।'],
      B: ['रोज बस/मेट्रो से जाएं।', 'शाकाहारी भोजन अपनाएं।', 'LED बल्ब लगाएं।'],
      C: ['पैदल चलें या साइकिल चलाएं।', 'LED बल्ब लगाएं।', 'बेकार उपकरण बंद करें।'],
      D: ['एक बार बस से जाएं।', 'शाकाहारी खाना आजमाएं।', 'इस्तेमाल न होने पर उपकरण बंद करें।'],
    },
    es: {
      S: ['¡Inspira a otros con tu ejemplo!', 'Sigue eligiendo transporte cero emisiones.'],
      A: ['Usa bicicleta para trayectos de menos de 5 km.', 'Come vegetal 3 veces por semana.'],
      B: ['Usa transporte público a diario.', 'Prueba una comida vegetal al día.', 'Cambia a bombillas LED.'],
      C: ['Camina o usa bici para trayectos cortos.', 'Come vegetariano con más frecuencia.', 'Desenchufa dispositivos en desuso.'],
      D: ['Reemplaza un viaje en auto con transporte público.', 'Prueba una comida vegetal hoy.', 'Apaga luces al salir.'],
    },
  };

  const langFallback = fallbackTexts[language] ?? fallbackTexts['en'];
  const langTips     = fallbackTips[language]  ?? fallbackTips['en'];

  const payload = {
    analysisText: langFallback[grade]  ?? langFallback['D'],
    tips:         langTips[grade]      ?? langTips['D'],
    audioUrl:     null,
    score: {
      label: gradeLabel,
      value: totalEcoPoints,
      grade,
    },
  };

  analysisCache.set(cacheKey, payload);
  res.json(payload);
});
