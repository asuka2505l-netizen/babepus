import { useEffect, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Select from "../components/ui/Select";
import Skeleton from "../components/ui/Skeleton";
import Textarea from "../components/ui/Textarea";
import { useToast } from "../hooks/useToast";
import { reviewService } from "../services/reviewService";
import { transactionService } from "../services/transactionService";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";

const DashboardTransactionsPage = () => {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [reviewForms, setReviewForms] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    const data = await transactionService.getMyTransactions();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions().finally(() => setIsLoading(false));
  }, []);

  const completeTransaction = async (id) => {
    try {
      await transactionService.complete(id);
      showToast({ title: "Transaksi selesai", message: "Pembeli sekarang dapat memberi review seller." });
      await fetchTransactions();
    } catch (error) {
      showToast({ type: "error", title: "Gagal menyelesaikan transaksi", message: error.message });
    }
  };

  const confirmEscrow = async (transaction) => {
    try {
      if (transaction.myRole === "buyer") {
        await transactionService.buyerConfirm(transaction.id);
        showToast({ title: "Barang diterima", message: "Konfirmasi pembeli berhasil disimpan." });
      } else {
        await transactionService.sellerConfirm(transaction.id);
        showToast({ title: "Barang diserahkan", message: "Konfirmasi seller berhasil disimpan." });
      }
      await fetchTransactions();
    } catch (error) {
      showToast({ type: "error", title: "Konfirmasi escrow gagal", message: error.message });
    }
  };

  const disputeEscrow = async (transaction) => {
    try {
      await transactionService.dispute(transaction.id, "Dispute dibuat dari dashboard.");
      showToast({ title: "Dispute dibuat", message: "Admin dapat meninjau transaksi escrow ini." });
      await fetchTransactions();
    } catch (error) {
      showToast({ type: "error", title: "Dispute gagal", message: error.message });
    }
  };

  const updateReviewForm = (id, field, value) => {
    setReviewForms((current) => ({
      ...current,
      [id]: { rating: 5, comment: "", ...current[id], [field]: value }
    }));
  };

  const submitReview = async (event, transactionId) => {
    event.preventDefault();
    const review = { rating: 5, comment: "", ...reviewForms[transactionId] };

    try {
      await reviewService.createReview({
        transactionId,
        rating: Number(review.rating),
        communicationRating: Number(review.communicationRating || review.rating),
        itemAccuracyRating: Number(review.itemAccuracyRating || review.rating),
        meetupRating: Number(review.meetupRating || review.rating),
        tags: String(review.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isAnonymous: Boolean(review.isAnonymous),
        comment: review.comment
      });
      showToast({ title: "Review terkirim", message: "Rating seller berhasil diperbarui." });
      await fetchTransactions();
    } catch (error) {
      showToast({ type: "error", title: "Gagal mengirim review", message: error.message });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[520px]" />;
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] bg-white p-5 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Transaksi</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">Transaksi Saya</h1>
      </div>

      {transactions.length ? (
        <div className="grid gap-4">
          {transactions.map((transaction) => (
            <article key={transaction.id} className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Dengan {transaction.counterpart.fullName} sebagai {transaction.counterpart.role}
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-950">{transaction.product.title}</h2>
                </div>
                <Badge value={transaction.status} />
              </div>
              <p className="mt-4 text-2xl font-black text-emerald-700">{formatCurrency(transaction.finalPrice)}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">Escrow: {transaction.escrowStatus}</p>
              <p className="mt-2 text-sm font-medium text-slate-500">Dibuat pada {formatDate(transaction.createdAt)}</p>

              {transaction.status === "pending_meetup" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => confirmEscrow(transaction)}>
                    {transaction.myRole === "buyer" ? "Konfirmasi Barang Diterima" : "Konfirmasi Barang Diserahkan"}
                  </Button>
                  <Button variant="secondary" onClick={() => completeTransaction(transaction.id)}>
                    Selesai Manual
                  </Button>
                  <Button variant="danger" onClick={() => disputeEscrow(transaction)}>
                    Dispute
                  </Button>
                </div>
              ) : null}

              {transaction.canReview ? (
                <form onSubmit={(event) => submitReview(event, transaction.id)} className="mt-5 grid gap-3 rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-black text-slate-950">Beri rating seller</h3>
                  <Select
                    value={reviewForms[transaction.id]?.rating || 5}
                    onChange={(event) => updateReviewForm(transaction.id, "rating", event.target.value)}
                  >
                    <option value="5">5 - Sangat baik</option>
                    <option value="4">4 - Baik</option>
                    <option value="3">3 - Cukup</option>
                    <option value="2">2 - Kurang</option>
                    <option value="1">1 - Buruk</option>
                  </Select>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Select value={reviewForms[transaction.id]?.communicationRating || 5} onChange={(event) => updateReviewForm(transaction.id, "communicationRating", event.target.value)}>
                      <option value="5">Komunikasi 5</option>
                      <option value="4">Komunikasi 4</option>
                      <option value="3">Komunikasi 3</option>
                      <option value="2">Komunikasi 2</option>
                      <option value="1">Komunikasi 1</option>
                    </Select>
                    <Select value={reviewForms[transaction.id]?.itemAccuracyRating || 5} onChange={(event) => updateReviewForm(transaction.id, "itemAccuracyRating", event.target.value)}>
                      <option value="5">Akurasi 5</option>
                      <option value="4">Akurasi 4</option>
                      <option value="3">Akurasi 3</option>
                      <option value="2">Akurasi 2</option>
                      <option value="1">Akurasi 1</option>
                    </Select>
                    <Select value={reviewForms[transaction.id]?.meetupRating || 5} onChange={(event) => updateReviewForm(transaction.id, "meetupRating", event.target.value)}>
                      <option value="5">Meetup 5</option>
                      <option value="4">Meetup 4</option>
                      <option value="3">Meetup 3</option>
                      <option value="2">Meetup 2</option>
                      <option value="1">Meetup 1</option>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="Tag dipisah koma, contoh: ramah, tepat waktu, barang sesuai"
                    value={reviewForms[transaction.id]?.tags || ""}
                    onChange={(event) => updateReviewForm(transaction.id, "tags", event.target.value)}
                  />
                  <Textarea
                    placeholder="Ceritakan pengalaman transaksi Anda"
                    value={reviewForms[transaction.id]?.comment || ""}
                    onChange={(event) => updateReviewForm(transaction.id, "comment", event.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <input
                      type="checkbox"
                      checked={Boolean(reviewForms[transaction.id]?.isAnonymous)}
                      onChange={(event) => updateReviewForm(transaction.id, "isAnonymous", event.target.checked)}
                    />
                    Kirim sebagai anonim
                  </label>
                  <Button type="submit">Kirim Review</Button>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Belum ada transaksi" description="Transaksi otomatis muncul saat seller menerima tawaran harga." />
      )}
    </div>
  );
};

export default DashboardTransactionsPage;
