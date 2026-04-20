import React from "react";
import {
  LayoutDashboard,
  History,
  User as UserIcon,
  LogOut,
} from "lucide-react";

export function Sidebar({
  username,
  activeTab,
  setActiveTab,
  setSolvingQuestion,
  handleLogout,
}) {
  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setSolvingQuestion(null);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-blue-600 tracking-tight">
          InterviewHub
        </h2>
      </div>
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 py-4 mb-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Welcome back
          </p>
          <p className="text-sm font-bold text-slate-800">{username}</p>
        </div>
        <button
          onClick={() => switchTab("library")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === "library" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          <LayoutDashboard size={18} /> Question Library
        </button>
        <button
          onClick={() => switchTab("history")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === "history" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          <History size={18} /> Past Interviews
        </button>
        <button
          onClick={() => switchTab("profile")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${activeTab === "profile" ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          <UserIcon size={18} /> My Profile
        </button>
      </div>
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium transition-colors"
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  );
}
