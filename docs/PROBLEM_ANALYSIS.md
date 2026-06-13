# Problem Analysis: Carbon Footprint Educational Gap

## 1. Problem Statement & Scope

Climate change is a global crisis driven by greenhouse gas emissions, yet public engagement remains dangerously low. Despite widespread awareness of climate change as a general concept, individual action is stifled because everyday consumers **cannot connect their small daily decisions** (e.g. eating beef vs. a plant-based lunch, driving vs. riding a bike) to concrete global environmental impacts. 

Traditional carbon footprint calculators exist, but they fail to drive behavior change due to three critical gaps:
1. **High Cognitive Load**: They require users to input precise utility billing figures (kWh, cubic meters of gas) that the average consumer does not have on hand.
2. **Lack of Gamification and Social Proof**: The calculated results are presented as abstract, dry statistics (e.g., "12.4 tonnes of CO2e per year") with no peer context or gamified motivation to improve.
3. **No Direct Visual Impact**: Seeing a numerical metric does not trigger the emotional response needed to prompt a change in lifestyle. Users cannot "see" the damage their habits cause, nor can they visualize the beauty of an eco-friendly alternative.

---

## 2. Target Demographic & Stakeholders

EcoQuest is designed to target:
- **Everyday Citizens and Youth**: The primary segment looking to transition toward sustainable living but facing educational fatigue and inertia.
- **Educators and Students**: Schools seeking interactive, accessible climate-change tools for environmental science curricula.
- **Enterprise Employees**: Companies looking to integrate sustainability-focused engagement tools for corporate social responsibility (CSR) challenges.

---

## 3. The Current Gap in Environmental Tools

```
+-----------------------------------+-----------------------------------+
| Traditional Calculators           | EcoQuest Innovation               |
+-----------------------------------+-----------------------------------+
| - Lengthy form filling (15+ min)  | - Fast, scenario-based game (2min)|
| - Abstract metrics (metric tons)  | - Concrete scenario visualisations|
| - Text-only report                | - Vertex AI Veo generated video  |
| - Mono-lingual, high reading level| - Multi-lingual TTS audio tracks  |
| - Isolated static experience      | - Social leaderboard gamification |
+-----------------------------------+-----------------------------------+
```

---

## 4. Problem Statement Alignment

EcoQuest closes these gaps through **Actionable Interactive Education**:
- **Scenario Simulation**: The user roleplays typical scenarios (morning commute, lunch, evening chores) and makes selections.
- **Immediate Feedback Loop**: The user's score updates dynamically with visual meters.
- **Generative AI Storytelling**: To bridge the emotional gap, Vertex AI Veo 3.1 synthesizes a custom animated video illustrating the cumulative effect of their lifestyle decisions.
- **Multi-lingual Voiceover**: Integrating Text-to-Speech API voiceovers breaks down reading barriers, enabling accessibility across multiple local languages (English, Spanish, Hindi, etc.).
