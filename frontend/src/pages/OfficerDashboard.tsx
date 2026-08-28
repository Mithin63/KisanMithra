import React, { useState, useEffect } from 'react';
import { Building2, Clock, Users, CheckSquare, PhoneCall, UserCheck, Play, ArrowRight, ShieldCheck } from 'lucide-react';
import { localState } from '../services/api';
import { Booking } from '../types';
import { ProcurementEntryModal } from '../components/ProcurementEntryModal';

export const OfficerDashboard: React.FC = () => {
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [selectedBookingForEntry, setSelectedBookingForEntry] = useState<Booking | null>(null);

  useEffect(() => {
    const sync = () => {
      setBookingsList([...localState.bookings]);
    };
    sync();
    const unsubscribe = localState.subscribe(sync);
    return unsubscribe;
  }, []);

  const totalToday = bookingsList.length + 368;
  const waitingCount = bookingsList.filter(b => b.status === 'WAITING' || b.status === 'ARRIVED').length + 14;
  const inProgressCount = bookingsList.filter(b => b.status === 'IN_PROGRESS').length;
  const completedCount = bookingsList.filter(b => b.status === 'COMPLETED').length + 350;

  const handleCallFarmer = (bookingId: number) => {
    localState.callFarmer(bookingId);
  };

  const handleMarkArrived = (bookingId: number) => {
    localState.markArrived(bookingId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-blue-900/60 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-700/50 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Procurement Officer Portal • Counter 1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Guntur Agricultural Procurement Centre</h1>
          <p className="text-xs text-slate-400">NH-16 Bypass, Market Yard, Guntur, AP - 522001</p>
        </div>

        {/* Capacity Gauge */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-right space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Today's Yard Capacity</span>
          <div className="text-xl font-black text-emerald-400">372 / 500 Farmers</div>
          <div className="w-36 bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[74%]"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Today's Farmers</div>
          <div className="text-3xl font-black text-slate-900">{totalToday}</div>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-amber-800 uppercase">Waiting in Queue</div>
          <div className="text-3xl font-black text-amber-700">{waitingCount}</div>
        </div>
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-blue-800 uppercase">In Inspection</div>
          <div className="text-3xl font-black text-blue-700">{inProgressCount}</div>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-emerald-800 uppercase">Procurement Completed</div>
          <div className="text-3xl font-black text-emerald-700">{completedCount}</div>
        </div>
      </div>

      {/* Live Queue Operations Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Today's Counter Queue Operations</span>
            </h2>
            <p className="text-xs text-slate-500">Currently Serving Token: #{localState.nowServingToken}</p>
          </div>

          <button
            onClick={() => localState.advanceQueue()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center space-x-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Next Farmer (+1)</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Token</th>
                <th className="p-3.5">Farmer Name</th>
                <th className="p-3.5">Crop Produce</th>
                <th className="p-3.5 text-right">Booked Qty</th>
                <th className="p-3.5">Slot Time</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookingsList.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-mono font-black text-sm text-emerald-800">#{b.token_number}</td>
                  <td className="p-3.5 font-bold text-slate-900">
                    {b.farmer_name || 'Ravi Kumar'}
                    <span className="block text-[10px] font-normal text-slate-400">{b.farmer_code || 'AP-FARM-9872'}</span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{b.crop_name || 'Paddy'}</td>
                  <td className="p-3.5 text-right font-bold text-slate-900">{b.quantity} Q</td>
                  <td className="p-3.5 font-medium">{b.slot_start} – {b.slot_end}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        b.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse'
                          : b.status === 'ARRIVED'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : b.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center space-x-1">
                    {b.status === 'WAITING' && (
                      <button
                        onClick={() => handleMarkArrived(b.id)}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-bold hover:bg-amber-500 transition"
                      >
                        Mark Arrived
                      </button>
                    )}

                    {b.status === 'ARRIVED' && (
                      <button
                        onClick={() => handleCallFarmer(b.id)}
                        className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-500 transition"
                      >
                        Call Token
                      </button>
                    )}

                    {b.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => setSelectedBookingForEntry(b)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-extrabold hover:bg-emerald-500 transition shadow"
                      >
                        Start Inspection
                      </button>
                    )}

                    {b.status === 'COMPLETED' && (
                      <span className="text-[10px] text-emerald-700 font-bold">✓ Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedBookingForEntry && (
        <ProcurementEntryModal
          booking={selectedBookingForEntry}
          onClose={() => setSelectedBookingForEntry(null)}
        />
      )}

    </div>
  );
};
