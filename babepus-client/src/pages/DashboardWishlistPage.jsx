import { useEffect, useState } from "react";
import ProductCard from "../components/marketplace/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { useToast } from "../hooks/useToast";
import { wishlistService } from "../services/wishlistService";

const DashboardWishlistPage = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    const data = await wishlistService.getWishlist();
    setProducts(data);
  };

  useEffect(() => {
    fetchWishlist().finally(() => setIsLoading(false));
  }, []);

  const removeWishlist = async (product) => {
    try {
      await wishlistService.remove(product.id);
      showToast({ title: "Wishlist dihapus", message: product.title });
      await fetchWishlist();
    } catch (error) {
      showToast({ type: "error", title: "Gagal menghapus wishlist", message: error.message });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[520px]" />;
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] bg-white p-5 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Wishlist</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">Barang yang Disimpan</h1>
      </div>
      {products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onWishlistToggle={removeWishlist} />
          ))}
        </div>
      ) : (
        <EmptyState title="Wishlist kosong" description="Simpan produk dari marketplace agar mudah ditemukan lagi." />
      )}
    </div>
  );
};

export default DashboardWishlistPage;
