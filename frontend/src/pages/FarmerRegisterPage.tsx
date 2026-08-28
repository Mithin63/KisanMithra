import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  User, Wheat, MapPin, CheckCircle2, ChevronRight, ArrowLeft,
  Navigation, RefreshCw, Building2, ShieldCheck, KeyRound, Mail, Lock, Fingerprint, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { localState } from '../services/api';
import { UserRole } from '../types';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const registerDict: Record<string, any> = {
  en: {
    portal_title: 'SmartProcure Registration',
    create_account: 'Create Account',
    govt_title: 'Ministry of Consumer Affairs, Food & Public Distribution',
    tab_farmer: 'Farmer',
    tab_officer: 'Officer',
    tab_admin: 'Admin',
    lbl_fullname: 'Full Name *',
    lbl_mobile: 'Mobile Number *',
    lbl_district: 'District *',
    lbl_village: 'Village / Mandal *',
    lbl_address: 'Farm Address *',
    lbl_station: 'Station Code *',
    lbl_designation: 'Designation *',
    lbl_password: 'Password *',
    lbl_email: 'Govt Email / ID *',
    lbl_state: 'State / Department *',
    lbl_pin: 'Security Passcode (6-Digits) *',
    btn_register: 'Complete Registration & Sign In',
    btn_next: 'Next Step',
    btn_prev: 'Previous Step',
    already_registered: 'Already registered? Sign In',
    step1_lbl: 'Personal Details',
    step2_lbl: 'Produce Details',
    step3_lbl: 'Select Center',
    step4_lbl: 'e-KYC Verification',
    detect_location: 'Detect Location (GPS)',
    lbl_aadhaar: 'Aadhaar Card Number *',
    lbl_aadhaar_placeholder: 'Enter 12-digit Aadhaar number',
    lbl_survey: 'Land Survey / Pattadar Passbook Number *',
    lbl_survey_placeholder: 'e.g. Survey No 145/2B or Passbook 49012',
    verify_ekyc_btn: 'Authenticate & Retrieve Land Records',
    ekyc_verifying: 'Connecting UIDAI & State Land Hub...',
    ekyc_success: 'Aadhaar e-KYC Verified Successfully!',
    ekyc_success_desc: 'Land records matched. Verified ownership: 5.8 Acres. Sowing crop matched: Paddy.',
    lbl_aadhaar_otp: 'Aadhaar OTP (Dispatched to UIDAI linked mobile) *',
    lbl_aadhaar_otp_placeholder: 'Enter 6-digit Aadhaar OTP',
    verify_otp_btn: 'Verify Aadhaar OTP',
    otp_sent_msg: 'Aadhaar OTP sent successfully! Check your Aadhaar linked mobile.'
  },
  te: {
    portal_title: 'స్మార్ట్‌ప్రొక్యూర్ రిజిస్ట్రేషన్',
    create_account: 'ఖాతాను సృష్టించండి',
    govt_title: 'వినియోగదారుల వ్యవహారాలు, ఆహార & ప్రజా పంపిణీ మంత్రిత్వ శాఖ',
    tab_farmer: 'రైతు',
    tab_officer: 'అధికారి',
    tab_admin: 'అడ్మిన్',
    lbl_fullname: 'పూర్తి పేరు *',
    lbl_mobile: 'మొబైల్ సంఖ్య *',
    lbl_district: 'జిల్లా *',
    lbl_village: 'గ్రామం / మండలం *',
    lbl_address: 'పొలం చిరునామా *',
    lbl_station: 'స్టేషన్ కోడ్ *',
    lbl_designation: 'హోదా / ఉద్యోగం *',
    lbl_password: 'పాస్‌వర్డ్ *',
    lbl_email: 'ప్రభుత్వ ఈమెయిల్ / ID *',
    lbl_state: 'రాష్ట్రం / శాఖ *',
    lbl_pin: 'సెక్యూరిటీ పిన్ (6 అంకెలు) *',
    btn_register: 'నమోదును పూర్తి చేసి ప్రవేశించండి',
    btn_next: 'ముందుకు సాగండి',
    btn_prev: 'వెనుకకు సాగండి',
    already_registered: 'ఇప్పటికే రిజిస్టర్ అయ్యారా? సైన్ ఇన్',
    step1_lbl: 'వ్యక్తిగత వివరాలు',
    step2_lbl: 'పంట వివరాలు',
    step3_lbl: 'కేంద్రం ఎంపిక',
    step4_lbl: 'ఇ-KYC ధృవీకరణ',
    detect_location: 'లొకేషన్ గుర్తించు (GPS)',
    lbl_aadhaar: 'आधार కార్డ్ నంబర్ *',
    lbl_aadhaar_placeholder: '12 అంకెల ఆధార్ నంబర్ నమోదు చేయండి',
    lbl_survey: 'భూమి సర్వే నంబర్ / పట్టాదార్ పాస్‌బుక్ సంఖ్య *',
    lbl_survey_placeholder: 'ఉదా: సర్వే నెం 145/2B లేదా పాస్‌బుక్ 49012',
    verify_ekyc_btn: 'ఆధార్ & భూమి వివరాలు ధృవీకరించు',
    ekyc_verifying: 'ఆధార్ మరియు భూ రికార్డుల కేంద్రానికి అనుసంధానిస్తోంది...',
    ekyc_success: 'ఆధార్ ఇ-KYC ధృవీకరణ విజయవంతమైంది!',
    ekyc_success_desc: 'భూ రికార్డులు సరిపోలాయి. ధృవీకరించబడిన భూమి: 5.8 ఎకరాలు. పంట రకం: వరి.',
    lbl_aadhaar_otp: 'ఆధార్ OTP (లింక్ చేయబడిన మొబైల్‌కు పంపబడింది) *',
    lbl_aadhaar_otp_placeholder: '6 అంకెల ఆధార్ OTP నమోదు చేయండి',
    verify_otp_btn: 'OTP ని ధృవీకరించండి',
    otp_sent_msg: 'ఆధార్ OTP పంపబడింది! లింక్ చేయబడిన మొబైల్ చూడండి.'
  },
  hi: {
    portal_title: 'स्मार्टप्रोक्योर पंजीकरण',
    create_account: 'खाता बनाएं',
    govt_title: 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय',
    tab_farmer: 'किसान',
    tab_officer: 'अधिकारी',
    tab_admin: 'प्रशासक',
    lbl_fullname: 'पूरा नाम *',
    lbl_mobile: 'मोबाइल नंबर *',
    lbl_district: 'जिला *',
    lbl_village: 'गाँव / मंडल *',
    lbl_address: 'खेत का पता *',
    lbl_station: 'स्टेशन कोड *',
    lbl_designation: 'पद (डेजिग्नेशन) *',
    lbl_password: 'पासवर्ड *',
    lbl_email: 'सरकारी ईमेल / आईडी *',
    lbl_state: 'राज्य / विभाग *',
    lbl_pin: 'सुरक्षा पासकोड (6-अंकीय) *',
    btn_register: 'पंजीकरण पूरा करें और प्रवेश करें',
    btn_next: 'अगला चरण',
    btn_prev: 'पिछला चरण',
    already_registered: 'पहले से पंजीकृत हैं? साइन इन करें',
    step1_lbl: 'व्यक्तिगत विवरण',
    step2_lbl: 'फसल विवरण',
    step3_lbl: 'केंद्र का चयन',
    step4_lbl: 'इ-केवाईसी (e-KYC) सत्यापन',
    detect_location: 'स्थान खोजें (GPS)',
    lbl_aadhaar: 'आधार कार्ड नंबर *',
    lbl_aadhaar_placeholder: '12-अंकीय आधार नंबर दर्ज करें',
    lbl_survey: 'भूमि खसरा / पट्टादार पासबुक संख्या *',
    lbl_survey_placeholder: 'जैसे: खसरा संख्या 145/2B या पासबुक 49012',
    verify_ekyc_btn: 'आधार और भूमि रिकॉर्ड सत्यापित करें',
    ekyc_verifying: 'UIDAI और राज्य भूमि रिकॉर्ड से जोड़ा जा रहा है...',
    ekyc_success: 'आधार ई-केवाईसी सत्यापन सफलतापूर्वक संपन्न हुआ!',
    ekyc_success_desc: 'भूमि स्वामित्व रिकॉर्ड मेल खा गया। सत्यापित भूमि: 5.8 एकड़। फसल: धान।',
    lbl_aadhaar_otp: 'आधार OTP (आधार से जुड़े मोबाइल नंबर पर भेजा गया) *',
    lbl_aadhaar_otp_placeholder: '6-अंकीय आधार OTP दर्ज करें',
    verify_otp_btn: 'OTP सत्यापित करें',
    otp_sent_msg: 'आधार OTP सफलतापूर्वक भेजा गया! जुड़े मोबाइल की जांच करें।'
  }
};

