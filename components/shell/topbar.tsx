"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  CircleCheckBig,
  FileText,
  Globe,
  LayoutGrid,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PillSelect } from "@/components/ui-kit/pill";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SeverityBadge } from "@/components/ui-kit/rag";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { alerts } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { comparisonOptions, periodOptions, periodScopeDetail } from "@/lib/metrics";

const languageShort: Record<string, string> = { "Bahasa Indonesia": "ID", English: "EN" };

const mobileNav = [
  { href: "/", label: "Beranda", icon: LayoutGrid },
  { href: "/dashboard", label: "Dashboard", icon: ChartNoAxesCombined },
  { href: "/kpi", label: "KPI", icon: ListChecks },
  { href: "/tanya-data", label: "Tanya Data", icon: Sparkles },
  { href: "/peringatan", label: "Peringatan", icon: Bell },
  { href: "/board-pack", label: "Board pack", icon: FileText },
  { href: "/tindak-lanjut", label: "Tindak lanjut", icon: CircleCheckBig },
  { href: "/laporan", label: "Laporan", icon: Mail },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings2 },
];

const clockOffsets: Record<string, number> = { WIB: 7, WITA: 8, WIT: 9 };

function clockString(date: Date, offset: number) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const shifted = new Date(utc + offset * 3600000);
  return `${String(shifted.getHours()).padStart(2, "0")}:${String(shifted.getMinutes()).padStart(2, "0")}`;
}

export function Topbar() {
  const {
    period,
    setPeriod,
    comparison,
    setComparison,
    timezone,
    lang,
    setLang,
    setPaletteOpen,
    savedView,
    showToast,
  } = useAppState();
  const [now, setNow] = useState<Date | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now ? clockString(now, clockOffsets[timezone] ?? 7) : "07:00";

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-5 px-4 pt-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="rounded-[24px] border border-glass-line bg-glass px-4 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-glass-line bg-glass text-ink-soft lg:hidden"
              aria-label="Buka pencarian dan navigasi"
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-display text-[19px] font-semibold leading-tight text-ink sm:text-[21px]">
                Selamat pagi, Ardi
              </h1>
              <p className="mt-0.5 truncate text-[11.5px] text-ink-muted">
                Nusantara Group · {periodScopeDetail[period]} · {time} {timezone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PillSelect
              label="Periode"
              value={period}
              options={periodOptions}
              onSelect={(value) => setPeriod(value as typeof period)}
              icon={<CalendarDays className="size-3.5 text-ink-muted" />}
              className="hidden sm:inline-flex"
              menuLabel="Rentang periode"
            />
            <PillSelect
              label="Bandingkan"
              value={comparison}
              options={comparisonOptions}
              onSelect={(value) => setComparison(value as typeof comparison)}
              className="hidden xl:inline-flex"
              menuLabel="Dasar pembanding"
            />

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden h-9 items-center gap-2 rounded-full border border-glass-line bg-glass px-3.5 text-left shadow-[0_2px_10px_-6px_rgba(76,58,110,0.5)] hover:bg-glass-strong md:flex"
              aria-label="Buka pencarian global"
            >
              <Search className="size-3.5 text-ink-muted" />
              <span className="w-40 text-[12.5px] text-ink-muted xl:w-52">Cari KPI, dashboard, laporan…</span>
              <kbd className="rounded-md border border-line bg-line-soft px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setLang(lang === "English" ? "Bahasa Indonesia" : "English")}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-glass-line bg-glass px-3 text-[12px] font-semibold text-ink-soft shadow-[0_2px_10px_-6px_rgba(76,58,110,0.5)] hover:bg-glass-strong"
              aria-label="Ganti bahasa"
            >
              <Globe className="size-3.5 text-ink-muted" />
              {languageShort[lang] ?? "ID"}
            </button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="relative grid size-9 place-items-center rounded-full border border-glass-line bg-glass text-ink-soft shadow-[0_2px_10px_-6px_rgba(76,58,110,0.5)] hover:bg-glass-strong"
                    aria-label="Notifikasi"
                  >
                    <Bell className="size-4" />
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand ring-2 ring-glass-strong" />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-[320px] rounded-2xl border-line p-2">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <p className="text-[12px] font-semibold text-ink">Peringatan terbaru</p>
                  <Link href="/peringatan" className="text-[11px] font-semibold text-brand">
                    Lihat semua
                  </Link>
                </div>
                <DropdownMenuSeparator />
                {alerts.slice(0, 3).map((alert) => (
                  <DropdownMenuItem key={alert.id} className="items-start gap-2 rounded-xl px-2 py-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <SeverityBadge severity={alert.severity} />
                        <span className="text-[10px] text-ink-muted">{alert.time}</span>
                      </div>
                      <p className="mt-1 text-[12px] font-medium leading-snug text-ink">{alert.title}</p>
                      <p className="text-[11px] text-ink-muted">
                        {alert.kpi} · {alert.value}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-glass-line bg-glass py-1 pl-1 pr-2.5 shadow-[0_2px_10px_-6px_rgba(76,58,110,0.5)] hover:bg-glass-strong"
                    aria-label="Menu akun"
                  >
                    <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-[#ffb27a] to-[#f97316] text-[10.5px] font-bold text-white">
                      AK
                    </span>
                    <div className="hidden leading-tight sm:block">
                      <p className="text-[11.5px] font-semibold text-ink">Ardi Kusuma</p>
                      <p className="text-[10px] text-ink-muted">CEO</p>
                    </div>
                    <ChevronDown className="hidden size-3 text-ink-muted sm:block" />
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-[240px] rounded-2xl border-line p-1.5">
                <DropdownMenuLabel className="px-2 py-1.5">
                  <span className="block text-[12px] font-semibold text-ink">Ardi Kusuma</span>
                  <span className="block text-[10.5px] text-ink-muted">ardi.kusuma@nusantara.co.id</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/pengaturan")}
                  className="rounded-xl px-2.5 py-2 text-[13px]"
                >
                  <UserRound className="size-3.5 text-ink-muted" />
                  Profil & preferensi
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/pengaturan")}
                  className="rounded-xl px-2.5 py-2 text-[13px]"
                >
                  <Settings2 className="size-3.5 text-ink-muted" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-2.5 py-2 text-[13px]">
                  <Globe className="size-3.5 text-ink-muted" />
                  Tampilan tersimpan: {savedView}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => showToast("Sesi demo — keluar tidak tersedia di prototipe.")}
                  className="rounded-xl px-2.5 py-2 text-[13px] text-danger-strong"
                >
                  <LogOut className="size-3.5" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <nav className="soft-scroll -mx-1 mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:hidden">
          {mobileNav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                  active ? "bg-brand-soft text-brand-strong" : "bg-glass text-ink-soft",
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
