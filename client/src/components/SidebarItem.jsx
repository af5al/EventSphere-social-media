import React from "react";

function SidebarItem({
  icon,
  href,
  label,
  NotfCount,
  MsgCount,
  clickedOn,
  ...props
}) {
  const isActive = clickedOn === label;

  return (
    <button
      {...props}
      className={`relative flex w-[calc(100%-16px)] mx-2 my-1 items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
        isActive
          ? "bg-indigo-500/15 text-indigo-400 font-semibold border border-indigo-500/25 shadow-sm shadow-indigo-500/10"
          : "text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3 w-full">
        <span className={`text-lg transition-transform duration-200 ${isActive ? "text-indigo-400 scale-105" : "text-slate-400"}`}>
          {icon}
        </span>
        <span className="tracking-wide text-sm">{label}</span>

        {/* Badges */}
        {label === "Notifications" && NotfCount > 0 && (
          <span className="ml-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {NotfCount > 99 ? "99+" : NotfCount}
          </span>
        )}
        {label === "Messages" && MsgCount > 0 && (
          <span className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {MsgCount > 99 ? "99+" : MsgCount}
          </span>
        )}
      </div>
    </button>
  );
}

export default SidebarItem;
