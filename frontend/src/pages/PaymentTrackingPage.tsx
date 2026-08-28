import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, Download, ShieldCheck, DollarSign, FileText } from 'lucide-react';
import { localState } from '../services/api';
import { Payment } from '../types';

export const PaymentTrackingPage: React.FC = () => {
  const [paymentsList, setPaymentsList] = useState<Payment[]>([]);

  useEffect(() => {
    const sync = () => {
      setPaymentsList([...localState.payments]);
    };
    sync();
    const unsubscribe = localState.subscribe(sync);
    return unsubscribe;
  }, []);

  const totalValue = paymentsList.reduce((acc, p) => acc + p.amount, 0);
  const paidValue = paymentsList.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amount, 0);
  const processingValue = paymentsList.filter(p => p.status === 'PROCESSING').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Direct Benefit Transfer (DBT) Transparency Hub
        </span>
        <h1 className="text-3xl font-black text-slate-900">Procurement Payment Tracking</h1>
        <p className="text-xs text-slate-500">Ministry of Consumer Affairs, Food & Public Distribution</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Procurement Value</div>
          <div className="text-3xl font-black text-slate-900">₹{totalValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 font-medium">All completed transactions</div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Paid (DBT)</div>
          <div className="text-3xl font-black text-emerald-700">₹{paidValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Credited to Bank Account</span>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-purple-800 uppercase tracking-wider">Processing Payment</div>
          <div className="text-3xl font-black text-purple-700">₹{processingValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-purple-600 font-medium">Expected within 48 hours</div>
        </div>

      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Payment Disbursement Records</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Auto-Synced with PFMS / DBT Gateway</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Crop</th>
                <th className="p-3.5 text-right">Quantity</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentsList.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-medium">{pay.payment_date.slice(0,10)}</td>
                  <td className="p-3.5 font-bold text-slate-900">{pay.crop_name || 'Paddy'}</td>
                  <td className="p-3.5 text-right font-semibold">{pay.quantity || 25.4} Q</td>
                  <td className="p-3.5 text-right font-black text-emerald-800">₹{pay.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">{pay.transaction_id}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold ${
                        pay.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-purple-100 text-purple-800 border border-purple-300'
                      }`}
                    >
                      {pay.status === 'PAID' ? '✓ Paid' : '⏳ Processing'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => alert(`Downloaded receipt for Txn #${pay.transaction_id}`)}
                      className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      title="Download Payment Voucher"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
