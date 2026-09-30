import React from "react";

export function Heading({
  title,
  children,
  as: Component = "h1",
  className = "",
  ...props
}) {
  const content = children || title;
  return (
    <Component
      className={`myTextColor uppercase text-sm md:text-xl lg:text-2xl font-bold tracking-tight ${className}`}
      {...props}
    >
      {content}
    </Component>
  );
}

export default Heading;
