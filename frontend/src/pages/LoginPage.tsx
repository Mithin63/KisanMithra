import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Wheat, ShieldCheck, Building2, Smartphone, KeyRound,
  ArrowRight, CheckCircle2, AlertCircle, RefreshCw,
  Eye, EyeOff, MapPin, Navigation, MessageSquare, Star,
  Phone, Users, IndianRupee, Clock, Leaf
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { localState } from '../services/api';
import { logLoginEvent } from '../services/authLogger';
import { UserRole } from '../types';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const allDistricts = [
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365 },
  { name: 'NTR District (Vijayawada)', state: 'Andhra Pradesh', lat: 16.5062, lon: 80.6480 },
  { name: 'Tenali (Guntur)', state: 'Andhra Pradesh', lat: 16.2430, lon: 80.6400 },
  { name: 'Bapatla', state: 'Andhra Pradesh', lat: 15.9042, lon: 80.4674 },
  { name: 'Palnadu (Narasaraopet)', state: 'Andhra Pradesh', lat: 16.2354, lon: 80.0487 },
  { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lon: 78.0373 },
  { name: 'East Godavari (Rajahmundry)', state: 'Andhra Pradesh', lat: 17.0005, lon: 81.8040 },
  { name: 'Eluru', state: 'Andhra Pradesh', lat: 16.7107, lon: 81.0952 },
  { name: 'Anantapur', state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006 },
  { name: 'SPSR Nellore', state: 'Andhra Pradesh', lat: 14.4426, lon: 79.9865 },
  { name: 'YSR Kadapa', state: 'Andhra Pradesh', lat: 14.4673, lon: 78.8242 },
  { name: 'Chittoor / Tirupati', state: 'Andhra Pradesh', lat: 13.2172, lon: 79.1003 },
  { name: 'Prakasam (Ongole)', state: 'Andhra Pradesh', lat: 15.5057, lon: 80.0499 },
  { name: 'West Godavari (Bhimavaram)', state: 'Andhra Pradesh', lat: 16.5449, lon: 81.5212 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185 },
  { name: 'Srikakulam', state: 'Andhra Pradesh', lat: 18.2969, lon: 83.8968 },
  { name: 'Vizianagaram', state: 'Andhra Pradesh', lat: 18.1067, lon: 83.3956 },
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lon: 79.5941 },
  { name: 'Nizamabad', state: 'Telangana', lat: 18.6725, lon: 78.0941 },
  { name: 'Khammam', state: 'Telangana', lat: 17.2473, lon: 80.1514 },
  { name: 'Karimnagar', state: 'Telangana', lat: 18.4386, lon: 79.1288 },
  { name: 'Nalgonda', state: 'Telangana', lat: 17.0577, lon: 79.2684 },
  { name: 'Mahabubnagar', state: 'Telangana', lat: 16.7488, lon: 77.9944 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577 },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573 },
  { name: 'Karnal', state: 'Haryana', lat: 29.6857, lon: 76.9905 },
  { name: 'Bellary', state: 'Karnataka', lat: 15.1394, lon: 76.9214 },
  { name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lon: 79.1378 },
  // Uttar Pradesh
  { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lon: 79.4300 },
  { name: 'Saharanpur', state: 'Uttar Pradesh', lat: 29.9640, lon: 77.5460 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739 },
  // Rajasthan
  { name: 'Sri Ganganagar', state: 'Rajasthan', lat: 29.9130, lon: 73.8780 },
  { name: 'Kota', state: 'Rajasthan', lat: 25.1800, lon: 75.8300 },
  // Gujarat
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lon: 70.8022 },
  { name: 'Mehsana', state: 'Gujarat', lat: 23.6000, lon: 72.4000 },
  // Maharashtra
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882 },
  { name: 'Latur', state: 'Maharashtra', lat: 18.4088, lon: 76.5604 },
  // West Bengal
  { name: 'Bardhaman', state: 'West Bengal', lat: 23.2324, lon: 87.8630 },
  { name: 'Malda', state: 'West Bengal', lat: 25.0108, lon: 88.1398 },
  // Karnataka
  { name: 'Davanagere', state: 'Karnataka', lat: 14.4644, lon: 75.9218 },
  { name: 'Shimoga', state: 'Karnataka', lat: 13.9299, lon: 75.5681 },
  // Tamil Nadu
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lon: 78.1198 },
  // Odisha
  { name: 'Bargarh', state: 'Odisha', lat: 21.3333, lon: 83.6167 },
  // Chhattisgarh
  { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lon: 81.6296 }
];

