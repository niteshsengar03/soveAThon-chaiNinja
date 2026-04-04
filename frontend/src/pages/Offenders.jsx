import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const offenders = [
  {
    id: 220451,
    name: 'Alex Rivera',
    room: 'B-402',
    offenses: 4,
    severity: 'High',
    incidentDate: 'Oct 24, 2023',
    repeated: true,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Alex',
  },
  {
    id: 220192,
    name: 'Sarah Jenkins',
    room: 'A-108',
    offenses: 2,
    severity: 'Medium',
    incidentDate: 'Nov 02, 2023',
    repeated: false,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Sarah',
  },
  {
    id: 220554,
    name: 'Mark Thompson',
    room: 'C-221',
    offenses: 3,
    severity: 'Low',
    incidentDate: 'Nov 12, 2023',
    repeated: true,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Mark',
  },
  {
    id: 220081,
    name: 'Maya Chen',
    room: 'B-305',
    offenses: 1,
    severity: 'High',
    incidentDate: 'Nov 15, 2023',
    repeated: false,
    avatar: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Maya',
  },
];

const caseFilters = ['All Cases', 'High Severity', 'Medium', 'Low'];

const severityChipClass = {
  High: 'bg-red-200/80 text-red-700',
  Medium: 'bg-indigo-200/80 text-indigo-700',
  Low: 'bg-slate-200 text-slate-600',
};

const Offenders = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          searchPlaceholder="Search records..."
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
            <section className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 pt-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-slate-800">Offenders List</h1>
                <p className="text-slate-500 text-sm md:text-base max-w-xl">
                  Maintain disciplinary standards and track incident reports across all hostel blocks.
                </p>
              </div>

              <div className="bg-slate-200/70 border border-slate-200 rounded-full p-1 flex flex-wrap gap-1 w-fit">
                {caseFilters.map((item, idx) => (
                  <button
                    key={item}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      idx === 0
                        ? 'bg-white text-slate-700 shadow-sm'
                        : 'text-slate-500 hover:bg-white/70'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
              <article className="xl:col-span-3 bg-panel border border-panel-border rounded-2xl p-5 shadow-card">
                <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">Total Incidents</p>
                <p className="mt-2 text-5xl font-extrabold tracking-[-0.03em] text-slate-800">42</p>
                <p className="mt-1 text-xs font-semibold text-red-500">↗ +12% this month</p>
              </article>

              <article className="xl:col-span-3 bg-panel border border-panel-border rounded-2xl p-5 shadow-card">
                <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">Repeat Offenders</p>
                <p className="mt-2 text-5xl font-extrabold tracking-[-0.03em] text-slate-800">08</p>
                <div className="mt-3 flex items-center -space-x-2">
                  <img
                    src="https://api.dicebear.com/8.x/adventurer/svg?seed=R1"
                    alt="Offender"
                    className="w-6 h-6 rounded-full border-2 border-panel"
                  />
                  <img
                    src="https://api.dicebear.com/8.x/adventurer/svg?seed=R2"
                    alt="Offender"
                    className="w-6 h-6 rounded-full border-2 border-panel"
                  />
                  <img
                    src="https://api.dicebear.com/8.x/adventurer/svg?seed=R3"
                    alt="Offender"
                    className="w-6 h-6 rounded-full border-2 border-panel"
                  />
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-[10px] font-semibold text-slate-500 inline-flex items-center justify-center border-2 border-panel">
                    +5
                  </span>
                </div>
              </article>

              <article className="xl:col-span-6 bg-panel border border-panel-border rounded-2xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">Critical Attention</p>
                  <p className="mt-2 text-3xl font-bold leading-tight text-red-600">3 Cases pending</p>
                  <p className="text-3xl font-bold leading-tight text-red-700">Dean's review</p>
                </div>
                <button className="px-5 py-2.5 rounded-lg bg-slate-600 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
                  Review Queue
                </button>
              </article>
            </section>

            <section className="bg-panel rounded-2xl border border-panel-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead className="text-[11px] uppercase tracking-[0.22em] text-slate-500 border-b border-slate-200/80">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold">Student</th>
                      <th className="text-left px-4 py-4 font-semibold">Room</th>
                      <th className="text-left px-4 py-4 font-semibold">Offenses</th>
                      <th className="text-left px-4 py-4 font-semibold">Severity</th>
                      <th className="text-left px-4 py-4 font-semibold">Last Incident</th>
                      <th className="text-left px-4 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offenders.map((offender) => (
                      <tr key={offender.id} className="border-b border-slate-200/70 text-slate-700 hover:bg-slate-100/70 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <img src={offender.avatar} alt={offender.name} className="w-9 h-9 rounded-full bg-slate-200" />
                            <div>
                              <p className="font-semibold text-slate-800">{offender.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {offender.repeated && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-200/80 text-red-700">
                                    REPEAT
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-500">ID: {offender.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-slate-600">{offender.room}</td>
                        <td className="px-4 py-5">
                          <span className="text-xl font-bold tracking-tight text-slate-800">{offender.offenses}</span>
                        </td>
                        <td className="px-4 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${severityChipClass[offender.severity]}`}
                          >
                            • {offender.severity}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-slate-500">{offender.incidentDate}</td>
                        <td className="px-4 py-5">
                          <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-6 py-4 text-xs text-slate-500">
                <p>Showing 1-4 of 42 offenders</p>
                <div className="flex items-center gap-3">
                  <button className="w-6 h-6 rounded-md hover:bg-slate-200 text-slate-500 inline-flex items-center justify-center">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-6 h-6 rounded-md hover:bg-slate-200 text-slate-500 inline-flex items-center justify-center">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-panel rounded-2xl border border-panel-border px-5 py-4 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-slate-200/90 inline-flex items-center justify-center text-slate-500">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-700">AI Insights</p>
                  <p className="text-xs text-slate-500">Hostel Block B accounts for 45% of current high-severity incidents.</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-slate-600 hover:text-slate-800 inline-flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                View Block Analysis
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Offenders;
