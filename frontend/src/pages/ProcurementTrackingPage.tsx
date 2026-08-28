import React, { useState, useEffect } from 'react';
import { CheckSquare, CheckCircle2, Clock, ShieldCheck, AlertCircle, FileText, Download, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { localState } from '../services/api';
import { ProcurementRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const ProcurementTrackingPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [procurement, setProcurement] = useState<ProcurementRecord | null>(null);

  useEffect(() => {
    const sync = () => {
      if (!user) {
        setProcurement(null);
        return;
      }
      const userBookingIds = localState.bookings
        .filter(b => b.farmer_id === user.farmer?.id)
        .map(b => b.id);
      const userProcurement = localState.procurements.find(p => userBookingIds.includes(p.booking_id));
      setProcurement(userProcurement || null);
    };
    sync();
    const unsubscribe = localState.subscribe(sync);
    return unsubscribe;
  }, [user]);

  const userBookings = user ? localState.bookings.filter(b => b.farmer_id === user.farmer?.id) : [];
  const hasBooking = userBookings.length > 0;

  const payment = procurement 
    ? localState.payments.find(p => p.procurement_id === procurement.id) 
    : null;

  const booking = procurement 
    ? localState.bookings.find(b => b.id === procurement.booking_id) 
    : null;

  const mspPrice = procurement?.procurement_price || (procurement && procurement.total_amount && procurement.actual_quantity ? procurement.total_amount / procurement.actual_quantity : 2369);

  const getTimelineStages = () => {
    const defaultStages = [
      { title: 'Slot Booked', time: '28 Aug 2026, 09:15 AM', status: 'completed' },
      { title: 'Farmer Arrived at Centre', time: '28 Aug 2026, 10:20 AM', status: 'completed' },
      { title: 'Token Called to Counter', time: '28 Aug 2026, 10:35 AM', status: 'completed' },
      { title: 'Moisture & Quality Inspection', time: '28 Aug 2026, 10:42 AM', status: 'completed' },
      { title: 'Weighing Completed', time: '28 Aug 2026, 10:48 AM', status: 'completed' },
      { title: 'Produce Accepted', time: '28 Aug 2026, 10:52 AM', status: 'completed' },
      { title: 'Payment Processing (DBT)', time: 'In Progress (Bank Verification)', status: 'active' },
      { title: 'Payment Completed', time: 'Pending Bank Clearance', status: 'pending' }
    ];

    if (!procurement) return defaultStages;

    // Use completed_at as baseline
    const baseDate = procurement.completed_at ? new Date(procurement.completed_at) : new Date('2026-08-28T10:52:00Z');
    
    const formatDateStr = (date: Date) => {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    };

    const formatTimeStr = (date: Date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    const getOffsetTimeStr = (minutesOffset: number) => {
      const d = new Date(baseDate.getTime() - minutesOffset * 60 * 1000);
      return `${formatDateStr(d)}, ${formatTimeStr(d)}`;
    };

    const acceptedTime = `${formatDateStr(baseDate)}, ${formatTimeStr(baseDate)}`;
    const weighedTime = getOffsetTimeStr(4);
    const inspectedTime = getOffsetTimeStr(10);
    const calledTime = getOffsetTimeStr(17);
    const arrivedTime = getOffsetTimeStr(32);
    const bookedTime = booking 
      ? `${formatDateStr(new Date(booking.booking_date || booking.created_at))}, ${booking.slot_start || '09:00 AM'}`
      : getOffsetTimeStr(97);

    let paymentProcessingStatus = 'active';
    let paymentProcessingTime = 'In Progress (Bank Verification)';
    let paymentCompletedStatus = 'pending';
    let paymentCompletedTime = 'Pending Bank Clearance';

    if (payment) {
      if (payment.status === 'PAID') {
        paymentProcessingStatus = 'completed';
        const pDate = new Date(payment.payment_date);
        paymentProcessingTime = `${formatDateStr(pDate)}, ${formatTimeStr(pDate)}`;
        paymentCompletedStatus = 'completed';
        paymentCompletedTime = `${formatDateStr(pDate)}, ${formatTimeStr(pDate)}`;
      } else if (payment.status === 'PROCESSING') {
        paymentProcessingStatus = 'active';
        paymentProcessingTime = 'In Progress (Bank Verification)';
        paymentCompletedStatus = 'pending';
        paymentCompletedTime = 'Pending Bank Clearance';
      }
    }

    return [
      { title: 'Slot Booked', time: bookedTime, status: 'completed' },
      { title: 'Farmer Arrived at Centre', time: arrivedTime, status: 'completed' },
      { title: 'Token Called to Counter', time: calledTime, status: 'completed' },
      { title: 'Moisture & Quality Inspection', time: inspectedTime, status: 'completed' },
      { title: 'Weighing Completed', time: weighedTime, status: 'completed' },
      { title: 'Produce Accepted', time: acceptedTime, status: 'completed' },
      { title: 'Payment Processing (DBT)', time: paymentProcessingTime, status: paymentProcessingStatus },
      { title: 'Payment Completed', time: paymentCompletedTime, status: paymentCompletedStatus }
    ];
  };

  const timelineStages = getTimelineStages();

  const handleDownloadReceipt = () => {
    if (!procurement) return;

    // Create a hidden iframe
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
          <title>Official Procurement Receipt - Batch #${booking?.token_number || 127}</title>
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
              grid-template-columns: 1fr 1fr; 
              gap: 24px; 
              margin-bottom: 30px; 
            }
            .section { 
              background: #f8fafc; 
              padding: 20px; 
              border-radius: 16px; 
              border: 1px solid #e2e8f0; 
            }
            .section-title { 
              font-size: 11px; 
              font-weight: 800; 
              text-transform: uppercase; 
              color: #64748b; 
              margin-bottom: 12px; 
              letter-spacing: 0.05em; 
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 6px;
            }
            .data-row { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 10px; 
              font-size: 13px; 
            }
            .data-row:last-child { 
              margin-bottom: 0; 
            }
            .label { 
              color: #64748b; 
              font-weight: 500;
            }
            .value { 
              font-weight: 700; 
              color: #0f172a; 
            }
            .table-container { 
              margin-bottom: 30px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              text-align: left; 
              font-size: 13px; 
            }
            th { 
              background: #0f172a; 
              color: white; 
              padding: 14px 16px; 
              font-weight: 700; 
            }
            th:first-child { 
              border-radius: 12px 0 0 12px; 
            }
            th:last-child { 
              border-radius: 0 12px 12px 0; 
            }
            td { 
              padding: 14px 16px; 
              border-bottom: 1px solid #e2e8f0; 
            }
            .total-row { 
              background: #f0fdf4; 
              border-top: 2px solid #10b981; 
              font-size: 15px; 
              font-weight: 800; 
            }
            .total-row td { 
              color: #065f46; 
              padding: 18px 16px; 
            }
            .status-banner {
              text-align: center; 
              background: #f0fdf4; 
              border: 1px solid #bbf7d0;
              padding: 16px;
              border-radius: 16px;
              margin-bottom: 30px;
            }
            .status-banner.processing {
              background: #faf5ff;
              border: 1px solid #e9d5ff;
              color: #6b21a8;
            }
            .status-title {
              font-weight: 800; 
              font-size: 14px;
            }
            .status-title.processing {
              color: #6b21a8;
            }
            .status-desc {
              font-size: 11px; 
              margin-top: 4px;
              color: #166534;
            }
            .status-desc.processing {
              color: #6b21a8;
            }
            .footer { 
              text-align: center; 
              font-size: 11px; 
              color: #94a3b8; 
              margin-top: 40px; 
              border-top: 1px solid #e2e8f0; 
              padding-top: 24px; 
            }
            .watermark { 
              position: absolute; 
              top: 55%; 
              left: 50%; 
              transform: translate(-50%, -50%) rotate(-30deg); 
              font-size: 90px; 
              font-weight: 900; 
              color: rgba(16, 185, 129, 0.04); 
              pointer-events: none; 
              white-space: nowrap; 
              letter-spacing: 0.1em;
            }
            @media print {
              body { 
                padding: 0; 
                background-color: #ffffff;
              }
              .receipt-container { 
                border: none; 
                box-shadow: none; 
                padding: 0; 
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="watermark">SMARTPROCURE</div>
            <div class="header">
              <h1>SMARTPROCURE PORTAL</h1>
              <h2>Ministry of Consumer Affairs, Food & Public Distribution</h2>
              <p>Government of India • Crop Procurement Official Receipt</p>
            </div>
            
            <div class="grid">
              <div class="section">
                <div class="section-title">Farmer & Centre Details</div>
                <div class="data-row">
                  <span class="label">Farmer Name:</span>
                  <span class="value">${procurement.farmer_name || 'Ravi Kumar'}</span>
                </div>
                <div class="data-row">
                  <span class="label">Farmer ID:</span>
                  <span class="value">${booking?.farmer_code || 'AP-FARM-9872'}</span>
                </div>
                <div class="data-row">
                  <span class="label">Procurement Centre:</span>
                  <span class="value">${booking?.centre_name || 'Tenali Agricultural Yard Centre'}</span>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Receipt Metadata</div>
                <div class="data-row">
                  <span class="label">Receipt No:</span>
                  <span class="value">REC-2026-08-${procurement.id}</span>
                </div>
                <div class="data-row">
                  <span class="label">Date & Time:</span>
                  <span class="value">${completedAt}</span>
                </div>
                <div class="data-row">
                  <span class="label">Transaction ID:</span>
                  <span class="value" style="font-family: monospace; font-size: 12px;">${txnId}</span>
                </div>
              </div>
            </div>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Commodity Crop</th>
                    <th>Quality Grade</th>
                    <th>Moisture Content</th>
                    <th>Quantity</th>
                    <th style="text-align: right;">MSP Rate</th>
                    <th style="text-align: right;">Total Payout</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="value">${cropName}</td>
                    <td><span style="font-weight: 700; color: #047857;">${grade.replace('_', ' ')}</span></td>
                    <td>${moisture}%</td>
                    <td>${quantity} Quintals</td>
                    <td style="text-align: right;">₹${mspPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / Qtl</td>
                    <td style="text-align: right; font-weight: 700;">₹${procurement.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="5">Total Payout Amount (Direct Benefit Transfer)</td>
                    <td style="text-align: right;">₹${procurement.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="status-banner ${paymentStatus.toLowerCase()}">
              <div class="status-title ${paymentStatus.toLowerCase()}">DBT Payment Status: ${paymentStatus}</div>
              <div class="status-desc ${paymentStatus.toLowerCase()}">
                ${paymentStatus === 'PAID' 
                  ? 'Funds have been successfully credited to your Aadhaar-linked bank account via DBT.' 
                  : 'Funds are in transit and will be credited to your Aadhaar-linked bank account within 24-48 hours.'}
              </div>
            </div>
            
            <div class="footer">
              <p>This is a computer-generated official procurement receipt and does not require a physical signature.</p>
              <p>For any queries, please contact helpdesk at support-smartprocure@gov.in or visit your local agricultural yard center.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    doc.write(htmlContent);
    doc.close();

    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Procurement Lifecycle Tracker
        </span>
        <h1 className="text-3xl font-black text-slate-900">Crop Procurement Status</h1>
        <p className="text-xs text-slate-500">{t('govt_title')}</p>
      </div>

      {/* My Profile & Logout Banner */}
      {user && (
        <div className="bg-gradient-to-r from-emerald-800 via-green-900 to-emerald-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-white flex items-center justify-center text-xl font-black">
                {user.name.charAt(0) || 'F'}
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">Logged in as</span>
                <h3 className="font-black text-lg text-white">{user.name}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-emerald-200">
                  <span>ID: <strong>{user.farmer?.farmer_id || 'AP-FARM-9872'}</strong></span>
                  <span>•</span>
                  <span>📱 {user.mobile || '9876543210'}</span>
                  <span>•</span>
                  <span>📍 {user.farmer?.village || 'Pedakakani'}, {user.farmer?.district || 'Guntur'}</span>
                  <span>•</span>
                  <span className="text-emerald-300 font-semibold">✓ Aadhaar Verified</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center space-x-2 bg-red-500/15 hover:bg-red-500/25 text-red-200 hover:text-white font-bold px-5 py-2.5 rounded-xl border border-red-400/30 text-xs transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {!procurement ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-5 py-12 shadow-sm animate-fadeIn">
          <Clock className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
          {hasBooking ? (
            <>
              <h3 className="text-xl font-black text-slate-900">Procurement Process Pending</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Your slot booking is confirmed. The procurement status timeline and digital receipt will be generated here once you arrive at the centre and the counter starts weighing your produce.
              </p>
              <div className="bg-slate-50 p-5 rounded-2xl max-w-sm mx-auto text-xs text-left space-y-2.5 border border-slate-200">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Assigned Token:</span>
                  <span className="font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">Token #{userBookings[0].token_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Procurement Hub:</span>
                  <span className="font-bold text-slate-800">{userBookings[0].centre_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-bold text-slate-800">{userBookings[0].booking_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Window:</span>
                  <span className="font-bold text-slate-850">{userBookings[0].slot_start} – {userBookings[0].slot_end}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-black text-slate-900">No Procurement Process Active</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                You have not booked any procurement slots. To bring your crop harvest to a Government purchase counter, please schedule a booking slot.
              </p>
              <button
                onClick={() => navigate('/farmer/book-slot')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow transition"
              >
                Book a Slot Now
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: 8-Stage Timeline */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <span>Procurement Progress Timeline</span>
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Grade A Verified
              </span>
            </div>

            <div className="space-y-6 relative pl-4 border-l-2 border-slate-200">
              {timelineStages.map((stage, idx) => (
                <div key={idx} className="relative flex items-start space-x-4">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center -ml-[25px] flex-shrink-0 text-xs font-bold ${
                      stage.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : stage.status === 'active'
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {stage.status === 'completed' ? '✓' : idx + 1}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 text-sm">{stage.title}</h4>
                    <p className="text-xs text-slate-500">{stage.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Accepted Batch Voucher Card */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-5 border border-slate-800">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Verified Batch</span>
                  <h3 className="font-black text-lg text-white">Batch #SP-GNT-{booking?.token_number || 127}</h3>
                </div>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Accepted
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Crop Commodity</span>
                  <span className="font-bold text-slate-200">{procurement?.crop_name || 'Paddy (Grade A)'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Net Quantity</span>
                  <span className="font-bold text-slate-200">{procurement?.actual_quantity || '25.40'} Quintals</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Moisture Content</span>
                  <span className="font-bold text-emerald-400">{procurement?.moisture || '12.5'}% (Pass)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Quality Assigned</span>
                  <span className="font-bold text-emerald-400">{procurement?.quality_grade || 'Grade A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Govt. MSP Price</span>
                  <span className="font-bold text-slate-200">₹{mspPrice ? mspPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '2,369.00'} / Qtl</span>
                </div>
                <div className="flex justify-between py-2 pt-3 text-sm">
                  <span className="font-bold text-white">Total Payout Amount</span>
                  <span className="font-black text-amber-400">₹{procurement?.total_amount ? procurement.total_amount.toLocaleString('en-IN') : '60,172.60'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Receipt</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProcurementTrackingPage;
