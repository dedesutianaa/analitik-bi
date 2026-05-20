"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChartNoAxesCombined,
  CircleCheckBig,
  CornerDownLeft,
  FileText,
  LayoutGrid,
  ListChecks,
  Mail,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { domains, kpis } from "@/lib/data";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

type PaletteItem = {
  id: string;
  group: string;
  label: string;
  hint: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const staticPages: { label: string; href: string; hint: string; icon: PaletteItem["icon"] }[] = [
  { label: "Beranda", href: "/", hint: "Command center", icon: LayoutGrid },
  { label: "Dashboard domain", href: "/dashboard", hint: "8 dashboard terkurasi", icon: ChartNoAxesCombined },
  { label: "Katalog KPI", href: "/kpi", hint: "48 KPI terkurasi", icon: ListChecks },
  { label: "Tanya Data", href: "/tanya-data", hint: "NL-to-metric", icon: Sparkles },
  { label: "Pusat peringatan", href: "/peringatan", hint: "Anomali & tindak lanjut", icon: Bell },
  { label: "Board pack", href: "/board-pack", hint: "Builder laporan direksi", icon: FileText },
  { label: "Tindak lanjut", href: "/tindak-lanjut", hint: "Action tracker & decision log", icon: CircleCheckBig },
  { label: "Laporan", href: "/laporan", hint: "Langganan & distribusi", icon: Mail },
  { label: "Konsol admin", href: "/admin", hint: "Pengguna, keamanan, konektor", icon: ShieldCheck },
  { label: "Pengaturan", href: "/pengaturan", hint: "Preferensi tampilan & notifikasi", icon: Settings2 },
];

const allItems: PaletteItem[] = [
  ...staticPages.map((page) => ({ ...page, id: `page:${page.href}`, group: "Navigasi" })),
  ...domains.map((domain) => ({
    id: `domain:${domain.slug}`,
    group: "Dashboard domain",
    label: domain.name,
    hint: domain.tagline,
    href: `/dashboard/${domain.slug}`,
    icon: TrendingUp,
  })),
  ...kpis.map((kpi) => ({
    id: `kpi:${kpi.id}`,
    group: "KPI",
    label: kpi.name,
    hint: `${kpi.domain} · ${kpi.value}`,
    href: `/kpi/${kpi.id}`,
    icon: ListChecks,
  })),
];

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useAppState();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global shortcut: ⌘K / Ctrl+K opens, Escape closes.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      } else if (event.key === "Escape") {
        setPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setPaletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      setQuery("");
      setActiveIndex(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(id);
    }
  }, [paletteOpen]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return allItems.slice(0, 9);
    return allItems
      .filter(
        (item) =>
          item.label.toLowerCase().includes(needle) ||
          item.hint.toLowerCase().includes(needle) ||
          item.group.toLowerCase().includes(needle),
      )
      .slice(0, 12);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function select(item: PaletteItem | undefined) {
    if (!item) return;
    setPaletteOpen(false);
    router.push(item.href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(results[activeIndex]);
    }
  }

  if (!paletteOpen) return null;

  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Tutup pencarian"
        onClick={() => setPaletteOpen(false)}
        className="absolute inset-0 cursor-default bg-[rgba(29,32,51,0.35)] backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian global"
        className="animate-float-in relative w-full max-w-[560px] overflow-hidden rounded-[22px] border border-glass-line bg-glass-strong shadow-[0_36px_80px_-30px_rgba(29,32,51,0.6)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
          <Search className="size-4 shrink-0 text-ink-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Cari KPI, dashboard, atau halaman…"
            aria-label="Pencarian global"
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <kbd className="rounded-md border border-line bg-line-soft px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
            Esc
          </kbd>
        </div>

        <div className="soft-scroll max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-[12px] text-ink-muted">
              Tidak ada hasil untuk “{query}”.
            </p>
          ) : (
            results.map((item, index) => {
              const showGroup = item.group !== lastGroup;
              lastGroup = item.group;
              return (
                <div key={item.id}>
                  {showGroup ? (
                    <p className="px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                      {item.group}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => select(item)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors",
                      index === activeIndex ? "bg-brand-soft text-brand-strong" : "text-ink-soft hover:bg-line-soft",
                    )}
                  >
                    <item.icon className="size-4 shrink-0 opacity-80" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold">{item.label}</span>
                      <span className="block truncate text-[10.5px] text-ink-muted">{item.hint}</span>
                    </span>
                    {index === activeIndex ? (
                      <CornerDownLeft className="size-3.5 shrink-0 text-ink-muted" />
                    ) : null}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-line px-4 py-2 text-[10px] text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-line bg-line-soft px-1 py-0.5">↑</kbd>
            <kbd className="rounded border border-line bg-line-soft px-1 py-0.5">↓</kbd>
            pilih
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-line bg-line-soft px-1 py-0.5">↵</kbd>
            buka
          </span>
          <span className="ml-auto">Pencarian hanya menjangkau metrik bersertifikat</span>
        </div>
      </div>
    </div>
  );
}
