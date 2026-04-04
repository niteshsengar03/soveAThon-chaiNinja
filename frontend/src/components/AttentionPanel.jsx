import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';

const AttentionPanel = ({ alerts }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-50 space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-red-50 p-2 rounded-xl">
          <AlertCircle className="w-6 h-6 text-red-500 fill-red-100/50 stroke-[2.5]" />
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Attention Needed</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-6 rounded-[2rem] border-l-[6px] ${alert.borderColor} ${alert.bgColor} flex flex-col justify-between items-start space-y-3 transition-transform hover:scale-105 active:scale-95 cursor-default min-h-[140px]`}
          >
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight pr-2">
                {alert.title}
              </h3>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed pt-2">
                {alert.description}
              </p>
            </div>
            <button className="flex items-center gap-1 text-[13px] font-bold text-slate-900/60 hover:text-slate-900 transition-all underline decoration-2 underline-offset-4 group">
              {alert.linkText}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttentionPanel;
