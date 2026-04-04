import React from 'react';
import { Bell, Plus, MoreHorizontal, Calendar } from 'lucide-react';

const NoticesPanel = ({ notices }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-50 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 p-2 rounded-xl">
            <Bell className="w-6 h-6 text-purple-500 fill-purple-100/50 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Notices</h2>
        </div>
        <button className="p-2.5 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      <div className="space-y-4 pt-2">
        {notices.map((notice) => (
          <div key={notice.id} className="group p-6 bg-slate-50/50 rounded-[2.5rem] hover:bg-white transition-all border border-transparent shadow-sm hover:shadow-soft hover:border-slate-100/50 flex items-start gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:scale-110 flex flex-col items-center justify-center min-w-[65px] min-h-[65px] shrink-0">
              <span className="text-sm font-black tracking-tight leading-none text-center">
                {notice.date.split(' ')[0]}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-300 pt-1 leading-none text-center">
                {notice.date.split(' ')[1]}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform">
                {notice.title}
              </h3>
              <p className="text-[12px] text-slate-400 font-medium leading-relaxed pt-1">
                {notice.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-slate-700 hover:bg-slate-800 text-white p-5 rounded-[2.5rem] font-black text-[11px] tracking-[0.2em] uppercase transition-all shadow-lg shadow-slate-200/50 flex items-center justify-center gap-3 active:scale-95 group overflow-hidden relative">
        <span className="relative z-10 flex items-center gap-2">
          <Plus className="w-4 h-4 stroke-[3]" />
          Create Notice
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      </button>
    </div>
  );
};

export default NoticesPanel;
