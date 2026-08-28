import React, { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle2, Clock, ShieldCheck, AlertCircle, FileText, Download } from 'lucide-react';
import { localState } from '../services/api';
import { ProcurementRecord } from '../types';

export const ProcurementTrackingPage: React.FC = () => {
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Procurement Lifecycle Tracker
        </span>
        <h1 className="text-3xl font-black text-slate-900">Crop Procurement Status</h1>
        <p className="text-xs text-slate-500">Ministry of Consumer Affairs, Food & Public Distribution</p>
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
                  className={`absolute -left-[25px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    stage.status === 'completed'
                      ? 'bg-emerald-600 text-white shadow ring-4 ring-emerald-100'
                      : stage.status === 'active'
                      ? 'bg-amber-500 text-slate-950 font-bold ring-4 ring-amber-100 animate-pulse'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {stage.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="space-y-0.5 pt-0.5">
                  <h4 className={`text-sm font-bold ${stage.status === 'completed' ? 'text-slate-900' : stage.status === 'active' ? 'text-amber-700 font-extrabold' : 'text-slate-400'}`}>
                    {stage.title}
                  </h4>
                  <p className="text-xs text-slate-500">{stage.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Verified Produce Receipt & Procurement Details */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base">Verified Produce Voucher</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Crop Name:</span>
                <span className="font-bold text-white">Paddy (Sona Masoori)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Actual Quantity:</span>
                <span className="font-bold text-emerald-400 text-sm">25.4 Quintals</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Quality Grade:</span>
                <span className="font-bold text-amber-300">Grade A (Moisture 12.5%)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">MSP Price / Quintal:</span>
                <span className="font-bold text-white">₹2,369 / Q</span>
              </div>

              <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-700/50 flex justify-between items-center text-sm font-black text-emerald-300">
                <span>Total Amount:</span>
                <span className="text-lg text-white">₹60,152.60</span>
              </div>
            </div>

            <button
              onClick={() => alert('Procurement Receipt downloaded.')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow text-xs flex items-center justify-center space-x-2"
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
