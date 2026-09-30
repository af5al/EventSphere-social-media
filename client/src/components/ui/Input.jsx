import React from "react";

export function Input({
  className = "",
  placeholder = "",
  type = "text",
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`myDivBg border myBorder w-48 h-8 px-3 p-2 mr-4 text-sm text-white rounded-md focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all ${className}`}
      {...props}
    />
  );
}

export default Input;
