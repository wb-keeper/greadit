"use client";
import { useState } from "react";

const Page = () => {
  const [input, setInput] = useState();
  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6"></div>
    </div>
  );
};

export default Page;
