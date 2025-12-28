import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center py-10 w-full">
      <div className="w-6 h-6 border-4 border-light border-t-orange-500 rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-500 font-DMsans">Processing...</span>
    </div>
  );
};

export default Loading;
