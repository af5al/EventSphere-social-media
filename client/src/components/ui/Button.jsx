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
    "font-semibold flex items-center justify-center transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-8 md:h-10 px-4 text-xs sm:text-sm",
    lg: "h-11 px-6 text-sm sm:text-base",
  };

  const variantStyles = {
    outline:
      "myBorder myTextColor border-2 rounded-full hover:bg-[#0f1015] w-full",
    solid:
      "rounded-md bg-[#969696] p-2 text-white shadow-sm hover:bg-[#0f1015] focus-visible:outline-indigo-600",
    primary:
      "rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus-visible:outline-indigo-600",
    ghost:
      "rounded-md text-gray-300 hover:text-white hover:bg-white/10",
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
