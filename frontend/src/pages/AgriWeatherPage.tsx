import React from 'react';
import { AgriWeatherAdvisor } from '../components/AgriWeatherAdvisor';
import { useLanguage } from '../context/LanguageContext';

export const AgriWeatherPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          IMD Agromet Weather Integration
        </span>
        <h1 className="text-3xl font-black text-slate-900">Crop Delivery & Weather Forecast</h1>
        <p className="text-xs text-slate-500">{t('govt_title')}</p>
      </div>

      {/* Main Weather Component */}
      <AgriWeatherAdvisor />
    </div>
  );
};

export default AgriWeatherPage;
