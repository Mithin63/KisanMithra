import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Download, Calendar, Clock, MapPin, ArrowRight, Share2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localState } from '../services/api';

export const DigitalTokenPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeBooking = localState.bookings[0];
  const nowServingToken = localState.nowServingToken;
  const tokenNum = activeBooking?.token_number || 127;
  const farmersAhead = Math.max(0, tokenNum - nowServingToken);
  const estimatedWait = Math.max(2, farmersAhead * 4);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Official Digital Procurement Pass
        </span>
        <h1 className="text-3xl font-black text-slate-900">Your Digital Procurement Token</h1>
        <p className="text-xs text-slate-500">Ministry of Consumer Affairs, Food & Public Distribution</p>
      </div>

      {/* Main Token Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-green-950 to-slate-900 text-white rounded-3xl p-8 shadow-2xl border-2 border-emerald-500/40 relative overflow-hidden space-y-6">
        
        <div className="flex justify-between items-center border-b border-emerald-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center font-bold text-white text-lg">
              🎟️
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Digital Token # {tokenNum}</h2>
              <p className="text-[11px] text-emerald-300">Verified QR Pass • SmartProcure</p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-amber-500 text-slate-950 rounded-full">
            {activeBooking?.status || 'WAITING'}
          </span>
        </div>

        {/* Center QR Code Visual */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/80 p-6 rounded-2xl border border-emerald-700/50">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Serving Token</span>
            <div className="text-5xl font-black text-white font-mono">#{tokenNum}</div>
            <p className="text-xs text-slate-300">
              Farmer: <strong className="text-white">{user?.name || 'Ravi Kumar'}</strong> ({user?.farmer?.farmer_id || 'AP-FARM-9872'})
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-md text-center">
            <QrCode className="w-32 h-32 text-slate-900" />
            <span className="text-[9px] font-mono text-slate-500 font-bold block mt-1">SP2026-TOKEN-{tokenNum}</span>
          </div>
        </div>

        {/* Token Details Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/60">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Centre</span>
            <span className="font-bold text-white text-xs mt-0.5 block truncate">
              {activeBooking?.centre_name?.split(' ')[0] || 'Guntur'} Centre
            </span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Date</span>
            <span className="font-bold text-white text-xs mt-0.5 block">28 August 2026</span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Time Slot</span>
            <span className="font-bold text-white text-xs mt-0.5 block">10:30 AM – 11:00 AM</span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-400 uppercase font-semibold block">Est. Wait</span>
            <span className="font-bold text-amber-300 text-xs mt-0.5 block">{estimatedWait} Minutes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => alert('Calendar appointment added for 28 August 2026, 10:30 AM.')}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow flex items-center justify-center space-x-2 border border-slate-700"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={() => alert(`Token #${tokenNum} PDF downloaded.`)}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow flex items-center justify-center space-x-2 border border-slate-700"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Token</span>
          </button>

          <button
            onClick={() => navigate('/farmer/my-queue')}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition shadow flex items-center justify-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>View Live Queue</span>
          </button>
        </div>

      </div>

    </div>
  );
};
