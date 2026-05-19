import { useToast } from "../../hooks/useToast";
import { cn } from "../../utils/cn";

const toneMap = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-sky-200 bg-sky-50 text-sky-900"
};

const ToastViewport = () => {
  const { removeToast, toasts } = useToast();

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={cn(
            "rounded-2xl border p-4 text-left shadow-soft transition hover:-translate-y-0.5",
            toneMap[toast.type] || toneMap.info
          )}
        >
          <p className="font-black">{toast.title}</p>
          {toast.message ? <p className="mt-1 text-sm opacity-80">{toast.message}</p> : null}
        </button>
      ))}
    </div>
  );
};

export default ToastViewport;
