import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Wheat, Phone, ShieldCheck, CheckCircle2, Navigation, RefreshCw, Save, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { localState } from '../services/api';

export const FarmerProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const farmer = user?.farmer;

  const [name, setName] = useState(user?.name || 'Ravi Kumar');
  const [district, setDistrict] = useState(farmer?.district || 'Guntur');
  const [village, setVillage] = useState(farmer?.village || 'Pedakakani');
  const [address, setAddress] = useState(farmer?.address || 'Door 4-12, Main Street, Pedakakani, Guntur, AP');
  const [saved, setSaved] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const districts = [
    'Guntur', 'NTR District (Vijayawada)', 'Tenali', 'Bapatla', 'Palnadu (Narasaraopet)',
    'Kurnool', 'East Godavari (Rajahmundry)', 'Eluru', 'Anantapur', 'SPSR Nellore',
    'YSR Kadapa', 'Chittoor / Tirupati', 'Prakasam (Ongole)', 'Warangal', 'Nizamabad', 'Khammam',
    'Indore', 'Ludhiana', 'Karnal'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (localState.users[0]?.farmer) {
      localState.users[0].name = name;
      localState.users[0].farmer.name = name;
      localState.users[0].farmer.district = district.split(' ')[0];
      localState.users[0].farmer.village = village;
      localState.users[0].farmer.address = address;
      localState.notify();
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleGPSDetect = () => {
    setDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDetecting(false);
          setAddress(`Farm Coordinates: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E, ${district}`);
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
        () => {
          setDetecting(false);
          setAddress(`Door 4-12, Main Street, ${village}, ${district}, AP`);
        }
      );
    } else {
      setDetecting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header Profile Info */}
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-black shadow-md">
            {name.charAt(0) || 'R'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{name}</h1>
            <p className="text-xs text-slate-500">Official Farmer Identity • Rythu Seva Portal</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
              Farmer ID: {farmer?.farmer_id || 'AP-FARM-9872'}
            </span>
          </div>
        </div>

        {/* Location & Profile Update Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Farmer Farm & Residential Location</span>
            </h3>
            <button
              type="button"
              onClick={handleGPSDetect}
              disabled={detecting}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200"
            >
              {detecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
              <span>{detecting ? 'Detecting...' : 'Detect Farm GPS'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Farmer Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Mobile Number</label>
              <input
                type="text"
                disabled
                value={user?.mobile || '9876543210'}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">District / Region (25+ Available)</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              >
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Mandal Name</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Farm / Delivery Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile & Location Updated Successfully!</span>
              </span>
            ) : <div></div>}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => { logout(); navigate('/'); }}
                className="border border-red-200 text-red-600 hover:bg-red-50 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Location & Profile</span>
              </button>
            </div>
          </div>
        </form>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center space-x-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Aadhaar & Land Records e-KYC Verified for Direct Benefit Transfer (DBT).</span>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfilePage;
