import Link from "next/link";
import { ArrowUpRight, Bell, FileText, ListChecks, Sparkles } from "lucide-react";
import { accentHex, accentSoft, type Accent } from "@/lib/data";

const items: { href: string; title: string; description: string; icon: typeof Bell; accent: Accent }[] = [
  {
    href: "/tanya-data",
    title: "Tanya Data",
    description: "Jawab pertanyaan ad hoc dengan bahasa natural",
    icon: Sparkles,
    accent: "violet",
  },
  {
    href: "/kpi",
    title: "Katalog KPI",
    description: "Definisi, pemilik, dan status sertifikasi",
    icon: ListChecks,
    accent: "sky",
  },
  {
    href: "/board-pack",
    title: "Board pack",
    description: "Susun materi rapat direksi otomatis",
    icon: FileText,
    accent: "brand",
  },
  {
    href: "/peringatan",
    title: "Pusat peringatan",
    description: "3 peringatan baru menunggu tindakan",
    icon: Bell,
    accent: "rose",
  },
];

export function QuickAccess() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="panel group flex items-center gap-3 rounded-[22px] p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-26px_rgba(76,58,110,0.55)]"
        >
          <span
            className="grid size-10 shrink-0 place-items-center rounded-xl"
            style={{ background: accentSoft[item.accent] }}
          >
            <item.icon className="size-[18px]" style={{ color: accentHex[item.accent] }} />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-ink">{item.title}</p>
            <p className="truncate text-[10.5px] text-ink-muted">{item.description}</p>
          </div>
          <ArrowUpRight className="ml-auto size-4 shrink-0 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
        </Link>
      ))}
    </div>
  );
}
