import React from 'react';
import { CheckCircle2, User, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

interface QueueVisualizerProps {
  nowServing: number;
  userToken: number;
  farmersAhead: number;
  estimatedWaitMins: number;
}

export const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
  nowServing,
  userToken,
  farmersAhead,
  estimatedWaitMins
}) => {

  // Generate tokens pipeline surrounding current serving & user token
  const startToken = Math.max(101, nowServing - 2);
  const endToken = Math.max(userToken + 1, nowServing + 5);
  const tokensList: number[] = [];

  for (let t = startToken; t <= endToken; t++) {
    tokensList.push(t);
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 space-y-6">
      
      {/* Live Queue Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Now Serving</div>
          <div className="text-3xl font-black text-emerald-700 mt-1 flex items-center justify-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block mr-1"></span>
            #{nowServing}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">At Counter 1</div>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Your Token</div>
          <div className="text-3xl font-black text-amber-700 mt-1">#{userToken}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-1">Slot: 10:30 – 11:00 AM</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Farmers Ahead</div>
          <div className="text-3xl font-black text-blue-700 mt-1">{farmersAhead}</div>
          <div className="text-[10px] text-blue-600 font-medium mt-1">In Queue Line</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">AI Est. Wait</div>
          <div className="text-3xl font-black text-purple-700 mt-1">{estimatedWaitMins} <span className="text-sm">min</span></div>
          <div className="text-[10px] text-purple-600 font-medium mt-1">Automated Algorithm</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
          <span>Queue Progress</span>
          <span>{farmersAhead === 0 ? 'Your turn is now!' : `${farmersAhead} farmers ahead`}</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(10, 100 - (farmersAhead * 6)))}%` }}
          ></div>
        </div>
      </div>

      {/* Pipeline Tokens horizontal scroll */}
      <div>
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Live Queue Token Flow</span>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
            🟢 Dynamic Live Sync
          </span>
        </div>

        <div className="flex items-center space-x-3 overflow-x-auto pb-4 pt-2 px-1">
          {tokensList.map((t, idx) => {
            const isCompleted = t < nowServing;
            const isServing = t === nowServing;
            const isUser = t === userToken;

            return (
              <React.Fragment key={t}>
                <div
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border-2 transition-all ${
                    isServing
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg scale-105 pulse-glow'
                      : isUser
                      ? 'bg-amber-500 text-white border-amber-400 shadow-md ring-4 ring-amber-200'
                      : isCompleted
                      ? 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60'
                      : 'bg-slate-50 text-slate-700 border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-semibold uppercase">
                    {isServing ? 'Serving' : isUser ? 'YOU' : isCompleted ? 'Done' : 'Wait'}
                  </span>
                  <span className="text-base font-black">#{t}</span>
                  {isServing && <span className="text-[9px] bg-emerald-700 px-1 rounded mt-0.5">Counter 1</span>}
                </div>
                {idx < tokensList.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
