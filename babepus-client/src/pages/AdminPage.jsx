import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import StatCard from "../components/ui/StatCard";
import { useToast } from "../hooks/useToast";
import { adminService } from "../services/adminService";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";

const AdminPage = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    const [statsData, userData, productData, reportData] = await Promise.all([
      adminService.getDashboard(),
      adminService.getUsers(),
      adminService.getProducts(),
      adminService.getReports()
    ]);
    setStats(statsData);
    setUsers(userData);
    setProducts(productData);
    setReports(reportData);
  };

  useEffect(() => {
    fetchAdminData().finally(() => setIsLoading(false));
  }, []);

  const toggleSuspend = async (user) => {
    try {
      await adminService.suspendUser(user.id, !user.isSuspended);
      showToast({
        title: !user.isSuspended ? "User disuspend" : "Suspend dibuka",
        message: user.fullName
      });
      await fetchAdminData();
    } catch (error) {
      showToast({ type: "error", title: "Gagal mengubah user", message: error.message });
    }
  };

  const updateReport = async (report, status) => {
    try {
      await adminService.updateReportStatus(report.id, { status, adminNote: `Ditandai ${status} oleh admin.` });
      showToast({ title: "Laporan diperbarui", message: `Status laporan menjadi ${status}.` });
      await fetchAdminData();
    } catch (error) {
      showToast({ type: "error", title: "Gagal update laporan", message: error.message });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-[640px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Admin Panel</p>
          <h1 className="mt-3 text-3xl font-black">Moderasi BabePus</h1>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Pantau user, produk, transaksi, laporan, dan suspend akun bermasalah dari satu tempat.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-5">
          <StatCard label="User" value={stats.totalUsers} />
          <StatCard label="Produk aktif" value={stats.activeProducts} accent="sky" />
          <StatCard label="Produk terjual" value={stats.soldProducts} accent="amber" />
          <StatCard label="Laporan pending" value={stats.pendingReports} accent="rose" />
          <StatCard label="User suspend" value={stats.suspendedUsers} accent="slate" />
        </div>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-slate-950">Kelola User</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-3">User</th>
                  <th>Kampus</th>
                  <th>Role</th>
                  <th>Produk</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4">
                      <p className="font-black text-slate-950">{item.fullName}</p>
                      <p className="text-slate-500">{item.email}</p>
                    </td>
                    <td>{item.campus}</td>
                    <td>{item.role}</td>
                    <td>{item.productCount}</td>
                    <td>{item.isSuspended ? "Suspended" : "Active"}</td>
                    <td>
                      {item.role !== "admin" ? (
                        <Button size="sm" variant={item.isSuspended ? "secondary" : "danger"} onClick={() => toggleSuspend(item)}>
                          {item.isSuspended ? "Buka Suspend" : "Suspend"}
                        </Button>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-slate-950">Produk terbaru</h2>
            <div className="mt-4 grid gap-3">
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">{product.title}</p>
                      <p className="text-sm text-slate-500">{product.sellerName} - {formatCurrency(product.price)}</p>
                    </div>
                    <Badge value={product.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-slate-950">Tangani laporan</h2>
            <div className="mt-4 grid gap-3">
              {reports.length ? (
                reports.map((report) => (
                  <div key={report.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-slate-950">
                          {report.targetType === "product" ? report.targetProductTitle : report.targetUserName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Dilaporkan oleh {report.reporterName} pada {formatDate(report.createdAt)}
                        </p>
                      </div>
                      <Badge value={report.status} />
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-700">{report.reason}</p>
                    <p className="mt-1 text-sm text-slate-500">{report.details || "Tidak ada detail tambahan."}</p>
                    {report.status === "pending" ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" onClick={() => updateReport(report, "reviewed")}>Review</Button>
                        <Button size="sm" variant="secondary" onClick={() => updateReport(report, "resolved")}>Resolve</Button>
                        <Button size="sm" variant="danger" onClick={() => updateReport(report, "rejected")}>Reject</Button>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <EmptyState title="Tidak ada laporan" description="Laporan user dan produk akan muncul di sini." />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
