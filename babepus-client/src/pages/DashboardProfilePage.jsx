import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { resolveImageUrl } from "../utils/image";

const DashboardProfilePage = () => {
  const { setUser, user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    campus: "",
    faculty: "",
    studyProgram: "",
    bio: ""
  });
  const [avatar, setAvatar] = useState(null);
  const [verificationToken, setVerificationToken] = useState("");
  const [issuedToken, setIssuedToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        campus: user.campus || "",
        faculty: user.faculty || "",
        studyProgram: user.studyProgram || "",
        bio: user.bio || ""
      });
    }
  }, [user]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedUser = await userService.updateProfile(form);
      setUser(updatedUser);
      showToast({ title: "Profil diperbarui", message: "Data profil berhasil disimpan." });
    } catch (error) {
      showToast({ type: "error", title: "Gagal menyimpan profil", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadAvatar = async () => {
    if (!avatar) {
      showToast({ type: "error", title: "Pilih avatar", message: "Pilih file gambar terlebih dahulu." });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const updatedUser = await userService.uploadAvatar(formData);
      setUser(updatedUser);
      setAvatar(null);
      showToast({ title: "Avatar diperbarui", message: "Foto profil berhasil diganti." });
    } catch (error) {
      showToast({ type: "error", title: "Gagal upload avatar", message: error.message });
    }
  };

  const requestVerification = async () => {
    try {
      const result = await authService.requestEmailVerification();
      if (result.alreadyVerified) {
        showToast({ title: "Email sudah verified", message: "Akun Anda sudah punya badge verified." });
        return;
      }
      setIssuedToken(result.token);
      setVerificationToken(result.token);
      showToast({ title: "Token verifikasi dibuat", message: "Masukkan token untuk memverifikasi email pribadi." });
    } catch (error) {
      showToast({ type: "error", title: "Gagal membuat token", message: error.message });
    }
  };

  const verifyEmail = async () => {
    try {
      const updatedUser = await authService.verifyEmail(verificationToken);
      setUser(updatedUser);
      setIssuedToken("");
      setVerificationToken("");
      showToast({ title: "Email verified", message: "Badge verified sudah aktif." });
    } catch (error) {
      showToast({ type: "error", title: "Verifikasi gagal", message: error.message });
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] bg-white p-5 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Profil User</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950">Edit Profil</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 text-center shadow-soft">
          <div className="mx-auto h-32 w-32 overflow-hidden rounded-[2rem] bg-emerald-50">
            {user?.avatarUrl ? (
              <img src={resolveImageUrl(user.avatarUrl)} alt={user.fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-black text-emerald-700">BP</div>
            )}
          </div>
          <h2 className="mt-4 text-xl font-black text-slate-950">{user?.fullName}</h2>
          <p className="text-sm font-medium text-slate-500">{user?.campus}</p>
          <p className="mt-2 text-sm font-black text-emerald-700">
            {user?.isEmailVerified ? "Verified user" : "Belum verified"}
          </p>
          <div className="mt-5 grid gap-3">
            <Input accept="image/png,image/jpeg,image/webp" type="file" onChange={(event) => setAvatar(event.target.files?.[0] || null)} />
            <Button onClick={uploadAvatar}>Upload Avatar</Button>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left">
            <p className="text-sm font-black text-slate-950">Verifikasi email pribadi</p>
            <p className="mt-1 text-xs text-slate-500">
              Mode development menampilkan token langsung agar fitur berjalan tanpa SMTP tambahan.
            </p>
            <Button className="mt-3 w-full" variant="secondary" onClick={requestVerification}>
              Buat Token
            </Button>
            {issuedToken ? <p className="mt-2 break-all text-xs font-semibold text-slate-500">{issuedToken}</p> : null}
            <Input className="mt-3" placeholder="Token verifikasi" value={verificationToken} onChange={(event) => setVerificationToken(event.target.value)} />
            <Button className="mt-3 w-full" onClick={verifyEmail}>Verifikasi</Button>
          </div>
        </section>

        <form onSubmit={updateProfile} className="grid gap-4 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
          <Input label="Nama lengkap" required value={form.fullName} onChange={(event) => updateForm("fullName", event.target.value)} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nomor HP" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} />
            <Input label="Kampus" required value={form.campus} onChange={(event) => updateForm("campus", event.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Fakultas" value={form.faculty} onChange={(event) => updateForm("faculty", event.target.value)} />
            <Input label="Program studi" value={form.studyProgram} onChange={(event) => updateForm("studyProgram", event.target.value)} />
          </div>
          <Textarea label="Bio" value={form.bio} onChange={(event) => updateForm("bio", event.target.value)} />
          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DashboardProfilePage;
