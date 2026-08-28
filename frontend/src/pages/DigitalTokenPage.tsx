import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Download, Calendar, Clock, MapPin, ArrowRight, Share2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { localState } from '../services/api';

export const DigitalTokenPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const activeBooking = localState.bookings.find(b => b.farmer_id === user?.farmer?.id);
  const nowServingToken = localState.nowServingToken;
  const tokenNum = activeBooking?.token_number;
  const farmersAhead = tokenNum ? Math.max(0, tokenNum - nowServingToken) : 0;
  const estimatedWait = Math.max(2, farmersAhead * 4);

  if (!activeBooking || !tokenNum) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <QrCode className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">No Active Digital Token</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          You must book a procurement slot first to generate a digital gate pass with verification QR code.
        </p>
        <button
          onClick={() => navigate('/farmer/book-slot')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-8 py-3 rounded-2xl shadow transition"
        >
          Book a Slot Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          {t('digital_pass_title')}
        </span>
        <h1 className="text-3xl font-black text-slate-900">{t('your_digital_token')}</h1>
        <p className="text-xs text-slate-500">{t('govt_title')}</p>
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
              <p className="text-[11px] text-emerald-300">{t('verified_qr_pass')}</p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-amber-500 text-slate-950 rounded-full">
            {activeBooking?.status || 'WAITING'}
          </span>
        </div>

        {/* Center QR Code Visual */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/80 p-6 rounded-2xl border border-emerald-700/50">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">{t('serving_token')}</span>
            <div className="text-5xl font-black text-white font-mono">#{tokenNum}</div>
            <p className="text-xs text-slate-300">
              {t('farmer_label')}: <strong className="text-white">{user?.name || 'Ravi Kumar'}</strong> ({user?.farmer?.farmer_id || 'AP-FARM-9872'})
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-md text-center">
            <QrCode className="w-32 h-32 text-slate-900" />
            <span className="text-[9px] font-mono text-slate-500 font-bold block mt-1">SP2026-TOKEN-{tokenNum}</span>
          </div>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 block text-[10px]">{t('scheduled_slot')}</span>
            <span className="font-bold text-white mt-1 block">
              {activeBooking?.booking_date || '2026-08-28'} ({activeBooking?.slot_start || '10:30 AM'})
            </span>
          </div>

          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800">
            <span className="text-emerald-300 block text-[10px]">{t('procurement_hub')}</span>
            <span className="font-bold text-white mt-1 block truncate">
              {activeBooking?.centre_name || 'Guntur APMC Yard'}
            </span>
          </div>

          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800 col-span-2 sm:col-span-1">
            <span className="text-emerald-300 block text-[10px]">{t('live_queue_status')}</span>
            <span className="font-bold text-amber-300 mt-1 block">
              {farmersAhead} {t('live_queue_ahead')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow text-xs flex items-center justify-center space-x-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>{t('btn_download_pass')}</span>
          </button>

          <button
            onClick={() => navigate('/farmer/my-queue')}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-slate-700 text-xs flex items-center justify-center space-x-2 transition"
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{t('btn_track_live_queue')}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default DigitalTokenPage;
