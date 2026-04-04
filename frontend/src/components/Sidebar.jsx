import React from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  ShieldAlert,
  Bell,
  Box,
  ClipboardList,
  MapPin,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleRouteChange = (event, path) => {
    event.preventDefault();
    event.stopPropagation();

    navigate(path);
    onClose();
  };

  const user = JSON.parse(localStorage.getItem("authUser") || "{}");
  const isAdmin = user.role === "ADMIN";

  const menuItems = isAdmin
    ? [
        { icon: LayoutDashboard, label: "DASHBOARD", path: "/" },
        { icon: Users, label: "STUDENTS" },
        { icon: MessageSquare, label: "COMPLAINTS", path: "/complaints" },
        { icon: ShieldAlert, label: "OFFENDERS", path: "/offenders" },
        { icon: ShieldAlert, label: "VIOLATIONS", path: "/violations" },
        { icon: Bell, label: "NOTICES", path: "/notices" },
        { icon: MapPin, label: "MOVEMENT", path: "/movement" },
        { icon: Box, label: "LAUNDRY", path: "/laundry" },
        { icon: ClipboardList, label: "LEAVE SURVEY", path: "/leave-survey" },
      ]
    : [
        { icon: LayoutDashboard, label: "DASHBOARD", path: "/" },
        { icon: MessageSquare, label: "COMPLAINTS", path: "/complaints" },
        { icon: Bell, label: "NOTICES", path: "/notices" },
      ];

  const SidebarContent = ({ showClose }) => (
    <>
      <div className="flex items-center justify-between gap-3 px-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200/80">
            <LayoutDashboard className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-800">
              Serenity Admin
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-[0.18em] uppercase">
              Management Suite
            </p>
          </div>
        </div>
        {showClose && (
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          if (item.path) {
            const isRoot = item.path === "/";
            const isActive = isRoot
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.label}
                type="button"
                onClick={(event) => handleRouteChange(event, item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs tracking-[0.14em] ${
                  isActive
                    ? "bg-slate-200/70 text-slate-800"
                    : "text-slate-500 hover:bg-white hover:text-slate-700"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          }

          return (
            <button
              key={item.label}
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-xs tracking-[0.14em] text-slate-500 hover:bg-white hover:text-slate-700"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <div className="bg-white p-3 rounded-2xl flex items-center gap-3 border border-slate-200/80">
          <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100"
            alt="Admin"
            className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              Admin User
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-slate-100/80 h-screen fixed left-0 top-0 border-r border-slate-200/70 flex-col py-6 px-4 z-50">
        <SidebarContent showClose={false} />
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={onClose}
        />
        <aside
          className={`absolute left-0 top-0 w-64 max-w-[85vw] h-full bg-white border-r border-slate-100 flex flex-col py-6 px-4 transition-transform duration-200 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent showClose={true} />
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
