import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wheat, Calendar, Clock, CheckSquare, CreditCard, Bell, User,
  QrCode, ArrowRight, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localState } from '../services/api';
import { Booking } from '../types';
import { QueueVisualizer } from '../components/QueueVisualizer';
import { QRModal } from '../components/QRModal';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const syncData = () => {
      // Get latest active booking for current farmer
      const bookings = localState.bookings;
      const active = bookings.find(b => b.status === 'WAITING' || b.status === 'ARRIVED' || b.status === 'IN_PROGRESS');
      if (active) {
        // Hydrate wait time dynamically
        const ahead = Math.max(0, active.token_number - localState.nowServingToken);
        const est = Math.max(2, ahead * 4);
        setActiveBooking({
          ...active,
          queue_position: ahead,
          estimated_wait_time: est
        });
      } else if (bookings.length > 0) {
        setActiveBooking(bookings[0]);
      }
    };

    syncData();
    const unsubscribe = localState.subscribe(syncData);
    return unsubscribe;
  }, []);

  const farmerName = user?.name || 'Ravi Kumar';
  const farmerIdCode = user?.farmer?.farmer_id || 'AP-FARM-9872';

  const farmersAhead = activeBooking?.queue_position ?? 13;
  const estimatedWaitMins = activeBooking?.estimated_wait_time ?? 45;
  const nowServingToken = localState.nowServingToken;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Welcome Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 text-emerald-200 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ministry of Consumer Affairs & Food Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Good morning, <span className="text-amber-300">{farmerName}</span>
          </h1>
          <p className="text-emerald-200 text-xs sm:text-sm">
            Farmer ID: <strong className="text-white font-mono">{farmerIdCode}</strong> • Village: Pedakakani, Guntur District
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Link
            to="/farmer/book-slot"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs transition shadow flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book New Slot</span>
          </Link>

          <Link
            to="/farmer/my-queue"
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl text-xs transition shadow flex items-center space-x-2 border border-emerald-500/40"
          >
            <Clock className="w-4 h-4" />
            <span>Track Live Queue</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Booking</div>
          <div className="text-2xl font-black text-slate-900">
            {activeBooking ? `#${activeBooking.token_number}` : 'None'}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {activeBooking ? activeBooking.centre_name?.split(' ')[0] + ' Centre' : 'No active token'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Queue Position</div>
          <div className="text-2xl font-black text-amber-600">
            {farmersAhead > 0 ? `${farmersAhead} Ahead` : 'Turn Active'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Est Wait: {estimatedWaitMins} mins</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Procured</div>
          <div className="text-2xl font-black text-emerald-700">45.4 Q</div>
          <div className="text-[11px] text-slate-500 font-medium">Paddy & Groundnut</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Payment</div>
          <div className="text-2xl font-black text-purple-700">₹60,152</div>
          <div className="text-[11px] text-purple-600 font-medium">Processing via DBT</div>
        </div>

      </div>

      {/* 3. Main Split View: Active Booking Card + Live Queue Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Booking Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
                <span>Active Booking</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                {activeBooking?.status || 'WAITING'}
              </span>
            </div>

            {activeBooking ? (
              <div className="space-y-4 text-xs">
                
                <div>
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Procurement Centre</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{activeBooking.centre_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Date</span>
                    <span className="font-bold text-slate-800 text-xs">{activeBooking.booking_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-semibold block">Time Slot</span>
                    <span className="font-bold text-slate-800 text-xs">{activeBooking.slot_start} – {activeBooking.slot_end}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                  <div>
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">Token Number</span>
                    <span className="text-2xl font-black text-emerald-800">#{activeBooking.token_number}</span>
                  </div>
                  <button
                    onClick={() => setShowQR(true)}
                    className="p-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow transition"
                    title="View Digital QR Token"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => navigate('/farmer/my-queue')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow flex items-center justify-center space-x-2 text-xs"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Track Live Queue</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">You have no active procurement slot bookings.</p>
                <Link
                  to="/farmer/book-slot"
                  className="inline-block bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
                >
                  Book Procurement Slot Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Queue Widget */}
        <div className="lg:col-span-2 space-y-6">
          <QueueVisualizer
            nowServing={nowServingToken}
            userToken={activeBooking?.token_number || 127}
            farmersAhead={farmersAhead}
            estimatedWaitMins={estimatedWaitMins}
          />
        </div>

      </div>

      {/* Render QR Modal if opened */}
      {showQR && activeBooking && (
        <QRModal booking={activeBooking} onClose={() => setShowQR(false)} />
      )}

    </div>
  );
};
