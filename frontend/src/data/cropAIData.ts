// ─────────────────────────────────────────────────────────────
//  AI CROP ADVISOR — Data Model
//  KisanMitra SmartProcure Platform
//  Source: CACP MSP data, ICAR soil research, IMD seasonal normals
// ─────────────────────────────────────────────────────────────

export type Season = 'Kharif' | 'Rabi' | 'Zaid';
export type SoilType = 'Black Cotton' | 'Red Laterite' | 'Alluvial' | 'Sandy Loam' | 'Clay' | 'Loamy' | 'Sandy';
export type RainfallLevel = 'Low (<500mm)' | 'Medium (500–1000mm)' | 'High (>1000mm)';

// ── MSP Historical + Predicted Prices (per quintal ₹) ──────
export interface CropPriceRecord {
  crop: string;
  emoji: string;
  category: string;
  season: Season;
  mspHistory: { year: string; msp: number; marketAvg: number }[];
  currentMSP: number;
  predictedMSP: { label: string; price: number; confidence: number }[];
  yieldPerAcre: string;    // quintals
  profitMargin: string;    // percent range
}

export const cropPriceData: CropPriceRecord[] = [
  {
    crop: 'Paddy (Common)', emoji: '🌾', category: 'Cereal', season: 'Kharif',
    currentMSP: 2300,
    mspHistory: [
      { year: '2020-21', msp: 1868, marketAvg: 1920 },
      { year: '2021-22', msp: 1940, marketAvg: 2010 },
      { year: '2022-23', msp: 2040, marketAvg: 2120 },
      { year: '2023-24', msp: 2183, marketAvg: 2280 },
      { year: '2024-25', msp: 2300, marketAvg: 2410 },
    ],
    predictedMSP: [
      { label: 'Oct 2026', price: 2350, confidence: 94 },
      { label: 'Jan 2027', price: 2400, confidence: 89 },
      { label: 'Apr 2027', price: 2460, confidence: 82 },
      { label: 'Jul 2027', price: 2520, confidence: 74 },
    ],
    yieldPerAcre: '20–28', profitMargin: '28–38'
  },
  {
    crop: 'Wheat', emoji: '🌿', category: 'Cereal', season: 'Rabi',
    currentMSP: 2275,
    mspHistory: [
      { year: '2020-21', msp: 1975, marketAvg: 2030 },
      { year: '2021-22', msp: 2015, marketAvg: 2090 },
      { year: '2022-23', msp: 2015, marketAvg: 2150 },
      { year: '2023-24', msp: 2150, marketAvg: 2240 },
      { year: '2024-25', msp: 2275, marketAvg: 2360 },
    ],
    predictedMSP: [
      { label: 'Dec 2026', price: 2350, confidence: 95 },
      { label: 'Mar 2027', price: 2420, confidence: 90 },
      { label: 'Jun 2027', price: 2490, confidence: 83 },
      { label: 'Sep 2027', price: 2570, confidence: 76 },
    ],
    yieldPerAcre: '18–24', profitMargin: '30–42'
  },
  {
    crop: 'Cotton (Medium Staple)', emoji: '☁️', category: 'Cash Crop', season: 'Kharif',
    currentMSP: 7121,
    mspHistory: [
      { year: '2020-21', msp: 5515, marketAvg: 5800 },
      { year: '2021-22', msp: 5726, marketAvg: 6400 },
      { year: '2022-23', msp: 6080, marketAvg: 7200 },
      { year: '2023-24', msp: 6620, marketAvg: 7100 },
      { year: '2024-25', msp: 7121, marketAvg: 7500 },
    ],
    predictedMSP: [
      { label: 'Oct 2026', price: 7400, confidence: 88 },
      { label: 'Jan 2027', price: 7700, confidence: 81 },
      { label: 'Apr 2027', price: 8050, confidence: 73 },
      { label: 'Jul 2027', price: 8350, confidence: 65 },
    ],
    yieldPerAcre: '8–14', profitMargin: '35–50'
  },
  {
    crop: 'Groundnut', emoji: '🥜', category: 'Oilseed', season: 'Kharif',
    currentMSP: 6783,
    mspHistory: [
      { year: '2020-21', msp: 5275, marketAvg: 5600 },
      { year: '2021-22', msp: 5550, marketAvg: 5900 },
      { year: '2022-23', msp: 5850, marketAvg: 6200 },
      { year: '2023-24', msp: 6377, marketAvg: 6700 },
      { year: '2024-25', msp: 6783, marketAvg: 7100 },
    ],
    predictedMSP: [
      { label: 'Oct 2026', price: 7050, confidence: 87 },
      { label: 'Jan 2027', price: 7350, confidence: 79 },
      { label: 'Apr 2027', price: 7650, confidence: 71 },
      { label: 'Jul 2027', price: 7900, confidence: 63 },
    ],
    yieldPerAcre: '10–16', profitMargin: '32–46'
  },
  {
    crop: 'Maize', emoji: '🌽', category: 'Cereal', season: 'Kharif',
    currentMSP: 2090,
    mspHistory: [
      { year: '2020-21', msp: 1850, marketAvg: 1920 },
      { year: '2021-22', msp: 1870, marketAvg: 1940 },
      { year: '2022-23', msp: 1962, marketAvg: 2050 },
      { year: '2023-24', msp: 2090, marketAvg: 2180 },
      { year: '2024-25', msp: 2090, marketAvg: 2210 },
    ],
    predictedMSP: [
      { label: 'Oct 2026', price: 2160, confidence: 91 },
      { label: 'Jan 2027', price: 2230, confidence: 85 },
      { label: 'Apr 2027', price: 2300, confidence: 78 },
      { label: 'Jul 2027', price: 2380, confidence: 70 },
    ],
    yieldPerAcre: '20–30', profitMargin: '25–38'
  },
  {
    crop: 'Soyabean (Yellow)', emoji: '🫘', category: 'Oilseed', season: 'Kharif',
    currentMSP: 4892,
    mspHistory: [
      { year: '2020-21', msp: 3880, marketAvg: 4100 },
      { year: '2021-22', msp: 3950, marketAvg: 4500 },
      { year: '2022-23', msp: 4300, marketAvg: 4800 },
      { year: '2023-24', msp: 4600, marketAvg: 4900 },
      { year: '2024-25', msp: 4892, marketAvg: 5100 },
    ],
    predictedMSP: [
      { label: 'Oct 2026', price: 5100, confidence: 86 },
      { label: 'Jan 2027', price: 5350, confidence: 79 },
      { label: 'Apr 2027', price: 5600, confidence: 71 },
      { label: 'Jul 2027', price: 5850, confidence: 63 },
    ],
    yieldPerAcre: '8–14', profitMargin: '28–40'
  },
  {
    crop: 'Moong Dal (Green Gram)', emoji: '🟢', category: 'Pulse', season: 'Kharif',
    currentMSP: 8682,
    mspHistory: [
      { year: '2020-21', msp: 7196, marketAvg: 7600 },
      { year: '2021-22', msp: 7275, marketAvg: 7900 },
      { year: '2022-23', msp: 7755, marketAvg: 8400 },
      { year: '2023-24', msp: 8558, marketAvg: 9000 },
      { year: '2024-25', msp: 8682, marketAvg: 9200 },
    ],
    predictedMSP: [
      { label: 'Oct 2026', price: 9000, confidence: 85 },
      { label: 'Jan 2027', price: 9350, confidence: 77 },
      { label: 'Apr 2027', price: 9700, confidence: 69 },
      { label: 'Jul 2027', price: 10050, confidence: 60 },
    ],
    yieldPerAcre: '4–6', profitMargin: '30–45'
  },
  {
    crop: 'Sunflower', emoji: '🌻', category: 'Oilseed', season: 'Rabi',
    currentMSP: 7280,
    mspHistory: [
      { year: '2020-21', msp: 5885, marketAvg: 6100 },
      { year: '2021-22', msp: 6015, marketAvg: 6300 },
      { year: '2022-23', msp: 6400, marketAvg: 6800 },
      { year: '2023-24', msp: 6760, marketAvg: 7100 },
      { year: '2024-25', msp: 7280, marketAvg: 7600 },
    ],
    predictedMSP: [
      { label: 'Dec 2026', price: 7550, confidence: 88 },
      { label: 'Mar 2027', price: 7850, confidence: 81 },
      { label: 'Jun 2027', price: 8200, confidence: 72 },
      { label: 'Sep 2027', price: 8500, confidence: 63 },
    ],
    yieldPerAcre: '5–8', profitMargin: '32–44'
  },
];

