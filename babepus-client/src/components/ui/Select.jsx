import { cn } from "../../utils/cn";

const Select = ({ children, error, label, className, ...props }) => (
  <label className="block">
    {label ? <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span> : null}
    <select
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100",
        error && "border-rose-300 focus:border-rose-500 focus:ring-rose-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : null}
  </label>
);

export default Select;
