import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";

const navClass = ({ isActive }) =>
  `rounded-xl px-3 py-2 text-sm font-bold transition ${
    isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/marketplace");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/marketplace" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-black text-white shadow-soft">
            BP
          </span>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-950">BabePus</p>
            <p className="-mt-1 text-xs font-semibold text-emerald-700">Barang Bekas Kampus</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/marketplace" className={navClass}>
            Marketplace
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
          ) : null}
          {user?.role === "admin" ? (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <span className="hidden text-sm font-semibold text-slate-600 sm:block">
                {user.fullName}
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>Daftar</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
