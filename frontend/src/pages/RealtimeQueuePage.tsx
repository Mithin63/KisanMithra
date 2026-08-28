import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RefreshCw, Zap, ShieldCheck, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
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

  const userToken = 127;
  const farmersAhead = Math.max(0, userToken - nowServing);
  const avgProcessingMins = 4;
  const estimatedWaitMins = farmersAhead * avgProcessingMins;

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

      {/* Main Visualizer */}
      <QueueVisualizer
        nowServing={nowServing}
        userToken={userToken}
        farmersAhead={farmersAhead}
        estimatedWaitMins={estimatedWaitMins}
      />

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
