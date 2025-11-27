import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p className="text-gray-800 mt-3">Loading...</p>
    </div>
  );
};

export default Loader;
