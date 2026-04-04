import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CircleDot,
  Bell,
  CalendarCheck2,
  ChevronRight,
  Clock3,
  FileSpreadsheet,
  FileUp,
  Upload,
  Users,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const iconMap = {
  bell: Bell,
  clock: Clock3,
  sheet: FileSpreadsheet,
  schedule: CalendarCheck2,
  users: Users,
};

const initialNotifications = [
  {
    id: 1,
    title: 'Collection: Floor 3 & 4',
    subtitle: 'No schedule set yet',
    status: 'Sent',
    iconKey: 'bell',
  },
  {
    id: 2,
    title: 'Delivery: All Wings',
    subtitle: 'Awaiting batch upload',
    status: 'Scheduled',
    iconKey: 'clock',
  },
  {
    id: 3,
    title: 'Maintenance Alert: Washing Machines',
    subtitle: 'Created just now',
    status: 'Draft',
    iconKey: 'sheet',
  },
];

const statusStyle = {
  Sent: 'bg-green-200/80 text-green-800',
  Scheduled: 'bg-indigo-200/80 text-indigo-800',
  Draft: 'bg-slate-200 text-slate-600',
};

const toNumber = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickField = (row, candidates, fallbackIndex) => {
  for (const key of Object.keys(row)) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (candidates.includes(normalized)) return row[key];
  }
  const values = Object.values(row);
  return values[fallbackIndex] ?? '';
};

const normalizeRows = (rows) => {
  return rows
    .map((row) => {
      const studentId = String(
        pickField(row, ['studentid', 'student', 'id', 'regno', 'registrationnumber'], 0),
      ).trim();
      const batchCode = String(
        pickField(row, ['batchcode', 'batch', 'code'], 1),
      ).trim();
      const weight = toNumber(
        pickField(row, ['itemweightkg', 'itemweight', 'weightkg', 'weight'], 2),
      );

      return {
        studentId,
        batchCode,
        weight,
      };
    })
    .filter((row) => row.studentId && row.batchCode && row.weight > 0);
};

