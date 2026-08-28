import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, FileText, Scale } from 'lucide-react';
import { Booking } from '../types';
import { localState } from '../services/api';

interface ProcurementEntryModalProps {
  booking: Booking;
  onClose: () => void;
}

export const ProcurementEntryModal: React.FC<ProcurementEntryModalProps> = ({ booking, onClose }) => {
  const [actualQuantity, setActualQuantity] = useState(booking.quantity.toString());
  const [qualityGrade, setQualityGrade] = useState<'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'REJECTED'>('GRADE_A');
  const [moisture, setMoisture] = useState('12.5');
  const [remarks, setRemarks] = useState('Produce inspected and verified. Grade A quality parameters met.');

  const price = booking.msp_price || 2369;
  const qtyNum = parseFloat(actualQuantity) || 0;
  const calculatedTotal = (qtyNum * price).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localState.completeProcurement({
      bookingId: booking.id,
      actualQuantity: qtyNum,
      qualityGrade,
      moisture: parseFloat(moisture) || 12.0
    });
    alert(`Procurement completed for Token #${booking.token_number}! Voucher generated for ₹${parseFloat(calculatedTotal).toLocaleString('en-IN')}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Counter Quality Inspection
            </span>
            <h3 className="font-extrabold text-slate-900 text-lg mt-1">Record Procurement Entry</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Farmer & Crop Context Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Farmer</span>
            <p className="font-bold text-slate-900">{booking.farmer_name}</p>
            <p className="text-slate-500">ID: {booking.farmer_code || 'AP-FARM-9872'}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Crop & Token</span>
            <p className="font-bold text-slate-900">{booking.crop_name} (Token #{booking.token_number})</p>
            <p className="text-emerald-700 font-bold">MSP: ₹{price} / Q</p>
          </div>
        </div>

        {/* Inspection Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Actual Weighing Quantity (Quintals) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={actualQuantity}
                onChange={e => setActualQuantity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Moisture Percentage (%) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={moisture}
                onChange={e => setMoisture(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Quality Grade Classification *</label>
            <select
              value={qualityGrade}
              onChange={e => setQualityGrade(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="GRADE_A">Grade A (Standard MSP Applicable)</option>
              <option value="GRADE_B">Grade B (Satisfactory)</option>
              <option value="GRADE_C">Grade C (Minor Defect - Discounted)</option>
              <option value="REJECTED">Rejected (Excess Moisture / Damage)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Officer Inspection Remarks</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs"
            ></textarea>
          </div>

          {/* Value Preview */}
          <div className="bg-emerald-900 text-white p-4 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Calculated Payment Amount</span>
              <span className="text-xl font-black">₹{parseFloat(calculatedTotal).toLocaleString('en-IN')}</span>
            </div>
            <span className="text-xs bg-emerald-700 px-3 py-1 rounded-full font-bold">Auto Voucher</span>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-6 py-2.5 rounded-xl shadow flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Procurement & Issue Voucher</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
