import React from 'react';
import { Sparkles, MapPin, Users, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { RecommendationResult } from '../types';

interface CentreRecommendationCardProps {
  recommendation: RecommendationResult;
  isBest?: boolean;
  onSelect: (centreId: number) => void;
}

export const CentreRecommendationCard: React.FC<CentreRecommendationCardProps> = ({
  recommendation,
  isBest = false,
  onSelect
}) => {
  const { centre, distanceKm, estimatedWaitMins, availableSlots, score, reasons } = recommendation;

  return (
    <div
      className={`rounded-2xl p-5 border-2 transition-all relative overflow-hidden ${
        isBest
          ? 'bg-gradient-to-br from-emerald-50 via-white to-green-50/50 border-emerald-500 shadow-md ring-2 ring-emerald-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {isBest && (
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-bl-xl flex items-center space-x-1 shadow">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Recommended Choice</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base">{centre.name}</h3>
          <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>{centre.address}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-emerald-700">{score}</span>
          <span className="text-[10px] text-slate-400 block font-medium">Match Score</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 my-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Distance</span>
          <span className="text-sm font-bold text-slate-800">{distanceKm} km</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Available Slots</span>
          <span className={`text-sm font-bold ${availableSlots < 50 ? 'text-amber-600' : 'text-emerald-700'}`}>
            {availableSlots} / {centre.daily_capacity}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Est. Wait Time</span>
          <span className="text-sm font-bold text-purple-700">{estimatedWaitMins} mins</span>
        </div>
      </div>

      {/* Recommendation Reasons */}
      <div className="space-y-1.5 mb-4">
        {reasons.map((reason, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
            <span>{reason}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSelect(centre.id)}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
          isBest
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
            : 'bg-slate-900 hover:bg-slate-800 text-white'
        }`}
      >
        <span>Select {centre.name.split(' ')[0]} Centre</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
