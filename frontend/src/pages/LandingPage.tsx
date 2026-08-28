import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wheat, Calendar, Clock, ShieldCheck, CreditCard, ArrowRight,
  CloudSun, ClipboardCheck, Phone, MapPin, CheckCircle2, Star,
  Navigation, TrendingUp, Users, IndianRupee, Layers, Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const localDict: Record<string, any> = {
  en: {
    official_badge: 'Government of India — Ministry of Consumer Affairs & Food',
    bullet1: '✅ No waiting — book your slot in 2 minutes',
    bullet2: '✅ Live queue tracker — know exactly when your turn is',
    bullet3: '✅ MSP payment directly to your bank account',
    bullet4: '✅ Works in Telugu, Hindi, English & more languages',
    new_reg: 'New Registration',
    helpline: 'Helpline: 1800-180-1551 (Toll Free, 24×7)',
    farmers_today: '2,847 farmers used SmartProcure today',
    avg_rating: '4.9/5 avg rating',
    payments_processed: 'Payments processed',
    avg_wait: 'Avg wait < 2 hrs',
    down_from: 'Down from 12+ hours',
    simple_process: 'Simple Process',
    smart_features: 'Smart Features',
    real_stories: 'Real Stories',
    farmers_speak: 'Farmers Speak',
    feedback_sub: 'Real feedback from farmers across Andhra Pradesh and Telangana',
    get_started_today: 'Get Started Today',
    ready_to_leave: 'Leave your crop worries to us',
    free_to_use: 'Free to use',
    no_middlemen: 'No middlemen',
    govt_protected: 'Govt. protected MSP',
    learn_more: 'Learn more',
    step1_lbl: 'OTP Login',
    step1_sub: 'Mobile number only, no password',
    step2_lbl: 'Book Slot',
    step2_sub: 'Choose date & time window',
    step3_lbl: 'Get Token',
    step3_sub: 'QR-verified digital gate pass',
    step4_lbl: 'Live Queue',
    step4_sub: 'Track your turn in real-time',
    step5_lbl: 'Inspection',
    step5_sub: 'Moisture & quality grading',
    step6_lbl: 'MSP Payment',
    step6_sub: 'Bank credit within 24 hours',
    feat_weather_title: 'Agri-Weather Forecast',
    feat_weather_desc: '7-day meteorological forecast with moisture risk index and rain alerts. Know the best date to bring your crop.',
    feat_weather_badge: '☀️ Smart Advisory',
    feat_checklist_title: 'Center Arrival Checklist',
    feat_checklist_desc: 'Complete guide to mandatory documents, moisture thresholds, and packing norms. Never get rejected at the gate.',
    feat_checklist_badge: '📋 Gate Ready',
    feat_gps_title: 'GPS Centre Finder',
    feat_gps_desc: 'Automatically detects your location and recommends the nearest procurement centre with live slot availability.',
    feat_gps_badge: '📍 GPS Smart',
    feat_queue_title: 'Live Queue Tracker',
    feat_queue_desc: 'Real-time digital token tracking. Get notified when your token is called — no more guessing your turn.',
    feat_queue_badge: '🔴 Live',
    feat_crops_title: 'Multi-Crop Booking',
    feat_crops_desc: 'Bring Paddy, Maize, Pulses and Cotton in one trip. Combined weighbridge & MSP calculation at a single counter.',
    feat_crops_badge: '🌾 47 Crops',
    feat_payment_title: 'Direct Bank Payment',
    feat_payment_desc: 'MSP amount is transferred via DBT directly to your Aadhaar-linked bank account within 24-48 hours.',
    feat_payment_badge: '💳 DBT Linked',
    quote1: 'No more standing in queue. I book my token on mobile and go straight to the counter!',
    quote2: 'Payment within 24 hours directly to my bank account. SmartProcure changed everything for us.',
    quote3: 'Weather forecast feature warned me about rain — I postponed my delivery and avoided moisture rejection at the yard.',
  },
  te: {
    official_badge: 'భారత ప్రభుత్వం — వినియోగదారుల వ్యవహారాలు, ఆహార & ప్రజా పంపిణీ మంత్రిత్వ శాఖ',
    bullet1: '✅ వేచి ఉండాల్సిన అవసరం లేదు — 2 నిమిషాల్లో స్లాట్ బుక్ చేసుకోండి',
    bullet2: '✅ లైవ్ క్యూ ట్రాకర్ — మీ వంతు ఎప్పుడు వస్తుందో ఖచ్చితంగా తెలుసుకోండి',
    bullet3: '✅ MSP చెల్లింపు నేరుగా మీ బ్యాంకు ఖాతాకు జమ అవుతుంది',
    bullet4: '✅ తెలుగు, హిందీ, ఇంగ్లీష్ మరియు మరిన్ని భాషల్లో పనిచేస్తుంది',
    new_reg: 'కొత్త రిజిస్ట్రేషన్',
    helpline: 'సహాయవాణి: 1800-180-1551 (ఉచితం, 24×7)',
    farmers_today: 'ఈరోజు 2,847 మంది రైతులు సేవలు పొందారు',
    avg_rating: '4.9/5 సగటు రేటింగ్',
    payments_processed: 'చెల్లింపులు పూర్తయ్యాయి',
    avg_wait: 'సగటు వేచి ఉండే సమయం < 2 గంటలు',
    down_from: 'గతంలో 12+ గంటల నుండి తగ్గింది',
    simple_process: 'సులభమైన ప్రక్రియ',
    smart_features: 'స్మార్ట్ ఫీచర్లు',
    real_stories: 'నిజమైన అనుభవాలు',
    farmers_speak: 'రైతుల మాటలు',
    feedback_sub: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ రైతుల నుండి నిజమైన అభిప్రాయాలు',
    get_started_today: 'ఈరోజే ప్రారంభించండి',
    ready_to_leave: 'మీ పంట గురించి మాకు వదిలేయండి',
    free_to_use: 'పూర్తిగా ఉచితం',
    no_middlemen: 'దళారులు లేరు',
    govt_protected: 'ప్రభుత్వ రక్షణ మరియు MSP',
    learn_more: 'మరింత సమాచారం',
    step1_lbl: 'OTP లాగిన్',
    step1_sub: 'మొబైల్ నంబర్ మాత్రమే, పాస్‌వర్డ్ అవసరం లేదు',
    step2_lbl: 'స్లాట్ బుకింగ్',
    step2_sub: 'తేదీ మరియు సమయాన్ని ఎంచుకోండి',
    step3_lbl: 'టోకెన్ పొందండి',
    step3_sub: 'QR-ధృవీకరించబడిన డిజిటల్ గేట్ పాస్',
    step4_lbl: 'లైవ్ క్యూ',
    step4_sub: 'మీ వంతును మొబైల్‌లో చూడండి',
    step5_lbl: 'నాణ్యత పరీక్ష',
    step5_sub: 'తేమ శాతం మరియు గ్రేడింగ్ పరీక్ష',
    step6_lbl: 'MSP చెల్లింపు',
    step6_sub: '24 గంటల్లో నేరుగా బ్యాంకు జమ',
    feat_weather_title: 'అగ్రి-వెదర్ సూచన',
    feat_weather_desc: 'తేమ శాతం ప్రమాదం మరియు వర్షపు హెచ్చరికలతో 7 రోజుల వాతావరణ సమాచారం. సరైన రోజును ఎంచుకోండి.',
    feat_weather_badge: '☀️ స్మార్ట్ సూచన',
    feat_checklist_title: 'యార్డ్ రాక చెక్‌లిస్ట్',
    feat_checklist_desc: 'తీసుకురావలసిన పత్రాలు, గరిష్ట తేమ శాతం మరియు ప్యాకింగ్ నియమాల పూర్తి వివరాలు.',
    feat_checklist_badge: '📋 గేట్ పాస్ రెడీ',
    feat_gps_title: 'GPS సేకరణ కేంద్రాల గుర్తింపు',
    feat_gps_desc: 'ఆటోమేటిక్‌గా మీ లొకేషన్ గుర్తించి సమీప సేకరణ కేంద్రాల లైవ్ స్లాట్‌లను చూపిస్తుంది.',
    feat_gps_badge: '📍 GPS స్మార్ట్',
    feat_queue_title: 'లైవ్ క్యూ ట్రాకర్',
    feat_queue_desc: 'రియల్-టైమ్ డిజిటల్ టోకెన్ ట్రాకింగ్. మీ టోకెన్ పిలిచినప్పుడు ఫోన్‌కు నోటిఫికేషన్ వస్తుంది.',
    feat_queue_badge: '🔴 లైవ్',
    feat_crops_title: 'బహుళ పంటల బుకింగ్',
    feat_crops_desc: 'వరి, జొన్నలు, పప్పులు మరియు పత్తిని ఒకేసారి బుక్ చేసి తీసుకురండి.',
    feat_crops_badge: '🌾 47 పంటలు',
    feat_payment_title: 'నేరుగా బ్యాంకు ఖాతాకు జమ',
    feat_payment_desc: 'సేకరణ పూర్తయిన 24-48 గంటల్లో మీ ఆధార్ అనుసంధాన బ్యాంకు ఖాతాకు జమ అవుతుంది.',
    feat_payment_badge: '💳 DBT లింక్డ్',
    quote1: 'పంట అమ్మకానికి ఇప్పుడు క్యూలో నిల్చోవాల్సిన అవసరం లేదు. మొబైల్‌లో టోకెన్ బుక్ చేసుకుని నేరుగా కౌంటర్‌కు వెళతాను!',
    quote2: '24 గంటల్లో నా బ్యాంకు ఖాతాకు నేరుగా పేమెంట్స్ జరిగాయి. కిసాన్ మిత్ర మా జీవితాలను మార్చేసింది.',
    quote3: 'వాతావరణ సమాచారం ద్వారా వర్షం వస్తుందని ముందే తెలిసింది — నేను ధాన్యం తీసుకురావడం వాయిదా వేసుకున్నాను మరియు తేమ శాతం తిరస్కరణ నుండి తప్పించుకున్నాను.',
  },
  hi: {
    official_badge: 'भारत सरकार — उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय',
    bullet1: '✅ कोई प्रतीक्षा नहीं — 2 मिनट में अपना स्लॉट बुक करें',
    bullet2: '✅ लाइव कतार ट्रैकर — जानें कि आपकी बारी कब आएगी',
    bullet3: '✅ MSP भुगतान सीधे आपके बैंक खाते में जमा होगा',
    bullet4: '✅ तेलुगु, हिंदी, अंग्रेजी और अधिक भाषाओं में काम करता है',
    new_reg: 'नया पंजीकरण',
    helpline: 'हेल्पलाइन: 1800-180-1551 (टोल फ्री, 24×7)',
    farmers_today: 'आज 2,847 किसानों ने स्मार्टप्रोक्योर का उपयोग किया',
    avg_rating: '4.9/5 औसत रेटिंग',
    payments_processed: 'भुगतान संसाधित किए गए',
    avg_wait: 'औसत प्रतीक्षा समय < 2 घंटे',
    down_from: 'पहले 12+ घंटे से कम',
    simple_process: 'सरल प्रक्रिया',
    smart_features: 'स्मार्ट फीचर्स',
    real_stories: 'वास्तविक कहानियाँ',
    farmers_speak: 'किसानों की बात',
    feedback_sub: 'आंध्र प्रदेश और तेलंगाना के किसानों से वास्तविक प्रतिक्रिया',
    get_started_today: 'आज ही शुरू करें',
    ready_to_leave: 'अपनी फसल की चिंता हमें सौंपें',
    free_to_use: 'उपयोग के लिए मुफ्त',
    no_middlemen: 'कोई बिचौलिया नहीं',
    govt_protected: 'सरकार द्वारा सुरक्षित MSP',
    learn_more: 'और जानें',
    step1_lbl: 'OTP लॉगिन',
    step1_sub: 'केवल मोबाइल नंबर, कोई पासवर्ड नहीं',
    step2_lbl: 'स्लॉट बुकिंग',
    step2_sub: 'दिनांक और समय चुनें',
    step3_lbl: 'टोकन प्राप्त करें',
    step3_sub: 'QR-सत्यापित डिजिटल पास',
    step4_lbl: 'लाइव कतार',
    step4_sub: 'अपनी बारी को लाइव ट्रैक करें',
    step5_lbl: 'गुणवत्ता जांच',
    step5_sub: 'नमी और ग्रेडिंग मूल्यांकन',
    step6_lbl: 'MSP भुगतान',
    step6_sub: '24 घंटे में सीधे बैंक में',
    feat_weather_title: 'कृषि-मौसम पूर्वानुमान',
    feat_weather_desc: 'नमी के जोखिम और बारिश की चेतावनी के साथ 7-दिवसीय मौसम पूर्वानुमान। फसल लाने की सही तारीख जानें।',
    feat_weather_badge: '☀️ स्मार्ट सलाह',
    feat_checklist_title: 'केंद्र आगमन चेकलिस्ट',
    feat_checklist_desc: 'अनिवार्य दस्तावेजों, नमी सीमा और पैकिंग नियमों की पूरी जानकारी ताकि प्रवेश में कोई बाधा न हो।',
    feat_checklist_badge: '📋 गेट रेडी',
    feat_gps_title: 'GPS केंद्र खोजक',
    feat_gps_desc: 'स्वचालित रूप से आपके स्थान का पता लगाता है और लाइव स्लॉट उपलब्धता के साथ निकटतम केंद्र की सिफारिश करता है।',
    feat_gps_badge: '📍 GPS स्मार्ट',
    feat_queue_title: 'लाइव कतार ट्रैकर',
    feat_queue_desc: 'वास्तविक समय डिजिटल टोकन ट्रैकिंग। टोकन बुलाए जाने पर फोन पर अलर्ट प्राप्त करें।',
    feat_queue_badge: '🔴 लाइव',
    feat_crops_title: 'बहु-फसल बुकिंग',
    feat_crops_desc: 'एक ही बार में धान, मक्का, दालें और कपास लाएं। एक ही काउंटर पर संयुक्त वजन और MSP गणना।',
    feat_crops_badge: '🌾 47 फसलों',
    feat_payment_title: 'सीधे बैंक खाते में भुगतान',
    feat_payment_desc: 'MSP राशि सीधे आपके आधार-लिंक्ड बैंक खाते में 24-48 घंटों के भीतर ट्रांसफर कर दी जाती है।',
    feat_payment_badge: '💳 DBT लिंक्ड',
    quote1: 'कतार में खड़े होने की कोई आवश्यकता नहीं है। मैं फोन पर अपना टोकन बुक करता हूं और सीधे केंद्र पर जाता हूं!',
    quote2: 'मेरे बैंक खाते में 24 घंटे के भीतर सीधे भुगतान प्राप्त हुआ। स्मार्टप्रोक्योर ने सब कुछ बदल दिया।',
    quote3: 'मौसम पूर्वानुमान सुविधा ने मुझे बारिश के बारे में चेतावनी दी थी - मैंने फसल लाने की तारीख बदल दी और यार्ड में नमी के कारण खारिज होने से बच गया।',
  }
};

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [ticker, setTicker] = useState(0);

  // Fallback map helper
  const translate = (key: string) => {
    return localDict[language]?.[key] || localDict['en']?.[key] || key;
  };

  const testimonials = [
    {
      name: 'Ravi Kumar Reddy',
      district: 'Guntur, Andhra Pradesh',
      avatar: '👨‍🌾',
      quote: translate('quote1'),
      rating: 5,
      crop: 'Paddy'
    },
    {
      name: 'Suresh Patel',
      district: 'Warangal, Telangana',
      avatar: '🧑‍🌾',
      quote: translate('quote2'),
      rating: 5,
      crop: 'Cotton'
    },
    {
      name: 'Lakshmi Devi',
      district: 'Kurnool, Andhra Pradesh',
      avatar: '👩‍🌾',
      quote: translate('quote3'),
      rating: 5,
      crop: 'Groundnut'
    }
  ];

  const steps = [
    { icon: Phone, label: translate('step1_lbl'), sub: translate('step1_sub'), color: 'bg-emerald-500', num: '01' },
    { icon: Calendar, label: translate('step2_lbl'), sub: translate('step2_sub'), color: 'bg-amber-500', num: '02' },
    { icon: ShieldCheck, label: translate('step3_lbl'), sub: translate('step3_sub'), color: 'bg-blue-500', num: '03' },
    { icon: Clock, label: translate('step4_lbl'), sub: translate('step4_sub'), color: 'bg-purple-500', num: '04' },
    { icon: ClipboardCheck, label: translate('step5_lbl'), sub: translate('step5_sub'), color: 'bg-rose-500', num: '05' },
    { icon: IndianRupee, label: translate('step6_lbl'), sub: translate('step6_sub'), color: 'bg-teal-500', num: '06' },
  ];

  const stats = [
    { value: '47+', label: t('stat_crops'), sub: t('stat_crops_sub'), icon: '🌾' },
    { value: '16+', label: t('stat_centres'), sub: t('stat_centres_sub'), icon: '🏛️' },
    { value: '< 2 hrs', label: t('stat_wait_time'), sub: translate('down_from'), icon: '⏱️' },
    { value: '₹2,183 Cr', label: t('stat_dbt'), sub: t('stat_dbt_sub'), icon: '💰' },
  ];

  // Ticker counter animation
  useEffect(() => {
    const timer = setInterval(() => setTicker(p => p + 1), 40);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO SECTION — Full cinematic crop photo
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">

        {/* Full-width paddy field background */}
        <div className="absolute inset-0">
          <img
            src="/paddy_field.jpg"
            alt="Indian paddy fields at golden hour"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-900/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text + CTA */}
            <div className="space-y-7 text-white">

              {/* Official Govt Badge */}
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur border border-emerald-400/40 px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-300 text-xs font-bold tracking-wider uppercase">
                  {translate('official_badge')}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                  <span className="text-white">Kisan</span>
                  <span className="text-emerald-400">Mitra</span>
                </h1>
                <p className="text-2xl sm:text-3xl font-bold text-amber-300 tracking-wide">
                  SmartProcure — కిసాన్ మిత్ర
                </p>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-light">
                  {t('tagline_desc')}
                </p>
              </div>

              {/* Quick trust points */}
              <div className="space-y-2">
                {[
                  translate('bullet1'),
                  translate('bullet2'),
                  translate('bullet3'),
                  translate('bullet4')
                ].map((point, i) => (
                  <p key={i} className="text-sm text-slate-200 font-medium">{point}</p>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {/* Farmer Portal Gateway */}
                <Link
                  to="/signin?role=FARMER"
                  className="flex-1 min-w-[170px] group bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3.5 rounded-2xl shadow-xl transition flex items-center justify-center space-x-2 text-xs"
                >
                  <Wheat className="w-4.5 h-4.5" />
                  <span>{t('btn_farmer_login')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Procurement Officer Gateway */}
                <Link
                  to="/signin?role=OFFICER"
                  className="flex-1 min-w-[170px] group bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-3.5 rounded-2xl shadow-xl transition flex items-center justify-center space-x-2 text-xs"
                >
                  <Building2 className="w-4.5 h-4.5" />
                  <span>{t('btn_officer_login')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Admin Gateway */}
                <Link
                  to="/signin?role=ADMIN"
                  className="flex-1 min-w-[170px] group bg-amber-600 hover:bg-amber-500 text-white font-black px-5 py-3.5 rounded-2xl shadow-xl transition flex items-center justify-center space-x-2 text-xs"
                >
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>{t('btn_admin_login')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Farmer registration link */}
              <div className="text-xs text-slate-300">
                <span>New Farmer? </span>
                <Link to="/register" className="text-amber-300 hover:underline font-bold">
                  {translate('new_farmer_registration')} →
                </Link>
              </div>

              {/* Helpline */}
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{translate('helpline')}</span>
              </div>
            </div>

            {/* Right: Farmer Photo + floating stat cards */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Farmer photo with frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 max-w-md mx-auto">
                  <img
                    src="/farmer_hero.jpg"
                    alt="Indian farmer in wheat field"
                    className="w-full h-[520px] object-cover object-top"
                  />
                  {/* Bottom gradient inside photo */}
                  <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
                      <p className="text-white text-xs font-bold">🌾 {translate('farmers_today')}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                        <span className="text-amber-300 text-xs ml-1 font-semibold">{translate('avg_rating')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stat pill — top left */}
                <div className="absolute -top-4 -left-8 bg-emerald-500 text-white px-4 py-2.5 rounded-2xl shadow-xl animate-bounce-slow">
                  <p className="text-xs font-bold">💰 {translate('payments_val')}</p>
                  <p className="text-[10px] opacity-80">{translate('payments_processed')}</p>
                </div>

                {/* Floating stat pill — bottom right */}
                <div className="absolute -bottom-4 -right-6 bg-amber-500 text-white px-4 py-2.5 rounded-2xl shadow-xl">
                  <p className="text-xs font-bold">⏱ {translate('avg_wait')}</p>
                  <p className="text-[10px] opacity-80">{translate('down_from')}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full fill-slate-50">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LIVE STATS TICKER
      ═══════════════════════════════════════════ */}
      <section className="bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100 hover:shadow-md transition group">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-emerald-700 group-hover:scale-110 transition-transform">{stat.value}</div>
                <div className="text-sm font-bold text-slate-800 mt-1">{stat.label}</div>
                <div className="text-xs text-slate-400 mt-0.5 leading-snug">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — 6 steps
      ═══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">{translate('simple_process')}</span>
            <h2 className="text-4xl font-black text-slate-900">{t('how_it_works')}</h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
              {t('how_desc')}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {/* Connecting dotted line */}
            <div className="hidden lg:block absolute top-10 left-[8%] right-[8%] h-px border-t-2 border-dashed border-emerald-200 z-0" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-3 group">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-black text-slate-400 font-mono">{step.num}</div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{step.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">{translate('smart_features')}</span>
            <h2 className="text-4xl font-black text-slate-900">{t('key_features_heading')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: CloudSun,
                title: translate('feat_weather_title'),
                desc: translate('feat_weather_desc'),
                badge: translate('feat_weather_badge'),
                link: '/farmer/weather',
                color: 'amber'
              },
              {
                icon: ClipboardCheck,
                title: translate('feat_checklist_title'),
                desc: translate('feat_checklist_desc'),
                badge: translate('feat_checklist_badge'),
                link: '/farmer/guidelines',
                color: 'emerald'
              },
              {
                icon: Navigation,
                title: translate('feat_gps_title'),
                desc: translate('feat_gps_desc'),
                badge: translate('feat_gps_badge'),
                link: '/farmer/book-slot',
                color: 'blue'
              },
              {
                icon: Clock,
                title: translate('feat_queue_title'),
                desc: translate('feat_queue_desc'),
                badge: translate('feat_queue_badge'),
                link: '/farmer/my-queue',
                color: 'purple'
              },
              {
                icon: Layers,
                title: translate('feat_crops_title'),
                desc: translate('feat_crops_desc'),
                badge: translate('feat_crops_badge'),
                link: '/farmer/book-slot',
                color: 'rose'
              },
              {
                icon: CreditCard,
                title: translate('feat_payment_title'),
                desc: translate('feat_payment_desc'),
                badge: translate('feat_payment_badge'),
                link: '/farmer/payments',
                color: 'teal'
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              const colorMap: any = {
                amber: 'border-amber-200 hover:border-amber-400 bg-amber-50',
                emerald: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50',
                blue: 'border-blue-200 hover:border-blue-400 bg-blue-50',
                purple: 'border-purple-200 hover:border-purple-400 bg-purple-50',
                rose: 'border-rose-200 hover:border-rose-400 bg-rose-50',
                teal: 'border-teal-200 hover:border-teal-400 bg-teal-50'
              };
              const iconColorMap: any = {
                amber: 'bg-amber-500', emerald: 'bg-emerald-500', blue: 'bg-blue-500',
                purple: 'bg-purple-500', rose: 'bg-rose-500', teal: 'bg-teal-500'
              };
              return (
                <Link
                  key={i}
                  to={feat.link}
                  className={`block rounded-3xl p-6 border-2 ${colorMap[feat.color]} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg space-y-4 group`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 ${iconColorMap[feat.color]} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[11px] bg-white rounded-full px-2.5 py-1 border border-slate-200 font-bold text-slate-600 shadow-sm">{feat.badge}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">{feat.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-bold text-slate-600 group-hover:text-emerald-700 transition-colors">
                    <span>{translate('learn_more')}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FARMER TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-b from-emerald-950 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="inline-block bg-white/10 text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">{translate('real_stories')}</span>
            <h2 className="text-4xl font-black">{translate('farmers_speak')}</h2>
            <p className="text-slate-400 text-sm">{translate('feedback_sub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className={`bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 space-y-4 transition-all duration-300 ${i === currentSlide ? 'ring-2 ring-emerald-400 bg-emerald-900/20' : ''}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center text-2xl">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-emerald-400 text-xs flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{t.district}</span>
                    </p>
                  </div>
                  <div className="ml-auto bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-1 rounded-full">{t.crop}</div>
                </div>
                <p className="text-slate-200 text-sm italic leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center space-x-0.5">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
              </div>
            ))}
          </div>

          {/* Slide dots */}
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-emerald-400 w-6' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BOTTOM CTA SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-green-800 to-emerald-950 rounded-3xl p-10 sm:p-14 text-white shadow-2xl text-center">
            {/* Soft glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <p className="text-emerald-300 text-sm font-bold uppercase tracking-widest">{translate('get_started_today')}</p>
              <h3 className="text-4xl sm:text-5xl font-black leading-tight">
                {translate('ready_to_leave')}
              </h3>
              <p className="text-emerald-200 text-base max-w-xl mx-auto leading-relaxed">
                {translate('cta_desc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-2xl mx-auto">
                <Link
                  to="/signin?role=FARMER"
                  className="flex-1 group bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3.5 rounded-2xl transition flex items-center justify-center space-x-2 text-xs"
                >
                  <Wheat className="w-4 h-4" />
                  <span>{t('btn_farmer_login')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/signin?role=OFFICER"
                  className="flex-1 group bg-blue-600 hover:bg-blue-500 text-white font-black px-6 py-3.5 rounded-2xl transition flex items-center justify-center space-x-2 text-xs"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t('btn_officer_login')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/signin?role=ADMIN"
                  className="flex-1 group bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl transition flex items-center justify-center space-x-2 text-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('btn_admin_login')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="text-xs text-emerald-200">
                <span>New Farmer? </span>
                <Link to="/register" className="text-amber-300 hover:underline font-bold">
                  {translate('new_farmer_registration')} →
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-6 text-xs text-emerald-300 pt-2">
                <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-4 h-4" /><span>{translate('free_to_use')}</span></span>
                <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-4 h-4" /><span>{translate('no_middlemen')}</span></span>
                <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-4 h-4" /><span>{translate('govt_protected')}</span></span>
              </div>

              {/* Helpline */}
              <p className="text-emerald-400 text-sm font-semibold pt-1">
                📞 {translate('helpline')}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
