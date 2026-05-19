import { createContext, useState } from "react";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const showToast = ({ type = "success", title, message }) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, type, title, message }]);
    window.setTimeout(() => removeToast(id), 4000);
  };

  return (
    <ToastContext.Provider value={{ removeToast, showToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};
