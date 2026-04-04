import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  CheckCircle2,
  Dot,
  History,
  Plus,
  Siren,
  Wrench,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["All", "Pending", "Assigned", "Resolved", "Unresolved"];
const STATUS_API_MAP = {
  Pending: "PENDING",
  Assigned: "ASSIGNED",
  Resolved: "RESOLVED",
  Unresolved: "UNRESOLVED",
};

const CATEGORY_OPTIONS = [
  "All",
  "AC",
  "Fan",
  "Electricity",
  "Plumbing",
  "Carpentry",
  "Other",
];
const CATEGORY_API_MAP = {
  AC: "AC",
  Fan: "FAN",
  Electricity: "ELECTRICITY",
  Plumbing: "PLUMBING",
  Carpentry: "CARPENTRY",
  Other: "OTHER",
};

const WORKER_CATEGORIES = [
  { label: "AC", value: "AC" },
  { label: "Electricity", value: "ELECTRICITY" },
  { label: "Furniture", value: "FURNITURE" },
  { label: "Washroom", value: "WASHROOM" },
  { label: "Water Cooler", value: "WATER_COOLER" },
];

const toInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "NA";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const Complaints = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Worker creation modal states
  const [showCreateWorkerModal, setShowCreateWorkerModal] = useState(false);
  const [workerFormData, setWorkerFormData] = useState({
    name: "",
    email: "",
    category: "AC",
  });
  const [isSubmittingWorker, setIsSubmittingWorker] = useState(false);
  const [workerMessage, setWorkerMessage] = useState({ type: "", text: "" });

  // Worker assignment states
  const [availableWorkers, setAvailableWorkers] = useState({}); // { complaintId: [workers] }
  const [assigningWorker, setAssigningWorker] = useState({}); // { complaintId: true/false }
  const [showWorkerOptions, setShowWorkerOptions] = useState({}); // { complaintId: true/false }

  // Handle worker form input changes
  const handleWorkerInputChange = (e) => {
    const { name, value } = e.target;
    setWorkerFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle worker creation
  const handleCreateWorker = async (e) => {
    e.preventDefault();
    setIsSubmittingWorker(true);
    setWorkerMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      const response = await fetch("/api/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workerFormData),
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        setWorkerMessage({
          type: "error",
          text: `Server error (HTTP ${response.status}). Please ensure backend is running on port 4000.`,
        });
        setIsSubmittingWorker(false);
        return;
      }

      if (!response.ok) {
        setWorkerMessage({
          type: "error",
          text: result?.message || result?.error || "Failed to create worker",
        });
        setIsSubmittingWorker(false);
        return;
      }

      setWorkerMessage({
        type: "success",
        text: "Worker created successfully!",
      });

      // Reset form
      setWorkerFormData({
        name: "",
        email: "",
        category: "AC",
      });

      // Close modal after 1.5 seconds
      setTimeout(() => {
        setShowCreateWorkerModal(false);
        setWorkerMessage({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      setWorkerMessage({
        type: "error",
        text:
          error?.message || "Unable to create worker. Check your connection.",
      });
    } finally {
      setIsSubmittingWorker(false);
    }
  };

  // Fetch available workers for a specific category and block
  const fetchAvailableWorkers = async (complaintId, category, block) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(
        `/api/complaints/available-workers?category=${category}&block=${block}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result = await response.json();
      console.log("Workers API Response:", result); // Debug log

      if (result?.success) {
        setAvailableWorkers((prev) => ({
          ...prev,
          [complaintId]: result.data?.workers || [],
        }));
        setShowWorkerOptions((prev) => ({
          ...prev,
          [complaintId]: true,
        }));
      } else {
        console.error("API returned success: false", result);
      }
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    }
  };

  // Assign worker to complaint
  const handleAssignWorker = async (complaintId, workerId, workerEmail) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth", { replace: true });
      return;
    }

    setAssigningWorker((prev) => ({
      ...prev,
      [complaintId]: true,
    }));

    try {
      const response = await fetch(`/api/complaints/${complaintId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ workerId }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result?.message || "Failed to assign worker");
        return;
      }

      // Update complaints to reflect the assignment
      setComplaints((prev) =>
        prev.map((comp) =>
          comp._id === complaintId
            ? { ...comp, status: "ASSIGNED", assignedWorker: { workerId } }
            : comp,
        ),
      );

      // Close worker options and clear selection
      setShowWorkerOptions((prev) => ({
        ...prev,
        [complaintId]: false,
      }));

      alert(
        `Worker assigned successfully! Notification sent to ${workerEmail}`,
      );
    } catch (error) {
      alert("Failed to assign worker. Please try again.");
      console.error("Assignment error:", error);
    } finally {
      setAssigningWorker((prev) => ({
        ...prev,
        [complaintId]: false,
      }));
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/auth", { replace: true });
        return;
      }

      try {
        setIsLoading(true);
        setLoadError("");

        const response = await fetch("/api/complaints/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type") || "";
        const result = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          navigate("/auth", { replace: true });
          return;
        }

        if (!response.ok || !result?.success) {
          setLoadError(
            result?.message ||
              `Failed to load complaints (HTTP ${response.status}).`,
          );
          return;
        }

        setComplaints(
          Array.isArray(result?.data?.complaints) ? result.data.complaints : [],
        );
      } catch {
        setLoadError(
          "Unable to reach backend API. Ensure backend server is running on port 4000.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  const complaintRows = useMemo(
    () =>
      complaints.map((item) => {
        const studentName =
          item?.studentId?.name || item?.regNo || "Unknown Student";
        const categoryLabel = item?.category
          ? item.category.charAt(0) + item.category.slice(1).toLowerCase()
          : "Other";
        const statusLabel = item?.status
          ? item.status.charAt(0) + item.status.slice(1).toLowerCase()
          : "Pending";
        const priority = item?.priority || "MEDIUM";

        return {
          id: item?._id || "",
          displayId: `CMP-${(item?._id || "").slice(-5).toUpperCase()}`,
          student: studentName,
          initials: toInitials(studentName),
          room: `${item?.block || "-"}-${item?.roomNo || "-"}`,
          category: categoryLabel,
          categoryApi: item?.category || "OTHER",
          severity: priority.charAt(0) + priority.slice(1).toLowerCase(),
          status: statusLabel,
          statusApi: item?.status || "PENDING",
          date: formatDate(item?.createdAt),
          action: item?.status === "RESOLVED" ? "history" : "resolve",
        };
      }),
    [complaints],
  );

  const filteredRows = useMemo(() => {
    return complaintRows.filter((row) => {
      const statusMatch =
        selectedStatus === "All" ||
        row.statusApi === STATUS_API_MAP[selectedStatus];
      const categoryMatch =
        selectedCategory === "All" ||
        row.categoryApi === CATEGORY_API_MAP[selectedCategory];
      return statusMatch && categoryMatch;
    });
  }, [complaintRows, selectedStatus, selectedCategory]);

  const resolvedCount = useMemo(
    () => complaintRows.filter((row) => row.statusApi === "RESOLVED").length,
    [complaintRows],
  );

  const resolutionRate = complaintRows.length
    ? ((resolvedCount / complaintRows.length) * 100).toFixed(1)
    : "0.0";

  const trendSeries = useMemo(() => {
    const last8Days = Array.from({ length: 8 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (7 - index));
      return date.toISOString().slice(0, 10);
    });

    const grouped = complaints.reduce((acc, item) => {
      const key = new Date(item.createdAt).toISOString().slice(0, 10);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return last8Days.map((day) => grouped[day] || 0);
  }, [complaints]);

  const maxTrend = Math.max(...trendSeries, 1);

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          actionLabel="Log New Complaint"
        />

        <main
          className="flex-1 pt-24 pb-10 px-4 sm:px-6 lg:px-8 overflow-y-auto"
          onClick={() => {
            if (isSidebarOpen) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <div className="max-w-6xl mx-auto space-y-6">
            <section className="space-y-1 pt-4">
              <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-slate-800">
                Complaints Management
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                Review and resolve student grievances across the campus.
              </p>
            </section>

            {/* Create Worker Card */}
            <section className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Add New Worker
                    </h2>
                    <p className="text-sm text-slate-600">
                      Register maintenance staff for complaint resolution
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateWorkerModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Worker
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-[1fr_180px] gap-4 items-stretch">
              <div className="bg-panel rounded-2xl border border-panel-border px-6 py-5 space-y-5 shadow-card">
                <div className="space-y-2">
                  <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">
                    Status
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          selectedStatus === status
                            ? "bg-slate-500 text-white"
                            : "bg-slate-200/90 text-slate-600 hover:bg-slate-300/80"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-500">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          selectedCategory === category
                            ? "bg-slate-500 text-white"
                            : "bg-slate-200/90 text-slate-600 hover:bg-slate-300/80"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-300/80 rounded-2xl border border-slate-300 p-5 flex flex-col justify-between">
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-slate-600">
                    Resolution Rate
                  </p>
                  <p className="text-5xl font-extrabold tracking-[-0.03em] mt-8 text-slate-700">
                    {resolutionRate}%
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  {resolvedCount} resolved of {complaintRows.length} total
                </p>
              </div>
            </section>

            <section className="bg-panel rounded-2xl border border-panel-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[940px] text-sm">
                  <thead className="text-[11px] uppercase tracking-[0.22em] text-slate-500 border-b border-slate-200/80">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold">ID</th>
                      <th className="text-left px-4 py-4 font-semibold">
                        Student
                      </th>
                      <th className="text-left px-4 py-4 font-semibold">
                        Room
                      </th>
                      <th className="text-left px-4 py-4 font-semibold">
                        Category
                      </th>
                      <th className="text-left px-4 py-4 font-semibold">
                        Severity
                      </th>
                      <th className="text-left px-4 py-4 font-semibold">
                        Status
                      </th>
                      <th className="text-left px-4 py-4 font-semibold">
                        Date
                      </th>
                      <th className="text-left px-4 py-4 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-10 text-center text-slate-500"
                        >
                          Loading complaints...
                        </td>
                      </tr>
                    )}

                    {!isLoading && loadError && (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-10 text-center text-red-600"
                        >
                          {loadError}
                        </td>
                      </tr>
                    )}

                    {!isLoading && !loadError && filteredRows.length === 0 && (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-6 py-10 text-center text-slate-500"
                        >
                          No complaints found for selected filters.
                        </td>
                      </tr>
                    )}

                    {!isLoading &&
                      !loadError &&
                      filteredRows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-slate-200/70 text-slate-700 hover:bg-slate-100/70 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-slate-700">
                            #{row.displayId}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-slate-200 text-[10px] font-semibold text-slate-600 inline-flex items-center justify-center">
                                {row.initials}
                              </span>
                              <span className="font-medium">{row.student}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">{row.room}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 rounded-full text-[11px] bg-slate-200/80 text-slate-600 font-medium">
                              {row.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium">
                              <Dot
                                className={`w-4 h-4 ${
                                  row.severity === "High"
                                    ? "text-red-500"
                                    : row.severity === "Medium"
                                      ? "text-slate-500"
                                      : "text-slate-400"
                                }`}
                              />
                              {row.severity.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                                row.statusApi === "PENDING"
                                  ? "bg-red-200/90 text-red-700"
                                  : row.statusApi === "ASSIGNED"
                                    ? "bg-indigo-200/90 text-indigo-700"
                                    : row.statusApi === "UNRESOLVED"
                                      ? "bg-amber-200/90 text-amber-800"
                                      : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {row.date}
                          </td>
                          <td className="px-4 py-4">
                            {row.statusApi === "ASSIGNED" ? (
                              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-green-700">
                                <CheckCircle2 className="w-4 h-4" />
                                Assigned
                              </span>
                            ) : (
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    fetchAvailableWorkers(
                                      row.id,
                                      row.categoryApi.toUpperCase(),
                                      row.room.split("-")[0],
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                                >
                                  Assign Worker
                                </button>
                                {showWorkerOptions[row.id] &&
                                  availableWorkers[row.id] && (
                                    <div className="absolute top-full mt-2 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                                      {availableWorkers[row.id].length > 0 ? (
                                        <div className="py-1">
                                          {availableWorkers[row.id].map(
                                            (worker) => (
                                              <button
                                                key={worker._id}
                                                onClick={() =>
                                                  handleAssignWorker(
                                                    row.id,
                                                    worker._id,
                                                    worker.email,
                                                  )
                                                }
                                                disabled={
                                                  assigningWorker[row.id]
                                                }
                                                className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                              >
                                                <div className="flex items-center justify-between">
                                                  <span>{worker.name}</span>
                                                  {assigningWorker[row.id] && (
                                                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                  )}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                  {worker.email}
                                                </div>
                                              </button>
                                            ),
                                          )}
                                        </div>
                                      ) : (
                                        <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                          No workers available
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-6 py-4 text-xs text-slate-500">
                <p>
                  Showing {filteredRows.length} of {complaintRows.length}{" "}
                  entries
                </p>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500">
                    &lt;
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-slate-600 text-white">
                    1
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500">
                    2
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500">
                    3
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500">
                    &gt;
                  </button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 pb-4">
              <div className="bg-panel rounded-2xl border border-panel-border p-5 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Resolution Trends
                    </h2>
                    <p className="text-sm text-slate-500">
                      Weekly volume of complaints vs. fixed issues.
                    </p>
                  </div>
                  <span className="text-slate-400 text-sm">↗</span>
                </div>
                <div className="bg-slate-100/80 rounded-xl p-4 h-44 flex items-end gap-3">
                  {trendSeries.map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className={`flex-1 rounded-t-md transition-all ${index % 2 === 0 ? "bg-slate-400/70" : "bg-slate-600/85"}`}
                      style={{ height: `${(value / maxTrend) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-panel rounded-2xl border border-panel-border p-5 shadow-card space-y-4">
                <h2 className="text-lg font-bold text-slate-800">
                  Critical Alerts
                </h2>

                <article className="rounded-xl border border-red-200 bg-red-50/70 p-3 flex items-start gap-3">
                  <Siren className="w-4 h-4 text-red-700 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">
                      B-Block Water Supply
                    </p>
                    <p className="text-xs text-slate-500">
                      6 related complaints in last 24h
                    </p>
                  </div>
                </article>

                <article className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 flex items-start gap-3">
                  <Wrench className="w-4 h-4 text-indigo-700 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">
                      Lift Maintenance Due
                    </p>
                    <p className="text-xs text-slate-500">
                      Scheduled for tomorrow 10:00 AM
                    </p>
                  </div>
                </article>
              </div>
            </section>

            <button
              className="fixed bottom-5 right-5 lg:hidden w-12 h-12 rounded-full bg-slate-700 text-white shadow-lg inline-flex items-center justify-center"
              aria-label="Log complaint"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </main>

        {/* Create Worker Modal */}
        {showCreateWorkerModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">
                  Create New Worker
                </h2>
                <button
                  onClick={() => {
                    setShowCreateWorkerModal(false);
                    setWorkerMessage({ type: "", text: "" });
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateWorker} className="p-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Worker Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={workerFormData.name}
                    onChange={handleWorkerInputChange}
                    placeholder="e.g., John Smith"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={workerFormData.email}
                    onChange={handleWorkerInputChange}
                    placeholder="e.g., john@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                    required
                  />
                </div>

                {/* Category Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={workerFormData.category}
                    onChange={handleWorkerInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm bg-white"
                    required
                  >
                    {WORKER_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message Alert */}
                {workerMessage.text && (
                  <div
                    className={`p-3 rounded-lg flex items-start gap-2 text-sm ${
                      workerMessage.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {workerMessage.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <p>{workerMessage.text}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateWorkerModal(false);
                      setWorkerMessage({ type: "", text: "" });
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingWorker}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {isSubmittingWorker ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Worker
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
