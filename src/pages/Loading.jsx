import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 border-4 border-blue-300 rounded-full border-b-transparent animate-spin reverse-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
