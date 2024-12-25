"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { createContext, ReactNode, useState, useCallback } from "react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface Toast {
  type: ToastType;
  message: ReactNode;
  id: string;
}

interface ToastContextProps {
  showToast: (type: ToastType, message: ReactNode, delay?: number) => void;
}

export const ToastContext = createContext<ToastContextProps | null>(null);

const getToastIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    case "warning":
      return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />;
    case "error":
      return <XCircleIcon className="h-6 w-6 text-red-500" />;
    case "info":
      return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    default:
      return "";
  }
};

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Method to show toast
  const showToast = useCallback(
    (type: ToastType, message: ReactNode, delay?: number) => {
      const id = Math.random().toString(36).substring(2, 9); // Generate ID
      setToasts((prevToasts) => [...prevToasts, { type, message, id }]);

      // Automatically close the toast after delay time or 3 seconds
      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id),
        );
      }, delay ?? 3000);
    },
    [],
  );

  // Method to manually close a toast
  const closeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed right-5 top-12 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg bg-neutral-100 p-4 shadow-md transition-transform duration-300 ease-in-out dark:bg-neutral-800
              ${toast.type === "success" ? "border border-green-500" : ""}
              ${toast.type === "warning" ? "border border-yellow-400" : ""}
              ${toast.type === "error" ? "border border-red-500" : ""}
              ${toast.type === "info" ? "border border-blue-500" : ""}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-row gap-3">
                {getToastIcon(toast.type)}
                <span className="font-medium">{toast.message}</span>
              </div>
              <button onClick={() => closeToast(toast.id)} className="ml-4">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
