import React from "react";
import Input from "./ui/Input";

function Search1({ search, ...props }) {
  return <Input placeholder={search} {...props} />;
}

export default Search1;
