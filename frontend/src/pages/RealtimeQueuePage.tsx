import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RefreshCw, Zap, ShieldCheck, CheckCircle2, UserCheck, AlertTriangle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { localState } from '../services/api';
import { QueueVisualizer } from '../components/QueueVisualizer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const RealtimeQueuePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [nowServing, setNowServing] = useState(localState.nowServingToken);
  const [autoAdvance, setAutoAdvance] = useState(true);

  useEffect(() => {
    const sync = () => {
      setNowServing(localState.nowServingToken);
    };

    sync();
    const unsubscribe = localState.subscribe(sync);
    return unsubscribe;
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (autoAdvance) {
      timer = setInterval(() => {
        localState.advanceQueue();
      }, 12000); // 12 second ticks for demo simulation
    }
    return () => clearInterval(timer);
  }, [autoAdvance]);

  const navigate = useNavigate();
  const activeBooking = localState.bookings.find(b => b.farmer_id === user?.farmer?.id);
  const userToken = activeBooking?.token_number || 0;
  const farmersAhead = userToken ? Math.max(0, userToken - nowServing) : 0;
  const avgProcessingMins = 4;
  const estimatedWaitMins = farmersAhead * avgProcessingMins;

  // Find the procurement record if it exists
  const procurement = activeBooking 
    ? localState.procurements.find(p => p.booking_id === activeBooking.id)
    : null;

  const payment = procurement
    ? localState.payments.find(p => p.procurement_id === procurement.id)
    : null;

  const handleDownloadReceipt = () => {
    if (!procurement || !activeBooking) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const txnId = payment?.transaction_id || `SP20260828${procurement.id}`;
    const cropName = procurement.crop_name || 'Groundnut (Peanut)';
    const quantity = procurement.actual_quantity || 20;
    const moisture = procurement.moisture || 7.8;
    const grade = procurement.quality_grade || 'GRADE_A';
    const completedAt = procurement.completed_at 
      ? new Date(procurement.completed_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : '28 Aug 2026, 10:52 AM';
    const paymentStatus = payment?.status || 'PROCESSING';

    const htmlContent = `
      <html>
        <head>
          <title>Official Procurement Receipt - Batch #${activeBooking?.token_number || 127}</title>
          <style>
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
              padding: 40px; 
              color: #1e293b; 
              background-color: #ffffff;
            }
            .receipt-container { 
              max-width: 800px; 
              margin: 0 auto; 
              border: 1px solid #e2e8f0; 
              border-radius: 24px; 
              padding: 40px; 
              position: relative;
              background-color: #ffffff;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #10b981; 
              padding-bottom: 24px; 
              margin-bottom: 30px; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 26px; 
              font-weight: 900; 
              color: #0f172a; 
              letter-spacing: -0.025em;
            }
            .header h2 { 
              margin: 6px 0 0; 
              font-size: 13px; 
              font-weight: 700; 
              color: #059669; 
              text-transform: uppercase; 
              letter-spacing: 0.05em; 
            }
            .header p { 
              margin: 4px 0 0; 
              font-size: 12px; 
              color: #64748b; 
            }
            .grid { 
              display: grid; 
              grid-template-cols: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 30px; 
            }
            .card { 
              background: #f8fafc; 
              border: 1px solid #e2e8f0; 
              border-radius: 16px; 
              padding: 20px; 
            }
            .card h3 { 
              margin: 0 0 12px; 
              font-size: 13px; 
              font-weight: 800; 
              text-transform: uppercase; 
              color: #475569; 
              letter-spacing: 0.05em;
            }
            .card p { 
              margin: 4px 0; 
              font-size: 13px; 
              color: #1e293b; 
            }
            .card p strong { 
              color: #0f172a; 
            }
            .table-container { 
              margin-bottom: 30px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
            }
            th, td { 
              padding: 14px; 
              text-align: left; 
              font-size: 13px; 
              border-bottom: 1px solid #e2e8f0; 
            }
            th { 
              background-color: #f8fafc; 
              font-weight: 750; 
              color: #475569; 
            }
            .total-row { 
              font-size: 15px; 
              font-weight: 900; 
              color: #0f172a; 
              background-color: #f0fdf4;
            }
            .footer { 
              text-align: center; 
              font-size: 11px; 
              color: #94a3b8; 
              margin-top: 40px; 
              border-top: 1px dashed #e2e8f0; 
              padding-top: 20px; 
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1>SmartProcure Receipt</h1>
              <h2>Govt of India Crop Procurement System</h2>
              <p>Verified Crop Acceptance Slip & Voucher</p>
            </div>

            <div class="grid">
              <div class="card">
                <h3>Farmer Details</h3>
                <p>Name: <strong>${user?.name}</strong></p>
                <p>ID: <strong>${user?.farmer?.farmer_id || 'AP-FARM-9872'}</strong></p>
                <p>Mandi Hub: <strong>${activeBooking.centre_name}</strong></p>
              </div>
              <div class="card">
                <h3>Transaction Details</h3>
                <p>Receipt ID: <strong>SP-REC-${procurement.id}</strong></p>
                <p>Date: <strong>${completedAt}</strong></p>
                <p>DBT Status: <strong>${paymentStatus}</strong></p>
              </div>
            </div>

            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Crop Commodity</th>
                    <th>Quality Grade</th>
                    <th>Moisture</th>
                    <th>Quantity (Qtl)</th>
                    <th>MSP Rate</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>${cropName}</strong></td>
                    <td>${grade}</td>
                    <td>${moisture}%</td>
                    <td>${quantity.toFixed(2)}</td>
                    <td>₹${(procurement.procurement_price || 2369).toLocaleString('en-IN')}</td>
                    <td><strong>₹${procurement.total_amount.toLocaleString('en-IN')}</strong></td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="5">Net Payable Payout (DBT)</td>
                    <td>₹${procurement.total_amount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>This is a computer generated digital receipt linked with Aadhaar and State Land Records.</p>
              <p>Ministry of Consumer Affairs, Food & Public Distribution, Government of India</p>
            </div>
          </div>
        </body>
      </html>
    `;

    doc.write(htmlContent);
    doc.close();

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  if (!activeBooking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">No Active Slot Booking Found</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          You must book a procurement slot first to generate a digital token and view the real-time queue tracker.
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{t('queue_tracker_title')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Guntur Agricultural Procurement Centre</h1>
          <p className="text-xs text-slate-400">Active Counters: 5 • Operating Hours: 08:00 AM – 05:00 PM</p>
        </div>

        {/* Live Counter Sync Badge */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-slate-200">Electronic Counter 1 Active</span>
          </div>
        </div>
      </div>

      {/* Main Visualizer or Completed Receipt Card */}
      {procurement ? (
        <div className="bg-gradient-to-br from-emerald-900 via-green-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-500/40 relative overflow-hidden space-y-6 animate-fadeIn">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-800/85 pb-4 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-white flex items-center justify-center text-2xl font-black">
                ✅
              </div>
              <div>
                <h2 className="font-black text-xl text-white">Procurement Completed</h2>
                <p className="text-xs text-emerald-300">Your crop produce batch has been successfully processed & accepted</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-emerald-500 text-white px-3 py-1 rounded-full uppercase tracking-wider">
              Accepted
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Left Box: Batch Metrics */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-emerald-800/50 space-y-3.5 text-xs">
              <div className="flex justify-between py-1 border-b border-emerald-950">
                <span className="text-slate-400">Crop Commodity</span>
                <span className="font-bold text-white">{procurement.crop_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-950">
                <span className="text-slate-400">Net Quantity</span>
                <span className="font-bold text-white">{procurement.actual_quantity} Quintals</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-950">
                <span className="text-slate-400">Moisture Content</span>
                <span className="font-bold text-emerald-400">{procurement.moisture}% (Passed)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-emerald-950">
                <span className="text-slate-400">Quality Assigned</span>
                <span className="font-bold text-emerald-400">{procurement.quality_grade}</span>
              </div>
              <div className="flex justify-between py-1 pt-2 text-sm font-bold border-t border-emerald-800/50">
                <span className="text-white">Total Payout Amount</span>
                <span className="text-amber-400 font-extrabold">₹{procurement.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Right Box: Action / Print */}
            <div className="flex flex-col justify-between p-1 space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">DBT Bank Transfer</span>
                <h4 className="font-black text-sm text-white">Payment Status: {payment?.status || 'PROCESSING'}</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Direct Benefit Transfer (DBT) is being processed by the treasury. Payout details have been logged with transaction ID: <strong className="text-white font-mono">{payment?.transaction_id || 'PENDING'}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl shadow text-xs flex items-center justify-center space-x-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Receipt (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <QueueVisualizer
          nowServing={nowServing}
          userToken={userToken}
          farmersAhead={farmersAhead}
          estimatedWaitMins={estimatedWaitMins}
        />
      )}

      {/* Queue Tips & Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Gate Arrival Protocol</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Arrive at the procurement gate 15 minutes before your scheduled slot. Show your digital token pass or QR code to the gate security.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Automated Weighing</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vehicles proceed to electronic weighbridges. Net produce weight is calculated automatically and sent to the central portal.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Moisture & Quality Inspection</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Authorized testing equipment measures grain moisture levels (Standard: below 14%). Grade A or Grade B is assigned.
          </p>
        </div>
      </div>

    </div>
  );
};

export default RealtimeQueuePage;
