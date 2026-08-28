import React, { useState, useEffect } from 'react';
import { Smartphone, X, Bell, CheckCircle2 } from 'lucide-react';
import { Notification } from '../types';
import { localState } from '../services/api';

export const DemoSMSModal: React.FC = () => {
  const [activeSMS, setActiveSMS] = useState<Notification | null>(null);

  useEffect(() => {
    const checkSMS = () => {
      if (localState.lastSMS) {
        setActiveSMS(localState.lastSMS);
        // Clear reference after showing
        const sms = localState.lastSMS;
        localState.lastSMS = null;
        // Auto hide after 8s
        setTimeout(() => {
          setActiveSMS(prev => (prev === sms ? null : prev));
        }, 8000);
      }
    };

    const unsubscribe = localState.subscribe(checkSMS);
    return unsubscribe;
  }, []);

  if (!activeSMS) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border-2 border-emerald-500/50 backdrop-blur-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/30 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Demo SMS Notification</span>
              <p className="text-[10px] text-slate-400">Govt. Procurement Gateway (mSeva)</p>
            </div>
          </div>
          <button
            onClick={() => setActiveSMS(null)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close SMS notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm font-semibold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{activeSMS.title}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 font-mono">
            "{activeSMS.message}"
          </p>
          <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400">
            <span>Sent to: +91 98765 43210</span>
            <span>Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};
