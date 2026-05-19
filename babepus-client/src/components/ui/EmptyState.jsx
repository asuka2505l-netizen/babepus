const EmptyState = ({ title, description, action }) => (
  <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-soft">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
      BP
    </div>
    <h3 className="text-lg font-black text-slate-900">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;
