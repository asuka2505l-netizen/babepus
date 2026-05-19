import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Skeleton from "../components/ui/Skeleton";
import Textarea from "../components/ui/Textarea";
import OfferComposer from "../features/marketplace/OfferComposer";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { productService } from "../services/productService";
import { reportService } from "../services/reportService";
import { wishlistService } from "../services/wishlistService";
import { chatService } from "../services/chatService";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";
import { resolveImageUrl } from "../utils/image";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [report, setReport] = useState({ targetType: "product", reason: "", details: "" });

  useEffect(() => {
    setIsLoading(true);
    productService
      .getProduct(id)
      .then(setProduct)
      .finally(() => setIsLoading(false));
  }, [id]);

  const submitReport = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      showToast({ type: "error", title: "Login diperlukan", message: "Login dulu untuk mengirim laporan." });
      return;
    }

    try {
      await reportService.createReport({
        targetType: report.targetType,
        targetProductId: report.targetType === "product" ? product.id : undefined,
        targetUserId: report.targetType === "user" ? product.seller.id : undefined,
        reason: report.reason,
        details: report.details
      });
      setReport({ targetType: "product", reason: "", details: "" });
      showToast({ title: "Laporan terkirim", message: "Admin akan meninjau laporan Anda." });
    } catch (error) {
      showToast({ type: "error", title: "Gagal melapor", message: error.message });
    }
  };

  const toggleWishlist = async () => {
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
      const updatedProduct = await productService.getProduct(product.id);
      setProduct(updatedProduct);
      showToast({ title: product.isWishlisted ? "Wishlist dihapus" : "Wishlist disimpan" });
    } catch (error) {
      showToast({ type: "error", title: "Wishlist gagal", message: error.message });
    }
  };

  const startChat = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      showToast({ type: "error", title: "Login diperlukan", message: "Login dulu untuk chat seller." });
      return;
    }

    try {
      await chatService.startConversation({
        productId: product.id,
        message: chatMessage || `Halo, saya tertarik dengan ${product.title}.`
      });
      setChatMessage("");
      showToast({ title: "Chat terkirim", message: "Seller akan menerima notifikasi realtime." });
    } catch (error) {
      showToast({ type: "error", title: "Gagal mengirim chat", message: error.message });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_420px]">
        <Skeleton className="h-[480px]" />
        <Skeleton className="h-[480px]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState title="Produk tidak ditemukan" description="Produk mungkin sudah dihapus atau tidak tersedia." />
      </div>
    );
  }

  const canOffer = isAuthenticated && !product.isOwner && product.status === "active";

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
        <div className="overflow-hidden rounded-3xl bg-emerald-50">
          <img src={resolveImageUrl(product.imageUrl)} alt={product.title} className="h-full max-h-[560px] w-full object-cover" />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge value={product.status} />
          <Badge value={product.conditionLabel} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{product.category?.name}</span>
        </div>
        <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-5xl">{product.title}</h1>
        <p className="mt-3 text-3xl font-black text-emerald-700">{formatCurrency(product.price)}</p>
        <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">{product.description}</p>
      </section>

      <aside className="grid gap-5 lg:h-fit">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Seller</p>
          <h2 className="mt-3 text-xl font-black text-slate-950">{product.seller.fullName}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{product.seller.campus}</p>
          <p className="mt-3 text-sm font-bold text-amber-600">
            Rating seller {product.seller.ratingAverage || "0.00"}/5 dari {product.seller.ratingCount || 0} review
          </p>
          <p className="mt-3 text-sm text-slate-500">Lokasi: {product.campusLocation}</p>
          {product.faculty ? <p className="mt-1 text-sm text-slate-500">Fakultas: {product.faculty}</p> : null}
          {product.isOwner ? (
            <Link to="/dashboard/products" className="mt-4 block">
              <Button className="w-full">Kelola Produk</Button>
            </Link>
          ) : null}
          {!product.isOwner ? (
            <Button className="mt-3 w-full" variant="secondary" onClick={toggleWishlist}>
              {product.isWishlisted ? "Hapus dari Wishlist" : "Tambah Wishlist"}
            </Button>
          ) : null}
        </div>

        {canOffer ? <OfferComposer product={product} /> : null}
        {isAuthenticated && !product.isOwner ? (
          <form onSubmit={startChat} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
            <h3 className="text-lg font-black text-slate-950">Chat realtime seller</h3>
            <Textarea
              className="mt-4"
              placeholder="Tulis pesan untuk seller"
              value={chatMessage}
              onChange={(event) => setChatMessage(event.target.value)}
            />
            <Button className="mt-3 w-full" type="submit">Kirim Chat</Button>
          </form>
        ) : null}
        {!isAuthenticated ? (
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <h3 className="text-lg font-black">Login untuk menawar</h3>
            <p className="mt-2 text-sm text-slate-300">Akun diperlukan agar seller bisa melihat profil penawar.</p>
            <Link to="/login" className="mt-4 block">
              <Button className="w-full" variant="primary">Login</Button>
            </Link>
          </div>
        ) : null}

        <form onSubmit={submitReport} className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-black text-slate-950">Laporkan</h3>
          <div className="mt-4 grid gap-3">
            <Select value={report.targetType} onChange={(event) => setReport((current) => ({ ...current, targetType: event.target.value }))}>
              <option value="product">Laporkan produk</option>
              <option value="user">Laporkan seller</option>
            </Select>
            <Input
              required
              placeholder="Alasan singkat"
              value={report.reason}
              onChange={(event) => setReport((current) => ({ ...current, reason: event.target.value }))}
            />
            <Textarea
              placeholder="Detail laporan"
              value={report.details}
              onChange={(event) => setReport((current) => ({ ...current, details: event.target.value }))}
            />
            <Button type="submit" variant="secondary">Kirim laporan</Button>
          </div>
        </form>

        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-black text-slate-950">Review seller</h3>
          <div className="mt-4 grid gap-3">
            {product.reviews?.length ? (
              product.reviews.map((review) => (
                <div key={review.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-slate-900">{review.reviewerName}</p>
                  <p className="text-sm font-black text-amber-600">{review.rating}/5</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  {review.communicationRating ? <span>Komunikasi {review.communicationRating}/5</span> : null}
                  {review.itemAccuracyRating ? <span>Akurasi {review.itemAccuracyRating}/5</span> : null}
                  {review.meetupRating ? <span>Meetup {review.meetupRating}/5</span> : null}
                </div>
                {review.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {review.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{tag}</span>
                    ))}
                  </div>
                ) : null}
                  <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment || "Tidak ada komentar."}</p>
                  <p className="mt-2 text-xs font-medium text-slate-400">{formatDate(review.createdAt)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Seller belum memiliki review.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ProductDetailPage;
