import React from "react";
import { Construction, Clock } from "lucide-react";

const ManageUser = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center max-w-lg">
        <Construction className="w-16 h-16 text-blue-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Page Under Construction
        </h1>
        <p className="text-gray-600 mb-6">
          We are currently working on this feature to make it available soon.
          Thank you for your patience!
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Update coming soon</span>
        </div>
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} - RFID Attendance System
      </footer>
    </div>
  );
};

export default ManageUser;
