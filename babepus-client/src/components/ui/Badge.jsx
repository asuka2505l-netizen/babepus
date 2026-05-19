import { cn } from "../../utils/cn";

const toneMap = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  sold: "bg-amber-50 text-amber-700 ring-amber-100",
  archived: "bg-slate-100 text-slate-600 ring-slate-200",
  pending: "bg-sky-50 text-sky-700 ring-sky-100",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  rejected: "bg-rose-50 text-rose-700 ring-rose-100",
  auto_rejected: "bg-slate-100 text-slate-600 ring-slate-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  pending_meetup: "bg-amber-50 text-amber-700 ring-amber-100",
  default: "bg-slate-100 text-slate-700 ring-slate-200"
};

const labelMap = {
  active: "Aktif",
  sold: "Terjual",
  archived: "Diarsipkan",
  pending: "Pending",
  accepted: "Diterima",
  rejected: "Ditolak",
  auto_rejected: "Otomatis ditolak",
  completed: "Selesai",
  pending_meetup: "Menunggu meetup",
  like_new: "Seperti baru",
  good: "Bagus",
  fair: "Layak pakai",
  needs_repair: "Perlu perbaikan"
};

const Badge = ({ value, children, className }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1",
      toneMap[value] || toneMap.default,
      className
    )}
  >
    {children || labelMap[value] || value}
  </span>
);

export default Badge;
