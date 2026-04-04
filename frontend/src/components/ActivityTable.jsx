import React from 'react';
import { RefreshCw, MapPin, Clock } from 'lucide-react';

const ActivityTable = ({ logs }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-50 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-xl">
            <MapPin className="w-6 h-6 text-blue-500 fill-blue-100/50 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Live Movement Activity</h2>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest pl-3 pr-1 py-2 rounded-lg hover:bg-slate-50 group">
          Refresh Logs
          <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <th className="text-left pb-4 pl-4 font-black">STUDENT NAME</th>
              <th className="text-left pb-4 font-black pl-8">ROOM</th>
              <th className="text-left pb-4 font-black pl-8">TIME</th>
              <th className="text-center pb-4 pr-4 font-black">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {logs.map((log) => (
              <tr key={log.id} className="group hover:bg-slate-50/80 transition-colors">
                <td className="py-5 pl-4">
                  <div className="flex items-center gap-4">
                    <img src={log.avatar} alt={log.name} className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-slate-800 tracking-tight">{log.name}</span>
                  </div>
                </td>
                <td className="py-5 pl-8 text-sm font-bold text-slate-700 tracking-tight">{log.room}</td>
                <td className="py-5 pl-8 text-sm font-bold text-slate-500 flex items-center gap-2">
                  <Clock className="w-3 h-3 text-slate-300" />
                  {log.time}
                </td>
                <td className="py-5 text-center pr-4">
                  <span className={`inline-flex items-center justify-center min-w-[50px] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border-2 shadow-sm ${
                    log.status === 'IN' 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
