import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await login(form);
      showToast({ title: "Login berhasil", message: `Selamat datang, ${user.fullName}.` });
      const redirectTo = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/dashboard");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      showToast({ type: "error", title: "Login gagal", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Masuk BabePus</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">Login ke akun Anda</h1>
      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <Input
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />
        <Input
          label="Password"
          required
          type="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        />
        <Button disabled={isSubmitting} size="lg" type="submit">
          {isSubmitting ? "Memproses..." : "Login"}
        </Button>
      </form>
      <p className="mt-6 text-sm font-medium text-slate-600">
        Belum punya akun?{" "}
        <Link className="font-black text-emerald-700" to="/register">
          Daftar sekarang
        </Link>
      </p>
      <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        Admin awal: <strong>admin@babepus.local</strong> dengan password <strong>Admin12345!</strong>
      </div>
    </div>
  );
};

export default LoginPage;
