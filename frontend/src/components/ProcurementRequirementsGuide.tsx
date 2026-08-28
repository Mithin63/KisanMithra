import React, { useState } from 'react';
import {
  ClipboardCheck, FileText, CheckCircle2, AlertCircle, ShieldAlert,
  Scale, Smartphone, CreditCard, Award, ArrowRight, UserCheck, CheckSquare,
  Sparkles, HelpCircle, Package, Truck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ProcurementRequirementsGuide: React.FC = () => {
  const { t } = useLanguage();

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'doc_aadhaar': true,
    'doc_token': true,
    'doc_bank': true,
    'doc_land': true,
    'quality_moisture': false,
    'quality_cleaning': false,
    'pkg_gunny': false,
    'transport_rc': false
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalItems = Object.keys(checkedItems).length;
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const readinessPercent = Math.round((completedItems / totalItems) * 100);

  const documentRequirements = [
    {
      id: 'doc_token',
      title: 'Digital Token / Appointment Pass',
      desc: 'Digital QR Pass on mobile or printed token slip showing appointment date, time slot, and vehicle number.',
      mandatory: true,
      category: 'Identity & Pass'
    },
    {
      id: 'doc_aadhaar',
      title: 'Original Aadhaar Card & Xerox Copy',
      desc: 'Government identity proof of the registered farmer matching the land record.',
      mandatory: true,
      category: 'Identity & Pass'
    },
    {
      id: 'doc_bank',
      title: 'Bank Passbook / Cancelled Cheque',
      desc: 'Aadhaar-seeded bank account details for direct payment transfer (Direct Benefit Transfer - DBT).',
      mandatory: true,
      category: 'Financial'
    },
    {
      id: 'doc_land',
      title: 'Pattadar Passbook / Land Record (RoR 1-B)',
      desc: 'e-Panta / e-Crop cultivation confirmation or revenue officer certificate validating acreage and crop.',
      mandatory: true,
      category: 'Land & Sowing'
    }
  ];

  const produceQualityStandards = [
    {
      id: 'quality_moisture',
      crop: 'Paddy / Rice',
      maxMoisture: '14.0% - 17.0%',
      foreignMatter: 'Max 1.0%',
      desc: 'Grains must be clean, mature, and dried below 17% (Grade A: below 14% for maximum price).'
    },
    {
      id: 'quality_maize',
      crop: 'Maize (Corn)',
      maxMoisture: '14.0%',
      foreignMatter: 'Max 1.5%',
      desc: 'Kernels must be free from mold, fungus, and pest infestation.'
    },
    {
      id: 'quality_pulses',
      crop: 'Pulses (Blackgram, Greengram, Redgram)',
      maxMoisture: '12.0%',
      foreignMatter: 'Max 1.0%',
      desc: 'Uniform seed size with less than 3% damaged/shriveled pulses.'
    },
    {
      id: 'quality_cotton',
      crop: 'Cotton (Kapas)',
      maxMoisture: '8.0% - 12.0%',
      foreignMatter: 'Max 2.0%',
      desc: 'Staple length standard with minimal yellow stain or dust.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Procurement Centre Gate Arrival & Readiness Checklist</h2>
          </div>
          <p className="text-xs text-slate-500">
            Mandatory documents, quality guidelines, and preparation required before arriving at the yard.
          </p>
        </div>

        {/* Readiness Meter */}
        <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center space-x-4 shadow-lg">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Readiness Meter</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{readinessPercent}% Ready</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
            <span className="text-xs font-bold">{completedItems}/{totalItems}</span>
          </div>
        </div>
      </div>

      {/* Section 1: Mandatory Documents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>1. Mandatory Documents to Carry (Keep in Hand)</span>
          </h3>
          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
            4 Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentRequirements.map((doc) => (
            <div
              key={doc.id}
              onClick={() => toggleCheck(doc.id)}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start space-x-3.5 ${
                checkedItems[doc.id]
                  ? 'bg-emerald-50/60 border-emerald-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={checkedItems[doc.id] || false}
                onChange={() => toggleCheck(doc.id)}
                className="w-5 h-5 text-emerald-600 rounded mt-0.5 focus:ring-emerald-500 cursor-pointer"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-900 text-xs">{doc.title}</h4>
                  {doc.mandatory && (
                    <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                      Mandatory
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Quality & Moisture Threshold Standards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>2. Produce Quality & Moisture Standards (Fair Average Quality - FAQ)</span>
          </h3>
          <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full font-bold border border-blue-200">
            Govt. FAQ Norms
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Crop Commodity</th>
                <th className="py-3 px-4">Max Moisture Permitted</th>
                <th className="py-3 px-4">Foreign Matter / Dust</th>
                <th className="py-3 px-4">Quality Preparation Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {produceQualityStandards.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{item.crop}</td>
                  <td className="py-3 px-4 font-black text-emerald-700">{item.maxMoisture}</td>
                  <td className="py-3 px-4 text-slate-600">{item.foreignMatter}</td>
                  <td className="py-3 px-4 text-slate-600">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Transport & Physical Preparation Checklist */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
          <Truck className="w-4 h-4 text-purple-600" />
          <span>3. Physical Packaging & Vehicle Checklist</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => toggleCheck('pkg_gunny')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start space-x-3.5 ${
              checkedItems['pkg_gunny']
                ? 'bg-purple-50/60 border-purple-500 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems['pkg_gunny'] || false}
              onChange={() => toggleCheck('pkg_gunny')}
              className="w-5 h-5 text-purple-600 rounded mt-0.5 focus:ring-purple-500 cursor-pointer"
            />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs">Clean Standard 50kg Gunny Bags or Loose Trolley</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Ensure gunny bags are undamaged, free of chemical stains, and properly stitched. Open tractor trolleys must have side planks secured.
              </p>
            </div>
          </div>

          <div
            onClick={() => toggleCheck('transport_rc')}
            className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start space-x-3.5 ${
              checkedItems['transport_rc']
                ? 'bg-purple-50/60 border-purple-500 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems['transport_rc'] || false}
              onChange={() => toggleCheck('transport_rc')}
              className="w-5 h-5 text-purple-600 rounded mt-0.5 focus:ring-purple-500 cursor-pointer"
            />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs">Vehicle RC & Driver Mobile for Weighbridge Entry</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Weighbridge operator will log vehicle gross weight and tare weight automatically against your token number.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Instructions Banner */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Important Yard Entry Note:</span>
          <p className="leading-relaxed">
            Please arrive at the centre 15 minutes before your token window. Keep your digital QR code ready on your mobile screen. In case of any dispute in quality grading, you have the right to request a secondary test by the District Quality Assurance Officer.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ProcurementRequirementsGuide;
