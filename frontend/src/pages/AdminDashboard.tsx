import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  BarChart3, Building2, Users, AlertTriangle, ShieldCheck, TrendingUp,
  Sparkles, Zap, ArrowUpRight, CheckCircle2, ArrowRight
} from 'lucide-react';
import { localState } from '../services/api';
import { ProcurementCentre } from '../types';

export const AdminDashboard: React.FC = () => {
  const [centresList, setCentresList] = useState<ProcurementCentre[]>([]);

  useEffect(() => {
    const sync = () => {
      setCentresList([...localState.centres]);
    };
    sync();
    const unsubscribe = localState.subscribe(sync);
    return unsubscribe;
  }, []);

  // Recharts Seed Data
  const dailyVolumeData = [
    { date: '22 Aug', Paddy: 4200, Wheat: 3100, Cotton: 1200 },
    { date: '23 Aug', Paddy: 4800, Wheat: 3400, Cotton: 1400 },
    { date: '24 Aug', Paddy: 5100, Wheat: 2900, Cotton: 1600 },
    { date: '25 Aug', Paddy: 5600, Wheat: 3800, Cotton: 1800 },
    { date: '26 Aug', Paddy: 6200, Wheat: 4100, Cotton: 2100 },
    { date: '27 Aug', Paddy: 6900, Wheat: 4500, Cotton: 2400 },
    { date: '28 Aug', Paddy: 7400, Wheat: 4900, Cotton: 2600 }
  ];

  const centreQueueData = centresList.map(c => ({
    name: c.name.split(' ')[0],
    Queue: c.current_queue || 14,
    Capacity: c.daily_capacity
  }));

  const paymentData = [
    { name: 'Paid (DBT)', value: 68, color: '#16a34a' },
    { name: 'Processing', value: 24, color: '#9333ea' },
    { name: 'Pending', value: 8, color: '#f59e0b' }
  ];

  const cropData = [
    { name: 'Paddy', value: 48, color: '#15803d' },
    { name: 'Wheat', value: 26, color: '#d97706' },
    { name: 'Cotton', value: 14, color: '#2563eb' },
    { name: 'Maize', value: 8, color: '#ca8a04' },
    { name: 'Groundnut', value: 4, color: '#7c3aed' }
  ];

  const overloadedCentres = centresList.filter(c => (c.utilization_percent || 0) >= 85);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-amber-900/60 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>State Agriculture Governance Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Ministry of Consumer Affairs & Public Distribution</h1>
          <p className="text-xs text-slate-400">Real-Time State Procurement Operations & Analytics Matrix</p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-800 p-3 rounded-2xl border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-bold text-emerald-300">Live AI Analytics Active</span>
        </div>
      </div>

      {/* Overload Alert Banner */}
      {overloadedCentres.length > 0 && (
        <div className="bg-amber-500/10 border-2 border-amber-500/50 p-4 rounded-2xl flex items-center justify-between text-xs text-amber-900 shadow">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-extrabold uppercase text-amber-700">Capacity Warning:</span>
              <p className="font-medium">
                {overloadedCentres.map(c => c.name).join(', ')} is approaching maximum daily capacity ({overloadedCentres[0]?.utilization_percent}%).
              </p>
            </div>
          </div>
          <button
            onClick={() => alert(`Redirecting new slot bookings to nearest low-load centre (Tenali Centre).`)}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl transition shadow flex-shrink-0"
          >
            Activate Smart Rerouting
          </button>
        </div>
      )}

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Total Farmers</div>
          <div className="text-2xl font-black text-slate-900">12,845</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Today's Bookings</div>
          <div className="text-2xl font-black text-emerald-700">1,284</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Procurement Done</div>
          <div className="text-2xl font-black text-blue-700">932 T</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Pending Payments</div>
          <div className="text-2xl font-black text-purple-700">₹24.8 Lakh</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Avg Wait Time</div>
          <div className="text-2xl font-black text-amber-600">32 min</div>
        </div>
      </div>

      {/* Key Innovation Display Panel (Requirement #35) */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 rounded-3xl border border-emerald-700/50 shadow-lg space-y-4">
        <div className="flex items-center space-x-2 border-b border-emerald-800 pb-3">
          <Zap className="w-5 h-5 text-amber-300" />
          <h2 className="text-base font-extrabold uppercase tracking-wide text-amber-300">
            Intelligent Automation Engine Status
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-800">
            <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Centre Load</span>
            <span className="text-sm font-bold text-white mt-1 block">🟢 Balanced (74%)</span>
          </div>

          <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-800">
            <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Queue Prediction</span>
            <span className="text-sm font-bold text-white mt-1 block">4.2 min / farmer</span>
          </div>

          <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-800">
            <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Smart Recommendation</span>
            <span className="text-sm font-bold text-white mt-1 block">Guntur AP Yard</span>
          </div>

          <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-800">
            <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Capacity Forecast</span>
            <span className="text-sm font-bold text-white mt-1 block">92% at 3:00 PM</span>
          </div>

          <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-800">
            <span className="text-emerald-300 font-semibold block text-[10px] uppercase">Automated Alerts</span>
            <span className="text-sm font-bold text-white mt-1 block">0 Overcrowd Errors</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Daily Volume */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Daily Procurement Volume (Quintals)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Paddy" fill="#15803d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Wheat" fill="#d97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cotton" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Centre Queue Length */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Centre-wise Active Queue Length</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centreQueueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Queue" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Payment Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Payment Status Distribution (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Crop Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Crop Produce Distribution (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cropData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {cropData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Centre Management Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 className="font-extrabold text-slate-900 text-lg flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>State Procurement Centre Management Matrix</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500">5 Operational Depots</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Centre Name</th>
                <th className="p-3.5">District</th>
                <th className="p-3.5 text-right">Daily Capacity</th>
                <th className="p-3.5 text-right">Booked</th>
                <th className="p-3.5 text-right">Current Queue</th>
                <th className="p-3.5 text-right">Utilization %</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {centresList.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                  <td className="p-3.5 font-medium">{c.district}</td>
                  <td className="p-3.5 text-right font-semibold">{c.daily_capacity}</td>
                  <td className="p-3.5 text-right font-bold text-slate-900">{c.booked_slots || 300}</td>
                  <td className="p-3.5 text-right font-black text-amber-700">{c.current_queue || 14}</td>
                  <td className="p-3.5 text-right font-bold">{c.utilization_percent || 74}%</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold ${
                        c.status === 'OVERLOADED'
                          ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                          : c.status === 'HIGH_LOAD'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {c.status === 'OVERLOADED' ? '🔴 Overloaded' : c.status === 'HIGH_LOAD' ? '🟡 High Load' : '🟢 Normal'}
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
