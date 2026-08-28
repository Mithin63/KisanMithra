import React, { useState, useEffect } from 'react';
import { Bell, Smartphone, CheckCircle2, Calendar, Clock, CheckSquare, CreditCard, Shield, Filter } from 'lucide-react';
import { localState } from '../services/api';
import { Notification, NotificationType } from '../types';

export const NotificationsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [notificationsList, setNotificationsList] = useState<Notification[]>([]);

  useEffect(() => {
    const sync = () => {
      setNotificationsList([...localState.notifications]);
    };
    sync();
    const unsubscribe = localState.subscribe(sync);
    return unsubscribe;
  }, []);

  const filtered = activeCategory === 'ALL'
    ? notificationsList
    : notificationsList.filter(n => n.type === activeCategory);

  const categories = [
    { key: 'ALL', label: 'All Notifications' },
    { key: 'BOOKING', label: 'Booking' },
    { key: 'QUEUE', label: 'Queue Updates' },
    { key: 'PROCUREMENT', label: 'Procurement' },
    { key: 'PAYMENT', label: 'Payments' },
    { key: 'SYSTEM', label: 'System' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Smart Notification Center
        </span>
        <h1 className="text-3xl font-black text-slate-900">SMS & App Alerts</h1>
        <p className="text-xs text-slate-500">Ministry of Consumer Affairs, Food & Public Distribution</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-slate-200 pb-4">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeCategory === cat.key
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.map(notif => (
          <div
            key={notif.id}
            className={`p-5 rounded-2xl border transition shadow-sm flex items-start space-x-4 ${
              !notif.read ? 'bg-emerald-50/60 border-emerald-300' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold">
              <Smartphone className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">{notif.title}</span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-slate-900 text-amber-300 rounded font-mono">
                    Demo SMS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">{notif.created_at.slice(11,16)}</span>
              </div>
              
              <p className="text-xs text-slate-700 leading-relaxed font-mono bg-slate-100/80 p-3 rounded-xl border border-slate-200">
                "{notif.message}"
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
