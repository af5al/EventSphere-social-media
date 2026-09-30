import React from "react";
import Button from "./ui/Button";

function Button2({ text, children, ...props }) {
  return (
    <Button variant="solid" text={text} type="button" {...props}>
      {children}
    </Button>
  );
}

export default Button2;