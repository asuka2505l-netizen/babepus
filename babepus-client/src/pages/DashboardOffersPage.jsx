import { useEffect, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { useToast } from "../hooks/useToast";
import { offerService } from "../services/offerService";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";

const OfferCard = ({ offer, mode, onAccept, onReject }) => (
  <article className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-slate-500">{mode === "incoming" ? offer.buyer.fullName : offer.seller.fullName}</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">{offer.product.title}</h2>
      </div>
      <Badge value={offer.status} />
    </div>
    <p className="mt-4 text-2xl font-black text-emerald-700">{formatCurrency(offer.offerPrice)}</p>
    <p className="mt-2 text-sm leading-6 text-slate-600">{offer.note || "Tidak ada catatan."}</p>
    <p className="mt-3 text-xs font-semibold text-slate-400">{formatDate(offer.createdAt)}</p>
    {mode === "incoming" && offer.status === "pending" ? (
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => onAccept(offer.id)}>Accept</Button>
        <Button variant="danger" onClick={() => onReject(offer.id)}>Reject</Button>
      </div>
    ) : null}
  </article>
);

const DashboardOffersPage = () => {
  const { showToast } = useToast();
  const [incomingOffers, setIncomingOffers] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOffers = async () => {
    const [incoming, mine] = await Promise.all([offerService.getIncoming(), offerService.getMyOffers()]);
    setIncomingOffers(incoming);
    setMyOffers(mine);
  };

  useEffect(() => {
    fetchOffers().finally(() => setIsLoading(false));
  }, []);

  const handleAccept = async (id) => {
    try {
      await offerService.accept(id);
      showToast({ title: "Tawaran diterima", message: "Transaksi otomatis berhasil dibuat." });
      await fetchOffers();
    } catch (error) {
      showToast({ type: "error", title: "Gagal menerima tawaran", message: error.message });
    }
  };

  const handleReject = async (id) => {
    try {
      await offerService.reject(id);
      showToast({ title: "Tawaran ditolak", message: "Status tawaran berhasil diperbarui." });
      await fetchOffers();
    } catch (error) {
      showToast({ type: "error", title: "Gagal menolak tawaran", message: error.message });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[520px]" />;
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] bg-white p-5 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Offer System</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">Tawaran Masuk & Riwayat</h1>
      </div>

      <section className="grid gap-4">
        <h2 className="text-xl font-black text-slate-950">Tawaran masuk</h2>
        {incomingOffers.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {incomingOffers.map((offer) => (
              <OfferCard key={offer.id} mode="incoming" offer={offer} onAccept={handleAccept} onReject={handleReject} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada tawaran masuk" description="Ketika mahasiswa menawar produk Anda, tawarannya akan muncul di sini." />
        )}
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-black text-slate-950">Tawaran saya</h2>
        {myOffers.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {myOffers.map((offer) => (
              <OfferCard key={offer.id} mode="mine" offer={offer} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum pernah menawar" description="Tawaran yang Anda kirim ke seller lain akan tampil sebagai riwayat." />
        )}
      </section>
    </div>
  );
};

export default DashboardOffersPage;
