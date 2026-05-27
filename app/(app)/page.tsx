"use client";

import { Play, Plus, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { StatCard } from "@/components/ui-kit/stat-card";
import { AiBriefing, AttentionList } from "@/components/home/ai-briefing";
import {
  DivisionCard,
  MarginGaugeCard,
  RevenueCard,
  SegmentCard,
} from "@/components/home/overview-charts";
import { QuickAccess } from "@/components/home/quick-access";
import { kpiById } from "@/lib/data";
import { useAppState, type SavedView } from "@/lib/app-state";
import { deriveKpi, periodScopeDetail } from "@/lib/metrics";

const featured = ["pendapatan", "margin-kotor", "ebitda", "arus-kas", "pelanggan-aktif"];

const viewMeta: Record<SavedView, { subtitle: string; order: string[] }> = {
  Harian: {
    subtitle: "Tampilan harian — KPI utama, peringatan, dan tren singkat.",
    order: ["kpi", "brief", "trend", "mix", "quick"],
  },
  Mingguan: {
    subtitle: "Tampilan mingguan — tren dan driver lebih dulu, KPI menyusul.",
    order: ["trend", "mix", "kpi", "brief", "quick"],
  },
  Board: {
    subtitle: "Tampilan direksi — ringkasan padat tanpa panel operasional.",
    order: ["kpi", "brief", "trend"],
  },
};

export default function OverviewPage() {
  const { period, comparison, savedView, timezone, fiscal } = useAppState();
  const cards = featured.map((id) => kpiById(id)).filter((kpi) => kpi !== undefined);
  const view = viewMeta[savedView];

  const blocks: Record<string, React.ReactNode> = {
    kpi: (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((kpi) => {
          const derived = deriveKpi(kpi, period, comparison);
          return (
            <StatCard
              key={kpi.id}
              label={kpi.name}
              value={derived.value}
              delta={derived.delta}
              deltaSuffix={derived.deltaSuffix}
              deltaLabel={derived.deltaLabel}
              rag={derived.rag}
              accent={kpi.accent}
              icon={kpi.icon}
              href={`/kpi/${kpi.id}`}
              good={kpi.direction === "down" ? derived.delta < 0 : derived.delta > 0}
            />
          );
        })}
      </div>
    ),
    brief: (
      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <AiBriefing />
        </div>
        <div className="xl:col-span-2">
          <AttentionList />
        </div>
      </div>
    ),
    trend: (
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueCard />
        </div>
        <MarginGaugeCard />
      </div>
    ),
    mix: (
      <div className="grid gap-4 xl:grid-cols-3">
        <DivisionCard />
        <div className="xl:col-span-2">
          <SegmentCard />
        </div>
      </div>
    ),
    quick: <QuickAccess />,
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Command center"
        title="Overview"
        subtitle={`${view.subtitle} Periode ${periodScopeDetail[period].toLowerCase()}.`}
        actions={
          <>
            <BrandButton href="/presentasi" variant="ghost" icon={<Play className="size-3.5" />}>
              Mode presentasi
            </BrandButton>
            <BrandButton href="/board-pack" icon={<Plus className="size-4" />}>
              Buat board pack
            </BrandButton>
          </>
        }
      />

      {view.order.map((key) => (
        <div key={key}>{blocks[key]}</div>
      ))}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-2xl border border-glass-line bg-glass-soft px-4 py-3 text-[10.5px] text-ink-muted backdrop-blur">
        <span className="inline-flex items-center gap-1.5 font-semibold text-mint-strong">
          <ShieldCheck className="size-3.5" />
          Semua KPI di beranda bersertifikat
        </span>
        <span>Keuangan: H+1 · 06:40 {timezone}</span>
        <span>Operasional: 15 menit lalu</span>
        <span>SDM: Senin 06:00 {timezone}</span>
        <span className="ml-auto">
          Zona waktu {timezone} · kalender fiskal {fiscal}
        </span>
      </div>
    </div>
  );
}
