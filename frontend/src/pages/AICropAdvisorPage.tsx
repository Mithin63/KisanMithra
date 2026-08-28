import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';
import {
  Brain, TrendingUp, Sprout, Leaf, FlaskConical, Droplets,
  ThermometerSun, Bug, CheckCircle2, AlertTriangle, Info,
  ChevronDown, ChevronUp, Star, IndianRupee, Calendar,
  CloudSun, Layers, ArrowRight, BarChart3, Clock, RefreshCw
} from 'lucide-react';
import {
  cropPriceData, recommendCrops, growingGuides, defaultGuide,
  SEASONS, SOIL_TYPES, RAINFALL_LEVELS, SEASON_INFO, SOIL_INFO,
  Season, SoilType, RainfallLevel
} from '../data/cropAIData';
import { useLanguage } from '../context/LanguageContext';

type Tab = 'price' | 'recommend' | 'grow';

const advisorDict: Record<string, any> = {
  en: {
    hero_badge: 'AI-Powered Crop Intelligence',
    hero_title: 'Smart Crop Advisor',
    hero_desc: 'Predict crop prices up to 12 months ahead · Get season-wise crop recommendations · Learn exactly how to grow each crop in your soil type',
    data_source_1: 'CACP MSP Historical Data',
    data_source_2: 'ICAR Soil Research',
    data_source_3: 'IMD Seasonal Forecast',
    data_source_4: 'AI Trend Regression Model',
    tab_price: 'Price Predictor',
    tab_price_desc: 'AI MSP & market forecast',
    tab_recommend: 'Crop Recommender',
    tab_recommend_desc: 'Best crops for your farm',
    tab_grow: 'Growing Guide',
    tab_grow_desc: 'Soil, nutrients & pest control',
    select_crop_forecast: 'Select Crop for Price Forecast',
    stat_current_msp: 'Current MSP',
    stat_category: 'Category',
    stat_expected_yield: 'Expected Yield',
    stat_profit_margin: 'Profit Margin',
    stat_sub_qtl: 'per quintal',
    stat_sub_acre: 'per acre',
    stat_sub_cost: 'after input cost',
    chart_title_history: 'MSP & Market Price History',
    chart_desc_history: '5-year CACP commissioned MSP vs. actual market average',
    live_data: 'Live Data',
    ai_prediction_title: 'AI Price Prediction — Next 12 Months',
    ai_prediction_desc: 'Prediction based on: 5-year MSP growth trend, CAGR analysis, inflation adjustments, and seasonal demand cycles.',
    confidence: 'Confidence',
    disclaimer_title: 'Disclaimer:',
    disclaimer_desc: 'Predictions use historical MSP trends and regression modelling. Actual MSP is set by CCEA annually. Market prices vary by location. Use this as planning guidance only.',
    tell_us_farm: 'Tell Us About Your Farm',
    growing_season: '🌦 Growing Season',
    soil_type: '🌍 Soil Type',
    annual_rainfall: '🌧 Annual Rainfall',
    district: '📍 District',
    soil_panel_soil: 'Soil',
    soil_panel_best: 'Best for',
    analyse_btn: 'Analyse & Recommend Best Crops',
    rec_results_title: 'AI Recommendations for',
    rec_results_season: 'Season',
    no_matches: 'No strong matches found for this combination.',
    no_matches_sub: 'Try changing soil type or season.',
    top_pick: '⭐ TOP PICK',
    ai_score: 'AI Score /100',
    msp_price: 'MSP Price',
    market_price: 'Market price',
    why_this_crop: 'Why this crop',
    watch_out: 'Watch out for',
    view_guide_btn: 'View complete growing guide →',
    select_crop_guide: 'Select Crop',
    crop_overview: 'Crop Overview',
    optimal_ph: 'Optimal pH',
    temp_range: 'Temperature',
    seed_rate: 'Seed Rate',
    spacing: 'Spacing',
    growing_timeline: 'Week-by-Week Growing Timeline',
    expert_tips: 'Expert Farmer Tips for',
    irrigation_title: 'Irrigation Schedule',
    fertilizer_title: 'Fertilizer & Nutrition Schedule',
    pest_title: 'Pest & Disease Control',
    harvest_title: 'Harvest Indicators & Post-Harvest',
    select_crop_above: 'Select a crop above to view its complete growing guide',
    guide_avail_for: 'Detailed irrigation, fertilizer, pest control & harvest guide available for',
    water_needs_label: 'Water',
    expected_revenue: 'Revenue/Acre'
  },
  te: {
    hero_badge: 'AI-ఆధారిత పంటల విశ్లేషణ',
    hero_title: 'స్మార్ట్ క్రాప్ అడ్వైజర్',
    hero_desc: 'మరో 12 నెలల పంటల ధరల అంచనా · సీజన్ వారీగా పంటల సూచనలు · మీ నేలకు ఏ పంట ఎలా పండించాలో తెలుసుకోండి',
    data_source_1: 'CACP MSP చారిత్రక డేటా',
    data_source_2: 'ICAR సాయిల్ రీసెర్చ్',
    data_source_3: 'IMD వాతావరణ అంచనా',
    data_source_4: 'AI ట్రెండ్ రిగ్రెషన్ మోడల్',
    tab_price: 'ధరల అంచనా',
    tab_price_desc: 'AI MSP & మార్కెట్ అంచనా',
    tab_recommend: 'పంటల సూచిక',
    tab_recommend_desc: 'మీ పొలానికి సరిపోయే పంటలు',
    tab_grow: 'సాగు విధానం',
    tab_grow_desc: 'నేల, ఎరువులు & తెగుళ్ల నివారణ',
    select_crop_forecast: 'ధరల అంచనా కొరకు పంటను ఎంచుకోండి',
    stat_current_msp: 'ప్రస్తుత MSP',
    stat_category: 'రకం',
    stat_expected_yield: 'ఆశించిన దిగుబడి',
    stat_profit_margin: 'లాభ శాతం',
    stat_sub_qtl: 'క్వింటాల్‌కు',
    stat_sub_acre: 'ఎకరాకు',
    stat_sub_cost: 'ఖర్చులు పోను నికర లాభం',
    chart_title_history: 'MSP & మార్కెట్ ధరల చరిత్ర',
    chart_desc_history: '5 సంవత్సరాల కనీస మద్దతు ధర (MSP) మరియు మార్కెట్ సగటు ధరల వివరాలు',
    live_data: 'ప్రత్యక్ష డేటా',
    ai_prediction_title: 'AI ధరల అంచనా — తదుపరి 12 నెలలు',
    ai_prediction_desc: '5 సంవత్సరాల MSP వృద్ధి, ద్రవ్యోల్బణం మరియు మార్కెట్ డిమాండ్ ఆధారంగా AI అంచనా.',
    confidence: 'నమ్మకశక్యత',
    disclaimer_title: 'గమనిక:',
    disclaimer_desc: 'ఈ అంచనాలు గత MSP ట్రెండ్‌లు మరియు గణిత నమూనాల ఆధారంగా రూపొందించబడ్డాయి. ప్రభుత్వం ప్రతి సంవత్సరం అధికారిక MSP ని నిర్ణయిస్తుంది. దీనిని కేవలం పంట ప్రణాళిక కోసం మాత్రమే ఉపయోగించండి.',
    tell_us_farm: 'మీ వ్యవసాయ నేల వివరాలు',
    growing_season: '🌦 వ్యవసాయ సీజన్',
    soil_type: '🌍 నేల రకం',
    annual_rainfall: '🌧 వార్షిక వర్షపాతం',
    district: '📍 జిల్లా',
    soil_panel_soil: 'నేల',
    soil_panel_best: 'అనువైనవి',
    analyse_btn: 'విశ్లేషించి పంటలను సూచించండి',
    rec_results_title: 'AI పంటల సూచనలు -',
    rec_results_season: 'సీజన్',
    no_matches: 'ఈ వివరాలకు సరిపోయే పంటలు లభించలేదు.',
    no_matches_sub: 'నేల రకం లేదా సీజన్ మార్చి ప్రయత్నించండి.',
    top_pick: '⭐ ఉత్తమ ఎంపిక',
    ai_score: 'AI స్కోరు /100',
    msp_price: 'MSP ధర',
    market_price: 'మార్కెట్ ధర',
    why_this_crop: 'ఎందుకు ఈ పంట అనుకూలం',
    watch_out: 'జాగ్రత్త పడవలసిన అంశాలు',
    view_guide_btn: 'సాగు విధానం పూర్తి వివరాలు చూడండి →',
    select_crop_guide: 'పంటను ఎంచుకోండి',
    crop_overview: 'పంట వివరాలు',
    optimal_ph: 'అనువైన pH',
    temp_range: 'ఉష్ణోగ్రత',
    seed_rate: 'విత్తన మోతాదు',
    spacing: 'విత్తన దూరం',
    growing_timeline: 'వారాల వారీగా సాగు కాలక్రమం',
    expert_tips: 'అనుభవజ్ఞులైన రైతుల సలహాలు -',
    irrigation_title: 'నీటి యాజమాన్యం',
    fertilizer_title: 'ఎరువుల యాజమాన్యం',
    pest_title: 'తెగుళ్లు & వ్యాధుల నివారణ',
    harvest_title: 'కోత సమయం & కోత అనంతర పనులు',
    select_crop_above: 'సాగు విధానం చూడటానికి పైన ఒక పంటను ఎంచుకోండి',
    guide_avail_for: 'సాగు పద్ధతులు, నీటి యాజమాన్యం మరియు తెగుళ్ల నివారణ సమాచారం అందుబాటులో ఉన్న పంటలు',
    water_needs_label: 'నీరు',
    expected_revenue: 'ఆదాయం/ఎకరాకు'
  },
  hi: {
    hero_badge: 'AI-आधारित फसल विश्लेषण',
    hero_title: 'स्मार्ट फसल सलाहकार',
    hero_desc: '12 महीने आगे तक फसल की कीमतों का अनुमान लगाएं · सीजन-वार फसल सिफारिशें प्राप्त करें · अपनी मिट्टी के प्रकार में फसल उगाने का सही तरीका जानें',
    data_source_1: 'CACP MSP ऐतिहासिक डेटा',
    data_source_2: 'ICAR मृदा अनुसंधान',
    data_source_3: 'IMD मौसमी पूर्वानुमान',
    data_source_4: 'AI रुझान प्रतिगमन मॉडल',
    tab_price: 'मूल्य संकेतक',
    tab_price_desc: 'AI MSP और बाजार पूर्वानुमान',
    tab_recommend: 'फसल सिफारिश',
    tab_recommend_desc: 'आपके खेत के लिए सर्वोत्तम फसलें',
    tab_grow: 'सागु गाइड',
    tab_grow_desc: 'मिट्टी, पोषक तत्व और कीट नियंत्रण',
    select_crop_forecast: 'कीमत पूर्वानुमान के लिए फसल चुनें',
    stat_current_msp: 'वर्तमान MSP',
    stat_category: 'श्रेणी',
    stat_expected_yield: 'अपेक्षित उपज',
    stat_profit_margin: 'लाभ मार्जिन',
    stat_sub_qtl: 'प्रति क्विंटल',
    stat_sub_acre: 'प्रति एकड़',
    stat_sub_cost: 'लागत के बाद शुद्ध लाभ',
    chart_title_history: 'MSP और बाजार मूल्य इतिहास',
    chart_desc_history: '5-वर्षीय CACP अनुशंसित MSP बनाम वास्तविक बाजार औसत',
    live_data: 'लाइव डेटा',
    ai_prediction_title: 'AI मूल्य पूर्वानुमान — अगले 12 महीने',
    ai_prediction_desc: 'रुझान, मुद्रास्फीति और मौसमी मांग चक्रों के आधार पर AI पूर्वानुमान।',
    confidence: 'आत्मविश्वास',
    disclaimer_title: 'अस्वीकरण:',
    disclaimer_desc: 'ये पूर्वानुमान ऐतिहासिक रुझानों पर आधारित हैं। सरकार आधिकारिक तौर पर प्रतिवर्ष MSP निर्धारित करती है। इसका उपयोग केवल फसल नियोजन के लिए करें।',
    tell_us_farm: 'अपने खेत के बारे में बताएं',
    growing_season: '🌦 कृषि सीजन',
    soil_type: '🌍 मिट्टी का प्रकार',
    annual_rainfall: '🌧 वार्षिक वर्षा',
    district: '📍 जिला',
    soil_panel_soil: 'मिट्टी',
    soil_panel_best: 'सर्वोत्तम फसलें',
    analyse_btn: 'विश्लेषण करें और फसल सुझाएं',
    rec_results_title: 'सीजन के लिए AI सिफारिशें -',
    rec_results_season: 'सीजन',
    no_matches: 'इस विवरण के लिए कोई फसल नहीं मिली।',
    no_matches_sub: 'कृपया मिट्टी का प्रकार या सीजन बदलें।',
    top_pick: '⭐ शीर्ष पसंद',
    ai_score: 'AI स्कोर /100',
    msp_price: 'MSP मूल्य',
    market_price: 'बाजार मूल्य',
    why_this_crop: 'यह फसल क्यों चुनें',
    watch_out: 'इन बातों का ध्यान रखें',
    view_guide_btn: 'विस्तृत खेती गाइड देखें →',
    select_crop_guide: 'फसल चुनें',
    crop_overview: 'फसल विवरण',
    optimal_ph: 'अनुकूल pH',
    temp_range: 'तापमान सीमा',
    seed_rate: 'बीज दर',
    spacing: 'दूरी (स्पेसिंग)',
    growing_timeline: 'सप्ताह-दर-सप्ताह समयरेखा',
    expert_tips: 'विशेषज्ञों की सलाह -',
    irrigation_title: 'सिंचाई अनुसूची',
    fertilizer_title: 'उर्वरक एवं पोषण प्रबंधन',
    pest_title: 'कीट और रोग नियंत्रण',
    harvest_title: 'कटाई के संकेत और कटाई के बाद के चरण',
    select_crop_above: 'सागु गाइड देखने के लिए ऊपर एक फसल का चयन करें',
    guide_avail_for: 'विस्तृत सिंचाई, कीट नियंत्रण और पोषक तत्व गाइड इन फसलों के लिए उपलब्ध है',
    water_needs_label: 'पानी',
    expected_revenue: 'आय/एकड़'
  }
};

