import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import StatCard from "../components/ui/StatCard";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";

const DashboardOverviewPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    userService
      .getDashboard()
      .then(setSummary)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Skeleton className="h-[460px]" />;
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Dashboard User</p>
        <h1 className="mt-3 text-3xl font-black">Halo, {user.fullName}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
          Kelola produk, pantau tawaran masuk, selesaikan transaksi, dan bangun rating seller dari sini.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Produk aktif" value={summary.stats.activeProducts} />
        <StatCard label="Produk terjual" value={summary.stats.soldProducts} accent="amber" />
        <StatCard label="Tawaran pending" value={summary.stats.pendingOffers} accent="sky" />
        <StatCard label="Transaksi selesai" value={summary.stats.completedTransactions} accent="slate" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-950">Produk terbaru</h2>
            <Link to="/dashboard/products">
              <Button size="sm">Kelola</Button>
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {summary.recentProducts.length ? (
              summary.recentProducts.map((product) => (
                <div key={product.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-black text-slate-950">{product.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatCurrency(product.price)} - {product.status}</p>
                </div>
              ))
            ) : (
              <EmptyState
                title="Belum ada produk"
                description="Upload barang bekas kampus pertama Anda untuk mulai menerima tawaran."
                action={
                  <Link to="/dashboard/products">
                    <Button>Upload Barang</Button>
                  </Link>
                }
              />
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-950">Tawaran masuk</h2>
            <Link to="/dashboard/offers">
              <Button size="sm" variant="secondary">Lihat semua</Button>
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {summary.recentOffers.length ? (
              summary.recentOffers.map((offer) => (
                <div key={offer.id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-black text-slate-950">{offer.productTitle}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {offer.buyerName} menawar {formatCurrency(offer.offerPrice)} pada {formatDate(offer.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Belum ada tawaran masuk.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