// ── Crop Recommendation Engine ──────────────────────────────
export interface CropRecommendation {
  crop: string;
  emoji: string;
  score: number;          // 0–100 AI confidence
  msp: number;
  season: Season;
  soilFit: string;
  waterNeeds: 'Low' | 'Medium' | 'High';
  duration: string;
  expectedYield: string;
  expectedRevenue: string;
  reasons: string[];
  risks: string[];
}

export function recommendCrops(params: {
  season: Season;
  soilType: SoilType;
  rainfall: RainfallLevel;
  district: string;
}): CropRecommendation[] {
  const { season, soilType, rainfall } = params;

  const allCrops: CropRecommendation[] = [
    // KHARIF
    {
      crop: 'Paddy', emoji: '🌾', season: 'Kharif', msp: 2300,
      soilFit: 'Clay, Alluvial, Black Cotton',
      waterNeeds: 'High', duration: '90–120 days',
      expectedYield: '20–28 qtl/acre', expectedRevenue: '₹46,000–64,000/acre',
      reasons: ['High water retention in clay soils', 'Guaranteed MSP procurement', 'Suitable for AP/Telangana climate'],
      risks: ['Blast disease risk in humid weather', 'Needs standing water for 45 days'],
      score: 0
    },
    {
      crop: 'Cotton', emoji: '☁️', season: 'Kharif', msp: 7121,
      soilFit: 'Black Cotton, Deep Alluvial',
      waterNeeds: 'Medium', duration: '150–180 days',
      expectedYield: '8–14 qtl/acre', expectedRevenue: '₹57,000–1,00,000/acre',
      reasons: ['Black cotton soil is ideal for moisture retention', 'High MSP of ₹7,121/qtl', 'Long growing season gives big yields'],
      risks: ['Bollworm pest pressure', 'Price volatile post-harvest'],
      score: 0
    },
    {
      crop: 'Groundnut', emoji: '🥜', season: 'Kharif', msp: 6783,
      soilFit: 'Red Laterite, Sandy Loam, Loamy',
      waterNeeds: 'Medium', duration: '90–120 days',
      expectedYield: '10–16 qtl/acre', expectedRevenue: '₹68,000–1,08,000/acre',
      reasons: ['Excellent fit for red laterite soils of AP', 'High MSP value', 'Drought-tolerant once established'],
      risks: ['Aflatoxin contamination if moisture > 9%', 'Leaf spot disease'],
      score: 0
    },
    {
      crop: 'Maize', emoji: '🌽', season: 'Kharif', msp: 2090,
      soilFit: 'Alluvial, Loamy, Sandy Loam',
      waterNeeds: 'Medium', duration: '80–95 days',
      expectedYield: '20–30 qtl/acre', expectedRevenue: '₹42,000–63,000/acre',
      reasons: ['Fast growing, quick income', 'Good demand for poultry/starch industry', 'Low input cost'],
      risks: ['Fall Armyworm pest', 'Needs good drainage'],
      score: 0
    },
    {
      crop: 'Soyabean', emoji: '🫘', season: 'Kharif', msp: 4892,
      soilFit: 'Black Cotton, Alluvial, Loamy',
      waterNeeds: 'Medium', duration: '90–110 days',
      expectedYield: '8–14 qtl/acre', expectedRevenue: '₹39,000–68,000/acre',
      reasons: ['Nitrogen-fixing legume improves soil health', 'Rising demand for edible oil', 'Good MSP support'],
      risks: ['Yellow Mosaic Virus', 'Waterlogging causes root rot'],
      score: 0
    },
    {
      crop: 'Moong Dal', emoji: '🟢', season: 'Kharif', msp: 8682,
      soilFit: 'Sandy Loam, Loamy, Red Laterite',
      waterNeeds: 'Low', duration: '60–75 days',
      expectedYield: '4–6 qtl/acre', expectedRevenue: '₹35,000–52,000/acre',
      reasons: ['Shortest duration — 2 crops per year possible', 'High MSP per quintal', 'Improves soil nitrogen'],
      risks: ['Yellow Mosaic disease', 'Rain at flowering causes pod shedding'],
      score: 0
    },
    // RABI
    {
      crop: 'Wheat', emoji: '🌿', season: 'Rabi', msp: 2275,
      soilFit: 'Alluvial, Loamy, Clay Loam',
      waterNeeds: 'Medium', duration: '100–130 days',
      expectedYield: '18–24 qtl/acre', expectedRevenue: '₹41,000–55,000/acre',
      reasons: ['Very high MSP stability', 'Strong govt procurement network', 'Excellent in alluvial plains'],
      risks: ['Rust disease in humid conditions', 'Late frost can damage flowering'],
      score: 0
    },
    {
      crop: 'Chana (Chickpea)', emoji: '🟤', season: 'Rabi', msp: 5440,
      soilFit: 'Black Cotton, Sandy Loam, Loamy',
      waterNeeds: 'Low', duration: '95–110 days',
      expectedYield: '6–10 qtl/acre', expectedRevenue: '₹33,000–54,000/acre',
      reasons: ['Low water requirement — ideal for dry Rabi', 'Fixes nitrogen in soil', 'Consistent MSP growth'],
      risks: ['Helicoverpa pod borer', 'Wilt in waterlogged conditions'],
      score: 0
    },
    {
      crop: 'Sunflower', emoji: '🌻', season: 'Rabi', msp: 7280,
      soilFit: 'Alluvial, Loamy, Red Laterite',
      waterNeeds: 'Medium', duration: '90–100 days',
      expectedYield: '5–8 qtl/acre', expectedRevenue: '₹36,000–58,000/acre',
      reasons: ['Very high MSP ₹7,280/qtl', 'Short duration cash crop', 'Edible oil demand rising'],
      risks: ['Alternaria leaf blight', 'Needs to avoid frost'],
      score: 0
    },
    {
      crop: 'Mustard', emoji: '🟡', season: 'Rabi', msp: 5950,
      soilFit: 'Sandy Loam, Alluvial, Loamy',
      waterNeeds: 'Low', duration: '90–120 days',
      expectedYield: '6–10 qtl/acre', expectedRevenue: '₹36,000–60,000/acre',
      reasons: ['Drought-tolerant Rabi crop', 'Very low irrigation needs (2–3 waterings)', 'Rising cooking oil prices boost returns'],
      risks: ['Aphid attack in Feb', 'Poor performance in clay soil'],
      score: 0
    },
    // ZAID
    {
      crop: 'Watermelon', emoji: '🍉', season: 'Zaid', msp: 0,
      soilFit: 'Sandy Loam, Alluvial',
      waterNeeds: 'Medium', duration: '65–80 days',
      expectedYield: '100–150 qtl/acre', expectedRevenue: '₹80,000–1,50,000/acre',
      reasons: ['High summer demand = premium market price', 'Fast growing in warm sandy soil', 'Excellent profit margins'],
      risks: ['No MSP — market-dependent pricing', 'Anthracnose fruit rot'],
      score: 0
    },
    {
      crop: 'Cucumber', emoji: '🥒', season: 'Zaid', msp: 0,
      soilFit: 'Sandy Loam, Loamy',
      waterNeeds: 'Medium', duration: '50–65 days',
      expectedYield: '60–100 qtl/acre', expectedRevenue: '₹60,000–1,20,000/acre',
      reasons: ['Fastest Zaid crop — 50 days to harvest', 'Very high market demand in summer', 'Easy drip irrigation'],
      risks: ['No MSP', 'Downy mildew in humid conditions'],
      score: 0
    },
  ];

  // Score each crop based on inputs
  const scored = allCrops.map(c => {
    if (c.season !== season) return { ...c, score: 0 };
    let score = 50;

    // Soil match
    const soilFits = c.soilFit.toLowerCase();
    if (soilFits.includes(soilType.toLowerCase().split(' ')[0].toLowerCase())) score += 25;
    else if (soilFits.includes('alluvial') && soilType === 'Loamy') score += 12;

    // Rainfall match
    if (rainfall === 'High (>1000mm)' && c.waterNeeds === 'High') score += 15;
    if (rainfall === 'Medium (500–1000mm)' && c.waterNeeds === 'Medium') score += 15;
    if (rainfall === 'Low (<500mm)' && c.waterNeeds === 'Low') score += 15;
    if (rainfall === 'Low (<500mm)' && c.waterNeeds === 'High') score -= 20;
    if (rainfall === 'High (>1000mm)' && c.waterNeeds === 'Low') score -= 5;

    // MSP bonus
    if (c.msp > 5000) score += 8;

    return { ...c, score: Math.min(99, Math.max(10, score)) };
  });

  return scored
    .filter(c => c.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

// ── Soil Growing Guide ───────────────────────────────────────
export interface GrowingGuide {
  crop: string;
  emoji: string;
  soilType: SoilType;
  optimalPH: string;
  temperatureRange: string;
  seedRate: string;
  spacing: string;
  irrigationSchedule: { stage: string; timing: string; method: string }[];
  fertilizers: { stage: string; npk: string; organic: string; qty: string }[];
  pestControl: { pest: string; symptom: string; remedy: string }[];
  timeline: { week: string; activity: string; icon: string }[];
  harvestIndicators: string[];
  postHarvest: string[];
  tips: string[];
}

export const growingGuides: Record<string, GrowingGuide> = {
  'Paddy': {
    crop: 'Paddy', emoji: '🌾', soilType: 'Clay',
    optimalPH: '5.5 – 6.5', temperatureRange: '25°C – 35°C',
    seedRate: '20–25 kg/acre', spacing: '20 × 15 cm',
    irrigationSchedule: [
      { stage: 'Transplanting', timing: 'Immediately after planting', method: 'Flood irrigation — maintain 3–5 cm standing water' },
      { stage: 'Tillering (25–35 DAT)', timing: 'Every 3–4 days', method: 'Maintain 5–8 cm water level' },
      { stage: 'Panicle initiation (50–60 DAT)', timing: 'Daily', method: 'Critical stage — never let field dry' },
      { stage: 'Grain filling (80–90 DAT)', timing: 'Every 5 days', method: 'Reduce water gradually' },
      { stage: 'Maturity (100+ DAT)', timing: 'Stop 10 days before harvest', method: 'Drain field completely' },
    ],
    fertilizers: [
      { stage: 'Basal (before transplant)', npk: '40:40:20 kg N:P:K/acre', organic: 'FYM 4 tonnes/acre', qty: '50 kg Urea + 125 kg SSP + 35 kg MOP' },
      { stage: 'First top-dress (25 DAT)', npk: '40 kg N/acre', organic: 'Neem cake 50 kg', qty: '87 kg Urea/acre, broadcast in standing water' },
      { stage: 'Second top-dress (50 DAT)', npk: '20 kg N/acre', organic: '—', qty: '43 kg Urea, apply before panicle initiation' },
    ],
    pestControl: [
      { pest: 'Blast (fungus)', symptom: 'Diamond-shaped grey spots on leaves and neck', remedy: 'Spray Tricyclazole 75% WP @ 150g/acre + 200L water. Repeat after 7 days.' },
      { pest: 'Brown Plant Hopper', symptom: 'Wilting in patches (hopper burn), honeydew secretion', remedy: 'Imidacloprid 17.8% SL @ 60ml/acre. Spray at base of plant.' },
      { pest: 'Leaf Folder', symptom: 'Rolled leaves with feeding damage inside', remedy: 'Chlorpyrifos 20% EC @ 400ml/acre + 200L water spray.' },
      { pest: 'Stem Borer', symptom: 'Dead heart in vegetative, white ear in reproductive stage', remedy: 'Carbofuran 3G @ 8kg/acre granules in standing water.' },
    ],
    timeline: [
      { week: 'Week 1–2', activity: 'Nursery preparation & seed sowing in seedbed', icon: '🌱' },
      { week: 'Week 3', activity: 'Main field plowing, puddling, leveling', icon: '🚜' },
      { week: 'Week 4', activity: 'Basal fertilizer + transplanting 3–4 week seedlings', icon: '🌿' },
      { week: 'Week 5–7', activity: 'First top-dressing + weed control (manual/herbicide)', icon: '💧' },
      { week: 'Week 8–10', activity: 'Second top-dressing, pest scouting, spray if needed', icon: '🧪' },
      { week: 'Week 11–14', activity: 'Panicle initiation — critical water management', icon: '⚠️' },
      { week: 'Week 15–17', activity: 'Grain filling — maintain irrigation, pest monitoring', icon: '🌾' },
      { week: 'Week 18', activity: 'Drain field 10 days before harvest', icon: '🌊' },
      { week: 'Week 19–20', activity: 'Harvest when 80% grains are golden-yellow', icon: '✂️' },
    ],
    harvestIndicators: [
      '80–85% grains turn golden/straw colour',
      'Grains are firm and do not indent with thumbnail',
      'Moisture content is 18–22% (ideal for cutting)',
    ],
    postHarvest: [
      'Sun-dry or mechanical drying to 14% moisture for storage',
      'Grade and clean using mechanical thresher',
      'Store in moisture-proof bags (100 kg HDPE/jute)',
      'Transport to procurement centre within 72 hours of drying',
    ],
    tips: [
      '💡 Use SRI (System of Rice Intensification) to increase yield by 20–30%',
      '💡 Apply Azospirillum biofertilizer to reduce Urea use by 25%',
      '💡 Maintain 2–3 cm water at flowering stage to prevent yield loss',
      '💡 Keep field well-leveled — uneven land wastes 30% more water',
    ]
  },
  'Cotton': {
    crop: 'Cotton', emoji: '☁️', soilType: 'Black Cotton',
    optimalPH: '6.0 – 8.0', temperatureRange: '21°C – 35°C',
    seedRate: '1–1.2 kg Bt Cotton seeds/acre', spacing: '90 × 60 cm (paired row) or 120 × 45 cm',
    irrigationSchedule: [
      { stage: 'Germination (0–15 DAS)', timing: 'Pre-sowing irrigation only', method: 'One protective irrigation before sowing' },
      { stage: 'Vegetative (30–60 DAS)', timing: 'Every 12–15 days', method: 'Furrow irrigation — avoid wetting stem' },
      { stage: 'Flower bud / Squaring (60–90 DAS)', timing: 'Every 10 days', method: 'Critical — drip irrigation ideal, 4L/plant/day' },
      { stage: 'Boll development (90–120 DAS)', timing: 'Every 12 days', method: 'Reduce if monsoon active. Boll cracking damage if excess.' },
      { stage: 'Boll opening (130+ DAS)', timing: 'Stop irrigation', method: 'Dry period needed for boll opening and fibre quality' },
    ],
    fertilizers: [
      { stage: 'Basal (before sowing)', npk: '15:30:15 kg N:P:K/acre', organic: 'FYM 5 tonnes + Neem cake 100 kg', qty: '33 kg Urea + 190 kg SSP + 25 kg MOP' },
      { stage: '30 DAS (1st top dress)', npk: '25 kg N/acre', organic: 'Humic acid foliar @ 2ml/L', qty: '54 kg Urea/acre, side-dress and irrigate' },
      { stage: '60 DAS (2nd top dress)', npk: '25 kg N + 15 kg K/acre', organic: '—', qty: '54 kg Urea + 25 kg MOP, apply before squaring' },
      { stage: '90 DAS (3rd — Boll period)', npk: 'Boron 1 kg/acre foliar', organic: 'Panchagavya @ 3% foliar', qty: 'Borax 15g/10L water spray to prevent boll shedding' },
    ],
    pestControl: [
      { pest: 'American Bollworm', symptom: 'Pin-hole entry in green bolls, frass at entry point', remedy: 'Emamectin Benzoate 5% SG @ 80g/acre. Economic Threshold: 5 larvae/100 plants.' },
      { pest: 'Whitefly (vector of CLCuD)', symptom: 'Yellowing, curling leaves, sticky honeydew, black sooty mold', remedy: 'Diafenthiuron 50% WP @ 240g/acre spray. Yellow sticky traps 10/acre.' },
      { pest: 'Jassid / Leafhopper', symptom: 'Triangular yellowing from leaf tip (hopper burn)', remedy: 'Imidacloprid 70% WG @ 25g/acre or Thiamethoxam 25% WG @ 50g/acre.' },
      { pest: 'Thrips', symptom: 'Silver streaks on leaves, curled leaf edges', remedy: 'Fipronil 5% SC @ 300ml/acre, spray in evening hours.' },
    ],
    timeline: [
      { week: 'Week 1', activity: 'Deep plowing (30 cm), sunning, basal fertilizer', icon: '🚜' },
      { week: 'Week 2', activity: 'Seed treatment + sowing at onset of monsoon', icon: '🌱' },
      { week: 'Week 3–5', activity: 'Gap filling, first irrigation if dry, earthing up', icon: '💧' },
      { week: 'Week 6–8', activity: '1st top-dress fertilizer, weed control, spray for jassid', icon: '🌿' },
      { week: 'Week 9–12', activity: '2nd top-dress, pest scouting every 3 days, set sticky traps', icon: '🔍' },
      { week: 'Week 13–16', activity: '3rd fertilizer (boron), manage bollworm — critical phase', icon: '⚠️' },
      { week: 'Week 17–20', activity: 'Boll development — 2–3 sprays as needed', icon: '🧪' },
      { week: 'Week 21–24', activity: 'Boll opening begins — stop irrigation, 1st picking', icon: '☁️' },
      { week: 'Week 25+', activity: '2nd and 3rd pickings at 15-day intervals', icon: '✂️' },
    ],
    harvestIndicators: [
      'Bolls burst open naturally with white fluffy fibre visible',
      'Brown/yellow boll shell indicates full maturity',
      'Harvest immediately after opening — delay reduces fibre quality',
    ],
    postHarvest: [
      'Dry picked cotton on clean tarpaulin for 2–3 days',
      'Remove leaf trash, boll shells — affects moisture % at procurement',
      'Keep moisture below 8% for procurement acceptance',
      'Store in clean dry place — avoid poly bags (traps moisture)',
    ],
    tips: [
      '💡 Sow Bt cotton within 15 June for maximum boll set',
      '💡 Grow refuge strips (non-Bt cotton 5%) to prevent resistance',
      '💡 Use pheromone traps @ 5/acre for bollworm monitoring',
      '💡 Topping (removal of terminal bud) at 75 DAS increases boll retention',
    ]
  },
  'Groundnut': {
    crop: 'Groundnut', emoji: '🥜', soilType: 'Red Laterite',
    optimalPH: '5.5 – 7.0', temperatureRange: '24°C – 33°C',
    seedRate: '70–80 kg (bold) or 50–55 kg (small seeded)/acre', spacing: '30 × 10 cm',
    irrigationSchedule: [
      { stage: 'Pre-sowing', timing: 'Before sowing', method: 'One good irrigation to bring soil to FC' },
      { stage: 'Vegetative (15–35 DAS)', timing: 'Every 10–12 days', method: 'Furrow/sprinkler — avoid waterlogging' },
      { stage: 'Pegging & pod development (45–75 DAS)', timing: 'Every 8–10 days', method: 'Critical — soil must be loose and moist for peg penetration' },
      { stage: 'Pod filling (75–95 DAS)', timing: 'Every 10 days', method: 'Light irrigation — excessive water causes aflatoxin' },
      { stage: 'Maturity', timing: 'Stop 10 days before harvest', method: 'Let soil dry — makes digging easier' },
    ],
    fertilizers: [
      { stage: 'Basal', npk: '8:20:16 kg N:P:K/acre', organic: 'Gypsum 100 kg/acre, FYM 4 tonnes', qty: '17 kg Urea + 125 kg SSP + 27 kg MOP + Gypsum (for pod fill)' },
      { stage: '30 DAS', npk: 'Calcium foliar', organic: 'Rhizobium seed treatment', qty: 'Calcium nitrate 1% foliar or top-dress gypsum 50 kg in pegging zone' },
    ],
    pestControl: [
      { pest: 'Leaf Spot (Early & Late)', symptom: 'Brown/dark spots on leaves, defoliation', remedy: 'Mancozeb 75% WP @ 600g/acre. Spray from 30 DAS, repeat every 10 days.' },
      { pest: 'Tikka Disease (Cercospora)', symptom: 'Circular dark spots with yellow halo', remedy: 'Chlorothalonil 75% WP @ 400g/acre. Critical to prevent 40% yield loss.' },
      { pest: 'White Grub (Soil pest)', symptom: 'Wilting plants, larvae found near roots', remedy: 'Chlorpyrifos 20% EC @ 1L/acre soil drench at transplanting.' },
      { pest: 'Spodoptera (Fall Armyworm)', symptom: 'Skeletonized leaves, fecal pellets', remedy: 'Spinetoram 11.7% SC @ 150ml/acre spray.' },
    ],
    timeline: [
      { week: 'Week 1', activity: 'Soil test, deep plowing, FYM incorporation, pre-sowing irrigation', icon: '🚜' },
      { week: 'Week 2', activity: 'Rhizobium seed treatment + sowing', icon: '🌱' },
      { week: 'Week 3–5', activity: 'Gap filling, earthing up, first spray (leaf spot prevention)', icon: '💧' },
      { week: 'Week 6–8', activity: 'Weeding, 1st topdress gypsum at pegging stage', icon: '🌿' },
      { week: 'Week 9–12', activity: 'Pod development — critical irrigation, leaf spot sprays', icon: '⚠️' },
      { week: 'Week 13–15', activity: 'Pod maturity check, stop irrigation', icon: '🔍' },
      { week: 'Week 16', activity: 'Harvest — pull plants manually or with blade plow', icon: '✂️' },
      { week: 'Week 17', activity: 'Dry on field 3–5 days, thresh, dry to 8% moisture', icon: '☀️' },
    ],
    harvestIndicators: [
      'Veins inside shell become dark brown when mature',
      'Kernel fills the shell completely (plump)',
      'Plant leaves start yellowing naturally',
    ],
    postHarvest: [
      'Sun dry for 3–5 days to reduce moisture to 8–9%',
      'Thresh and winnow to remove debris',
      'Sample test for aflatoxin before procurement submission',
      'Store in 50 kg jute bags in dry, ventilated godown',
    ],
    tips: [
      '💡 Apply Gypsum @ 100 kg/acre at pegging stage for calcium-rich pods',
      '💡 Keep soil loose at pegging zone — hard soil = fewer pods',
      '💡 Inoculate seeds with Rhizobium to reduce urea need by 15 kg/acre',
      '💡 Harvest on time — delayed harvest leads to aflatoxin contamination at yard',
    ]
  },
};

// Default guide for crops without specific data
export const defaultGuide: Partial<GrowingGuide> = {
  optimalPH: '6.0 – 7.5',
  temperatureRange: '20°C – 35°C',
  tips: [
    '💡 Always do a soil test before sowing for best results',
    '💡 Use certified, disease-free seeds from government outlets',
    '💡 Apply FYM or compost to improve soil organic matter',
    '💡 Follow recommended spacing for proper aeration',
  ]
};

export const SEASONS: Season[] = ['Kharif', 'Rabi', 'Zaid'];
export const SOIL_TYPES: SoilType[] = ['Black Cotton', 'Red Laterite', 'Alluvial', 'Sandy Loam', 'Clay', 'Loamy', 'Sandy'];
export const RAINFALL_LEVELS: RainfallLevel[] = ['Low (<500mm)', 'Medium (500–1000mm)', 'High (>1000mm)'];

export const SEASON_INFO = {
  Kharif:  { months: 'June – October',  emoji: '🌧️', desc: 'Monsoon season crops — high rainfall' },
  Rabi:    { months: 'October – March', emoji: '❄️', desc: 'Winter season crops — cool, less rain' },
  Zaid:    { months: 'March – June',    emoji: '☀️', desc: 'Summer season crops — warm & dry' },
};

export const SOIL_INFO: Record<SoilType, { color: string; desc: string; bestFor: string }> = {
  'Black Cotton':  { color: 'bg-slate-700', desc: 'High clay content, moisture retentive, shrinks when dry', bestFor: 'Cotton, Soyabean, Wheat, Jowar' },
  'Red Laterite':  { color: 'bg-red-600',   desc: 'Iron-rich, well-drained, acidic, low nutrients', bestFor: 'Groundnut, Millets, Cashew, Pulses' },
  'Alluvial':      { color: 'bg-amber-500', desc: 'River-deposited, fertile, medium texture, good water-holding', bestFor: 'Paddy, Wheat, Sugarcane, Maize' },
  'Sandy Loam':    { color: 'bg-yellow-400', desc: 'Well-drained, warm quickly, low water retention', bestFor: 'Groundnut, Vegetable, Potato, Mustard' },
  'Clay':          { color: 'bg-stone-600', desc: 'Heavy, water-retentive, prone to waterlogging, fertile', bestFor: 'Paddy, Sugarcane, Wheat' },
  'Loamy':         { color: 'bg-amber-700', desc: 'Balanced sand-silt-clay, excellent drainage & fertility', bestFor: 'Almost all crops — ideal soil type' },
  'Sandy':         { color: 'bg-yellow-300', desc: 'Low fertility, very fast drainage, drought-prone', bestFor: 'Watermelon, Groundnut, Bajra, Millets' },
};
