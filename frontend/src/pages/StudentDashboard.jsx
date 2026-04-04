import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Car,
  Heart,
  Send,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [requestType, setRequestType] = useState("GARAGE");
  const [reason, setReason] = useState("");
  const [requestedOutTime, setRequestedOutTime] = useState("");
  const [expectedReturnTime, setExpectedReturnTime] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMovements = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/auth");

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/movements/my", {
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
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (
      !reason.trim() ||
      !requestedOutTime ||
      !expectedReturnTime ||
      !roomNo.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/auth");

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/movements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          type: requestType,
          reason: reason.trim(),
          requestedOutTime,
          expectedReturnTime,
          roomNo: roomNo.trim(),
        }),
      });

      if (response.status === 401 || response.status === 403) {
        navigate("/auth", { replace: true });
        return;
      }

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          `Backend error (HTTP ${response.status}). Please restart the backend server.`,
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit request");
      }

      // Reset form
      setReason("");
      setRequestedOutTime("");
      setExpectedReturnTime("");
      setRoomNo("");
      setShowRequestModal(false);
      fetchMovements();
      alert("Movement request submitted successfully!");
    } catch (err) {
      alert(err.message || "Network error occurred");
    } finally {
      setIsSubmitting(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "APPROVED":
        return "bg-green-50 text-green-600 border-green-100";
      case "REJECTED":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 relative">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          searchPlaceholder="Search your movements..."
          showActionButton={false}
          rightLabel="Student Hub"
        />

        <main
          className="flex-1 pt-24 pb-10 px-4 sm:px-6 lg:px-8 overflow-y-auto"
          onClick={() => {
            if (isSidebarOpen) setIsSidebarOpen(false);
          }}
        >
          <div className="max-w-6xl mx-auto space-y-6">
            <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pt-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                  Student Dashboard
                </h1>
                <p className="text-slate-500 text-lg mt-1 font-medium">
                  Manage your movement requests for garage and prayer
                  activities.
                </p>
              </div>

              <button
                onClick={() => setShowRequestModal(true)}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold inline-flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                <Send className="w-5 h-5" />
                Request Movement
              </button>
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
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400">
                  Total Requests
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-5xl font-black tracking-tight text-slate-900">
                    {movements.length}
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 inline-block">
                  All time
                </p>
              </article>

              <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400">
                  Approved
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-5xl font-black tracking-tight text-slate-900">
                    {movements.filter((m) => m.status === "APPROVED").length}
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 inline-block">
                  This month
                </p>
              </article>

              <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400">
                  Pending
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-5xl font-black tracking-tight text-slate-900">
                    {movements.filter((m) => m.status === "PENDING").length}
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 inline-block">
                  Awaiting approval
                </p>
              </article>
            </div>

            {/* Movements List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Your Movement Requests
              </h2>

              {isLoading && (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
                  <p className="text-slate-500 font-bold">
                    Loading your requests...
                  </p>
                </div>
              )}

              {!isLoading && movements.length === 0 && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-16 text-center">
                  <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-xl">
                    No movement requests yet
                  </p>
                  <p className="text-slate-400 mt-1 mb-6">
                    Create your first movement request to get started.
                  </p>
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold border border-slate-200 hover:border-slate-400 transition-all"
                  >
                    Request Movement
                  </button>
                </div>
              )}

              {movements.map((movement) => (
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
                            className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(movement.status)}`}
                          >
                            {movement.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-lg font-bold text-slate-800">
                            Room {movement.roomNo}
                          </span>
                        </div>

                        <p className="text-slate-600 font-medium">
                          {movement.reason}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
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
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in transition-all">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative border border-slate-100 animate-in zoom-in-95 fill-mode-both duration-200">
              <button
                onClick={() => setShowRequestModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              >
                <AlertCircle className="w-6 h-6" />
              </button>

              <div className="mb-6">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-7 h-7 text-slate-900" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">
                  Request Movement
                </h3>
                <p className="text-slate-500 mt-1 font-medium">
                  Submit a request to go out for garage or prayer.
                </p>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">
                    Movement Type
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  >
                    <option value="GARAGE">Garage</option>
                    <option value="PRAYER">Prayer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    placeholder="e.g., A-101"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">
                    Reason
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide a reason for your movement request..."
                    rows={3}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">
                      Out Time
                    </label>
                    <input
                      type="datetime-local"
                      value={requestedOutTime}
                      onChange={(e) => setRequestedOutTime(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">
                      Expected Return
                    </label>
                    <input
                      type="datetime-local"
                      value={expectedReturnTime}
                      onChange={(e) => setExpectedReturnTime(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg active:scale-95"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Request
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

export default StudentDashboard;
