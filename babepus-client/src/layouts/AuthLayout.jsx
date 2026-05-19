import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="min-h-screen bg-auth px-4 py-8">
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl lg:p-10">
        <Link to="/marketplace" className="inline-flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 font-black">
            BP
          </span>
          <span className="text-xl font-black">BabePus</span>
        </Link>
        <div className="mt-16 max-w-xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            Marketplace Mahasiswa
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            Jual beli barang kampus lebih rapi, cepat, dan terpercaya.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Cari buku kuliah, elektronik, perlengkapan kost, hingga alat praktikum bekas dari mahasiswa lain di sekitar kampus.
          </p>
        </div>
      </section>
      <section className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur md:p-8">
        <Outlet />
      </section>
    </div>
  </div>
);

export default AuthLayout;
