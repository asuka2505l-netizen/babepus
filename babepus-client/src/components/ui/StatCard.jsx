const accentMap = {
  emerald: "text-emerald-700",
  amber: "text-amber-700",
  sky: "text-sky-700",
  rose: "text-rose-700",
  slate: "text-slate-900"
};

const StatCard = ({ label, value, accent = "emerald" }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className={`mt-3 text-3xl font-black ${accentMap[accent] || accentMap.emerald}`}>{value}</p>
  </div>
);

export default StatCard;
