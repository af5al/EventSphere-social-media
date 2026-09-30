import React from "react";
import Heading from "./ui/Heading";

function Myh1({ title, children, ...props }) {
  return (
    <Heading title={title} {...props}>
      {children}
    </Heading>
  );
}

export default Myh1;