const districts = [
  'Guntur', 'NTR District (Vijayawada)', 'Tenali', 'Bapatla', 'Palnadu (Narasaraopet)',
  'Kurnool', 'East Godavari (Rajahmundry)', 'Eluru', 'Anantapur', 'SPSR Nellore',
  'YSR Kadapa', 'Chittoor / Tirupati', 'Prakasam (Ongole)', 'West Godavari (Bhimavaram)',
  'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Nalgonda', 'Mahabubnagar',
  'Indore', 'Ludhiana', 'Karnal', 'Bellary', 'Thanjavur'
];

export const FarmerRegisterPage: React.FC = () => {
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRoleParam = searchParams.get('role')?.toUpperCase();
  const initialRole: UserRole = (initialRoleParam === 'OFFICER' || initialRoleParam === 'ADMIN')
    ? (initialRoleParam as UserRole) : 'FARMER';

  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);

  React.useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam === 'OFFICER' || roleParam === 'ADMIN') {
      setActiveTab(roleParam as UserRole);
    } else {
      setActiveTab('FARMER');
    }
  }, [searchParams]);

  const [step, setStep] = useState(1);
  const [detectingGps, setDetectingGps] = useState(false);

  // e-KYC Verification State
  const [aadhaar, setAadhaar] = useState('');
  const [surveyNumber, setSurveyNumber] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [ekycVerifying, setEkycVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isEkycVerified, setIsEkycVerified] = useState(false);
  const [ekycError, setEkycError] = useState<string | null>(null);

  const tr = (key: string) => {
    return registerDict[language]?.[key] || registerDict['en']?.[key] || key;
  };

  // Farmer Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    farmerId: `AP-FARM-${Math.floor(1000 + Math.random() * 9000)}`,
    address: '',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    village: '',
    crop: 'Paddy (Grade A)',
    variety: 'BPT 5204 (Samba Mahsuri)',
    expectedQuantity: '25',
    preferredCentreId: 1
  });

  // Officer Form State
  const [officerData, setOfficerData] = useState({
    name: '',
    mobile: '',
    stationCode: 'AP-GNT-01',
    designation: 'Mandi Supervisor',
    password: ''
  });

  // Admin Form State
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    state: 'Andhra Pradesh',
    pin: ''
  });

  const handleDetectGPS = () => {
    setDetectingGps(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetectingGps(false);
          setFormData(prev => ({
            ...prev,
            district: 'Guntur',
            village: 'Pedakakani Mandi',
            address: `GPS Farm: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E, Guntur`
          }));
        },
        () => {
          setDetectingGps(false);
          setFormData(prev => ({
            ...prev,
            district: 'Guntur',
            village: 'Pedakakani',
            address: 'Door 4-12, Main Street, Pedakakani, Guntur, AP'
          }));
        }
      );
    } else {
      setDetectingGps(false);
    }
  };

  const handleRequestAadhaarOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (aadhaar.length < 12) {
      setEkycError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    if (!surveyNumber) {
      setEkycError('Land Survey / Pattadar Passbook Number is required.');
      return;
    }
    setEkycError(null);
    setEkycVerifying(true);
    setTimeout(() => {
      setEkycVerifying(false);
      setOtpSent(true);
    }, 1200);
  };

  const handleVerifyAadhaarOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (aadhaarOtp.length < 4) {
      setEkycError('Please enter the OTP sent to your Aadhaar linked mobile.');
      return;
    }
    setEkycError(null);
    setEkycVerifying(true);
    setTimeout(() => {
      setEkycVerifying(false);
      setIsEkycVerified(true);
    }, 1000);
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (!isEkycVerified) {
        setEkycError('e-KYC authentication is mandatory to complete registration.');
        return;
      }
      let existing = localState.users.find(u => u.mobile === formData.mobile);
      if (!existing) {
        const newUser = {
          id: localState.users.length + 1,
          name: formData.name,
          mobile: formData.mobile,
          role: 'FARMER' as UserRole,
          farmer: {
            id: localState.users.length + 1,
            user_id: localState.users.length + 1,
            farmer_id: formData.farmerId,
            name: formData.name,
            mobile: formData.mobile,
            address: formData.address,
            district: formData.district,
            village: formData.village
          }
        };
        localState.users.push(newUser);
      }
      login(formData.mobile, 'FARMER');
      navigate('/farmer');
    }
  };

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: localState.users.length + 1,
      name: officerData.name,
      mobile: officerData.mobile,
      role: 'OFFICER' as UserRole
    };
    localState.users.push(newUser);
    login(officerData.mobile, 'OFFICER');
    navigate('/officer');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      id: localState.users.length + 1,
      name: adminData.name,
      mobile: '9876543212',
      email: adminData.email,
      role: 'ADMIN' as UserRole
    };
    localState.users.push(newUser);
    login(adminData.email, 'ADMIN');
    navigate('/admin');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fadeIn relative">
      
      {/* Floating Language Switcher in top right corner */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          {tr('portal_title')}
        </span>
        <h1 className="text-3xl font-black text-slate-900">{tr('create_account')}</h1>
        <p className="text-xs text-slate-500">
          {tr('govt_title')}
        </p>
      </div>

      {/* Role Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md mx-auto border border-slate-200">
        {(['FARMER', 'OFFICER', 'ADMIN'] as UserRole[]).map(role => (
          <button
            key={role}
            type="button"
            onClick={() => { setActiveTab(role); setStep(1); }}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
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

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">

        {/* 🌾 FARMER REGISTRATION */}
        {activeTab === 'FARMER' && (
          <form onSubmit={handleFarmerSubmit} className="space-y-6">
            {/* Step Indicators for Farmer */}
            <div className="flex items-center justify-between max-w-lg mx-auto pb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      step === i
                        ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100'
                        : step > i
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                  </div>
                  <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                    {i === 1 ? tr('step1_lbl') : i === 2 ? tr('step2_lbl') : i === 3 ? tr('step3_lbl') : tr('step4_lbl')}
                  </span>
                </div>
              ))}
            </div>

            {/* STEP 1: Personal & Location Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-sm font-black uppercase text-slate-900">{tr('step1_lbl')}</h2>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={detectingGps}
                    className="text-[10px] text-emerald-700 hover:text-emerald-800 font-black flex items-center space-x-1 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 transition"
                  >
                    {detectingGps ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                    <span>{detectingGps ? 'Detecting...' : tr('detect_location')}</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">{tr('lbl_fullname')}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ravi Kumar"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">{tr('lbl_mobile')}</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">{tr('lbl_district')}</label>
                    <select
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white outline-none"
                    >
                      {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">{tr('lbl_village')}</label>
                    <input
                      type="text"
                      required
                      value={formData.village}
                      onChange={e => setFormData({ ...formData, village: e.target.value })}
                      placeholder="e.g. Pedakakani"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">{tr('lbl_address')}</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Door number, street name, pincode"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* STEP 2: Produce Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-black uppercase text-slate-900 border-b pb-2">{tr('step2_lbl')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Primary Crop Type *</label>
                    <select
                      value={formData.crop}
                      onChange={e => setFormData({ ...formData, crop: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white outline-none"
                    >
                      {localState.crops.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.icon || '🌾'} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Variety / Quality Grade *</label>
                    <input
                      type="text"
                      required
                      value={formData.variety}
                      onChange={e => setFormData({ ...formData, variety: e.target.value })}
                      placeholder="e.g. Sona Masoori Grade A"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Expected Tonnage (in Quintals) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.expectedQuantity}
                    onChange={e => setFormData({ ...formData, expectedQuantity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">1 Quintal = 100 kg. Government MSP and weighbridge constraints apply.</p>
                </div>
              </div>
            )}

            {/* STEP 3: Centre Selection */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-black uppercase text-slate-900 border-b pb-2">{tr('step3_lbl')}</h2>
                <div className="space-y-3">
                  {localState.centres.slice(0, 4).map(c => (
                    <label
                      key={c.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                        formData.preferredCentreId === c.id
                          ? 'bg-emerald-50 border-emerald-600 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="preferredCentre"
                          checked={formData.preferredCentreId === c.id}
                          onChange={() => setFormData({ ...formData, preferredCentreId: c.id })}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                          <p className="text-xs text-slate-500">{c.address}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                        Capacity: {c.daily_capacity} qtl/day
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: e-KYC Verification */}
            {step === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <h2 className="text-sm font-black uppercase text-slate-900 border-b pb-2">{tr('step4_lbl')}</h2>
                
                {ekycError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{ekycError}</span>
                  </div>
                )}

                {!isEkycVerified ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">{tr('lbl_aadhaar')}</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            maxLength={12}
                            value={aadhaar}
                            onChange={e => setAadhaar(e.target.value.replace(/\D/g, ''))}
                            placeholder={tr('lbl_aadhaar_placeholder')}
                            className="w-full px-4 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                          />
                          <Fingerprint className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">{tr('lbl_survey')}</label>
                        <input
                          type="text"
                          required
                          value={surveyNumber}
                          onChange={e => setSurveyNumber(e.target.value)}
                          placeholder={tr('lbl_survey_placeholder')}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleRequestAadhaarOtp}
                        disabled={ekycVerifying}
                        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md"
                      >
                        {ekycVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                        <span>{ekycVerifying ? tr('ekyc_verifying') : tr('verify_ekyc_btn')}</span>
                      </button>
                    ) : (
                      <div className="space-y-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                        <p className="text-[11px] text-emerald-800 font-semibold">{tr('otp_sent_msg')}</p>
                        
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">{tr('lbl_aadhaar_otp')}</label>
                          <input
                            type="password"
                            required
                            maxLength={6}
                            value={aadhaarOtp}
                            onChange={e => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder={tr('lbl_aadhaar_otp_placeholder')}
                            className="w-full sm:w-64 px-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleVerifyAadhaarOtp}
                          disabled={ekycVerifying}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
                        >
                          {ekycVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>{tr('verify_otp_btn')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 space-y-3 animate-scaleUp">
                    <div className="flex items-center space-x-2 text-emerald-800">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      <span className="font-black text-sm">{tr('ekyc_success')}</span>
                    </div>
                    <p className="text-emerald-700 text-xs leading-relaxed pl-8">
                      {tr('ekyc_success_desc')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Farmer Navigation */}
            <div className="flex justify-between pt-4 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => { setStep(step - 1); setEkycError(null); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center space-x-1 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{tr('btn_prev')}</span>
                </button>
              ) : (
                <Link to="/signin" className="text-xs text-emerald-700 hover:underline font-semibold flex items-center">
                  {tr('already_registered')}
                </Link>
              )}

              <button
                type="submit"
                disabled={step === 4 && !isEkycVerified}
                className={`font-black px-6 py-2.5 rounded-xl text-xs shadow flex items-center space-x-2 transition ${
                  step === 4 && !isEkycVerified
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <span>{step === 4 ? tr('btn_register') : tr('btn_next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* 🏢 OFFICER REGISTRATION */}
        {activeTab === 'OFFICER' && (
          <form onSubmit={handleOfficerSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{tr('lbl_fullname')}</label>
                <input
                  type="text"
                  required
                  value={officerData.name}
                  onChange={e => setOfficerData({ ...officerData, name: e.target.value })}
                  placeholder="e.g. Officer Anitha"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{tr('lbl_mobile')}</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={officerData.mobile}
                  onChange={e => setOfficerData({ ...officerData, mobile: e.target.value.replace(/\D/g, '') })}
                  placeholder="e.g. 9876543211"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{tr('lbl_station')}</label>
                <input
                  type="text"
                  required
                  value={officerData.stationCode}
                  onChange={e => setOfficerData({ ...officerData, stationCode: e.target.value })}
                  placeholder="e.g. AP-GNT-01"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 outline-none transition-colors font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{tr('lbl_designation')}</label>
                <input
                  type="text"
                  required
                  value={officerData.designation}
                  onChange={e => setOfficerData({ ...officerData, designation: e.target.value })}
                  placeholder="e.g. Mandi Supervisor"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">{tr('lbl_password')}</label>
              <div className="relative border-2 border-slate-200 rounded-xl focus-within:border-blue-500 transition-colors">
                <input
                  type="password"
                  required
                  value={officerData.password}
                  onChange={e => setOfficerData({ ...officerData, password: e.target.value })}
                  placeholder="Enter secure password"
                  className="w-full px-4 py-2.5 text-xs text-slate-900 outline-none rounded-xl"
                />
                <Lock className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-xl transition flex items-center justify-center space-x-2 text-xs shadow-lg shadow-blue-100"
            >
              <Building2 className="w-4 h-4" />
              <span>{tr('btn_register')}</span>
            </button>

            <div className="text-center pt-2">
              <Link to="/signin?role=OFFICER" className="text-xs text-blue-600 hover:underline font-bold">
                {tr('already_registered')}
              </Link>
            </div>
          </form>
        )}

        {/* 🛡️ ADMIN REGISTRATION */}
        {activeTab === 'ADMIN' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{tr('lbl_fullname')}</label>
                <input
                  type="text"
                  required
                  value={adminData.name}
                  onChange={e => setAdminData({ ...adminData, name: e.target.value })}
                  placeholder="e.g. Dr. K. S. Sharma"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-amber-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{tr('lbl_email')}</label>
                <input
                  type="email"
                  required
                  value={adminData.email}
                  onChange={e => setAdminData({ ...adminData, email: e.target.value })}
                  placeholder="e.g. admin.sharma@gov.in"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-amber-500 outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{tr('lbl_state')}</label>
                <select
                  value={adminData.state}
                  onChange={e => setAdminData({ ...adminData, state: e.target.value })}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-amber-500 outline-none transition-colors bg-white font-semibold text-slate-800"
                >
                  {['Andhra Pradesh', 'Telangana', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Uttar Pradesh', 'Rajasthan', 'Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">{tr('lbl_pin')}</label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={adminData.pin}
                  onChange={e => setAdminData({ ...adminData, pin: e.target.value.replace(/\D/g, '') })}
                  placeholder="e.g. 123456"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:border-amber-500 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-3.5 rounded-xl transition flex items-center justify-center space-x-2 text-xs shadow-lg shadow-amber-100"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{tr('btn_register')}</span>
            </button>

            <div className="text-center pt-2">
              <Link to="/signin?role=ADMIN" className="text-xs text-amber-600 hover:underline font-bold">
                {tr('already_registered')}
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default FarmerRegisterPage;
