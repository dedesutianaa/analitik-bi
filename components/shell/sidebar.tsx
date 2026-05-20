"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChartNoAxesCombined,
  CircleCheckBig,
  FileText,
  LayoutGrid,
  ListChecks,
  LogOut,
  Mail,
  Play,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const primary = [
  { href: "/", label: "Beranda", icon: LayoutGrid },
  { href: "/dashboard", label: "Dashboard domain", icon: ChartNoAxesCombined },
  { href: "/kpi", label: "Katalog KPI", icon: ListChecks },
  { href: "/tanya-data", label: "Tanya Data", icon: Sparkles },
  { href: "/peringatan", label: "Pusat peringatan", icon: Bell, badge: 3 },
  { href: "/board-pack", label: "Board pack", icon: FileText },
  { href: "/tindak-lanjut", label: "Tindak lanjut", icon: CircleCheckBig },
  { href: "/laporan", label: "Briefing & laporan", icon: Mail },
];

const secondary = [
  { href: "/admin", label: "Konsol admin", icon: ShieldCheck },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings2 },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function RailLink({
  href,
  label,
  icon: Icon,
  badge,
  active,
}: {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  badge?: number;
  active: boolean;
}) {
  return (
    <Link href={href} className="group relative flex items-center justify-center" aria-label={label}>
      <span className="rail-item" data-active={active}>
        <Icon className="size-[19px]" strokeWidth={active ? 2.2 : 1.9} />
        {badge ? (
          <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-brand text-[9px] font-bold text-white ring-2 ring-glass-strong">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-medium text-ink-inverse opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[92px] flex-col items-center border-r border-glass-line bg-glass py-5 shadow-[8px_0_40px_-32px_rgba(76,58,110,0.6)] backdrop-blur-xl lg:flex">
      <Link href="/" className="group relative flex flex-col items-center gap-1.5" aria-label="ExecInsight">
        <span className="relative grid size-11 place-items-center rounded-[15px] bg-gradient-to-br from-[#ff9a4d] via-[#f97316] to-[#e8620a] shadow-[0_10px_22px_-10px_rgba(249,115,22,0.9)]">
          <ChartNoAxesCombined className="size-5 text-white" strokeWidth={2.4} />
          <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-violet ring-2 ring-glass-strong" />
        </span>
        <span className="font-display text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          Exec
        </span>
      </Link>

      <nav className="soft-scroll mt-6 flex w-full flex-1 flex-col items-center gap-1.5 overflow-y-auto px-3">
        {primary.map((item) => (
          <RailLink key={item.href} {...item} active={isActive(pathname, item.href)} />
        ))}
        <span className="my-2 h-px w-7 bg-line" />
        {secondary.map((item) => (
          <RailLink key={item.href} {...item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <div className="mt-3 flex flex-col items-center gap-2">
        <Link
          href="/presentasi"
          className="group relative grid size-11 place-items-center rounded-2xl bg-ink text-ink-inverse transition-transform hover:scale-105"
          aria-label="Mode presentasi"
        >
          <Play className="size-4 fill-ink-inverse" />
          <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-medium text-ink-inverse opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Mode presentasi
          </span>
        </Link>
        <button
          type="button"
          className={cn("rail-item")}
          aria-label="Keluar"
          title="Keluar"
        >
          <LogOut className="size-[18px]" />
        </button>
      </div>
    </aside>
  );
}
