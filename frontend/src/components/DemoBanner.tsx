import React, { useState, useEffect } from 'react';
import { Play, FastForward, UserCheck, ShieldCheck, RefreshCw, Zap, BellRing } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { localState } from '../services/api';

export const DemoBanner: React.FC = () => {
  const { role, switchRole, demoMode, toggleDemoMode } = useAuth();
  const { t } = useLanguage();
  const [autoSimulating, setAutoSimulating] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoSimulating) {
      interval = setInterval(() => {
        localState.advanceQueue();
      }, 10000); // Advances queue every 10 seconds
    }
    return () => clearInterval(interval);
  }, [autoSimulating]);

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs px-4 py-2 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hackathon presentation title */}
        <div className="flex items-center space-x-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] animate-pulse">
            ⚡
          </span>
          <span className="font-bold tracking-wide uppercase text-emerald-400">{t('presentation_panel')}</span>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-900/60 text-emerald-300 rounded text-[10px] border border-emerald-700/50">
            {t('live_simulation')}
          </span>
        </div>

        {/* Center: Presentation controls */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => localState.advanceQueue()}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-md transition font-medium shadow"
            title="Advances current queue token by 1"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{t('advance_queue')}</span>
          </button>

          <button
            onClick={() => setAutoSimulating(!autoSimulating)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition font-medium shadow border ${
              autoSimulating
                ? 'bg-amber-600 border-amber-500 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {autoSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoSimulating ? t('auto_simulating') : t('start_simulation')}</span>
          </button>
        </div>

        {/* Right: Quick Role Switcher */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <span className="text-[10px] text-slate-400 px-1 font-semibold">{t('switch_view')}:</span>
          <button
            onClick={() => switchRole('FARMER')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              role === 'FARMER' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('tab_farmer')}
          </button>
          <button
            onClick={() => switchRole('OFFICER')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              role === 'OFFICER' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('tab_officer')}
          </button>
          <button
            onClick={() => switchRole('ADMIN')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              role === 'ADMIN' ? 'bg-amber-600 text-white font-bold shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('tab_admin')}
          </button>
        </div>
      </div>
    </div>
  );
};
