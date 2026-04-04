import React, { useEffect, useState, useCallback } from "react";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Megaphone,
  Plus,
  Send,
  Users,
  Trash2,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";

const Notices = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [broadcasts, setBroadcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBroadcasts = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/auth");

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/broadcasts/admin", {
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

      // Try to parse as JSON regardless of content-type header
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        // Backend returned non-JSON (HTML error page) — means server is not running or crashed
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error(
          `Backend error (HTTP ${response.status}). Please restart the backend server.`,
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Error ${response.status}`);
      }

      setBroadcasts(result.data?.broadcasts || []);
    } catch (err) {
      console.error("Fetch notices error:", err);
      setError(err.message || "Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBroadcasts();
  }, [fetchBroadcasts]);

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/auth");

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/broadcasts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          content: newContent,
          imageUrl: newImageUrl.trim() || undefined,
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
        throw new Error(result.message || "Failed to create broadcast");
      }

      setNewContent("");
      setNewImageUrl("");
      setShowModal(false);
      fetchBroadcasts();
    } catch (err) {
      alert(err.message || "Network error occurred while sending");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/auth");

    try {
      const response = await fetch(`/api/broadcasts/${id}`, {
        method: "DELETE",
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
        fetchBroadcasts();
      } else {
        const result = await response.json().catch(() => ({}));
        alert(result.message || "Could not delete the broadcast");
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

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 relative">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          searchPlaceholder="Filter announcements..."
          showActionButton={false}
          rightLabel="Admin Hub"
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
                  Broadcasts
                </h1>
                <p className="text-slate-500 text-lg mt-1 font-medium">
                  Manage and send real-time alerts to residents.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchBroadcasts}
                  className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all border border-slate-200"
                  aria-label="Refresh data"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold inline-flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  New Broadcast
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
                    onClick={fetchBroadcasts}
                    className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl font-bold text-sm transition-colors"
                  >
                    Attempt Reconnection
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-bold tracking-[0.1em] uppercase text-slate-400">
                  Current Reach
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-5xl font-black tracking-tight text-slate-900">
                    {broadcasts.length}
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 inline-block">
                  All active announcements
                </p>
              </article>
            </div>

            <section className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Communication Timeline
                  </h2>
                </div>

                <div className="space-y-4">
                  {isLoading && broadcasts.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
                      <p className="text-slate-500 font-bold">
                        Synchronizing with server...
                      </p>
                    </div>
                  )}

                  {!isLoading && broadcasts.length === 0 && !error && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-16 text-center">
                      <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold text-xl">
                        The airwaves are quiet.
                      </p>
                      <p className="text-slate-400 mt-1 mb-6">
                        Create your first broadcast to notify residents.
                      </p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold border border-slate-200 hover:border-slate-400 transition-all"
                      >
                        Start Broadcasting
                      </button>
                    </div>
                  )}

                  {broadcasts.map((notice) => (
                    <article
                      key={notice._id}
                      className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-400 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                              Block {notice.block}
                            </span>
                          </div>

                          {notice.imageUrl && (
                            <div className="mb-4 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-lg bg-slate-50 p-2">
                              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md aspect-square">
                                <img
                                  src={notice.imageUrl}
                                  alt="Broadcast image"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          <p className="text-lg text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                            {notice.content}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(notice._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                          title="Delete announcement"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 border-t border-slate-50 pt-4">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarClock className="w-4 h-4" />{" "}
                          {formatDate(notice.createdAt)}
                        </span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-4 h-4" /> Sent to residents
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <article className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <p className="text-xs font-black tracking-widest uppercase text-slate-400 mb-4">
                      Quick Broadcast
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full rounded-2xl bg-white/10 hover:bg-white/20 transition-all p-5 flex items-center justify-between group"
                    >
                      <div className="text-left">
                        <p className="font-black text-lg">Send Alert</p>
                        <p className="text-sm text-slate-400">
                          Broadcast to your assigned block.
                        </p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>

                <article className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                    Pro Tips
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0">
                        01
                      </div>
                      <p className="text-sm text-slate-500 leading-snug">
                        Keep notices concise for better resident engagement.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0">
                        02
                      </div>
                      <p className="text-sm text-slate-500 leading-snug">
                        Urgent notices should be clearly labeled at the top.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </main>

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in transition-all">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative border border-slate-100 animate-in zoom-in-95 fill-mode-both duration-200">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-6">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <Megaphone className="w-7 h-7 text-slate-900" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">
                  New Broadcast
                </h3>
                <p className="text-slate-500 mt-1 font-medium">
                  Send a real-time message to your block.
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 min-h-[160px] text-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 focus:bg-white transition-all transition-duration-200"
                />

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 focus:bg-white transition-all transition-duration-200"
                  />
                  <p className="text-xs text-slate-400 font-medium">
                    Add an image to make your broadcast more engaging
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 px-1">
                  <AlertCircle className="w-4 h-4" />
                  Residents will receive this in their notification feed.
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Draft for later
                </button>
                <button
                  disabled={isSubmitting || !newContent.trim()}
                  onClick={handleCreate}
                  className="flex-[1.5] bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg active:scale-95"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Publish Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