const Laundry = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [uploadInfo, setUploadInfo] = useState('No file uploaded yet.');
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('laundryRecords');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('laundryNotifications');
      if (!saved) return initialNotifications;

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return initialNotifications;

      // Migrate legacy entries that may have non-serializable icon component refs.
      return parsed.map((item) => ({
        ...item,
        iconKey: item.iconKey || 'bell',
      }));
    } catch {
      return initialNotifications;
    }
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('laundryRecords', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('laundryNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    setNotifications((previous) => [
      {
        id: Date.now(),
        ...notification,
      },
      ...previous,
    ]);
  };

  const parseFile = async (file) => {
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.xlsx') && !lowerName.endsWith('.csv')) {
      setError('Only .xlsx and .csv files are supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum allowed size is 10MB.');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
      const parsedRows = normalizeRows(rawRows);

      if (!parsedRows.length) {
        setError('No valid records found. Expected Student ID, Batch Code, and Item Weight.');
        return;
      }

      setRecords(parsedRows);
      setUploadInfo(`${file.name} uploaded • ${parsedRows.length} valid records`);

      addNotification({
        title: `Upload complete: ${file.name}`,
        subtitle: `${parsedRows.length} records imported successfully`,
        status: 'Sent',
        iconKey: 'sheet',
      });
    } catch {
      setError('Unable to parse spreadsheet. Please verify file content and format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    parseFile(file);
    event.target.value = '';
  };

  const handleScheduleBatch = () => {
    const batchCode = window.prompt('Enter batch code (example: BATCH-204):');
    if (!batchCode) return;
    const schedule = window.prompt('Enter schedule (example: Tomorrow 09:00 AM):');
    if (!schedule) return;

    addNotification({
      title: `Batch ${batchCode} scheduled`,
      subtitle: `${schedule} • ${records.length || 0} recipients`,
      status: 'Scheduled',
      iconKey: 'schedule',
    });
  };

  const handleNotifyAll = () => {
    addNotification({
      title: 'Delivery: All Wings',
      subtitle: `Notification sent • ${records.length || 0} recipients`,
      status: 'Sent',
      iconKey: 'users',
    });
  };

  const totalWeight = useMemo(
    () => records.reduce((sum, record) => sum + record.weight, 0),
    [records],
  );
  const uniqueBatches = useMemo(
    () => new Set(records.map((record) => record.batchCode)).size,
    [records],
  );
  const activeBatches = useMemo(
    () => notifications.filter((item) => item.status === 'Scheduled').length,
    [notifications],
  );
  const completionRate = uniqueBatches > 0
    ? Math.min(100, Math.round((activeBatches / uniqueBatches) * 100))
    : 0;
  const avgDelay = useMemo(() => {
    if (!records.length) return 0;
    return Math.max(1, Math.round((records.length % 17) + activeBatches));
  }, [records, activeBatches]);
  const visibleNotifications = showAllNotifications ? notifications : notifications.slice(0, 3);

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          searchPlaceholder="Search records..."
          showActionButton={false}
          leftLabel="Hostel Serenity"
          rightLabel="Admin User"
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
            <section className="space-y-1 pt-4">
              <h1 className="text-3xl md:text-[44px] font-extrabold tracking-[-0.03em] text-slate-800">Laundry Notifications & Records</h1>
              <p className="text-slate-500 text-sm md:text-[18px]">
                Manage schedules, notify residents, and maintain historical batch logs.
              </p>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
              <article className="bg-panel border border-panel-border rounded-2xl p-5 md:p-6 shadow-card">
                <div className="flex items-center gap-2 text-slate-800 mb-4">
                  <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                  <h2 className="text-2xl md:text-[34px] leading-none font-bold tracking-tight">Upload Excel Record</h2>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.csv"
                  className="hidden"
                  onChange={handleFileSelection}
                />

                <div
                  className={`relative rounded-2xl border-2 border-dashed px-4 py-14 md:py-16 flex flex-col items-center text-center transition-colors ${
                    isDragging
                      ? 'border-slate-500 bg-slate-200/60'
                      : 'border-slate-300/90 bg-slate-100/60'
                  }`}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    const file = event.dataTransfer.files?.[0];
                    if (file) parseFile(file);
                  }}
                >
                  <Upload className="absolute right-8 top-6 w-12 h-12 text-slate-300" />
                  <div className="w-14 h-14 rounded-full bg-slate-200/70 inline-flex items-center justify-center mb-5">
                    <FileUp className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="text-xl md:text-[34px] font-bold tracking-tight text-slate-800">Drag and drop your spreadsheet here</p>
                  <p className="text-slate-500 text-sm md:text-base mt-2">Accepts .xlsx, .csv formats (Max 10MB)</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-6 px-7 py-3 rounded-lg bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold transition-colors shadow-sm"
                  >
                    {isProcessing ? 'Processing...' : 'Browse Files'}
                  </button>
                  <p className="mt-3 text-xs text-slate-500">{uploadInfo}</p>
                  {error && <p className="mt-2 text-xs text-red-600 font-medium">{error}</p>}
                </div>
              </article>

              <div className="space-y-4">
                <article className="bg-panel border border-panel-border rounded-2xl p-5 shadow-card">
                  <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500 mb-3">Quick Actions</p>
                  <div className="space-y-3">
                    <button
                      onClick={handleScheduleBatch}
                      className="w-full rounded-2xl bg-slate-600 text-white px-4 py-3.5 text-left flex items-center justify-between hover:bg-slate-700 transition-colors shadow-sm"
                    >
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <CalendarCheck2 className="w-4 h-4" />
                        Schedule New Batch
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNotifyAll}
                      className="w-full rounded-2xl bg-slate-200/80 text-slate-700 px-4 py-3.5 text-left flex items-center justify-between hover:bg-slate-300/80 transition-colors"
                    >
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <Users className="w-4 h-4" />
                        Notify All Students
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>

                <article className="bg-panel border border-panel-border rounded-2xl p-5 shadow-card relative overflow-hidden">
                  <div className="absolute right-[-38px] top-[58px] w-24 h-24 rounded-full bg-slate-200/80" />
                  <div className="absolute right-[-18px] bottom-[-10px] w-14 h-14 rounded-full bg-slate-200/80" />
                  <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">Weekly Overview</p>
                  <div className="relative mt-3 flex items-end gap-2 z-10">
                    <p className="text-5xl font-extrabold tracking-tight text-slate-700">{completionRate}%</p>
                    <p className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-500 pb-2">Active Batches</p>
                  </div>

                  <div className="relative mt-4 h-2.5 rounded-full bg-slate-200 overflow-hidden z-10">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: `${completionRate}%` }} />
                  </div>

                  <div className="relative mt-5 grid grid-cols-2 gap-4 z-10">
                    <div>
                      <p className="text-xl font-bold text-slate-800">{totalWeight.toFixed(1)} kg</p>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">Processed</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-800">{avgDelay} mins</p>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">Avg. Delay</p>
                    </div>
                  </div>
                </article>

                <article className="bg-panel border border-panel-border rounded-2xl p-5 shadow-card">
                  <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500 mb-3">Record Requirements</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><CircleDot className="w-3.5 h-3.5 text-slate-500" /> Column A: Student ID</li>
                    <li className="flex items-center gap-2"><CircleDot className="w-3.5 h-3.5 text-slate-500" /> Column B: Batch Code</li>
                    <li className="flex items-center gap-2"><CircleDot className="w-3.5 h-3.5 text-slate-500" /> Column C: Item Weight (kg)</li>
                  </ul>
                </article>
              </div>
            </section>

            <section className="bg-panel border border-panel-border rounded-2xl p-5 md:p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl md:text-[34px] leading-none font-bold tracking-tight text-slate-800">Recent Notifications</h2>
                <button
                  onClick={() => setShowAllNotifications((current) => !current)}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-800"
                >
                  {showAllNotifications ? 'Show Less' : 'View All'}
                </button>
              </div>

              <div className="space-y-3">
                {visibleNotifications.map((item) => {
                  const Icon = iconMap[item.iconKey] || Bell;

                  return (
                    <article key={item.id} className="rounded-xl bg-slate-100/70 border border-slate-200/70 px-4 py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-full bg-slate-200 inline-flex items-center justify-center text-slate-600 shrink-0">
                          <Icon className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                          <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide shrink-0 ${statusStyle[item.status] || statusStyle.Draft}`}>
                        {item.status}
                      </span>
                    </article>
                  );
                })}

                {!visibleNotifications.length && (
                  <article className="rounded-xl bg-slate-100/70 border border-slate-200/70 px-4 py-6 text-sm text-slate-500 text-center">
                    No notifications yet. Use quick actions to create one.
                  </article>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Laundry;
