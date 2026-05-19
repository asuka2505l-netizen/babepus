import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Ringkasan", end: true },
  { to: "/dashboard/products", label: "Produk Saya" },
  { to: "/dashboard/offers", label: "Tawaran" },
  { to: "/dashboard/transactions", label: "Transaksi" },
  { to: "/dashboard/wishlist", label: "Wishlist" },
  { to: "/dashboard/chat", label: "Chat" },
  { to: "/dashboard/analytics", label: "Analytics" },
  { to: "/dashboard/profile", label: "Profil" }
];

const DashboardSidebar = () => (
  <aside className="rounded-3xl border border-slate-100 bg-white p-3 shadow-soft lg:sticky lg:top-24 lg:h-fit">
    <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Dashboard</p>
    <nav className="grid gap-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          end={link.end}
          to={link.to}
          className={({ isActive }) =>
            `rounded-2xl px-4 py-3 text-sm font-bold transition ${
              isActive ? "bg-emerald-600 text-white shadow-soft" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default DashboardSidebar;
