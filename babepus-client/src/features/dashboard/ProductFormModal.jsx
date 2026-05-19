import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import { useToast } from "../../hooks/useToast";
import { productService } from "../../services/productService";
import { pricingService } from "../../services/pricingService";
import { formatCurrency } from "../../utils/currency";

const emptyForm = {
  title: "",
  description: "",
  categoryId: "",
  price: "",
  conditionLabel: "good",
  campusLocation: "",
  faculty: ""
};

const ProductFormModal = ({ categories, isOpen, onClose, onSaved, product }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [pricingInput, setPricingInput] = useState({ originalPrice: "", ageMonths: "", includesBox: true, urgency: "normal" });
  const [pricingEstimate, setPricingEstimate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        categoryId: product.category?.id || "",
        price: product.price || "",
        conditionLabel: product.conditionLabel || "good",
        campusLocation: product.campusLocation || "",
        faculty: product.faculty || ""
      });
    } else {
      setForm(emptyForm);
    }
    setImage(null);
  }, [product, isOpen]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const estimatePrice = async () => {
    if (!form.categoryId || !pricingInput.originalPrice) {
      showToast({ type: "error", title: "Data estimator kurang", message: "Pilih kategori dan isi harga beli awal." });
      return;
    }

    try {
      const estimate = await pricingService.estimate({
        categoryId: form.categoryId,
        originalPrice: pricingInput.originalPrice,
        conditionLabel: form.conditionLabel,
        ageMonths: pricingInput.ageMonths || 0,
        includesBox: pricingInput.includesBox,
        urgency: pricingInput.urgency
      });
      setPricingEstimate(estimate);
      updateForm("price", estimate.suggestedMedian);
    } catch (error) {
      showToast({ type: "error", title: "Estimator gagal", message: error.message });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!product && !image) {
      showToast({ type: "error", title: "Gambar wajib", message: "Upload minimal satu gambar produk." });
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    if (image) {
      formData.append("image", image);
    }

    setIsSubmitting(true);
    try {
      if (product) {
        await productService.updateProduct(product.id, formData);
        showToast({ title: "Produk diperbarui", message: "Perubahan produk berhasil disimpan." });
      } else {
        await productService.createProduct(formData);
        showToast({ title: "Produk dipublikasikan", message: "Barang Anda sudah tampil di marketplace." });
      }
      onSaved();
      onClose();
    } catch (error) {
      showToast({ type: "error", title: "Gagal menyimpan produk", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? "Edit Produk" : "Upload Barang"}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input
          label="Judul barang"
          minLength={5}
          required
          value={form.title}
          onChange={(event) => updateForm("title", event.target.value)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Kategori"
            required
            value={form.categoryId}
            onChange={(event) => updateForm("categoryId", event.target.value)}
          >
            <option value="">Pilih kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input
            label="Harga"
            min="1000"
            required
            type="number"
            value={form.price}
            onChange={(event) => updateForm("price", event.target.value)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Kondisi"
            value={form.conditionLabel}
            onChange={(event) => updateForm("conditionLabel", event.target.value)}
          >
            <option value="like_new">Seperti baru</option>
            <option value="good">Bagus</option>
            <option value="fair">Layak pakai</option>
            <option value="needs_repair">Perlu perbaikan</option>
          </Select>
          <Input
            label="Lokasi kampus"
            required
            value={form.campusLocation}
            onChange={(event) => updateForm("campusLocation", event.target.value)}
          />
        </div>
        <Input
          label="Fakultas target"
          placeholder="Contoh: Teknik, Ekonomi"
          value={form.faculty}
          onChange={(event) => updateForm("faculty", event.target.value)}
        />
        <div className="rounded-2xl bg-emerald-50 p-4">
          <h3 className="font-black text-slate-950">AI harga bekas</h3>
          <p className="mt-1 text-sm text-slate-600">Estimator lokal berbasis kategori, kondisi, umur barang, kelengkapan, dan urgensi jual.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Input label="Harga beli awal" type="number" value={pricingInput.originalPrice} onChange={(event) => setPricingInput((current) => ({ ...current, originalPrice: event.target.value }))} />
            <Input label="Umur bulan" type="number" value={pricingInput.ageMonths} onChange={(event) => setPricingInput((current) => ({ ...current, ageMonths: event.target.value }))} />
            <Select label="Urgensi" value={pricingInput.urgency} onChange={(event) => setPricingInput((current) => ({ ...current, urgency: event.target.value }))}>
              <option value="low">Santai</option>
              <option value="normal">Normal</option>
              <option value="high">Cepat laku</option>
            </Select>
            <Select label="Box" value={String(pricingInput.includesBox)} onChange={(event) => setPricingInput((current) => ({ ...current, includesBox: event.target.value === "true" }))}>
              <option value="true">Lengkap</option>
              <option value="false">Tidak lengkap</option>
            </Select>
          </div>
          <Button className="mt-3" variant="secondary" onClick={estimatePrice}>Estimasi Harga</Button>
          {pricingEstimate ? (
            <p className="mt-3 text-sm font-bold text-emerald-700">
              Rekomendasi: {formatCurrency(pricingEstimate.suggestedMin)} - {formatCurrency(pricingEstimate.suggestedMax)}. Median {formatCurrency(pricingEstimate.suggestedMedian)}.
            </p>
          ) : null}
        </div>
        <Textarea
          label="Deskripsi"
          minLength={20}
          required
          value={form.description}
          onChange={(event) => updateForm("description", event.target.value)}
        />
        <Input
          accept="image/png,image/jpeg,image/webp"
          label={product ? "Ganti gambar produk" : "Gambar produk"}
          required={!product}
          type="file"
          onChange={(event) => setImage(event.target.files?.[0] || null)}
        />
        <Button disabled={isSubmitting} type="submit" size="lg">
          {isSubmitting ? "Menyimpan..." : product ? "Simpan Perubahan" : "Publikasikan Produk"}
        </Button>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
