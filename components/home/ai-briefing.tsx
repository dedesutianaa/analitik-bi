import Link from "next/link";
import { ChevronRight, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { Pill, Tag } from "@/components/ui-kit/pill";
import { Delta, SeverityBadge } from "@/components/ui-kit/rag";
import { attentionItems, narrative } from "@/lib/data";

const changes = [
  { label: "Pendapatan YTD", value: "Rp 4,82 T", delta: 12.4, suffix: "%", good: true },
  { label: "Margin kotor", value: "38,6%", delta: -2.3, suffix: " pp", good: false },
  { label: "Pipeline coverage", value: "3,4x", delta: -0.3, suffix: "x", good: false },
  { label: "Attrition karyawan", value: "7,8%", delta: 1.1, suffix: " pp", good: false },
];

export function AiBriefing() {
  return (
    <Panel className="relative flex h-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-gradient-to-br from-brand-soft via-violet-soft to-transparent opacity-70 blur-2xl" />
      <div className="relative flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-[#ffb27a] to-[#f97316] text-white shadow-[0_8px_18px_-10px_rgba(249,115,22,0.9)]">
            <Sparkles className="size-4" />
          </span>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Ringkasan AI · apa yang berubah
          </p>
          <Tag tone="brand" className="ml-auto">
            ≤ 150 kata
          </Tag>
        </div>

        <div className="mt-3 grid gap-4 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <h3 className="font-display text-[17px] font-semibold leading-snug text-ink">
              {narrative.headline}
            </h3>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{narrative.body}</p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
              Perubahan utama
            </p>
            {changes.map((change) => (
              <div
                key={change.label}
                className="flex items-center justify-between gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-medium text-ink-muted">{change.label}</p>
                  <p className="font-display text-[13.5px] font-semibold text-ink">{change.value}</p>
                </div>
                <Delta value={change.delta} suffix={change.suffix} good={change.good} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "KPI bersertifikat", value: "8" },
              { label: "Sumber data", value: "3" },
              { label: "Baris dipindai", value: "1,28 jt" },
            ].map((source) => (
              <div key={source.label} className="rounded-xl bg-line-soft/60 px-3 py-2">
                <p className="font-display text-[13px] font-semibold text-ink">{source.value}</p>
                <p className="text-[10px] text-ink-muted">{source.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill icon={<ShieldCheck className="size-3.5 text-mint" />}>Lihat dasar jawaban</Pill>
            <Pill icon={<MessageSquare className="size-3.5 text-violet" />}>Tanya lanjutan</Pill>
            <span className="ml-auto text-[10.5px] text-ink-muted">{narrative.updated}</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function AttentionList() {
  return (
    <Panel className="flex flex-col">
      <PanelHeader
        title="Perlu perhatian Anda"
        subtitle="Diurutkan berdasarkan dampak bisnis"
        action={<Tag tone="rose">{attentionItems.length} item</Tag>}
      />
      <div className="mt-3 flex-1 space-y-2">
        {attentionItems.map((item) => (
          <Link
            key={item.id}
            href={`/kpi/${item.kpiId}`}
            className="group flex items-start gap-2.5 rounded-2xl border border-line-soft bg-glass-soft p-2.5 transition-colors hover:border-brand/20 hover:bg-glass"
          >
            <span className="mt-1.5">
              <SeverityBadge severity={item.severity} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold leading-snug text-ink">{item.title}</p>
              <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-ink-muted">{item.detail}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-ink-muted">
                <span>{item.meta}</span>
                <span className="font-semibold text-brand">{item.impact}</span>
              </div>
            </div>
            <ChevronRight className="mt-1 size-3.5 shrink-0 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
      <Link
        href="/peringatan"
        className="mt-3 inline-flex items-center justify-center gap-1 rounded-xl bg-line-soft py-2 text-[11.5px] font-semibold text-ink-soft transition-colors hover:bg-brand-soft hover:text-brand-strong"
      >
        Buka pusat peringatan
        <ChevronRight className="size-3.5" />
      </Link>
    </Panel>
  );
}
