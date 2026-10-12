import React from "react";

const StatusPill = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "On-Time":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "Late":
        return "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-500";
      case "Absent":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-500";
      case "Sick":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-500";
      case "Leave":
        return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  const getDotColor = () => {
    switch (status) {
      case "On-Time":
        return "bg-green-500";
      case "Late":
        return "bg-red-500";
      case "Absent":
        return "bg-violet-500";
      case "Sick":
        return "bg-pink-500";
      case "Leave":
        return "bg-violet-500";
      default:
        return "bg-gray-400";
    }
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor()}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${getDotColor()}`} />
      {status}
    </span>
  );
};

export default StatusPill;
