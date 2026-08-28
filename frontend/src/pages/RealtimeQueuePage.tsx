import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RefreshCw, Zap, ShieldCheck, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { localState } from '../services/api';
import { QueueVisualizer } from '../components/QueueVisualizer';
import { useAuth } from '../context/AuthContext';

export const RealtimeQueuePage: React.FC = () => {
  const { user } = useAuth();
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
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Live Procurement Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Guntur Agricultural Procurement Centre</h1>
          <p className="text-xs text-slate-400">Active Counters: 5 • Operating Hours: 08:00 AM – 05:00 PM</p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center space-x-3 bg-slate-800 p-2.5 rounded-2xl border border-slate-700">
          <span className="text-xs font-semibold text-slate-300">Live Simulation:</span>
          <button
            onClick={() => setAutoAdvance(!autoAdvance)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              autoAdvance
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {autoAdvance ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoAdvance ? 'Auto Tick (12s)' : 'Paused'}</span>
          </button>

          <button
            onClick={() => localState.advanceQueue()}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow"
          >
            +1 Step Now
          </button>
        </div>
      </div>

      {/* Main Interactive Queue Visualizer */}
      <QueueVisualizer
        nowServing={nowServing}
        userToken={userToken}
        farmersAhead={farmersAhead}
        estimatedWaitMins={estimatedWaitMins}
      />

      {/* Smart Waiting-Time Algorithm Explanation Card */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-green-50 p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">AI & Automated Queue Estimation Algorithm</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Formula</span>
            <p className="font-mono text-emerald-800 font-bold text-xs">
              estimated_wait = (farmers_ahead × avg_processing) / active_counters
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Current Factors</span>
            <p className="text-slate-700 font-medium">
              13 farmers ahead × 4 mins / 5 counters = ~45 mins
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Smart Dispatch</span>
            <p className="text-slate-700 font-medium">
              Automatically alerts farmer via SMS when queue position &lt; 5.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
