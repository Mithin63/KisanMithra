import React from 'react';
import { X, QrCode, Download, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Booking } from '../types';

interface QRModalProps {
  booking: Booking;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ booking, onClose }) => {
  const handleDownload = () => {
    alert(`Token #${booking.token_number} downloaded successfully to your device.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up space-y-5">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              🎟️
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Digital Token Summary</h3>
              <p className="text-xs text-slate-500">Ministry of Consumer Affairs & Food</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Token Box */}
        <div className="bg-gradient-to-br from-emerald-800 to-green-950 text-white rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-600/20 rounded-full blur-xl"></div>
          
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 bg-emerald-700/80 rounded-full border border-emerald-500/30 text-emerald-200 mb-2">
            Procurement Token
          </span>

          <div className="text-5xl font-black tracking-tight text-white my-1 font-mono">
            #{booking.token_number}
          </div>

          <p className="text-xs text-emerald-200 font-medium">
            {booking.farmer_name} (ID: {booking.farmer_code || 'AP-FARM-9872'})
          </p>

          {/* QR visual placeholder */}
          <div className="bg-white p-3 rounded-xl inline-block my-4 shadow-md">
            <div className="w-32 h-32 bg-slate-900 p-2 rounded-lg flex flex-col items-center justify-center text-white space-y-1">
              <QrCode className="w-24 h-24 text-white" />
              <span className="text-[8px] font-mono tracking-widest text-slate-300">SP2026-TOKEN-{booking.token_number}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left text-xs bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/50">
            <div>
              <span className="text-[10px] text-emerald-300 block">Centre:</span>
              <span className="font-semibold text-white truncate block">{booking.centre_name || 'Guntur AP Procurement Centre'}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 block">Produce / Qty:</span>
              <span className="font-semibold text-white">{booking.crop_name} ({booking.quantity} Q)</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 block">Date:</span>
              <span className="font-semibold text-white">{booking.booking_date}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-300 block">Time Slot:</span>
              <span className="font-semibold text-white">{booking.slot_start} – {booking.slot_end}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition shadow"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition shadow"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Close Window</span>
          </button>
        </div>
      </div>
    </div>
  );
};
