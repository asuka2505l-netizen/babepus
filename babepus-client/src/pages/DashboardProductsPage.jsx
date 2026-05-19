import { useEffect, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import ProductFormModal from "../features/dashboard/ProductFormModal";
import { useToast } from "../hooks/useToast";
import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import { formatCurrency } from "../utils/currency";
import { resolveImageUrl } from "../utils/image";

const DashboardProductsPage = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    const data = await productService.getMyProducts();
    setProducts(data);
  };

  useEffect(() => {
    Promise.all([categoryService.getCategories(), productService.getMyProducts()])
      .then(([categoryData, productData]) => {
        setCategories(categoryData);
        setProducts(productData);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const openCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Hapus produk "${product.title}"?`)) {
      return;
    }

    try {
      await productService.deleteProduct(product.id);
      showToast({ title: "Produk dihapus", message: "Produk tidak lagi tampil di marketplace." });
      await fetchProducts();
    } catch (error) {
      showToast({ type: "error", title: "Gagal menghapus", message: error.message });
    }
  };

  const handleMarkSold = async (product) => {
    try {
      await productService.markSold(product.id);
      showToast({ title: "Produk ditandai terjual", message: "Tawaran pending otomatis ditolak." });
      await fetchProducts();
    } catch (error) {
      showToast({ type: "error", title: "Gagal menandai terjual", message: error.message });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[520px]" />;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-[2rem] bg-white p-5 shadow-soft sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Product Management</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">Produk Saya</h1>
        </div>
        <Button onClick={openCreateModal}>Upload Barang</Button>
      </div>

      {products.length ? (
        <div className="grid gap-4">
          {products.map((product) => (
            <article key={product.id} className="grid gap-4 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-soft md:grid-cols-[160px_1fr]">
              <img src={resolveImageUrl(product.imageUrl)} alt={product.title} className="h-40 w-full rounded-2xl object-cover md:h-full" />
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-slate-950">{product.title}</h2>
                    <p className="mt-1 font-black text-emerald-700">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge value={product.status} />
                    <Badge value={product.conditionLabel} />
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
                <p className="mt-3 text-sm font-semibold text-slate-500">
                  {product.pendingOfferCount} tawaran pending - {product.category?.name}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}>
                    Edit
                  </Button>
                  {product.status === "active" ? (
                    <Button variant="secondary" onClick={() => handleMarkSold(product)}>
                      Tandai Terjual
                    </Button>
                  ) : null}
                  <Button variant="danger" onClick={() => handleDelete(product)}>
                    Hapus
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada produk" description="Upload barang bekas kampus agar bisa menerima tawaran dari mahasiswa lain." action={<Button onClick={openCreateModal}>Upload Barang</Button>} />
      )}

      <ProductFormModal
        categories={categories}
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchProducts}
      />
    </div>
  );
};

export default DashboardProductsPage;
