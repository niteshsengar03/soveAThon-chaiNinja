import React, { useState } from 'react';
import { MessageSquare, AlertCircle, ChevronDown } from 'lucide-react';

const ComplaintsPanel = ({ complaints: allComplaints }) => {
  const [activeTab, setActiveTab] = useState('roommate');

  const complaints = {
    roommate: allComplaints.filter(c => c.type === 'roommate'),
    infra: allComplaints.filter(c => c.type === 'infra'),
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-50 space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="bg-orange-50 p-2 rounded-xl">
          <MessageSquare className="w-6 h-6 text-orange-500 fill-orange-100/50 stroke-[2.5]" />
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Complaints Overview</h2>
      </div>

      <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 transform transition-all group-hover:scale-[1.02]">
        <button
          onClick={() => setActiveTab('roommate')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
            activeTab === 'roommate' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Roommate (08)
        </button>
        <button
          onClick={() => setActiveTab('infra')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
            activeTab === 'infra' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Infra (04)
        </button>
      </div>

      <div className="space-y-4 pt-2">
        {complaints[activeTab].map((complaint) => (
          <div key={complaint.id} className="p-6 bg-slate-50/50 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100/50 group">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-none truncate">
                {complaint.title}
              </h3>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border transition-all ${
                complaint.status === 'New' 
                  ? 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100 group-hover:scale-105' 
                  : 'bg-slate-200/50 text-slate-500 border-slate-200'
              }`}>
                {complaint.status}
              </span>
            </div>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
              {complaint.description}
            </p>
          </div>
        ))}
      </div>

      <button className="w-full mt-2 py-4 px-6 flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-slate-900 border-2 border-dashed border-slate-200 hover:border-slate-400/50 rounded-3xl transition-all">
        View All Complaints
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ComplaintsPanel;
