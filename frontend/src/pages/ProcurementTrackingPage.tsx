import React, { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle2, Clock, ShieldCheck, AlertCircle, FileText, Download } from 'lucide-react';
import { localState } from '../services/api';
import { ProcurementRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const ProcurementTrackingPage: React.FC = () => {
  const { t } = useLanguage();
  const [procurement, setProcurement] = useState<ProcurementRecord | null>(null);

  useEffect(() => {
    const sync = () => {
      if (localState.procurements.length > 0) {
        setProcurement(localState.procurements[0]);
      }
    };
    sync();
    const unsubscribe = localState.subscribe(sync);
    return unsubscribe;
  }, []);

  const timelineStages = [
    { title: 'Slot Booked', time: '28 Aug 2026, 09:15 AM', status: 'completed' },
    { title: 'Farmer Arrived at Centre', time: '28 Aug 2026, 10:20 AM', status: 'completed' },
    { title: 'Token Called to Counter', time: '28 Aug 2026, 10:35 AM', status: 'completed' },
    { title: 'Moisture & Quality Inspection', time: '28 Aug 2026, 10:42 AM', status: 'completed' },
    { title: 'Weighing Completed', time: '28 Aug 2026, 10:48 AM', status: 'completed' },
    { title: 'Produce Accepted', time: '28 Aug 2026, 10:52 AM', status: 'completed' },
    { title: 'Payment Processing (DBT)', time: 'In Progress (Bank Verification)', status: 'active' },
    { title: 'Payment Completed', time: 'Pending Bank Clearance', status: 'pending' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Procurement Lifecycle Tracker
        </span>
        <h1 className="text-3xl font-black text-slate-900">Crop Procurement Status</h1>
        <p className="text-xs text-slate-500">{t('govt_title')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: 8-Stage Timeline */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              <span>Procurement Progress Timeline</span>
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Grade A Verified
            </span>
          </div>

          <div className="space-y-6 relative pl-4 border-l-2 border-slate-200">
            {timelineStages.map((stage, idx) => (
              <div key={idx} className="relative flex items-start space-x-4">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center -ml-[25px] flex-shrink-0 text-xs font-bold ${
                    stage.status === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : stage.status === 'active'
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {stage.status === 'completed' ? '✓' : idx + 1}
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-sm">{stage.title}</h4>
                  <p className="text-xs text-slate-500">{stage.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Accepted Batch Voucher Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-5 border border-slate-800">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Verified Batch</span>
                <h3 className="font-black text-lg text-white">Batch #SP-GNT-127</h3>
              </div>
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Accepted
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Crop Commodity</span>
                <span className="font-bold text-slate-200">{procurement?.crop_name || 'Paddy (Grade A)'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Net Quantity</span>
                <span className="font-bold text-slate-200">{procurement?.actual_quantity || '25.40'} Quintals</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Moisture Content</span>
                <span className="font-bold text-emerald-400">{procurement?.moisture || '12.5'}% (Pass)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Quality Assigned</span>
                <span className="font-bold text-emerald-400">{procurement?.quality_grade || 'Grade A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Govt. MSP Price</span>
                <span className="font-bold text-slate-200">₹2,369.00 / Qtl</span>
              </div>
              <div className="flex justify-between py-2 pt-3 text-sm">
                <span className="font-bold text-white">Total Payout Amount</span>
                <span className="font-black text-amber-400">₹{procurement?.total_amount ? procurement.total_amount.toLocaleString('en-IN') : '60,172.60'}</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Receipt</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProcurementTrackingPage;
