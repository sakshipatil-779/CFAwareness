/**
 * Curated cinematic prompts for Veo 3.1 video generation.
 * Each prompt is engineered for maximum photorealism and narrative impact.
 * Prompts follow Veo best practices:
 *   - Subject first, then action, then style/camera/lighting
 *   - Specify duration, resolution, aspect ratio implicitly via language
 *   - Avoid negatives; describe what you WANT, not what you don't want
 */

import type { VideoTopic } from './videoScripts';

export interface VeoPrompt {
  /** Primary text prompt sent to Veo 3.1 */
  text: string;
  /** Short label for logging */
  label: string;
  /** Expected mood/color temperature for the frontend overlay */
  mood: 'hopeful' | 'urgent' | 'inspirational' | 'contemplative';
}

/**
 * Multiple prompts per topic — randomly rotated so users see variety.
 */
export const VEO_PROMPTS: Record<VideoTopic, VeoPrompt[]> = {

  // ── Carbon Awareness ─────────────────────────────────────────────────────
  carbon_awareness: [
    {
      label: 'split-world-contrast',
      mood: 'urgent',
      text: `Cinematic aerial timelapse contrasting two halves of the same modern city. Left side: smog-choked industrial district with belching factory chimneys, congested highways of cars, grey polluted sky, wilting trees. Right side: lush green eco-district with solar rooftops gleaming in sunlight, cyclists on clean tree-lined paths, crystal-clear sky, vibrant flowers blooming. The boundary between the two sides shifts gradually from left to right as renewable energy spreads. Golden hour lighting. Ultra-realistic photographic quality. Camera pulls back slowly to a majestic bird's-eye view of the entire city. 8 seconds, 1080p, cinematic 16:9.`,
    },
    {
      label: 'carbon-molecule-earth',
      mood: 'contemplative',
      text: `Ultra-realistic macro-to-cosmic camera journey. Begins extreme close-up on a single factory smokestack releasing a plume of dark grey smoke molecules, individual particles visible and sparkling. Camera pulls back through the pollution cloud, revealing a vast industrial landscape below. Continues pulling back through Earth's atmosphere, showing a thin golden-orange layer of CO2 wrapped around the blue planet like a fragile shell. Final shot: Earth from space, beautiful but surrounded by an almost imperceptible warming haze. Dramatic orchestral atmosphere. Photorealistic CGI quality. 8 seconds, 1080p.`,
    },
    {
      label: 'forest-vs-emissions',
      mood: 'hopeful',
      text: `Time-lapse cinematic sequence showing a pristine Amazon rainforest canopy in the morning mist, dew on giant leaves, exotic birds calling. Split screen transitions to a massive coal power plant at dusk, steam rising into a pink-orange sky. Then a beautiful solar farm in the desert at sunrise, thousands of panels reflecting the golden light. Final frame: a child's hands planting a small green seedling in rich dark soil, sunlight streaming through gaps in mature trees above. Warm, hopeful color grading. Photorealistic. 8 seconds, 1080p, 16:9.`,
    },
  ],

  // ── Green City ───────────────────────────────────────────────────────────
  green_city: [
    {
      label: 'futuristic-eco-city',
      mood: 'inspirational',
      text: `Breathtaking cinematic flyover of a near-future sustainable city at golden hour. Skyscrapers covered in vertical gardens and living walls of cascading green plants and flowers. Rooftop solar panels and small wind turbines on every building, glinting in the sun. Silent electric trams and autonomous vehicles on wide tree-lined boulevards. Citizens walking, cycling, and socializing in vast urban parks with crystal-clear rivers running through them. Drone camera smoothly banking through the city canyons, revealing more beauty around every corner. Highly photorealistic. 8 seconds, 1080p, cinematic wide-angle.`,
    },
    {
      label: 'city-transformation',
      mood: 'hopeful',
      text: `Stunning before-and-after time-lapse of a city street corner over 10 years. Begins as a grey concrete intersection with heavy traffic, billboards, and smog. Morphs progressively: trees planted and growing tall, cycle lanes appearing, buildings getting solar panels and green walls, cars replaced by electric vehicles and cyclists, air clearing to reveal a vivid blue sky. Final frame shows same corner as a vibrant, beautiful urban plaza with people sitting outdoors under solar-shaded seating areas. Magical realism aesthetic. Photorealistic. 8 seconds, 1080p.`,
    },
    {
      label: 'copenhagen-inspired',
      mood: 'inspirational',
      text: `Cinematic tour of a Scandinavian-inspired eco-city on a bright summer morning. Hundreds of cyclists crossing a beautiful modern bridge over a sparkling harbour. Waterfront cafes with solar-powered outdoor heaters. Children playing in a clean urban park where bees and butterflies visit wildflower meadows. Wind turbines visible on the distant horizon over a calm sea. Camera moves fluidly between intimate street-level moments and soaring aerial views. Warm, golden, photorealistic cinematography. 8 seconds, 1080p, 16:9.`,
    },
  ],

  // ── Transport ────────────────────────────────────────────────────────────
  transport: [
    {
      label: 'commute-comparison',
      mood: 'contemplative',
      text: `Cinematic split-screen comparison of two morning commutes. Left: A person stuck in gridlocked traffic in a diesel car, frustrated, surrounded by exhaust fumes, grey urban motorway. Right: A smiling person cycling through a beautiful tree-canopied cycle path, wind in their hair, birds flying alongside, morning sun dappling through leaves. Both arrive at the same modern office building — cyclist arrives fresh and energized, driver arrives stressed. Slow-motion final shot of cyclist locking up bike amid blooming flowers. Photorealistic. 8 seconds, 1080p.`,
    },
    {
      label: 'electric-future-transport',
      mood: 'inspirational',
      text: `Ultra-realistic cinematic montage of next-generation sustainable transport. A sleek electric high-speed train cutting through green countryside at sunrise. People boarding a modern solar-powered ferry on a sunlit harbour. A cyclist effortlessly gliding past classic architecture in a European city. A family walking through a car-free pedestrian zone with outdoor cafes and street musicians. Seamless transitions between each scene, tied together by warm golden light and a sense of freedom and possibility. 8 seconds, 1080p, 16:9.`,
    },
    {
      label: 'plane-vs-train-emissions',
      mood: 'urgent',
      text: `Dramatic photorealistic visualization comparing transport carbon emissions. A commercial jet aircraft leaves a thick contrail across a blue sky, with CO2 molecules visualized as golden particles trailing behind it. Cut to a modern high-speed rail train gliding silently through alpine scenery, its contrail a tiny whisp in comparison. Infographic-style numbers appear briefly showing the difference. Final shot: a person looking thoughtfully at a departure board choosing between flight and train options, sunlight streaming through the station's glass roof. Cinematic and educational. 8 seconds, 1080p.`,
    },
  ],

  // ── Energy ───────────────────────────────────────────────────────────────
  energy: [
    {
      label: 'solar-revolution',
      mood: 'inspirational',
      text: `Sweeping cinematic timelapse from dawn to dusk of a massive solar farm in a desert landscape. As the sun rises, thousands of solar panels tilt to track it, their surfaces catching the first golden rays and transforming them to visible arcs of electrical energy flowing toward a modern city on the horizon. Timelapse clouds throw dramatic moving shadows. At dusk, city lights glow powered by stored solar energy, stars appearing above. Photorealistic, awe-inspiring scale. Camera moves from ground-level panel detail to satellite-like overhead view. 8 seconds, 1080p.`,
    },
    {
      label: 'home-energy-choices',
      mood: 'hopeful',
      text: `Warm, intimate cinematic shots of a modern eco-home throughout a single day. Dawn: rooftop solar panels absorbing first light. Morning: smart thermostat adjusting automatically, LED lights switching on as family moves room to room. Afternoon: electric vehicle charging in the garage from home solar power, excess energy flowing to neighborhood grid shown as glowing lines. Evening: family cooking on induction hob, smart appliances running efficiently. Night: battery storage system glowing softly while house sleeps. Photorealistic cozy interior cinematography. 8 seconds, 1080p, 16:9.`,
    },
    {
      label: 'wind-and-solar-power',
      mood: 'inspirational',
      text: `Epic photorealistic wide-angle shot of an offshore wind farm at sunrise, turbines turning slowly in the golden mist over calm water, seagulls flying between them. Cut to a rooftop solar installation on a colourful row of houses in a European town, children waving from a garden below. Cut to an electric grid control room where operators monitor clean energy flows on massive screens. Final shot: a glowing light bulb close-up, but inside the filament, tiny wind turbines and solar panels are visible spinning and shining. 8 seconds, 1080p.`,
    },
  ],

  // ── Waste ────────────────────────────────────────────────────────────────
  waste: [
    {
      label: 'circular-economy',
      mood: 'hopeful',
      text: `Beautiful cinematic journey following a glass bottle through its circular life. Shown first as molten glass being shaped in a hot factory, golden and glowing. Then being filled with juice at a bright production line. Then purchased at a colorful market. Enjoyed by a person at a sunny picnic. Placed in a glass recycling bin. Transported to a recycling plant where it's melted and reborn as a new bottle, glowing golden again. Loop closes perfectly. Warm, life-affirming color palette. Photorealistic. 8 seconds, 1080p, 16:9.`,
    },
    {
      label: 'ocean-vs-recycling',
      mood: 'urgent',
      text: `Emotionally powerful split-screen. Left: Aerial view of a vast ocean garbage patch, plastic bottles and bags stretching to the horizon, a sea turtle tangled in plastic. Right: A vibrant recycling facility where workers sort plastic, metal and glass that flows along cheerful colour-coded conveyor belts, materials being baled and sent to transformation. Final merged frame: a clean tropical beach at sunset, waves washing over pristine white sand, families walking, no plastic in sight. Cinematic, documentary style. 8 seconds, 1080p.`,
    },
    {
      label: 'composting-and-nature',
      mood: 'contemplative',
      text: `Intimate, beautifully shot macro-cinematic sequence. Kitchen vegetable scraps — carrot tops, apple cores, coffee grounds — falling in slow motion into a wooden compost bin. Extreme close-up time-lapse of decomposition transforming scraps into dark, rich compost, teeming with earthworms and mycelium webs glowing faintly. Final shot: gloved hands scooping this same compost into a lush raised garden bed, seeds being planted, and in an accelerated final frame, vigorous green plants sprouting and flowering. Life from life. Photorealistic macro photography. 8 seconds, 1080p.`,
    },
  ],
};

/**
 * Select a prompt for a given topic — rotated by sessionId hash for variety.
 */
export function selectVeoPrompt(topic: VideoTopic, sessionId: string): VeoPrompt {
  const prompts = VEO_PROMPTS[topic] ?? VEO_PROMPTS.carbon_awareness;
  // Simple hash of sessionId to pick a prompt index deterministically
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash * 31 + sessionId.charCodeAt(i)) & 0x7fffffff;
  }
  return prompts[hash % prompts.length]!;
}
