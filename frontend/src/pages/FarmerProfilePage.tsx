import React from 'react';
import { User, MapPin, Wheat, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FarmerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const farmer = user?.farmer;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-black shadow-md">
            {user?.name?.charAt(0) || 'R'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{user?.name || 'Ravi Kumar'}</h1>
            <p className="text-xs text-slate-500">Official Farmer Identity • Rythu Portal</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              Farmer ID: {farmer?.farmer_id || 'AP-FARM-9872'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Registered Mobile</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">{user?.mobile || '9876543210'}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">District & Mandal</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">{farmer?.district || 'Guntur'} District</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Village Location</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">{farmer?.village || 'Pedakakani'}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Preferred Centre</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">Guntur AP Procurement Centre</span>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center space-x-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Aadhaar & Land Records e-KYC Verified for Direct Benefit Transfer (DBT).</span>
        </div>
      </div>
    </div>
  );
};
