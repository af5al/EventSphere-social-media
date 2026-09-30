import React from "react";
import Button from "./ui/Button";

function Button1({ text, children, ...props }) {
  return (
    <Button variant="outline" text={text} {...props}>
      {children}
    </Button>
  );
}

export default Button1;
