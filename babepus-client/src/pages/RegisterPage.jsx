import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    campus: "",
    faculty: "",
    studyProgram: "",
    studentId: "",
    campusEmail: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await register(form);
      showToast({ title: "Registrasi berhasil", message: "Akun Anda siap dipakai untuk jual beli." });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showToast({ type: "error", title: "Registrasi gagal", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Daftar Mahasiswa</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">Buat akun BabePus</h1>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <Input label="Nama lengkap" required value={form.fullName} onChange={(event) => updateForm("fullName", event.target.value)} />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Email" required type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} />
          <Input label="Password" minLength={8} required type="password" value={form.password} onChange={(event) => updateForm("password", event.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Kampus" required value={form.campus} onChange={(event) => updateForm("campus", event.target.value)} />
          <Input label="Fakultas" value={form.faculty} onChange={(event) => updateForm("faculty", event.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Program studi" value={form.studyProgram} onChange={(event) => updateForm("studyProgram", event.target.value)} />
          <Input label="NIM" value={form.studentId} onChange={(event) => updateForm("studentId", event.target.value)} />
        </div>
        <Input label="Email pribadi untuk verifikasi" type="email" value={form.campusEmail} onChange={(event) => updateForm("campusEmail", event.target.value)} />
        <Input label="Nomor HP" value={form.phone} onChange={(event) => updateForm("phone", event.target.value)} />
        <Button disabled={isSubmitting} size="lg" type="submit">
          {isSubmitting ? "Membuat akun..." : "Daftar"}
        </Button>
      </form>
      <p className="mt-6 text-sm font-medium text-slate-600">
        Sudah punya akun?{" "}
        <Link className="font-black text-emerald-700" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
