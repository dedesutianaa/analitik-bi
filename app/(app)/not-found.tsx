import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel mx-auto mt-10 max-w-lg rounded-[26px] p-8 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">404</p>
      <h1 className="mt-2 font-display text-[22px] font-semibold text-ink">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
        KPI atau dashboard yang Anda cari tidak tersedia, atau Anda tidak memiliki hak akses ke data
        tersebut.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] to-[#f97316] px-4 text-[12.5px] font-semibold text-white shadow-[0_14px_26px_-14px_rgba(249,115,22,0.95)]"
      >
        Kembali ke beranda
      </Link>
    </div>
  );
}
