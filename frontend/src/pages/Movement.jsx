import React, { useEffect, useState, useCallback } from "react";
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Car,
  Heart,
  AlertCircle,
  User,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";

const Movement = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // pending, approved, outside

  const fetchMovements = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/auth");

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/movements/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        navigate("/auth", { replace: true });
        return;
      }

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error(
          `Backend error (HTTP ${response.status}). Please restart the backend server.`,
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Error ${response.status}`);
      }

      setMovements(result.data?.movements || []);
    } catch (err) {
      console.error("Fetch movements error:", err);
      setError(err.message || "Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/auth");

    try {
      const response = await fetch(`/api/movements/${id}/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/auth", { replace: true });
        return;
      }

      if (response.ok) {
        fetchMovements();
      } else {
        const result = await response.json().catch(() => ({}));
        alert(result.message || "Could not approve request");
      }
    } catch (err) {
      alert("A connection error occurred");
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/auth");

    try {
      const response = await fetch(`/api/movements/${id}/reject`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/auth", { replace: true });
        return;
      }

      if (response.ok) {
        fetchMovements();
      } else {
        const result = await response.json().catch(() => ({}));
        alert(result.message || "Could not reject request");
      }
    } catch (err) {
      alert("A connection error occurred");
    }
  };

  const formatDate = (ds) => {
    const d = new Date(ds);
    if (Number.isNaN(d.getTime())) return ds;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getFilteredMovements = () => {
    switch (activeTab) {
      case "pending":
        return movements.filter((m) => m.status === "PENDING");
      case "approved":
        return movements.filter((m) => m.status === "APPROVED");
      case "outside":
        return movements.filter(
          (m) => m.status === "APPROVED" && !m.actualReturnTime,
        );
      default:
        return movements;
    }
  };

  const getTabStats = () => {
    return {
      pending: movements.filter((m) => m.status === "PENDING").length,
      approved: movements.filter((m) => m.status === "APPROVED").length,
      outside: movements.filter(
        (m) => m.status === "APPROVED" && !m.actualReturnTime,
      ).length,
    };
  };

  const stats = getTabStats();
  const filteredMovements = getFilteredMovements();

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 relative">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          searchPlaceholder="Search movements..."
          showActionButton={false}
          rightLabel="Movement Hub"
        />

        <main
          className="flex-1 pt-24 pb-10 px-4 sm:px-6 lg:px-8 overflow-y-auto"
          onClick={() => {
            if (isSidebarOpen) setIsSidebarOpen(false);
          }}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pt-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                  Movement Monitoring
                </h1>
                <p className="text-slate-500 text-lg mt-1 font-medium">
                  Track and manage student movement requests for garage and
                  prayer activities.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchMovements}
                  className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all border border-slate-200"
                  aria-label="Refresh data"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </section>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-red-800 font-bold text-lg">
                    System Communication Issue
                  </h3>
                  <p className="text-red-600 mt-1">{error}</p>
                  <button
                    onClick={fetchMovements}
                    className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold text-sm transition-colors"
                  >
                    Attempt Reconnection
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400">
                  Pending Requests
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-5xl font-black tracking-tight text-slate-900">
                    {stats.pending}
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 inline-block">
                  Awaiting approval
                </p>
              </article>

              <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400">
                  Currently Outside
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-5xl font-black tracking-tight text-slate-900">
                    {stats.outside}
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 inline-block">
                  Active movements
                </p>
              </article>

              <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400">
                  Total Approved
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-5xl font-black tracking-tight text-slate-900">
                    {stats.approved}
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 inline-block">
                  This month
                </p>
              </article>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
              <div className="flex gap-2">
                {[
                  {
                    id: "pending",
                    label: "Pending Requests",
                    count: stats.pending,
                  },
                  {
                    id: "outside",
                    label: "Currently Outside",
                    count: stats.outside,
                  },
                  {
                    id: "approved",
                    label: "All Approved",
                    count: stats.approved,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                      activeTab === tab.id
                        ? "bg-slate-900 text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Movements List */}
            <div className="space-y-4">
              {isLoading && filteredMovements.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
                  <p className="text-slate-500 font-bold">
                    Loading movement data...
                  </p>
                </div>
              )}

              {!isLoading && filteredMovements.length === 0 && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-16 text-center">
                  <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-xl">
                    No movements found
                  </p>
                  <p className="text-slate-400 mt-1">
                    No {activeTab} movements at this time.
                  </p>
                </div>
              )}

              {filteredMovements.map((movement) => (
                <article
                  key={movement._id}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-400 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`p-2 rounded-xl ${
                            movement.type === "GARAGE"
                              ? "bg-blue-50"
                              : "bg-purple-50"
                          }`}
                        >
                          {movement.type === "GARAGE" ? (
                            <Car
                              className={`w-5 h-5 ${
                                movement.type === "GARAGE"
                                  ? "text-blue-500"
                                  : "text-purple-500"
                              }`}
                            />
                          ) : (
                            <Heart
                              className={`w-5 h-5 ${
                                movement.type === "GARAGE"
                                  ? "text-blue-500"
                                  : "text-purple-500"
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                            {movement.type}
                          </span>
                          <span
                            className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              movement.status === "PENDING"
                                ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                                : movement.status === "APPROVED"
                                  ? "bg-green-50 text-green-600 border border-green-100"
                                  : "bg-red-50 text-red-600 border border-red-100"
                            }`}
                          >
                            {movement.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-lg font-bold text-slate-800">
                            {movement.regNo}
                          </span>
                          <span className="text-sm text-slate-500">
                            • Room {movement.roomNo}
                          </span>
                        </div>

                        <p className="text-slate-600 font-medium">
                          {movement.reason}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <ArrowRight className="w-4 h-4" />
                            Out: {formatDate(movement.requestedOutTime)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            Expected: {formatDate(movement.expectedReturnTime)}
                          </span>
                          {movement.actualReturnTime && (
                            <span className="inline-flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              Returned: {formatDate(movement.actualReturnTime)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {activeTab === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(movement._id)}
                          className="p-3 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all border border-green-200"
                          title="Approve request"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(movement._id)}
                          className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-200"
                          title="Reject request"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Movement;
