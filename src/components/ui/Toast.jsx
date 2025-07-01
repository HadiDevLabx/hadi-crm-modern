import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/shadcn-utils";
import Icon from "../AppIcon";

// Create context
const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

// Toast types
const TOAST_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
};

// Icons for each toast type
const TOAST_ICONS = {
  [TOAST_TYPES.INFO]: "Info",
  [TOAST_TYPES.SUCCESS]: "CheckCircle",
  [TOAST_TYPES.WARNING]: "AlertTriangle",
  [TOAST_TYPES.ERROR]: "XCircle",
};

// Toast colors for each type
const TOAST_COLORS = {
  [TOAST_TYPES.INFO]: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300",
  [TOAST_TYPES.SUCCESS]: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300",
  [TOAST_TYPES.WARNING]: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300",
  [TOAST_TYPES.ERROR]: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300",
};

// Toast icon colors
const TOAST_ICON_COLORS = {
  [TOAST_TYPES.INFO]: "text-blue-500 dark:text-blue-400",
  [TOAST_TYPES.SUCCESS]: "text-green-500 dark:text-green-400",
  [TOAST_TYPES.WARNING]: "text-yellow-500 dark:text-yellow-400",
  [TOAST_TYPES.ERROR]: "text-red-500 dark:text-red-400",
};

// ToastProvider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ type = TOAST_TYPES.INFO, title, message, duration = 5000, action }) => {
    const id = Date.now().toString();
    const newToast = { id, type, title, message, duration, action };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-dismiss toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    // Convenience methods
    info: (props) => addToast({ ...props, type: TOAST_TYPES.INFO }),
    success: (props) => addToast({ ...props, type: TOAST_TYPES.SUCCESS }),
    warning: (props) => addToast({ ...props, type: TOAST_TYPES.WARNING }),
    error: (props) => addToast({ ...props, type: TOAST_TYPES.ERROR }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Individual Toast component
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    // Close on escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-full max-w-sm rounded-lg shadow-lg border p-4 pointer-events-auto",
        "flex items-start gap-3",
        TOAST_COLORS[toast.type]
      )}
      role="alert"
    >
      <div className={cn("flex-shrink-0", TOAST_ICON_COLORS[toast.type])}>
        <Icon name={TOAST_ICONS[toast.type]} size={20} />
      </div>
      <div className="flex-1 pt-0.5">
        {toast.title && (
          <p className="font-medium mb-1">{toast.title}</p>
        )}
        <p className="text-sm">{toast.message}</p>
        {toast.action && (
          <div className="mt-2">
            <button
              className={cn(
                "text-sm font-medium",
                {
                  "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300": toast.type === TOAST_TYPES.INFO,
                  "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300": toast.type === TOAST_TYPES.SUCCESS,
                  "text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300": toast.type === TOAST_TYPES.WARNING,
                  "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300": toast.type === TOAST_TYPES.ERROR,
                }
              )}
              onClick={toast.action.onClick}
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>
      <button
        className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <Icon name="X" size={16} />
      </button>
    </motion.div>
  );
};

// ToastContainer to display all toasts
const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-xs sm:max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export { TOAST_TYPES };
