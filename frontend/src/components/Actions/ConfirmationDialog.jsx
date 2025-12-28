import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  textButtonClose,
  textButtonConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-DMsans">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative m-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-surface_dark"
        role="dialog"
        aria-modal="true">
        <div className="flex items-start gap-4">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
            <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-500" />
          </div>
          <div className="flex-1">
            <h3
              className="text-lg font-bold text-gray-900 dark:text-gray-100"
              id="modal-title">
              {title || "Konfirmasi Tindakan"}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {message ||
                "Apakah Anda yakin ingin melanjutkan? Tindakan ini tidak dapat diurungkan."}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {textButtonClose}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {textButtonConfirm}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
