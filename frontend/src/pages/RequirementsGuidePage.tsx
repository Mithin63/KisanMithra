import React from 'react';
import { ProcurementRequirementsGuide } from '../components/ProcurementRequirementsGuide';
import { useLanguage } from '../context/LanguageContext';

export const RequirementsGuidePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Official Farmer Advisory
        </span>
        <h1 className="text-3xl font-black text-slate-900">Procurement Center Requirements & Checklist</h1>
        <p className="text-xs text-slate-500">{t('govt_title')}</p>
      </div>

      {/* Main Guide Component */}
      <ProcurementRequirementsGuide />
    </div>
  );
};

export default RequirementsGuidePage;