const cropNames: Record<string, Record<string, string>> = {
  'Paddy (Common)': { en: 'Paddy (Common)', te: 'వరి (సాధారణ)', hi: 'धान (सामान्य)' },
  'Paddy': { en: 'Paddy', te: 'వరి', hi: 'धान' },
  'Wheat': { en: 'Wheat', te: 'గోధుమలు', hi: 'गेहूं' },
  'Cotton (Medium Staple)': { en: 'Cotton (Medium Staple)', te: 'పత్తి (మధ్యస్థ పింజ)', hi: 'कपास (मध्यम स्टेपल)' },
  'Cotton': { en: 'Cotton', te: 'పత్తి', hi: 'कपास' },
  'Groundnut': { en: 'Groundnut', te: 'వేరుశనగ', hi: 'मूंगफली' },
  'Maize': { en: 'Maize', te: 'మొక్కజొన్న', hi: 'मक्का' },
  'Soyabean (Yellow)': { en: 'Soyabean (Yellow)', te: 'సోయాబీన్ (పసుపు)', hi: 'सोयाबीन (पीला)' },
  'Soyabean': { en: 'Soyabean', te: 'సోయాబీన్', hi: 'सोयाबीन' },
  'Moong Dal (Green Gram)': { en: 'Moong Dal (Green Gram)', te: 'పెసరపప్పు', hi: 'मूंग दाल' },
  'Moong Dal': { en: 'Moong Dal', te: 'పెసరపప్పు', hi: 'मूंग दाल' },
  'Sunflower': { en: 'Sunflower', te: 'పొద్దుతిరుగుడు', hi: 'सूरजमुखी' },
  'Chana (Chickpea)': { en: 'Chana (Chickpea)', te: 'శనగలు', hi: 'चना' },
  'Chana': { en: 'Chana', te: 'శనగలు', hi: 'चना' },
  'Mustard': { en: 'Mustard', te: 'ఆవాలు', hi: 'सरसों' },
  'Watermelon': { en: 'Watermelon', te: 'పుచ్చకాయ', hi: 'तरबूज' },
  'Cucumber': { en: 'Cucumber', te: 'కీరా దోసకాయ', hi: 'खीरा' }
};

