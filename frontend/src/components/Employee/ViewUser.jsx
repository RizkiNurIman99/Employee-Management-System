import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

const StatusPill = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "On-Time":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Late":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      case "Absent":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-base font-semibold ${getStatusColor()}`}>
      {status}
    </span>
  );
};

const ViewUser = ({ isOpen, setIsOpen, user, fields, side = "right" }) => {
  const [show, setShow] = useState(false);

  const getAvatarUrl = (picture) =>
    `${import.meta.env.VITE_IMAGE_BASE_URL}/avatar/${picture || "default-avatar.png"}`;

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setShow(true);
      }, 10);
      return () => clearInterval(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);
  if (!user) return null;
  return (
    <div
      id={`dialog-${side}`}
      aria-labelledby="slide-over"
      role="dialog"
      aria-modal="true"
      aria-hidden={false}
      className={`relative z-[100] font-DMsans ${
        isOpen ? "" : "pointer-events-none"
      }`}>
      {/* backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`transition-opacity duration-500 ease-in-out fixed inset-0 bg-black/50 backdrop-blur-sm ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`transform transition-transform duration-500 ease-in-out fixed inset-y-0 right-0 w-screen max-w-md bg-white dark:bg-dark flex flex-col overflow-y-auto ${
          show ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex items-center justify-between border-b border-b-border dark:border-b-border p-4">
          <h2 id="slide-over" className="text-lg font-semibold">
            Employee Details
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overvlow-y-auto">
          <div className=" p-6 text-center border-b border-b-border dark:border-b-border">
            <img
              src={getAvatarUrl(user.picture)}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/avatar/default-avatar.png`;
              }}
              alt="Avatar"
              className="object-cover size-24 ring-offset-2 ring-orange-500 rounded-full mx-auto"
            />
            <h1 className="mt-4 text-xl font-DMsans font-bold text-dark dark:text-white">
              {user.name}
            </h1>
            <p className="text-sm text-dark dark:text-white">{user.role}</p>
          </div>
          <div className="p-6 border-b border-b-border dark:border-b-border">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className={
                    field.key === "status" ? "sm:cols-span-3" : "sm:col-span-1"
                  }>
                  <dt>{field.label}</dt>
                  <dd className="mt-1 text-base font-semibold text-dark dark:text-white">
                    {field.key === "status" ? (
                      <StatusPill status={user[field.key]} />
                    ) : field.formatter ? (
                      field.formatter(user[field.key])
                    ) : (
                      user[field.key] || "---"
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="p-4 flex justify-end mt-5">
            <Button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-dark dark:text-white bg-red-500 hover:bg-red-700">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
