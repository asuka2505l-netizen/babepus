import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider.");
  }

  return context;
};
