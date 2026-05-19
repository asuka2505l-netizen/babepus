import { useEffect, useState } from "react";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import StatCard from "../components/ui/StatCard";
import { userService } from "../services/userService";
import { formatCurrency } from "../utils/currency";

const SellerAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    userService
      .getAnalytics()
      .then(setAnalytics)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Skeleton className="h-[520px]" />;
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] bg-white p-5 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Seller Analytics</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">Performa Jualan</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total views" value={analytics.totalViews} />
        <StatCard label="Wishlist" value={analytics.wishlistCount} accent="amber" />
        <StatCard label="Revenue selesai" value={formatCurrency(analytics.grossRevenue)} accent="sky" />
        <StatCard label="Acceptance rate" value={`${analytics.offerAcceptanceRate}%`} accent="slate" />
      </div>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">Produk paling diminati</h2>
        {analytics.topProducts.length ? (
          <div className="mt-4 grid gap-3">
            {analytics.topProducts.map((product) => (
              <div key={product.id} className="grid gap-2 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-black text-slate-950">{product.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {product.viewCount} views - {product.wishlistCount} wishlist - {product.offerCount} tawaran
                  </p>
                </div>
                <p className="font-black text-emerald-700">{formatCurrency(product.price)}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Analytics belum tersedia" description="Upload produk dan tunggu interaksi pembeli untuk melihat analytics." />
        )}
      </section>
    </div>
  );
};

export default SellerAnalyticsPage;
