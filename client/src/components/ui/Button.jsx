import React from "react";

export function Button({
  children,
  text,
  variant = "outline",
  size = "md",
  className = "",
  ...props
}) {
  const content = children || text;

  const baseStyles =
    "font-medium flex items-center justify-center transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "h-8 px-3 text-xs rounded-lg",
    md: "h-10 px-4 text-xs sm:text-sm rounded-xl",
    lg: "h-12 px-6 text-sm sm:text-base rounded-xl",
  };

  const variantStyles = {
    outline:
      "border border-indigo-500/40 text-indigo-300 hover:text-white hover:bg-indigo-600/20 hover:border-indigo-500/80 rounded-full w-full shadow-sm",
    solid:
      "rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 shadow-sm hover:text-white",
    primary:
      "rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20 focus-visible:outline-indigo-600 font-semibold",
    ghost:
      "rounded-xl text-slate-300 hover:text-white hover:bg-white/10",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
    variantStyles[variant] || variantStyles.outline
  } ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
}

export default Button;