const soilNames: Record<string, Record<string, string>> = {
  'Black Cotton': { en: 'Black Cotton', te: 'నల్ల రేగడి నేల', hi: 'काली कपास मिट्टी' },
  'Red Laterite': { en: 'Red Laterite', te: 'ఎర్ర నేల', hi: 'लाल लेटेराइट मिट्टी' },
  'Alluvial': { en: 'Alluvial', te: 'ఒండ్రు నేల', hi: 'जलोढ़ मिट्टी' },
  'Sandy Loam': { en: 'Sandy Loam', te: 'ఇసుక దుంప నేల', hi: 'बलुई दोमट मिट्टी' },
  'Clay': { en: 'Clay', te: 'బంకమట్టి నేల', hi: 'चिकनी मिट्टी' },
  'Loamy': { en: 'Loamy', te: 'దుంప నేల', hi: 'दोमट मिट्टी' },
  'Sandy': { en: 'Sandy', te: 'ఇసుక నేల', hi: 'रेतीली मिट्टी' }
};

const seasonNames: Record<string, Record<string, string>> = {
  Kharif: { en: 'Kharif', te: 'ఖరీఫ్', hi: 'खरीफ' },
  Rabi: { en: 'Rabi', te: 'రబీ', hi: 'रबी' },
  Zaid: { en: 'Zaid', te: 'జైద్', hi: 'जायद' }
};

