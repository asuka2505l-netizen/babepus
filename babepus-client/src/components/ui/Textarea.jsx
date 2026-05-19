import { cn } from "../../utils/cn";

const Textarea = ({ error, label, className, ...props }) => (
  <label className="block">
    {label ? <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span> : null}
    <textarea
      className={cn(
        "min-h-32 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100",
        error && "border-rose-300 focus:border-rose-500 focus:ring-rose-100",
        className
      )}
      {...props}
    />
    {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : null}
  </label>
);

export default Textarea;
