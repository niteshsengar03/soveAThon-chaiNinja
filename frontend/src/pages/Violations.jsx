import React, { useEffect, useMemo, useState } from 'react';
import { get, onValue, ref } from 'firebase/database';
import { AlertTriangle, Camera, ShieldAlert } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { missingFirebaseConfig, realtimeDb } from '../lib/firebase';

const formatDateTime = (value) => {
  if (!value) return '-';

  if (typeof value?.toDate === 'function') {
    return value.toDate().toLocaleString();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

const toText = (value, fallback = '-') => {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
};

const deriveNameFromImage = (value) => {
  if (!value) return '';
  const raw = String(value).split('/').pop() || '';
  const withoutExt = raw.replace(/\.[^/.]+$/, '');
  return withoutExt.replace(/[_-]+/g, ' ').trim();
};

const extractRow = (id, data) => {
  const imageName = deriveNameFromImage(
    data?.imageName || data?.image_name || data?.fileName || data?.filename || data?.imageUrl || data?.image,
  );

  return {
    id,
    studentName: toText(data?.studentName || data?.name || data?.student || imageName || 'Unknown'),
    regNo: toText(data?.regNo || data?.studentId || data?.rollNo),
    block: toText(data?.block),
    roomNo: toText(data?.roomNo || data?.room),
    violationType: toText(data?.violationType || data?.type || 'Smoking'),
    confidence: Number(data?.confidence || data?.confidenceScore || data?.confidence_score || 0),
    status: toText(data?.status || 'Detected'),
    imageUrl: data?.imageUrl || data?.image || '',
    timestamp: data?.timestamp || data?.createdAt || data?.detectedAt || data?.detected_at || null,
  };
};

const normalizeViolations = (value) => {
  if (!value) return [];

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item])
    : Object.entries(value);

  const rows = [];

  for (const [id, data] of entries) {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const hasViolationFields =
        data.studentName || data.name || data.student || data.regNo || data.studentId || data.violationType || data.type;

      if (hasViolationFields) {
        rows.push(extractRow(id, data));
      } else {
        const nestedEntries = Array.isArray(data)
          ? data.map((item, index) => [String(index), item])
          : Object.entries(data);

        for (const [childId, child] of nestedEntries) {
          if (!child || typeof child !== 'object') continue;
          rows.push(extractRow(`${id}-${childId}`, child));
        }
      }
    }
  }

  rows.sort((a, b) => {
    const first = new Date(b.timestamp || 0).getTime();
    const second = new Date(a.timestamp || 0).getTime();
    return first - second;
  });

  return rows;
};

const Violations = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    let unsubscribe = null;

    const init = async () => {
    if (missingFirebaseConfig || !realtimeDb) {
      setError('Firebase config missing. Set VITE_FIREBASE_* variables in frontend/.env.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

      const configuredPath = import.meta.env.VITE_FIREBASE_VIOLATIONS_PATH;
      const candidatePaths = configuredPath
        ? [configuredPath]
        : ['smoking_model', 'violations', 'detections', 'smokingViolations'];

      let selectedPath = candidatePaths[0];

      for (const candidate of candidatePaths) {
        try {
          const snapshot = await get(ref(realtimeDb, candidate));
          if (snapshot.exists()) {
            selectedPath = candidate;
            break;
          }
        } catch {
          // Continue trying fallback paths.
        }
      }

      setActivePath(selectedPath);

      const violationsRef = ref(realtimeDb, selectedPath);

      unsubscribe = onValue(
        violationsRef,
        (snapshot) => {
          const value = snapshot.val();
          const rows = normalizeViolations(value);

          setViolations(rows);
          setIsLoading(false);
        },
        (readError) => {
          setError(readError?.message || 'Failed to fetch violations from Firebase Realtime Database.');
          setIsLoading(false);
        },
      );
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const highConfidenceCount = useMemo(
    () => violations.filter((item) => item.confidence >= 80).length,
    [violations],
  );

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          searchPlaceholder="Search student, reg no, block..."
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
            <section className="space-y-1 pt-4">
              <h1 className="text-3xl md:text-[44px] font-extrabold tracking-[-0.03em] text-slate-800">Student Violations</h1>
              <p className="text-slate-500 text-base">Fetched live from Firebase Realtime Database{activePath ? ` (${activePath})` : ''}.</p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <article className="bg-panel border border-panel-border rounded-2xl p-5 shadow-card">
                <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">Total Violations</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-slate-800">{violations.length}</p>
              </article>
              <article className="bg-panel border border-panel-border rounded-2xl p-5 shadow-card">
                <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">High Confidence</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-red-700">{highConfidenceCount}</p>
              </article>
              <article className="bg-panel border border-panel-border rounded-2xl p-5 shadow-card">
                <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">Source</p>
                <p className="mt-2 text-xl font-bold text-slate-800 inline-flex items-center gap-2">
                  <Camera className="w-5 h-5" /> Smoking Model Feed
                </p>
              </article>
            </section>

            <section className="bg-panel border border-panel-border rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200/70 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-slate-600" />
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Violation Records</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-sm">
                  <thead className="text-[11px] uppercase tracking-[0.2em] text-slate-500 border-b border-slate-200/70">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold">Student</th>
                      <th className="text-left px-4 py-4 font-semibold">Reg No</th>
                      <th className="text-left px-4 py-4 font-semibold">Block</th>
                      <th className="text-left px-4 py-4 font-semibold">Room</th>
                      <th className="text-left px-4 py-4 font-semibold">Type</th>
                      <th className="text-left px-4 py-4 font-semibold">Confidence</th>
                      <th className="text-left px-4 py-4 font-semibold">Status</th>
                      <th className="text-left px-4 py-4 font-semibold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td colSpan="8" className="px-6 py-10 text-center text-slate-500">Loading violations...</td>
                      </tr>
                    )}

                    {!isLoading && error && (
                      <tr>
                        <td colSpan="8" className="px-6 py-10 text-center text-red-600 inline-flex items-center gap-2 justify-center w-full">
                          <AlertTriangle className="w-4 h-4" /> {error}
                        </td>
                      </tr>
                    )}

                    {!isLoading && !error && violations.length === 0 && (
                      <tr>
                        <td colSpan="8" className="px-6 py-10 text-center text-slate-500">No violations found at Realtime DB path "{activePath || import.meta.env.VITE_FIREBASE_VIOLATIONS_PATH || 'smoking_model'}".</td>
                      </tr>
                    )}

                    {!isLoading && !error && violations.map((row) => (
                      <tr key={row.id} className="border-b border-slate-200/60 hover:bg-slate-100/60 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">{row.studentName}</td>
                        <td className="px-4 py-4 text-slate-600">{row.regNo}</td>
                        <td className="px-4 py-4 text-slate-600">{row.block}</td>
                        <td className="px-4 py-4 text-slate-600">{row.roomNo}</td>
                        <td className="px-4 py-4 text-slate-700">{row.violationType}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            row.confidence >= 80 ? 'bg-red-200/80 text-red-700' : 'bg-amber-200/80 text-amber-700'
                          }`}>
                            {row.confidence ? `${row.confidence}%` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-700">{row.status}</td>
                        <td className="px-4 py-4 text-slate-500">{formatDateTime(row.timestamp)}</td>
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

export default Violations;
