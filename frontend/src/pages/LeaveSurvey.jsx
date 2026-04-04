import React, { useState } from 'react';
import {
  Download,
  Filter,
  Phone,
  Send,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const leaveRows = [
  {
    id: 1,
    name: 'Marcus Holloway',
    room: 'Room 402-B • Block A',
    status: 'Already Left',
    expectedReturn: 'Aug 15, 2024',
    returnMeta: '34 days remaining',
    phone: '+1 (555) 092-4122',
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Marcus',
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    room: 'Room 110-A • Block B',
    status: 'In Hostel',
    expectedReturn: '—',
    returnMeta: 'Staying for summer',
    phone: '+1 (555) 882-9010',
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=SarahJ',
  },
  {
    id: 3,
    name: 'Liam Porter',
    room: 'Room 305-C • Block C',
    status: 'Unresponsive',
    expectedReturn: 'Pending',
    returnMeta: 'Action required',
    phone: '+1 (555) 341-2993',
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=LiamP',
  },
  {
    id: 4,
    name: 'Chloe Simmons',
    room: 'Room 214-D • Block C',
    status: 'Already Left',
    expectedReturn: 'Aug 20, 2024',
    returnMeta: '39 days remaining',
    phone: '+1 (555) 765-1122',
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=ChloeS',
  },
];

const statusStyles = {
  'Already Left': 'bg-emerald-100 text-emerald-700',
  'In Hostel': 'bg-indigo-100 text-indigo-700',
  Unresponsive: 'bg-red-200 text-red-700',
};

const LeaveSurvey = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          searchPlaceholder="Search students or leave dates..."
          showActionButton={false}
        />

        <main
          className="flex-1 pt-24 pb-10 px-4 sm:px-6 lg:px-8 overflow-y-auto"
          onClick={() => {
            if (isSidebarOpen) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <div className="max-w-6xl mx-auto space-y-5">
            <section className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pt-4">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-[50px] font-extrabold tracking-[-0.03em] text-slate-800">Leave Survey Statistics</h1>
                <p className="text-slate-500 text-base">Summer Holiday Period: June 15 - August 20</p>
              </div>

              <div className="flex gap-2">
                <button className="px-5 py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold inline-flex items-center gap-2 hover:bg-slate-300 transition-colors">
                  <Download className="w-4 h-4" />
                  Export to CSV
                </button>
                <button className="px-5 py-3 rounded-xl bg-slate-600 text-white font-semibold inline-flex items-center gap-2 hover:bg-slate-700 transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                  Send Reminders
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <article className="bg-panel border border-panel-border rounded-2xl p-5 shadow-card">
                <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">Total Left</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-slate-800">412</p>
                <p className="mt-3 inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">↗ 82% of capacity</p>
              </article>

              <article className="bg-panel border border-panel-border rounded-2xl p-5 shadow-card">
                <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">Remaining</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-slate-800">88</p>
                <div className="mt-6 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full w-[24%] bg-slate-500 rounded-full" />
                </div>
              </article>

              <article className="bg-panel border border-panel-border rounded-2xl p-5 shadow-card flex items-center gap-4">
                <div className="relative w-[92px] h-[92px] rounded-full bg-[conic-gradient(#52627e_338deg,#d5dbe6_338deg)] p-[7px] shrink-0">
                  <div className="w-full h-full rounded-full bg-panel flex items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-800">94%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-slate-800">Survey Completion</h3>
                  <p className="text-slate-500 text-sm mt-1">470 of 500 students responded</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500" />Completed</span>
                    <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" />Pending</span>
                  </div>
                </div>
              </article>
            </section>

            <section className="bg-panel border border-panel-border rounded-2xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 md:px-6 py-5 border-b border-slate-200/70">
                <h2 className="text-3xl md:text-[38px] font-bold tracking-tight text-slate-800">Student Leave Register</h2>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-slate-200/90 text-slate-700 text-sm font-medium">All Blocks</button>
                  <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 inline-flex items-center justify-center">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[940px]">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-[0.2em] text-slate-500 border-b border-slate-200/70">
                      <th className="text-left px-6 py-4 font-semibold">Student Details</th>
                      <th className="text-left px-4 py-4 font-semibold">Status</th>
                      <th className="text-left px-4 py-4 font-semibold">Expected Return</th>
                      <th className="text-left px-4 py-4 font-semibold">Emergency Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRows.map((row) => (
                      <tr key={row.id} className="border-b border-slate-200/60 hover:bg-slate-100/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={row.avatar} alt={row.name} className="w-11 h-11 rounded-full bg-slate-200" />
                            <div>
                              <p className="font-bold text-slate-800 text-lg leading-tight">{row.name}</p>
                              <p className="text-sm text-slate-500">{row.room}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[row.status]}`}>{row.status}</span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-slate-800 font-medium">{row.expectedReturn}</p>
                          <p className={`text-xs uppercase ${row.status === 'Unresponsive' ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>{row.returnMeta}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="inline-flex items-center gap-2 text-slate-700 font-medium">
                            <Phone className="w-4 h-4" />
                            {row.phone}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaveSurvey;
