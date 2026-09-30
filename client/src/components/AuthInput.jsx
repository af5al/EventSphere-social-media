import React from "react";

function AuthInput({ className = "", ...props }) {
  return (
    <div className="py-2 w-full">
      <input
        {...props}
        className={`bg-[#111726] text-slate-100 placeholder:text-slate-500 block w-full rounded-xl px-4 py-3.5 border border-[#1F293D] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all duration-200 text-sm sm:text-base font-normal shadow-sm ${className}`}
      />
    </div>
  );
}

export default AuthInput;
