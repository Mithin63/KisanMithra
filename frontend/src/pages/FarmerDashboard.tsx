import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wheat, Calendar, Clock, CheckSquare, CreditCard, Bell, User,
  QrCode, ArrowRight, Sparkles, RefreshCw, AlertCircle, MapPin,
  CloudSun, ClipboardCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { localState } from '../services/api';
import { Booking } from '../types';
import { QueueVisualizer } from '../components/QueueVisualizer';
import { QRModal } from '../components/QRModal';
import { AutoLocationDetector } from '../components/AutoLocationDetector';
import { AgriWeatherAdvisor } from '../components/AgriWeatherAdvisor';
import { ProcurementRequirementsGuide } from '../components/ProcurementRequirementsGuide';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const syncData = () => {
      if (!user) {
        setActiveBooking(null);
        return;
      }
      const bookings = localState.bookings.filter(b => b.farmer_id === user.farmer?.id);
      const active = bookings.find(b => b.status === 'WAITING' || b.status === 'ARRIVED' || b.status === 'IN_PROGRESS');
      if (active) {
        const ahead = Math.max(0, active.token_number - localState.nowServingToken);
        const est = Math.max(2, ahead * 4);
        setActiveBooking({
          ...active,
          queue_position: ahead,
          estimated_wait_time: est
        });
      } else {
        setActiveBooking(null);
      }
    };

    syncData();
    const unsubscribe = localState.subscribe(syncData);
    return unsubscribe;
  }, [user]);

  const farmerName = user?.name || 'Ravi Kumar';
  const farmerIdCode = user?.farmer?.farmer_id || 'AP-FARM-9872';
  const farmerDistrict = user?.farmer?.district || 'Guntur';
  const farmerVillage = user?.farmer?.village || 'Pedakakani';

  const farmersAhead = activeBooking?.queue_position ?? 13;
  const estimatedWaitMins = activeBooking?.estimated_wait_time ?? 45;
  const nowServingToken = localState.nowServingToken;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* 1. Welcome Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 text-emerald-200 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('govt_title')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('welcome_farmer')}, {farmerName}!
          </h1>
          <p className="text-emerald-200 text-xs sm:text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Farmer ID: <strong>{farmerIdCode}</strong></span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{farmerVillage}, {farmerDistrict}</span>
            </span>
            {user?.name.startsWith('Farmer (') && (
              <>
                <span>•</span>
                <Link to="/farmer/profile" className="text-amber-300 hover:text-amber-200 font-bold underline flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Update Profile Name</span>
                </Link>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            to="/farmer/book-slot"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-lg transition flex items-center space-x-2 text-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('btn_book_new_slot')}</span>
          </Link>
          <Link
            to="/farmer/weather"
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl border border-emerald-500/40 shadow transition flex items-center space-x-2 text-xs"
          >
            <CloudSun className="w-4 h-4" />
            <span>Weather Forecast</span>
          </Link>
        </div>
      </div>

      {/* Auto Location & District Detector */}
      <AutoLocationDetector />

      {/* 2. Live Active Token Card */}
      {activeBooking ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                🎟️
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">{t('live_token_card')}</span>
                <h3 className="text-xl font-black text-slate-900">Token #{activeBooking.token_number}</h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQR(true)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition border border-emerald-200"
              >
                <QrCode className="w-4 h-4" />
                <span>Show QR Pass</span>
              </button>
              <Link
                to="/farmer/my-queue"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition shadow"
              >
                <Clock className="w-4 h-4" />
                <span>Live Tracker</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Centre</span>
              <span className="font-bold text-slate-800 mt-1 block truncate">{activeBooking.centre_name}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Produce Items</span>
              <span className="font-bold text-slate-800 mt-1 block">{activeBooking.crops?.length || 1} Crop(s)</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Appointment Slot</span>
              <span className="font-bold text-slate-800 mt-1 block">{activeBooking.booking_date} ({activeBooking.slot_start})</span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
              <span className="text-emerald-800 block text-[11px] font-bold">Est. MSP Total</span>
              <span className="font-black text-emerald-700 mt-1 block">₹{activeBooking.total_estimated_payout ? activeBooking.total_estimated_payout.toLocaleString('en-IN') : '60,172'}</span>
            </div>
          </div>

          {/* Visual Queue Pipeline */}
          <QueueVisualizer
            nowServing={nowServingToken}
            userToken={activeBooking.token_number}
            farmersAhead={farmersAhead}
            estimatedWaitMins={estimatedWaitMins}
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
          <Clock className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Active Slot Bookings</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You do not have any active appointments today. Book a slot to get your digital token and live queue tracker.
          </p>
          <Link
            to="/farmer/book-slot"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow"
          >
            {t('btn_book_new_slot')}
          </Link>
        </div>
      )}

      {/* 3. Agri-Weather Advisor Section */}
      <AgriWeatherAdvisor />

      {/* 4. Procurement Requirements & Gate Checklist */}
      <ProcurementRequirementsGuide />

      {/* 5. Quick Actions Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">{t('quick_actions')}</h3>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${activeBooking ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
          {activeBooking && (
            <Link
              to="/farmer/digital-token"
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold group-hover:scale-110 transition">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{t('btn_view_token')}</h4>
              <p className="text-[11px] text-slate-500">Download digital gate pass with QR code verification.</p>
            </Link>
          )}

          <Link
            to="/farmer/weather"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <CloudSun className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Weather & Delivery Forecast</h4>
            <p className="text-[11px] text-slate-500">Check rain probability and grain sun-drying recommendations.</p>
          </Link>

          <Link
            to="/farmer/guidelines"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Required Documents Checklist</h4>
            <p className="text-[11px] text-slate-500">Aadhaar, Land records, Bank DBT details, and quality norms.</p>
          </Link>

          <Link
            to="/farmer/payments"
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{t('btn_payment_status')}</h4>
            <p className="text-[11px] text-slate-500">Track Direct Benefit Transfer (DBT) bank payment status.</p>
          </Link>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && activeBooking && (
        <QRModal
          booking={activeBooking}
          onClose={() => setShowQR(false)}
        />
      )}

    </div>
  );
};

export default FarmerDashboard;
