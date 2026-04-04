import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import AttentionPanel from '../components/AttentionPanel';
import ActivityTable from '../components/ActivityTable';
import ComplaintsPanel from '../components/ComplaintsPanel';
import NoticesPanel from '../components/NoticesPanel';
import { stats, attentionAlerts, activityLogs, complaints, notices } from '../data/mockData';
import { ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-page min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main
          className="flex-1 transition-all pt-20 pb-12 px-4 sm:px-6 lg:px-10 ml-0 lg:ml-0 overflow-y-auto"
          onClick={() => {
            if (isSidebarOpen) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <div className="max-w-7xl mx-auto pt-10 pb-12 space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Main Admin Dashboard</h1>
            <p className="text-base text-slate-400 font-medium tracking-tight">Real-time management overview of Hostel Serenity ecosystem.</p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="mb-12">
              <AttentionPanel alerts={attentionAlerts} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
              <div className="lg:col-span-8">
                <ActivityTable logs={activityLogs} />
              </div>

              <div className="lg:col-span-4 space-y-8">
                <ComplaintsPanel complaints={Object.values(complaints).flat()} />
                <NoticesPanel notices={notices} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-4">
              <div className="lg:col-span-7 bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800')] bg-cover opacity-20 transition-transform duration-1000 group-hover:scale-110"></div>
                <div className="relative z-10 h-full flex flex-col justify-end space-y-3">
                  <h2 className="text-3xl font-black text-white tracking-tight leading-tight">Facility Health Check</h2>
                  <p className="text-slate-400 max-w-md text-sm font-bold leading-relaxed">
                    All systems operational. Next plumbing maintenance scheduled for Block B on Nov 5th.
                  </p>
                </div>
                <div className="absolute top-10 right-10">
                  <ShieldCheck className="w-12 h-12 text-slate-200 fill-slate-200/10 stroke-[2.5]" />
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-600 rounded-[3rem] p-10 flex flex-col justify-between group shadow-2xl shadow-slate-600/20 transition-all hover:translate-y-[-4px]">
                <div className="space-y-4">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">Student Feedback Summary</h2>
                  <p className="text-slate-300 text-sm font-bold opacity-80">Average Satisfaction Score: 4.8/5.0</p>
                </div>

                <div className="flex items-center gap-1 pt-6">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/150?u=${i + 10}`}
                      alt="Student"
                      className="w-10 h-10 rounded-2xl border-2 border-white/20 shadow-md transform transition-transform hover:scale-110"
                      style={{ marginLeft: i > 0 ? '-10px' : '0' }}
                    />
                  ))}
                  <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-black text-white border border-white/20 ml-[-10px] shadow-md">
                    +42
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
