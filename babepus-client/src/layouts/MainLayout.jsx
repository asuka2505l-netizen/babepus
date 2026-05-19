import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const MainLayout = () => (
  <div className="min-h-screen bg-page">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <footer className="border-t border-slate-100 bg-white py-8 text-center text-sm font-medium text-slate-500">
      BabePus membantu mahasiswa jual beli barang kampus dengan aman dan praktis.
    </footer>
  </div>
);

export default MainLayout;
