import React, { useState } from 'react';
import {
  Phone, Mail, MessageSquare, ShieldCheck, ChevronDown, ChevronUp,
  Search, Send, ArrowRight, CheckCircle2, User, Building2, HelpCircle,
  Clock, MapPin, AlertCircle, Sparkles, MessageCircle, Brain, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FAQ {
  q: string;
  a: string;
  category: 'booking' | 'moisture' | 'payment' | 'general';
}

interface StateContact {
  state: string;
  phone: string;
  email: string;
  hours: string;
}

const helplineDict: Record<string, any> = {
  en: {
    title: 'Kisan Support & Helpline Portal',
    desc: 'Get in touch with national & state helpline centers, submit grievances, or chat with AI KisanMitra for instant answers.',
    toll_free_lbl: 'Toll-Free National Kisan Helpline (24×7)',
    toll_free_num: '1800-180-1551',
    state_dirs: 'State-wise Procurement Helplines',
    faq_section: 'Frequently Asked Questions (FAQ)',
    faq_sub: 'Quick answers to slot booking, moisture thresholds, and DBT payment queries.',
    submit_grievance: 'Submit a Query / Grievance',
    submit_desc: 'Fill out the form below. Our district nodal officer will respond within 24 hours.',
    name_lbl: 'Full Name *',
    mobile_lbl: 'Mobile Number *',
    district_lbl: 'Select District *',
    query_type: 'Query Category *',
    msg_lbl: 'Describe Your Issue / Question *',
    btn_submit: 'Submit Query',
    success_title: 'Query Submitted Successfully!',
    success_desc: 'Your grievance ID is KM-GRI-2026-',
    success_sub: '. A support officer will contact you shortly.',
    chat_title: 'AI KisanMitra Assistant',
    chat_desc: 'Ask anything about crop moisture, MSP, slot booking, or required documents.',
    chat_placeholder: 'Type your agriculture query here...',
    chat_init: 'Namaste! I am your AI KisanMitra helper. How can I help you today?',
    faq_cats: {
      all: 'All FAQs',
      booking: 'Slot Booking',
      moisture: 'Quality & Moisture',
      payment: 'DBT Payments',
      general: 'General Info'
    },
    query_cats: {
      booking: 'Slot Booking Issues',
      moisture: 'Quality / Moisture Limits',
      payment: 'DBT Bank Credit Delay',
      other: 'Other Queries'
    }
  },
  te: {
    title: 'కిసాన్ సహాయ కేంద్రం & సహాయవాణి',
    desc: 'జాతీయ మరియు రాష్ట్ర హెల్ప్‌లైన్లతో మాట్లాడండి, మీ ఫిర్యాదులను సమర్పించండి లేదా తక్షణ సమాధానాల కోసం AI కిసాన్ మిత్రతో చాట్ చేయండి.',
    toll_free_lbl: 'ఉచిత జాతీయ కిసాన్ సహాయవాణి (24×7)',
    toll_free_num: '1800-180-1551',
    state_dirs: 'రాష్ట్రాల వారీగా పంట సేకరణ హెల్ప్‌లైన్లు',
    faq_section: 'తరచుగా అడిగే ప్రశ్నలు (FAQ)',
    faq_sub: 'స్లాట్ బుకింగ్, తేమ శాతం మరియు DBT చెల్లింపులపై తక్షణ సమాధానాలు.',
    submit_grievance: 'ప్రశ్న / ఫిర్యాదు సమర్పించండి',
    submit_desc: 'క్రింది ఫారమ్‌ను పూరించండి. మా జిల్లా నోడల్ అధికారి 24 గంటల్లో సమాధానం ఇస్తారు.',
    name_lbl: 'పూర్తి పేరు *',
    mobile_lbl: 'మొబైల్ సంఖ్య *',
    district_lbl: 'జిల్లా ఎంచుకోండి *',
    query_type: 'సమస్య యొక్క వర్గం *',
    msg_lbl: 'మీ సమస్య / ప్రశ్నను వివరించండి *',
    btn_submit: 'ఫిర్యాదు సమర్పించు',
    success_title: 'ఫిర్యాదు విజయవంతంగా సమర్పించబడింది!',
    success_desc: 'మీ ఫిర్యాదు ID KM-GRI-2026-',
    success_sub: '. త్వరలోనే మా అధికారి మిమ్మల్ని సంప్రదిస్తారు.',
    chat_title: 'AI కిసాన్ మిత్ర అసిస్టెంట్',
    chat_desc: 'పంటల తేమ శాతం, కనీస మద్దతు ధర (MSP), స్లాట్ బుకింగ్ లేదా నిబంధనలపై ఏదైనా అడగండి.',
    chat_placeholder: 'మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...',
    chat_init: 'నమస్కారం! నేను మీ AI కిసాన్ మిత్ర సహాయకుడిని. ఈ రోజు మీకు ఏ విధంగా సహాయపడగలను?',
    faq_cats: {
      all: 'అన్ని ప్రశ్నలు',
      booking: 'స్లాట్ బుకింగ్',
      moisture: 'నాణ్యత & తేమ శాతం',
      payment: 'DBT చెల్లింపులు',
      general: 'సాధారణ సమాచారం'
    },
    query_cats: {
      booking: 'స్లాట్ బుకింగ్ సమస్యలు',
      moisture: 'నాణ్యత / తేమ శాతం పరిమితులు',
      payment: 'DBT బ్యాంకు జమ ఆలస్యం',
      other: 'ఇతర ప్రశ్నలు'
    }
  },
  hi: {
    title: 'किसान सहायता केंद्र और हेल्पलाइन',
    desc: 'राष्ट्रीय और राज्य हेल्पलाइनों से संपर्क करें, अपनी शिकायतें दर्ज करें, या त्वरित उत्तरों के लिए AI किसानमित्र के साथ चैट करें।',
    toll_free_lbl: 'टोल-फ्री राष्ट्रीय किसान हेल्पलाइन (24×7)',
    toll_free_num: '1800-180-1551',
    state_dirs: 'राज्य-वार खरीद हेल्पलाइनों की सूची',
    faq_section: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    faq_sub: 'स्लॉट बुकिंग, नमी सीमा और DBT बैंक भुगतान से संबंधित त्वरित उत्तर।',
    submit_grievance: 'प्रश्न या शिकायत दर्ज करें',
    submit_desc: 'नीचे दिए गए फॉर्म को भरें। हमारे जिला नोडल अधिकारी 24 घंटे के भीतर आपसे संपर्क करेंगे।',
    name_lbl: 'पूरा नाम *',
    mobile_lbl: 'मोबाइल नंबर *',
    district_lbl: 'जिला चुनें *',
    query_type: 'प्रश्न की श्रेणी *',
    msg_lbl: 'अपनी समस्या या प्रश्न का विवरण दें *',
    btn_submit: 'शिकायत दर्ज करें',
    success_title: 'शिकायत सफलतापूर्वक दर्ज की गई!',
    success_desc: 'आपकी शिकायत संख्या KM-GRI-2026-',
    success_sub: ' है। एक सहायता अधिकारी जल्द ही आपसे संपर्क करेगा।',
    chat_title: 'AI किसानमित्र सहायक',
    chat_desc: 'फसल की नमी, MSP, स्लॉट बुकिंग या आवश्यक दस्तावेजों के बारे में कुछ भी पूछें।',
    chat_placeholder: 'अपनी कृषि संबंधी समस्या यहाँ लिखें...',
    chat_init: 'नमस्ते! मैं आपका AI किसानमित्र सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?',
    faq_cats: {
      all: 'सभी प्रश्न',
      booking: 'स्लॉट बुकिंग',
      moisture: 'गुणवत्ता और नमी',
      payment: 'DBT भुगतान',
      general: 'सामान्य जानकारी'
    },
    query_cats: {
      booking: 'स्लॉट बुकिंग की समस्याएं',
      moisture: 'गुणवत्ता / नमी सीमा',
      payment: 'DBT बैंक क्रेडिट में देरी',
      other: 'अन्य प्रश्न'
    }
  }
};

const faqData: Record<string, FAQ[]> = {
  en: [
    { q: 'What is the maximum moisture limit allowed for Paddy?', a: 'As per government guidelines, the maximum moisture content allowed for Paddy (Common & Grade A) is 17%. Produce exceeding this limit may be rejected at the gate or advised for further sun drying.', category: 'moisture' },
    { q: 'When will I receive my MSP payment?', a: 'Once electronic weighing and quality check are complete, a payment voucher is instantly generated. Direct Benefit Transfer (DBT) is credited to your Aadhaar-linked bank account within 24 to 48 hours.', category: 'payment' },
    { q: 'What documents should I bring to the procurement yard?', a: 'You must bring: (1) Your digital token pass (QR code on mobile or printed), (2) Aadhaar Card, (3) Land record passbook (Pattadar Passbook), and (4) Bank passbook copy matching Aadhaar.', category: 'booking' },
    { q: 'Can I change my booked procurement date or slot?', a: 'Yes, you can reschedule your slot at least 24 hours before the scheduled time by visiting your profile dashboard and clicking on Reschedule.', category: 'booking' },
    { q: 'Can I sell multiple crops on the same day?', a: 'Yes, SmartProcure supports multi-crop bookings. You can select up to 3 different crop types in your single slot booking request.', category: 'general' },
  ],
  te: [
    { q: 'వరి ధాన్యానికి గరిష్ట తేమ శాతం ఎంత ఉండాలి?', a: 'ప్రభుత్వ నిబంధనల ప్రకారం, వరి ధాన్యానికి గరిష్ట తేమ శాతం 17% గా నిర్ణయించబడింది. తేమ శాతం ఇంతకంటే ఎక్కువగా ఉంటే కొనుగోలు నిరాకరించబడుతుంది లేదా ఎండబెట్టాలని సూచించబడుతుంది.', category: 'moisture' },
    { q: 'నా పంటకు సంబంధించిన డబ్బులు ఎప్పుడు జమ అవుతాయి?', a: 'ధాన్యం తూకం మరియు నాణ్యత పరిశీలన పూర్తయిన వెంటనే రశీదు జారీ చేయబడుతుంది. తదుపరి 24 నుండి 48 గంటల్లో మీ ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాకు నేరుగా (DBT) జమ అవుతుంది.', category: 'payment' },
    { q: 'మార్కెట్ యార్డ్‌కు ఏ పత్రాలు తీసుకురావాలి?', a: 'మీరు తీసుకురావాల్సినవి: (1) మొబైల్‌లోని డిజిటల్ టోకెన్ పాస్ (QR కోడ్), (2) ఆధార్ కార్డు, (3) పట్టాదారు పాస్ బుక్ (భూమి రికార్డు), మరియు (4) ఆధార్ లింక్డ్ బ్యాంక్ ఖాతా పాస్ బుక్ జిరాక్స్.', category: 'booking' },
    { q: 'నేను బుక్ చేసుకున్న తేదీ లేదా సమయాన్ని మార్చుకోవచ్చా?', a: 'అవును, అపాయింట్‌మెంట్‌కు కనీసం 24 గంటల ముందు మీ ప్రొఫైల్ డాష్‌బోర్డ్‌లోకి వెళ్లి ఉచితంగా రీషెడ్యూల్ చేసుకోవచ్చు.', category: 'booking' },
    { q: 'నేను ఒకే రోజు బహుళ పంటలను అమ్ముకోవచ్చా?', a: 'అవును, మా వేదికలో బహుళ పంటల బుకింగ్ మద్దతు ఉంది. మీరు ఒకే స్లాట్ లో గరిష్టంగా 3 రకాల పంటలను ఎంచుకోవచ్చు.', category: 'general' },
  ],
  hi: [
    { q: 'धान की खरीद के लिए अधिकतम नमी की सीमा क्या है?', a: 'सरकारी दिशा-निर्देशों के अनुसार, धान (सामान्य और ग्रेड ए) के लिए अनुमत अधिकतम नमी की मात्रा 17% है। इससे अधिक नमी वाली फसल को गेट पर खारिज किया जा सकता है।', category: 'moisture' },
    { q: 'मुझे अपना MSP भुगतान कब प्राप्त होगा?', a: 'इलेक्ट्रॉनिक वजन और गुणवत्ता जांच पूरी होने के बाद, भुगतान वाउचर तुरंत बन जाता है। DBT भुगतान 24 से 48 घंटे के भीतर सीधे आपके आधार-लिंक्ड बैंक खाते में जमा हो जाता है।', category: 'payment' },
    { q: 'खरीद केंद्र पर मुझे कौन से दस्तावेज लाने होंगे?', a: 'आपको लाना होगा: (1) डिजिटल टोकन पास (मोबाइल या प्रिंटेड क्यूआर कोड), (2) आधार कार्ड, (3) भूमि रिकॉर्ड पासबुक (पट्टादार पासबुक), और (4) आधार-लिंक्ड बैंक पासबुक की प्रति।', category: 'booking' },
    { q: 'क्या मैं अपनी बुक की गई खरीद की तारीख बदल सकता हूँ?', a: 'हाँ, आप अपने प्रोफाइल डैशबोर्ड पर जाकर निर्धारित समय से कम से कम 24 घंटे पहले अपने स्लॉट को रीशेड्यूल कर सकते हैं।', category: 'booking' },
  ]
};

const stateHelplines: StateContact[] = [
  { state: 'Andhra Pradesh', phone: '1800-425-0012', email: 'support.ap@smartprocure.gov.in', hours: '08:00 AM – 06:00 PM' },
  { state: 'Telangana', phone: '1800-599-4488', email: 'support.ts@smartprocure.gov.in', hours: '08:00 AM – 06:00 PM' },
  { state: 'Madhya Pradesh', phone: '1800-233-1560', email: 'support.mp@smartprocure.gov.in', hours: '09:00 AM – 05:00 PM' },
  { state: 'Punjab', phone: '1800-180-4111', email: 'support.pb@smartprocure.gov.in', hours: '08:00 AM – 08:00 PM' },
];

export const HelplinePage: React.FC = () => {
  const { language } = useLanguage();

  const t = (key: string) => {
    return helplineDict[language]?.[key] || helplineDict['en']?.[key] || key;
  };

  const currentFaqs = faqData[language] || faqData['en'];

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [district, setDistrict] = useState('Guntur');
  const [category, setCategory] = useState('booking');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grievanceId, setGrievanceId] = useState<string | null>(null);

  // FAQ states
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  // AI Mitra Chat States
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: t('chat_init') }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const randomId = Math.floor(1000 + Math.random() * 9000).toString();
      setGrievanceId(randomId);
      setName('');
      setMobile('');
      setDescription('');
    }, 800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    // Simulated AI response based on keywords
    setTimeout(() => {
      let aiText = '';
      const text = userText.toLowerCase();

      if (text.includes('moisture') || text.includes('తేమ') || text.includes('नमी')) {
        aiText = language === 'te' 
          ? 'వరి ధాన్యానికి గరిష్టంగా 17% తేమ శాతం మాత్రమే అనుమతించబడుతుంది. తేమ ఎక్కువగా ఉంటే పంటను ఆరబెట్టి యార్డుకు తీసుకురండి.'
          : language === 'hi'
          ? 'धान खरीद के लिए अधिकतम नमी की सीमा 17% है। कृपया फसल को सुखाकर लाएं।'
          : 'The maximum moisture limit for Paddy is 17%. If it is higher, please dry it in the sun before arriving.';
      } else if (text.includes('payment') || text.includes('డబ్బులు') || text.includes('पैसा') || text.includes('dbt')) {
        aiText = language === 'te'
          ? 'సేకరణ తూకం పూర్తయిన తర్వాత 24-48 గంటల్లో మీ బ్యాంక్ ఖాతాకు నేరుగా (DBT) జమ చేయబడుతుంది.'
          : language === 'hi'
          ? 'वजन और ग्रेडिंग के बाद 24 से 48 घंटे में भुगतान सीधे आपके बैंक खाते (DBT) में जमा हो जाएगा।'
          : 'Payments are processed directly via DBT to your Aadhaar-linked bank account within 24–48 hours after weighbridge verification.';
      } else if (text.includes('token') || text.includes('టోకెన్') || text.includes('पास') || text.includes('booking')) {
        aiText = language === 'te'
          ? 'మీరు మీ స్లాట్ బుక్ చేసుకున్న తర్వాత డిజిటల్ టోకెన్ మరియు QR కోడ్ జనరేట్ అవుతుంది. దానిని మీ ఫోన్‌లో చూపించి యార్డులోకి ప్రవేశించవచ్చు.'
          : language === 'hi'
          ? 'स्लॉट बुक होने के बाद डिजिटल टोकन और क्यूआर कोड बनता है। इसे मोबाइल पर दिखाकर गेट एंट्री मिल जाएगी।'
          : 'Once your booking is confirmed, a digital token and QR pass is generated under My Dashboard. Show this on your mobile at the entry gate.';
      } else {
        aiText = language === 'te'
          ? 'క్షమించండి, మీ ప్రశ్న సరిగ్గా అర్థం కాలేదు. దయచేసి తేమ శాతం, బుకింగ్ లేదా బ్యాంకు చెల్లింపులకు సంబంధించిన ప్రశ్నను అడగండి.'
          : language === 'hi'
          ? 'क्षमा करें, मैं आपका प्रश्न नहीं समझ पाया। कृपया नमी, स्लॉट बुकिंग या भुगतान के बारे में पूछें।'
          : 'I could not find a direct answer. Please try asking about moisture limits, slot booking, required documents, or payment status.';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
    }, 600);
  };

  const filteredFaqs = currentFaqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
                          faq.a.toLowerCase().includes(faqSearch.toLowerCase());
    const matchesCat = selectedCat === 'all' || faq.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-900 to-emerald-950 text-white py-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black">{t('title')}</h1>
          <p className="text-emerald-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {t('desc')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ══════════════════════════════════
            LEFT COLUMN — National & State Helplines
        ══════════════════════════════════ */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* National helpline banner */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">{t('toll_free_lbl')}</p>
                <p className="text-xl font-black tracking-wide">{t('toll_free_num')}</p>
              </div>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Call free of cost from any mobile or landline across India. Supported in 12 languages.
            </p>
          </div>

          {/* State Directory */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-slate-900 font-black text-sm flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>{t('state_dirs')}</span>
            </h3>
            <div className="space-y-3">
              {stateHelplines.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{item.state}</span>
                    <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">{item.hours}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span className="flex items-center space-x-1"><Phone className="w-3 h-3" /><span>{item.phone}</span></span>
                    <span className="text-slate-400 font-normal">|</span>
                    <span className="flex items-center space-x-1 text-slate-500 font-normal"><Mail className="w-3 h-3" /><span className="text-[10px] lowercase truncate max-w-[100px]">{item.email}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            MID COLUMN — FAQs & Chat
        ══════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Chat Helper */}
          <div className="bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col h-[400px]">
            {/* Header */}
            <div className="bg-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="font-black text-xs sm:text-sm text-white">{t('chat_title')}</h3>
                  <p className="text-[10px] text-slate-400">{t('chat_desc')}</p>
                </div>
              </div>
              <span className="flex items-center space-x-1 text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                <Sparkles className="w-2.5 h-2.5" />
                <span>ONLINE AI</span>
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
              {messages.map((m, idx) => (
                <div key={idx} className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white self-end rounded-tr-none'
                    : 'bg-slate-900 text-slate-100 self-start rounded-tl-none border border-slate-800'
                }`}>
                  {m.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="bg-slate-900 border-t border-slate-800 p-2.5 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={t('chat_placeholder')}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Grievance Submission Form */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="space-y-1">
              <h3 className="text-slate-900 font-black text-base flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <span>{t('submit_grievance')}</span>
              </h3>
              <p className="text-slate-500 text-xs">{t('submit_desc')}</p>
            </div>

            {grievanceId ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                <div>
                  <h4 className="text-slate-900 font-black text-sm">{t('success_title')}</h4>
                  <p className="text-slate-600 text-xs mt-1">
                    {t('success_desc')}<strong>{grievanceId}</strong>{t('success_sub')}
                  </p>
                </div>
                <button
                  onClick={() => setGrievanceId(null)}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  ← Submit another query
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">{t('name_lbl')}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Ravi Kumar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">{t('mobile_lbl')}</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">{t('district_lbl')}</label>
                    <select
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    >
                      {['Guntur', 'Kurnool', 'Nellore', 'Warangal', 'Khammam'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">{t('query_type')}</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                    >
                      <option value="booking">{t('query_cats.booking')}</option>
                      <option value="moisture">{t('query_cats.moisture')}</option>
                      <option value="payment">{t('query_cats.payment')}</option>
                      <option value="other">{t('query_cats.other')}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">{t('msg_lbl')}</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter details of your query..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black py-3.5 rounded-xl transition flex items-center justify-center space-x-2 text-xs"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>{t('btn_submit')}</span>}
                </button>
              </form>
            )}
          </div>

          {/* FAQ Accordions */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="space-y-2">
              <h3 className="text-slate-900 font-black text-base flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <span>{t('faq_section')}</span>
              </h3>
              <p className="text-slate-500 text-xs">{t('faq_sub')}</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {Object.keys(helplineDict[language]?.faq_cats || helplineDict.en.faq_cats).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                    selectedCat === cat
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t(`faq_cats.${cat}`)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={faqSearch}
                onChange={e => setFaqSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Accordion List */}
            <div className="space-y-2.5">
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-100/50 transition"
                  >
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{faq.q}</span>
                    {openFaqIdx === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {openFaqIdx === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200/40 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <p className="text-center text-slate-400 text-xs py-4">No matching FAQs found.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HelplinePage;
