import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import DashboardSidebar from "../components/layout/DashboardSidebar";

const DashboardLayout = () => (
  <div className="min-h-screen bg-page">
    <Navbar />
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <DashboardSidebar />
      <main>
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;
