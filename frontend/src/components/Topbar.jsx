import React from 'react';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';

const Topbar = ({
  onToggleSidebar,
  isSidebarOpen,
  actionLabel = 'Quick Action',
  searchPlaceholder = 'Search complaints, students, or rooms...',
  showActionButton = true,
  leftLabel = '',
  rightLabel = 'Hostel Serenity',
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-20 bg-page/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between z-40 transition-all border-b border-slate-200/70">
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-700"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {leftLabel && <span className="hidden lg:inline text-slate-800 font-semibold tracking-tight whitespace-nowrap">{leftLabel}</span>}

        <div className="relative group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-slate-200/60 border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-slate-300 transition-all outline-none text-slate-700 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6 pl-4 lg:pl-8">
        <div className="relative cursor-pointer transition-transform hover:scale-110 active:scale-95">
          <Bell className="w-5 h-5 text-slate-700" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-slate-500 border-2 border-page rounded-full"></span>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 pr-2">
          <span className="text-slate-700 font-medium tracking-tight">{rightLabel}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {showActionButton && (
          <button className="hidden md:flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wide transition-all">
            + {actionLabel}
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
