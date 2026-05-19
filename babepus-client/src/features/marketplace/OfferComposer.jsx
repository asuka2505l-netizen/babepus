import { useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import { offerService } from "../../services/offerService";
import { formatCurrency } from "../../utils/currency";
import { useToast } from "../../hooks/useToast";

const OfferComposer = ({ product }) => {
  const { showToast } = useToast();
  const [offerPrice, setOfferPrice] = useState(Math.max(Number(product.price) - 10000, 1000));
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await offerService.createOffer({
        productId: product.id,
        offerPrice,
        note
      });
      setNote("");
      showToast({
        title: "Tawaran terkirim",
        message: `Tawaran ${formatCurrency(offerPrice)} menunggu keputusan seller.`
      });
    } catch (error) {
      showToast({ type: "error", title: "Gagal mengirim tawaran", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5">
      <h3 className="text-lg font-black text-slate-950">Tawar harga</h3>
      <p className="mt-1 text-sm text-slate-600">Kirim tawaran yang sopan agar seller lebih cepat merespons.</p>
      <div className="mt-4 grid gap-4">
        <Input
          label="Nominal tawaran"
          min="1000"
          required
          type="number"
          value={offerPrice}
          onChange={(event) => setOfferPrice(event.target.value)}
        />
        <Textarea
          label="Catatan"
          placeholder="Contoh: Bisa COD di perpustakaan kampus sore ini?"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Mengirim..." : "Kirim Tawaran"}
        </Button>
      </div>
    </form>
  );
};

export default OfferComposer;
