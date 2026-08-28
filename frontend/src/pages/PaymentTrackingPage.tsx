import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, Download, ShieldCheck, DollarSign, FileText } from 'lucide-react';
import { localState } from '../services/api';
import { Payment } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const PaymentTrackingPage: React.FC = () => {
  const { t } = useLanguage();
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          {t('payment_title')}
        </span>
        <h1 className="text-3xl font-black text-slate-900">Procurement Payment Tracking</h1>
        <p className="text-xs text-slate-500">{t('govt_title')}</p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Procurement Value</div>
          <div className="text-3xl font-black text-slate-900">₹{totalValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 font-medium">{t('completed_txns')}</div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{t('total_paid')}</div>
          <div className="text-3xl font-black text-emerald-700">₹{paidValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Credited to Bank Account via DBT</span>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-3xl border border-purple-200 shadow-sm space-y-2">
          <div className="text-xs font-bold text-purple-800 uppercase tracking-wider">{t('pending_amount')}</div>
          <div className="text-3xl font-black text-purple-700">₹{processingValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-purple-600 font-medium">Expected within 24-48 hours</div>
        </div>

      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>Direct Benefit Transfer (DBT) Vouchers</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">{paymentsList.length} Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">{t('voucher_id')}</th>
                <th className="py-3 px-4">Commodity Crop</th>
                <th className="py-3 px-4">Net Quantity</th>
                <th className="py-3 px-4">Total Amount (₹)</th>
                <th className="py-3 px-4">Transaction Date</th>
                <th className="py-3 px-4 rounded-r-xl">{t('bank_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentsList.map(pay => (
                <tr key={pay.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{pay.transaction_id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{pay.crop_name || 'Groundnut (Peanut)'}</td>
                  <td className="py-3 px-4 text-slate-600">{pay.quantity || 20} Qtl</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700 text-sm">₹{pay.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(pay.payment_date).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                      pay.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {pay.status === 'PAID' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{pay.status === 'PAID' ? 'Bank Credited' : 'Processing'}</span>
                    </span>
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

export default PaymentTrackingPage;
