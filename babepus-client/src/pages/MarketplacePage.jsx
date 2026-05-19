import { useCallback, useEffect, useState } from "react";
import ProductCard from "../components/marketplace/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import Skeleton from "../components/ui/Skeleton";
import MarketplaceFilters from "../features/marketplace/MarketplaceFilters";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import { wishlistService } from "../services/wishlistService";

const initialFilters = {
  search: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  faculty: "",
  sort: "latest",
  page: 1
};

const MarketplacePage = () => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const debouncedSearch = useDebounce(filters.search, 450);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value, page: 1 }));
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await productService.getProducts({
        search: debouncedSearch,
        categoryId: filters.categoryId,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        faculty: filters.faculty,
        sort: filters.sort,
        page: filters.page,
        limit: 12
      });
      setProducts(result.products || []);
      setMeta(result.meta || null);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast({ type: "error", title: "Error", message: error.message || "Gagal mengambil data produk" });
      setProducts([]);
      setMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filters.categoryId, filters.faculty, filters.maxPrice, filters.minPrice, filters.page, filters.sort, showToast]);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      showToast({ type: "error", title: "Login diperlukan", message: "Login dulu untuk menyimpan wishlist." });
      return;
    }

    try {
      if (product.isWishlisted) {
        await wishlistService.remove(product.id);
      } else {
        await wishlistService.add(product.id);
      }
      await fetchProducts();
    } catch (error) {
      showToast({ type: "error", title: "Wishlist gagal", message: error.message });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] bg-hero p-6 shadow-soft md:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-700">BabePus Marketplace</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-6xl">
            Barang kampus bekas, harga mahasiswa, transaksi lebih tenang.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Cari kebutuhan kuliah dari mahasiswa lain. Produk Anda sendiri otomatis disembunyikan ketika login.
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        <MarketplaceFilters
          categories={categories}
          filters={filters}
          onChange={updateFilter}
          onReset={() => setFilters(initialFilters)}
        />
        <section className="grid gap-5">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-80" />
              ))}
            </div>
          ) : products.length ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onWishlistToggle={toggleWishlist} />
                ))}
              </div>
              <Pagination meta={meta} onPageChange={(page) => setFilters((current) => ({ ...current, page }))} />
            </>
          ) : (
            <EmptyState
              title="Produk belum ditemukan"
              description="Coba ubah kata kunci, kategori, atau rentang harga untuk menemukan barang kampus yang cocok."
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default MarketplacePage;