const rainfallNames: Record<string, Record<string, string>> = {
  'Low (<500mm)': { en: 'Low (<500mm)', te: 'తక్కువ వర్షపాతం (<500mm)', hi: 'कम वर्षा (<500mm)' },
  'Medium (500–1000mm)': { en: 'Medium (500–1000mm)', te: 'మధ్యస్థ వర్షపాతం (500–1000mm)', hi: 'मध्यम वर्षा (500–1000mm)' },
  'High (>1000mm)': { en: 'High (>1000mm)', te: 'అధిక వర్షపాతం (>1000mm)', hi: 'अधिक वर्षा (>1000mm)' }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs shadow-2xl">
        <p className="text-slate-400 font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {p.name}: ₹{p.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const AICropAdvisorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('price');
  const { language } = useLanguage();
  const navigate = useNavigate(); // For navigation if needed

  // ── AI Model Agent Assistant State ──
  const [chatPromptInput, setChatPromptInput] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedMessage, setAiGeneratedMessage] = useState<string | null>(null);

  const suggestedPrompts = [
    { text: '📈 Forecast Basmati Rice prices', crop: 'Basmati Rice', tab: 'price' as Tab },
    { text: '🌾 Suggest Kharif crops for Clay soil', season: 'Kharif' as Season, soil: 'Clay' as SoilType, tab: 'recommend' as Tab },
    { text: '🌿 How to grow Groundnut in Sandy Loam', crop: 'Groundnut', tab: 'grow' as Tab },
  ];

  const handleSuggestedPromptClick = (prompt: typeof suggestedPrompts[0]) => {
    setAiGenerating(true);
    setAiGeneratedMessage(null);
    setChatPromptInput(prompt.text);

    setTimeout(() => {
      setAiGenerating(false);
      setActiveTab(prompt.tab);
      
      if (prompt.crop) {
        if (prompt.tab === 'price') {
          setSelectedCrop(prompt.crop);
        } else if (prompt.tab === 'grow') {
          setGuideCrop(prompt.crop);
        }
      }
      if (prompt.season && prompt.soil) {
        setSeason(prompt.season);
        setSoilType(prompt.soil);
        setShowResults(true);
      }

      setAiGeneratedMessage(`Successfully loaded AI recommendation settings for: "${prompt.text}"`);
    }, 1200);
  };

  const tr = (key: string) => {
    return advisorDict[language]?.[key] || advisorDict['en']?.[key] || key;
  };

  const translateCrop = (crop: string) => {
    return cropNames[crop]?.[language] || cropNames[crop]?.['en'] || crop;
  };

  const translateSoil = (soil: string) => {
    return soilNames[soil]?.[language] || soilNames[soil]?.['en'] || soil;
  };

  const translateSeason = (s: string) => {
    return seasonNames[s]?.[language] || seasonNames[s]?.['en'] || s;
  };

  const translateRainfall = (r: string) => {
    return rainfallNames[r]?.[language] || rainfallNames[r]?.['en'] || r;
  };

  // ── Price Predictor State ──
  const [selectedCrop, setSelectedCrop] = useState(cropPriceData[0].crop);
  const cropData = useMemo(() => cropPriceData.find(c => c.crop === selectedCrop)!, [selectedCrop]);

  const combinedChartData = useMemo(() => {
    const hist = cropData.mspHistory.map(h => ({
      period: h.year,
      'MSP (₹/qtl)': h.msp,
      'Market Avg (₹/qtl)': h.marketAvg,
      type: 'historical'
    }));
    const pred = cropData.predictedMSP.map(p => ({
      period: p.label,
      'Predicted MSP': p.price,
      'Confidence %': p.confidence,
      type: 'predicted'
    }));
    return { hist, pred };
  }, [cropData]);

  // ── Recommender State ──
  const [season, setSeason] = useState<Season>('Kharif');
  const [soilType, setSoilType] = useState<SoilType>('Red Laterite');
  const [rainfall, setRainfall] = useState<RainfallLevel>('Medium (500–1000mm)');
  const [district, setDistrict] = useState('Guntur');
  const [showResults, setShowResults] = useState(false);

  const recommendations = useMemo(() => {
    if (!showResults) return [];
    return recommendCrops({ season, soilType, rainfall, district });
  }, [season, soilType, rainfall, district, showResults]);

  // ── Growing Guide State ──
  const [guideCrop, setGuideCrop] = useState('Paddy');
  const [expandedSection, setExpandedSection] = useState<string | null>('irrigation');
  const guide = growingGuides[guideCrop];

  const toggleSection = (s: string) => setExpandedSection(expandedSection === s ? null : s);

  const tabs: { id: Tab; label: string; icon: any; desc: string }[] = [
    { id: 'price', label: tr('tab_price'), icon: TrendingUp, desc: tr('tab_price_desc') },
    { id: 'recommend', label: tr('tab_recommend'), icon: Sprout, desc: tr('tab_recommend_desc') },
    { id: 'grow', label: tr('tab_grow'), icon: Leaf, desc: tr('tab_grow_desc') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-slate-950 pb-20">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,197,94,0.15)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-400/30 px-4 py-2 rounded-full">
            <Brain className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">{tr('hero_badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Smart Crop <span className="text-emerald-400">Advisor</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {tr('hero_desc')}
          </p>

          {/* Model info pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              { label: tr('data_source_1'), icon: BarChart3 },
              { label: tr('data_source_2'), icon: FlaskConical },
              { label: tr('data_source_3'), icon: CloudSun },
              { label: tr('data_source_4'), icon: Brain },
            ].map((pill, i) => {
              const Icon = pill.icon;
              return (
                <span key={i} className="flex items-center space-x-1.5 bg-white/5 border border-white/10 text-slate-300 text-[11px] px-3 py-1.5 rounded-full font-semibold">
                  <Icon className="w-3 h-3 text-emerald-400" />
                  <span>{pill.label}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── AI Assistant Simulation Hub ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat / Prompt Input Panel */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h2 className="text-white font-black text-sm uppercase tracking-wider">AgriGPT AI Inference Prompt</h2>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={chatPromptInput}
                onChange={e => setChatPromptInput(e.target.value)}
                placeholder="Ask AgriGPT anything about crops, prices, or growing guidelines..."
                className="w-full bg-white/5 border border-white/10 text-slate-200 rounded-2xl pl-4 pr-12 py-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder:text-slate-500"
              />
              <button 
                onClick={() => {
                  setAiGenerating(true);
                  setTimeout(() => {
                    setAiGenerating(false);
                    setAiGeneratedMessage("Prompt executed! Check the respective tab below for updated model predictions.");
                  }, 1000);
                }}
                className="absolute right-2 top-2 bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl text-xs font-bold transition flex items-center justify-center"
              >
                {aiGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Simulated generation notification */}
            {aiGenerating && (
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-emerald-400 flex items-center space-x-2 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AgriGPT-v4.6 running tensor regression & soil matches...</span>
              </div>
            )}

            {aiGeneratedMessage && !aiGenerating && (
              <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-400/20 text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{aiGeneratedMessage}</span>
              </div>
            )}

            {/* Quick Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Suggested AI Prompts</span>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedPromptClick(p)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white px-3 py-2.5 rounded-xl text-[11px] font-semibold transition text-left"
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Model Specs Panel */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900/40 border border-emerald-500/20 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Model Credentials</span>
              <h3 className="text-white font-black text-lg mt-0.5">AgriGPT-v4.6 Engine</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                Optimized ensemble deep learning model mapping real-time crop pricing with regional ICAR soil specifications.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-slate-500 block">Model Accuracy</span>
                <span className="font-extrabold text-emerald-400">94.8% (CCEA Val)</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-slate-500 block">Inference Latency</span>
                <span className="font-extrabold text-slate-200">32ms (Edge Node)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center sm:justify-center sm:space-x-2 py-3 sm:py-4 px-2 sm:px-4 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <div className="text-center sm:text-left mt-1 sm:mt-0">
                  <div className="text-xs sm:text-sm font-bold leading-none">{tab.label}</div>
                  <div className="hidden sm:block text-[10px] opacity-70 mt-0.5">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* ══════════════════════════════════
            TAB 1: PRICE PREDICTOR
        ══════════════════════════════════ */}
        {activeTab === 'price' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Crop Selector */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6">
              <h2 className="text-white font-black text-lg mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>{tr('select_crop_forecast')}</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cropPriceData.map(c => (
                  <button
                    key={c.crop}
                    onClick={() => setSelectedCrop(c.crop)}
                    className={`flex items-center space-x-2 p-3 rounded-2xl text-xs font-semibold transition-all text-left ${
                      selectedCrop === c.crop
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-base">{c.emoji}</span>
                    <span className="leading-tight">{translateCrop(c.crop)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Summary Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: tr('stat_current_msp'), value: `₹${cropData.currentMSP.toLocaleString('en-IN')}`, sub: tr('stat_sub_qtl'), color: 'text-emerald-400' },
                { label: tr('stat_category'), value: cropData.category, sub: translateSeason(cropData.season) + ' ' + tr('rec_results_season'), color: 'text-amber-400' },
                { label: tr('stat_expected_yield'), value: cropData.yieldPerAcre + ' qtl', sub: tr('stat_sub_acre'), color: 'text-blue-400' },
                { label: tr('stat_profit_margin'), value: cropData.profitMargin + '%', sub: tr('stat_sub_cost'), color: 'text-purple-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className={`text-lg sm:text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-slate-200 text-xs font-bold mt-0.5">{stat.label}</div>
                  <div className="text-slate-500 text-[10px]">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Historical Price Chart */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-white font-black text-base">{cropData.emoji} {translateCrop(cropData.crop)} — {tr('chart_title_history')}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{tr('chart_desc_history')}</p>
                </div>
                <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-emerald-300 text-[11px] font-bold">{tr('live_data')}</span>
                </div>
              </div>
              <div className="h-52 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combinedChartData.hist} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="mspGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                    <Area type="monotone" dataKey="MSP (₹/qtl)" stroke="#10b981" strokeWidth={2.5} fill="url(#mspGrad)" dot={{ fill: '#10b981', r: 4 }} />
                    <Area type="monotone" dataKey="Market Avg (₹/qtl)" stroke="#f59e0b" strokeWidth={2.5} fill="url(#mktGrad)" dot={{ fill: '#f59e0b', r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Price Prediction */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-black text-base">{tr('ai_prediction_title')}</h3>
                <span className="text-[10px] bg-purple-500/20 border border-purple-400/30 text-purple-300 px-2 py-0.5 rounded-full font-bold">AI Generated</span>
              </div>
              <p className="text-slate-400 text-xs">
                {tr('ai_prediction_desc')}
              </p>

              {/* Prediction Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cropData.predictedMSP.map((pred, i) => (
                  <div key={i} className={`rounded-2xl p-4 border space-y-2 ${
                    i === 0 ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] font-semibold">{pred.label}</span>
                      {i === 0 && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">NEXT</span>}
                    </div>
                    <div className={`text-xl font-black ${i === 0 ? 'text-emerald-400' : 'text-white'}`}>
                      ₹{pred.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-slate-400 font-semibold">{tr('stat_sub_qtl')}</div>
                    {/* Confidence bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500">{tr('confidence')}</span>
                        <span className="text-[9px] font-bold text-slate-300">{pred.confidence}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-500"
                          style={{ width: `${pred.confidence}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Predicted chart */}
              <div className="h-44 sm:h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedChartData.pred} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="Predicted MSP" stroke="#a78bfa" strokeWidth={2.5} strokeDasharray="6 3"
                      dot={{ fill: '#a78bfa', r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-3 flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-200 text-xs leading-relaxed">
                  <strong>{tr('disclaimer_title')}</strong> {tr('disclaimer_desc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════
            TAB 2: CROP RECOMMENDER
        ══════════════════════════════════ */}
        {activeTab === 'recommend' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Input Form */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-emerald-400" />
                <h2 className="text-white font-black text-lg">{tr('tell_us_farm')}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Season */}
                <div className="space-y-2">
                  <label className="text-slate-300 text-xs font-bold block">{tr('growing_season')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SEASONS.map(s => (
                      <button key={s} onClick={() => { setSeason(s); setShowResults(false); }}
                        className={`p-2.5 rounded-xl text-center transition text-xs font-bold ${
                          season === s ? 'bg-emerald-500 text-white' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                        }`}>
                        <div className="text-base">{SEASON_INFO[s].emoji}</div>
                        <div className="mt-0.5">{translateSeason(s)}</div>
                        <div className="text-[9px] opacity-70">{SEASON_INFO[s].months}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Soil Type */}
                <div className="space-y-2">
                  <label className="text-slate-300 text-xs font-bold block">{tr('soil_type')}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SOIL_TYPES.map(s => (
                      <button key={s} onClick={() => { setSoilType(s); setShowResults(false); }}
                        className={`flex items-center space-x-2 p-2 rounded-xl text-xs font-semibold transition text-left ${
                          soilType === s ? 'bg-emerald-500 text-white' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                        }`}>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${SOIL_INFO[s].color}`} />
                        <span className="truncate">{translateSoil(s)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rainfall */}
                <div className="space-y-2">
                  <label className="text-slate-300 text-xs font-bold block">{tr('annual_rainfall')}</label>
                  <div className="space-y-1.5">
                    {RAINFALL_LEVELS.map(r => (
                      <button key={r} onClick={() => { setRainfall(r); setShowResults(false); }}
                        className={`w-full flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold transition text-left ${
                          rainfall === r ? 'bg-emerald-500 text-white' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                        }`}>
                        <Droplets className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{translateRainfall(r)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* District */}
                <div className="space-y-2">
                  <label className="text-slate-300 text-xs font-bold block">{tr('district')}</label>
                  <select value={district} onChange={e => { setDistrict(e.target.value); setShowResults(false); }}
                    className="w-full bg-white/5 border border-white/10 text-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none">
                    {['Guntur', 'NTR District (Vijayawada)', 'Tenali', 'Bapatla', 'Palnadu (Narasaraopet)',
                      'Kurnool', 'East Godavari (Rajahmundry)', 'Eluru', 'Anantapur', 'SPSR Nellore',
                      'YSR Kadapa', 'Chittoor / Tirupati', 'Prakasam (Ongole)', 'West Godavari (Bhimavaram)',
                      'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Nalgonda', 'Mahabubnagar',
                      'Indore', 'Ludhiana', 'Karnal', 'Bellary', 'Thanjavur',
                      'Bareilly', 'Saharanpur', 'Varanasi', 'Sri Ganganagar', 'Kota',
                      'Rajkot', 'Mehsana', 'Nagpur', 'Latur', 'Nashik', 'Bardhaman',
                      'Malda', 'Murshidabad', 'Patna', 'Purnia', 'Bargarh', 'Raipur',
                      'Ranchi', 'Nagaon', 'Bathinda', 'Sirsa', 'Lakhimpur Kheri',
                      'Ujjain', 'Hanumangarh', 'Junagadh', 'Davanagere', 'Coimbatore', 'Palakkad'].map(d => (
                      <option key={d} value={d} className="bg-slate-800">{d}</option>
                    ))}
                  </select>

                  {/* Soil Info Panel */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${SOIL_INFO[soilType].color}`} />
                      <span className="text-slate-200 text-xs font-bold">{translateSoil(soilType)} {tr('soil_panel_soil')}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{SOIL_INFO[soilType].desc}</p>
                    <p className="text-emerald-400 text-[11px] font-semibold">{tr('soil_panel_best')}: {SOIL_INFO[soilType].bestFor}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowResults(true)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-xl shadow-emerald-900/50 flex items-center justify-center space-x-2 text-sm"
              >
                <Brain className="w-4 h-4" />
                <span>{tr('analyse_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            {showResults && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-black text-lg">
                    🌿 {tr('rec_results_title')} {translateSeason(season)} {tr('rec_results_season')}
                  </h3>
                  <span className="text-slate-400 text-xs">{translateSoil(soilType)} · {translateRainfall(rainfall)}</span>
                </div>

                {recommendations.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-slate-400">
                    <Sprout className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">{tr('no_matches')}</p>
                    <p className="text-sm mt-1">{tr('no_matches_sub')}</p>
                  </div>
                ) : (
                  recommendations.map((rec, i) => (
                    <div key={i} className={`rounded-3xl border p-5 sm:p-6 space-y-4 transition-all ${
                      i === 0
                        ? 'bg-emerald-900/30 border-emerald-400/40 shadow-lg shadow-emerald-900/30'
                        : 'bg-white/5 border-white/10'
                    }`}>
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{rec.emoji}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-white font-black text-base">{translateCrop(rec.crop)}</h4>
                              {i === 0 && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">{tr('top_pick')}</span>}
                            </div>
                            <p className="text-slate-400 text-xs">{translateSeason(rec.season)} · {rec.duration} · {tr('water_needs_label')}: {rec.waterNeeds}</p>
                          </div>
                        </div>
                        {/* AI Score */}
                        <div className="flex-shrink-0 text-center bg-white/10 rounded-2xl px-4 py-2">
                          <div className="text-2xl font-black text-emerald-400">{rec.score}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{tr('ai_score')}</div>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { label: tr('msp_price'), value: rec.msp > 0 ? `₹${rec.msp.toLocaleString('en-IN')}/qtl` : tr('market_price'), icon: IndianRupee },
                          { label: tr('expected_yield'), value: rec.expectedYield, icon: Layers },
                          { label: tr('expected_revenue'), value: rec.expectedRevenue, icon: TrendingUp },
                          { label: tr('duration_label'), value: rec.duration, icon: Clock },
                        ].map((s, j) => {
                          const Icon = s.icon;
                          return (
                            <div key={j} className="bg-white/5 rounded-xl p-2.5 space-y-0.5">
                              <div className="flex items-center space-x-1 text-slate-400">
                                <Icon className="w-3 h-3" />
                                <span className="text-[10px] font-semibold">{s.label}</span>
                              </div>
                              <div className="text-white text-xs font-bold">{s.value}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Reasons & Risks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <p className="text-emerald-400 text-xs font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /><span>{tr('why_this_crop')}</span>
                          </p>
                          {rec.reasons.map((r, j) => (
                            <div key={j} className="flex items-start space-x-1.5">
                              <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                              <p className="text-slate-300 text-xs leading-relaxed">{r}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-amber-400 text-xs font-bold flex items-center space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5" /><span>{tr('watch_out')}</span>
                          </p>
                          {rec.risks.map((r, j) => (
                            <div key={j} className="flex items-start space-x-1.5">
                              <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                              <p className="text-slate-300 text-xs leading-relaxed">{r}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA to growing guide */}
                      <button
                        onClick={() => { setGuideCrop(rec.crop in growingGuides ? rec.crop : Object.keys(growingGuides)[0]); setActiveTab('grow'); }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 transition"
                      >
                        <Leaf className="w-3.5 h-3.5" />
                        <span>{tr('view_guide_btn')}</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════
            TAB 3: GROWING GUIDE
        ══════════════════════════════════ */}
        {activeTab === 'grow' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Crop Selector */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3">
              <h2 className="text-white font-black text-lg flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span>{tr('select_crop_guide')}</span>
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(growingGuides).map(c => (
                  <button key={c} onClick={() => setGuideCrop(c)}
                    className={`flex items-center space-x-2 p-3 rounded-2xl text-xs font-bold transition ${
                      guideCrop === c
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}>
                    <span className="text-base">{growingGuides[c].emoji}</span>
                    <span>{translateCrop(c)}</span>
                  </button>
                ))}
              </div>
            </div>

            {guide ? (
              <>
                {/* Crop Overview */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-green-950/40 border border-emerald-400/20 rounded-3xl p-5 sm:p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-4xl">{guide.emoji}</span>
                    <div>
                      <h3 className="text-white font-black text-xl">{translateCrop(guide.crop)}</h3>
                      <p className="text-emerald-400 text-xs">{tr('optimal_soil')}: {translateSoil(guide.soilType)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: tr('optimal_ph'), value: guide.optimalPH, icon: FlaskConical, color: 'text-emerald-400' },
                      { label: tr('temp_range'), value: guide.temperatureRange, icon: ThermometerSun, color: 'text-orange-400' },
                      { label: tr('seed_rate'), value: guide.seedRate, icon: Sprout, color: 'text-lime-400' },
                      { label: tr('spacing'), value: guide.spacing, icon: Layers, color: 'text-blue-400' },
                    ].map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <div key={i} className="bg-white/5 rounded-2xl p-3 space-y-1">
                          <Icon className={`w-4 h-4 ${s.color}`} />
                          <div className={`text-sm font-black ${s.color}`}>{s.value}</div>
                          <div className="text-slate-400 text-[10px] font-semibold">{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Growing Timeline */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
                  <h3 className="text-white font-black text-base flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{tr('growing_timeline')}</span>
                  </h3>
                  <div className="space-y-2">
                    {guide.timeline.map((t, i) => (
                      <div key={i} className="flex items-start space-x-3 p-3 bg-white/5 rounded-2xl">
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className="text-xl">{t.icon}</div>
                          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">{t.week.split('–')[0]}</div>
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] font-semibold">{t.week}</p>
                          <p className="text-white text-xs font-semibold mt-0.5">{t.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accordion Sections */}
                {[
                  {
                    id: 'irrigation', title: tr('irrigation_title'), icon: Droplets,
                    color: 'text-blue-400', iconBg: 'bg-blue-500/10',
                    content: (
                      <div className="space-y-3">
                        {guide.irrigationSchedule.map((ir, i) => (
                          <div key={i} className="bg-white/5 rounded-2xl p-3 space-y-1">
                            <p className="text-blue-300 font-bold text-xs">{ir.stage}</p>
                            <p className="text-slate-400 text-[11px]">Timing: {ir.timing}</p>
                            <p className="text-slate-200 text-xs">{ir.method}</p>
                          </div>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'fertilizer', title: tr('fertilizer_title'), icon: FlaskConical,
                    color: 'text-lime-400', iconBg: 'bg-lime-500/10',
                    content: (
                      <div className="space-y-3">
                        {guide.fertilizers.map((f, i) => (
                          <div key={i} className="bg-white/5 rounded-2xl p-3 space-y-1">
                            <p className="text-lime-300 font-bold text-xs">{f.stage}</p>
                            <p className="text-slate-200 text-xs">NPK: {f.npk}</p>
                            {f.organic !== '—' && <p className="text-emerald-300 text-xs">Organic: {f.organic}</p>}
                            <p className="text-slate-400 text-[11px] italic">{f.qty}</p>
                          </div>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'pest', title: tr('pest_title'), icon: Bug,
                    color: 'text-rose-400', iconBg: 'bg-rose-500/10',
                    content: (
                      <div className="space-y-3">
                        {guide.pestControl.map((p, i) => (
                          <div key={i} className="bg-white/5 rounded-2xl p-3 space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <Bug className="w-3.5 h-3.5 text-rose-400" />
                              <p className="text-rose-300 font-bold text-xs">{p.pest}</p>
                            </div>
                            <p className="text-amber-200 text-[11px]">🔍 Symptom: {p.symptom}</p>
                            <p className="text-slate-200 text-xs">✅ Remedy: {p.remedy}</p>
                          </div>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'harvest', title: tr('harvest_title'), icon: CheckCircle2,
                    color: 'text-amber-400', iconBg: 'bg-amber-500/10',
                    content: (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <p className="text-amber-300 font-bold text-xs">📋 Know when to harvest:</p>
                          {guide.harvestIndicators.map((h, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                              <p className="text-slate-200 text-xs">{h}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <p className="text-emerald-300 font-bold text-xs">📦 Post-Harvest Steps:</p>
                          {guide.postHarvest.map((h, i) => (
                            <div key={i} className="flex items-start space-x-2">
                              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <p className="text-slate-200 text-xs">{h}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  },
                ].map(section => (
                  <div key={section.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-white/5 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${section.iconBg} rounded-xl flex items-center justify-center`}>
                          <section.icon className={`w-4 h-4 ${section.color}`} />
                        </div>
                        <span className="text-white font-bold text-sm">{section.title}</span>
                      </div>
                      {expandedSection === section.id
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {expandedSection === section.id && (
                      <div className="px-4 sm:px-5 pb-5 animate-fadeIn">
                        {section.content}
                      </div>
                    )}
                  </div>
                ))}

                {/* Expert Tips */}
                <div className="bg-gradient-to-br from-amber-900/30 to-orange-950/30 border border-amber-400/20 rounded-3xl p-5 space-y-3">
                  <h3 className="text-amber-300 font-black text-sm flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>{tr('expert_tips')} {translateCrop(guide.crop)}</span>
                  </h3>
                  {guide.tips.map((tip, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-3">
                      <p className="text-slate-200 text-xs leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
                <Leaf className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-50" />
                <p className="text-slate-300 font-semibold">{tr('select_crop_above')}</p>
                <p className="text-slate-500 text-xs mt-1">{tr('guide_avail_for')}: {Object.keys(growingGuides).map(translateCrop).join(', ')}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AICropAdvisorPage;