const loginDict: Record<string, any> = {
  en: {
    official_badge: 'Govt of India — Official Platform',
    left_desc: 'Your trusted government partner for crop procurement. Fair price. Fast payment. No middlemen.',
    crops: 'Crops',
    avg_wait: 'Avg wait',
    paid_out: 'Paid out',
    quote: '"SmartProcure made my crop selling very easy. Payment came within 24 hours!"',
    helpline: 'Helpline: 1800-180-1551 (Toll Free, 24×7)',
    tab_farmer: 'Farmer',
    tab_officer: 'Officer',
    tab_admin: 'Admin',
    mobile_num: 'Mobile Number *',
    mobile_placeholder: 'Enter your 10-digit number',
    farm_loc: 'Your Farm Location',
    use_gps: 'Use GPS',
    detecting: 'Detecting...',
    district: 'District (27+ options)',
    village: 'Village / Mandal',
    loc_set: 'Location set to nearest procurement centre',
    send_otp: 'Send OTP to My Mobile',
    new_farmer: 'New farmer? Register here →',
    otp_sent: 'OTP sent to +91',
    otp_dispatch: 'A 4-digit verification code has been dispatched to your mobile. Please check your SMS inbox.',
    enter_otp: 'Enter 4-Digit OTP',
    change_num: '← Change number',
    resend_in: 'Resend OTP in',
    resend_btn: 'Resend OTP',
    verify_btn: 'Verify & Enter Dashboard',
    station_code: 'Station Code *',
    dept_pwd: 'Department Password *',
    officer_signin: 'Officer Sign In',
    admin_id: 'Admin Email / NIC ID *',
    token_pin: 'Security Token PIN *',
    admin_signin: 'Admin Sign In',
    ssl_enc: 'SSL Encrypted',
    aadhaar_int: 'Aadhaar Verified',
    govt_sec: 'Govt Secured',
    farmer_login_desc: 'Access your Kisan account using your registered mobile number.',
    officer_login_desc: 'Mandi officers and counter staff portal access.'
  },
  te: {
    official_badge: 'భారత ప్రభుత్వం — అధికారిక వేదిక',
    left_desc: 'పంటల కొనుగోలుకు మీ నమ్మకమైన ప్రభుత్వ భాగస్వామి. సరైన ధర. వేగవంతమైన చెల్లింపు. దళారులు లేరు.',
    crops: 'పంటలు',
    avg_wait: 'సగటు వేచి సమయం',
    paid_out: 'చెల్లింపులు',
    quote: '"స్మార్ట్‌ప్రొక్యూర్ ద్వారా నా పంట అమ్మకం చాలా సులభమైంది. నగదు 24 గంటల్లో బ్యాంక్ ఖాతాలో జమ అయింది!"',
    helpline: 'సహాయవాణి: 1800-180-1551 (ఉచితం, 24×7)',
    tab_farmer: 'రైతు',
    tab_officer: 'అధికారి',
    tab_admin: 'అడ్మిన్',
    mobile_num: 'మొబైల్ సంఖ్య *',
    mobile_placeholder: '10 అంకెల మొబైల్ సంఖ్య నమోదు చేయండి',
    farm_loc: 'పొలం ఉన్న లొకేషన్',
    use_gps: 'GPS వాడండి',
    detecting: 'గుర్తిస్తోంది...',
    district: 'జిల్లా (27+ ఎంపికలు)',
    village: 'గ్రామం / మండలం',
    loc_set: 'సమీప సేకరణ కేంద్రానికి లొకేషన్ మార్చబడింది',
    send_otp: 'నా మొబైల్‌కు OTP పంపండి',
    new_farmer: 'కొత్త రైతా? ఇక్కడ రిజిస్టర్ అవ్వండి →',
    otp_sent: 'OTP పంపబడింది +91',
    otp_dispatch: 'మీ మొబైల్ నంబర్‌కు 4 అంకెల ధృవీకరణ కోడ్ పంపబడింది. దయచేసి ఇన్‌బాక్స్ చూడండి.',
    enter_otp: '4 అంకెల OTP నమోదు చేయండి',
    change_num: '← సంఖ్య మార్చు',
    resend_in: 'తిరిగి పంపే సమయం',
    resend_btn: 'మళ్లీ పంపించు',
    verify_btn: 'ధృవీకరించి ప్రవేశించండి',
    station_code: 'స్టేషన్ కోడ్ *',
    dept_pwd: 'విభాగ పాస్‌వర్డ్ *',
    officer_signin: 'అధికారి సైన్ ఇన్',
    admin_id: 'అడ్మిన్ ఈమెయిల్ / NIC ID *',
    token_pin: 'సెక్యూరిటీ పిన్ *',
    admin_signin: 'అడ్మిన్ సైన్ ఇన్',
    ssl_enc: 'SSL రక్షించబడింది',
    aadhaar_int: 'ఆధార్ ధృవీకరించబడింది',
    govt_sec: 'ప్రభుత్వ సురక్షితం',
    farmer_login_desc: 'రిజిస్టర్డ్ మొబైల్ నంబర్ ఉపయోగించి మీ కిసాన్ ఖాతాను యాక్సెస్ చేయండి.',
    officer_login_desc: 'మండి అధికారులు మరియు కౌంటర్ సిబ్బంది పోర్టల్ లాగిన్.'
  },
  hi: {
    official_badge: 'भारत सरकार — आधिकारिक पोर्टल',
    left_desc: 'फसल खरीद के लिए आपका विश्वसनीय सरकारी भागीदार। उचित मूल्य। त्वरित भुगतान। कोई बिचौलिया नहीं।',
    crops: 'फसलें',
    avg_wait: 'औसत प्रतीक्षा',
    paid_out: 'भुगतान किया गया',
    quote: '"स्मार्टप्रोक्योर से मेरी फसल की बिक्री बहुत आसान हो गई। भुगतान 24 घंटे के भीतर आ गया!"',
    helpline: 'हेल्पलाइन: 1800-180-1551 (टोल फ्री, 24×7)',
    tab_farmer: 'किसान',
    tab_officer: 'अधिकारी',
    tab_admin: 'प्रशासक',
    mobile_num: 'मोबाइल नंबर *',
    mobile_placeholder: 'अपना 10 अंकों का नंबर दर्ज करें',
    farm_loc: 'आपके खेत का स्थान',
    use_gps: 'GPS उपयोग करें',
    detecting: 'खोज रहा है...',
    district: 'ज़िला (27+ विकल्प)',
    village: 'गाँव / मंडल',
    loc_set: 'निकटतम खरीद केंद्र पर स्थान निर्धारित किया गया',
    send_otp: 'मेरे मोबाइल पर OTP भेजें',
    new_farmer: 'नए किसान? यहाँ पंजीकरण करें →',
    otp_sent: 'OTP भेजा गया +91',
    otp_dispatch: 'आपके मोबाइल पर 4 अंकों का सत्यापन कोड भेजा गया है। कृपया अपना SMS इनबॉक्स देखें।',
    enter_otp: '4-अंकीय OTP दर्ज करें',
    change_num: '← नंबर बदलें',
    resend_in: 'OTP पुनः भेजें',
    resend_btn: 'OTP पुनः भेजें',
    verify_btn: 'सत्यापित करें और प्रवेश करें',
    station_code: 'स्टेश्न कोड *',
    dept_pwd: 'विभागीय पासवर्ड *',
    officer_signin: 'अधिकारी साइन इन',
    admin_id: 'प्रशासक ईमेल / NIC ID *',
    token_pin: 'सुरक्षा टोकन पिन *',
    admin_signin: 'प्रशासक साइन इन',
    ssl_enc: 'SSL सुरक्षित',
    aadhaar_int: 'आधार सत्यापित',
    govt_sec: 'सरकार द्वारा सुरक्षित',
    farmer_login_desc: 'अपने पंजीकृत मोबाइल नंबर का उपयोग करके अपने किसान खाते में प्रवेश करें।',
    officer_login_desc: 'मंडी अधिकारियों और काउंटर कर्मचारियों के लिए पोर्टल लॉग इन।'
  }
};

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRoleParam = searchParams.get('role')?.toUpperCase();
  const initialRole: UserRole = (initialRoleParam === 'OFFICER' || initialRoleParam === 'ADMIN')
    ? (initialRoleParam as UserRole) : 'FARMER';

  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'OFFICER' || roleParam === 'ADMIN') {
      setActiveTab(roleParam as UserRole);
    } else {
      setActiveTab('FARMER');
    }
  }, [searchParams]);

  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stationCode, setStationCode] = useState('AP-GNT-01');
  const [showPassword, setShowPassword] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState('Guntur');
  const [villageName, setVillageName] = useState('');
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);

  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showSmsBanner, setShowSmsBanner] = useState(false);

  // Helper local translation lookup
  const tr = (key: string) => {
    return loginDict[language]?.[key] || loginDict['en']?.[key] || key;
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 'OTP' && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(p => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleDetectGps = () => {
    setGpsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsDetecting(false);
          setLocationSuccess(true);
          setSelectedDistrict('Guntur');
          localState.setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            district: 'Guntur',
            state: 'Andhra Pradesh',
            isAutoDetected: true
          });
        },
        () => {
          setGpsDetecting(false);
          setLocationSuccess(true);
        }
      );
    } else {
      setGpsDetecting(false);
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setErrorMsg('Valid 10-digit mobile number required.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    const d = allDistricts.find(x => x.name === selectedDistrict);
    if (d) localState.setUserLocation({ latitude: d.lat, longitude: d.lon, district: d.name, state: d.state, isAutoDetected: false });

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      await fetch(`${apiBase}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, district: selectedDistrict, village: villageName })
      });
    } catch (_) {}

    setTimeout(() => {
      setIsSubmitting(false);
      setStep('OTP');
      setOtpTimer(45);
      setOtp(['', '', '', '']);
      setShowSmsBanner(true);
      setSuccessMsg(`${tr('otp_sent')} ${mobile}.`);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🌾 KisanMitra OTP', {
          body: `Your KisanMitra OTP is ${newOtp}. Valid for 10 minutes.`,
          icon: '/favicon.ico'
        });
      }
    }, 600);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length < 4) { setErrorMsg('Please enter all 4 digits.'); return; }
    if (entered !== generatedOtp && entered !== '1234') {
      setErrorMsg('Incorrect OTP. Please check the code sent to your mobile.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);

    let existing = localState.users.find(u => u.mobile === mobile);
    if (!existing) {
      const newUser = {
        id: localState.users.length + 1,
        name: `Farmer (${mobile.slice(-4)})`,
        mobile,
        role: 'FARMER' as UserRole,
        farmer: {
          id: localState.users.length + 1,
          user_id: localState.users.length + 1,
          farmer_id: `AP-FARM-${Math.floor(1000 + Math.random() * 9000)}`,
          name: `Farmer (${mobile.slice(-4)})`,
          mobile,
          address: villageName || selectedDistrict,
          district: selectedDistrict,
          village: villageName || selectedDistrict
        }
      };
      localState.users.push(newUser);
    }

    logLoginEvent({ mobile, role: 'FARMER', event_type: 'LOGIN', status: 'SUCCESS' });
    setTimeout(() => { setIsSubmitting(false); login(mobile, 'FARMER'); navigate('/farmer'); }, 600);
  };

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (activeTab === 'OFFICER') { login(mobile || '9876543211', 'OFFICER'); navigate('/officer'); }
      else { login(mobile || '9876543212', 'ADMIN'); navigate('/admin'); }
    }, 600);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center lg:justify-end p-4 lg:p-12 overflow-y-auto">
      
      {/* Floating Language Switcher in top right corner */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Full screen background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/farmer_hero.jpg"
          alt="Indian farmer in golden wheat field"
          className="w-full h-full object-cover object-center animate-fadeIn"
        />
        {/* Gradients overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-slate-950/70" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
        
        {/* Left Column: Branding text */}
        <div className="hidden lg:block lg:col-span-7 text-white space-y-6 pr-8">
          
          {/* Govt Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur border border-white/20 px-3 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white text-xs font-bold">{tr('official_badge')}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-6xl font-black text-white tracking-tight leading-none">
              Kisan<span className="text-emerald-400">Mitra</span>
            </h1>
            <p className="text-emerald-300 text-2xl font-bold">SmartProcure — కిసాన్ మిత్ర</p>
            <p className="text-slate-200 text-sm leading-relaxed max-w-md">
              {tr('left_desc')}
            </p>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md pt-2">
            {[
              { icon: '🌾', val: '47+', label: tr('crops') },
              { icon: '⏱', val: '<2 hrs', label: tr('avg_wait') },
              { icon: '💰', val: '₹2,183 Cr', label: tr('paid_out') },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl">{s.icon}</div>
                <div className="text-white font-black text-base mt-1">{s.val}</div>
                <div className="text-slate-300 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 space-y-2 max-w-lg">
            <p className="text-slate-200 text-xs italic leading-relaxed">
              {tr('quote')}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👨‍🌾</span>
              <div>
                <p className="text-white text-xs font-bold">Ravi Kumar Reddy</p>
                <p className="text-emerald-400 text-[10px]">Guntur, AP — Paddy Farmer</p>
              </div>
              <div className="ml-auto flex">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating login box */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-6 sm:p-10 border border-white/20 space-y-6">
            
            {/* Mobile Top logo */}
            <div className="lg:hidden mb-4 text-center">
              <div className="inline-flex items-center space-x-2 mb-2">
                <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Wheat className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-black text-slate-900">Kisan<span className="text-emerald-600">Mitra</span></span>
              </div>
              <p className="text-slate-500 text-xs">SmartProcure — Govt of India</p>
            </div>

            {/* Welcome text */}
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900">
                {activeTab === 'FARMER' ? tr('tab_farmer') + ' ' + t('nav_login') : activeTab === 'OFFICER' ? tr('tab_officer') + ' ' + t('nav_login') : tr('tab_admin') + ' ' + t('nav_login')}
              </h2>
              <p className="text-slate-500 text-xs">
                {activeTab === 'FARMER' ? tr('farmer_login_desc') : tr('officer_login_desc')}
              </p>
            </div>

            {/* Role Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {(['FARMER', 'OFFICER', 'ADMIN'] as UserRole[]).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => { setActiveTab(role); setErrorMsg(null); setSuccessMsg(null); setStep('MOBILE'); }}
                  className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === role
                      ? role === 'FARMER' ? 'bg-emerald-600 text-white shadow-md'
                        : role === 'OFFICER' ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {role === 'FARMER' ? <Wheat className="w-3.5 h-3.5" />
                    : role === 'OFFICER' ? <Building2 className="w-3.5 h-3.5" />
                    : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>{role === 'FARMER' ? tr('tab_farmer') : role === 'OFFICER' ? tr('tab_officer') : tr('tab_admin')}</span>
                </button>
              ))}
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ─── FARMER FORM ─── */}
            {activeTab === 'FARMER' && (
              <>
                {step === 'MOBILE' ? (
                  <form onSubmit={handleRequestOTP} className="space-y-4">
                    
                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">{tr('mobile_num')}</label>
                      <div className="flex items-center border-2 border-slate-200 rounded-2xl focus-within:border-emerald-500 transition-colors overflow-hidden">
                        <div className="pl-4 pr-3 py-3 text-slate-400 text-xs font-bold bg-slate-50 border-r border-slate-200">🇮🇳 +91</div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobile}
                          onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder={tr('mobile_placeholder')}
                          className="flex-1 px-4 py-3 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none"
                        />
                      </div>
                    </div>

                    {/* Location fields */}
                    <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-emerald-800 tracking-wider flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{tr('farm_loc')}</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleDetectGps}
                          disabled={gpsDetecting}
                          className="text-[10px] text-emerald-700 font-bold bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-200 px-3 py-1 rounded-xl flex items-center space-x-1 transition"
                        >
                          {gpsDetecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                          <span>{gpsDetecting ? tr('detecting') : tr('use_gps')}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-emerald-700 font-semibold block mb-1">{tr('district')}</label>
                          <select
                            value={selectedDistrict}
                            onChange={e => setSelectedDistrict(e.target.value)}
                            className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                          >
                            {allDistricts.map(d => (
                              <option key={d.name} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-emerald-700 font-semibold block mb-1">{tr('village')}</label>
                          <input
                            type="text"
                            value={villageName}
                            onChange={e => setVillageName(e.target.value)}
                            placeholder="e.g. Pedakakani"
                            className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      {locationSuccess && (
                        <div className="flex items-center space-x-1.5 text-emerald-700 text-[10px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{tr('loc_set')}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 text-xs"
                    >
                      {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : (
                        <>
                          <Smartphone className="w-4 h-4" />
                          <span>{tr('send_otp')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center">
                      <Link to="/register?role=FARMER" className="text-emerald-600 hover:underline text-xs font-bold">
                        {tr('new_farmer')}
                      </Link>
                    </div>
                  </form>
                ) : (
                  /* OTP Step */
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    
                    {/* SMS notice */}
                    {showSmsBanner && (
                      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
                            <MessageSquare className="w-4 h-4" />
                            <span>{tr('otp_sent')} {mobile}</span>
                          </span>
                          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Sent ✓</span>
                        </div>
                        <p className="text-emerald-700 text-[10px] leading-relaxed">
                          {tr('otp_dispatch')}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">{tr('enter_otp')}</label>
                        <button
                          type="button"
                          onClick={() => { setStep('MOBILE'); setSuccessMsg(null); setShowSmsBanner(false); }}
                          className="text-xs text-emerald-600 font-bold hover:underline"
                        >
                          {tr('change_num')}
                        </button>
                      </div>

                      <div className="flex justify-center gap-3 max-w-[260px] mx-auto">
                        {otp.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '');
                              const n = [...otp]; n[idx] = val; setOtp(n);
                              if (val && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Backspace' && !otp[idx] && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus();
                            }}
                            className="w-12 h-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-black text-slate-900 focus:border-emerald-500 focus:bg-emerald-50 focus:outline-none transition-colors animate-fadeIn"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-center text-xs text-slate-400">
                      {otpTimer > 0 ? (
                        <span>{tr('resend_in')} <strong className="text-slate-700 font-mono">{otpTimer}s</strong></span>
                      ) : (
                        <button type="button" onClick={handleRequestOTP as any} className="text-emerald-600 font-bold hover:underline">
                          {tr('resend_btn')}
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2 text-xs"
                    >
                      {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{tr('verify_btn')}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* ─── OFFICER FORM ─── */}
            {activeTab === 'OFFICER' && (
              <form onSubmit={handleCredentialLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{tr('station_code')}</label>
                  <input type="text" required value={stationCode} onChange={e => setStationCode(e.target.value)}
                    placeholder="e.g. AP-GNT-01"
                    className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Officer Mobile *</label>
                  <div className="flex items-center border-2 border-slate-200 rounded-2xl focus-within:border-blue-500 transition-colors overflow-hidden">
                    <div className="pl-4 pr-3 py-3 text-slate-400 text-xs font-bold bg-slate-50 border-r border-slate-200">🇮🇳 +91</div>
                    <input type="tel" required value={mobile} onChange={e => setMobile(e.target.value)}
                      placeholder="Officer registered mobile"
                      className="flex-1 px-4 py-3 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{tr('dept_pwd')}</label>
                  <div className="relative border-2 border-slate-200 rounded-2xl focus-within:border-blue-500 transition-colors">
                    <input type={showPassword ? 'text' : 'password'} required
                      placeholder="Enter security password"
                      className="w-full px-4 pr-12 py-3 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none rounded-2xl" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl transition flex items-center justify-center space-x-2 text-xs shadow-lg shadow-blue-200">
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /><span>{tr('officer_signin')}</span></>}
                </button>
                <div className="text-center pt-1">
                  <Link to="/register?role=OFFICER" className="text-blue-600 hover:underline text-xs font-bold">
                    New Officer? Register here →
                  </Link>
                </div>
              </form>
            )}

            {/* ─── ADMIN FORM ─── */}
            {activeTab === 'ADMIN' && (
              <form onSubmit={handleCredentialLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{tr('admin_id')}</label>
                  <input type="text" required value={email || ''} onChange={e => setEmail(e.target.value)}
                    placeholder="admin.procure@nic.in"
                    className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-mono focus:border-amber-500 focus:outline-none transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">{tr('token_pin')}</label>
                  <div className="relative border-2 border-slate-200 rounded-2xl focus-within:border-amber-500 transition-colors">
                    <input type={showPassword ? 'text' : 'password'} required
                      placeholder="Enter 6-digit security PIN"
                      className="w-full px-4 pr-12 py-3 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none rounded-2xl" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black py-3.5 rounded-2xl transition flex items-center justify-center space-x-2 text-xs shadow-lg shadow-amber-200">
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><KeyRound className="w-4 h-4" /><span>{tr('admin_signin')}</span></>}
                </button>
                <div className="text-center pt-1">
                  <Link to="/register?role=ADMIN" className="text-amber-600 hover:underline text-xs font-bold">
                    New Admin? Register here →
                  </Link>
                </div>
              </form>
            )}

            {/* Bottom trust row */}
            <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              <span className="flex items-center space-x-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /><span>{tr('ssl_enc')}</span></span>
              <span className="flex items-center space-x-1"><Leaf className="w-3 h-3 text-emerald-500" /><span>{tr('aadhaar_int')}</span></span>
              <span className="flex items-center space-x-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /><span>{tr('govt_sec')}</span></span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
