"use client";

import { useState } from "react";
import { Check, CheckCheck, Clock3, Flag, UserPlus } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { Chip, Tag } from "@/components/ui-kit/pill";
import { SeverityBadge } from "@/components/ui-kit/rag";
import { alerts, type Alert } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusTone: Record<Alert["status"], "brand" | "sky" | "violet" | "mint"> = {
  baru: "brand",
  diakui: "sky",
  ditugaskan: "violet",
  selesai: "mint",
};

const statusLabel: Record<Alert["status"], string> = {
  baru: "Baru",
  diakui: "Diakui",
  ditugaskan: "Ditugaskan",
  selesai: "Selesai",
};

export function AlertsCenter() {
  const [selectedId, setSelectedId] = useState(alerts[0].id);
  const [filter, setFilter] = useState("Semua");
  const [statuses, setStatuses] = useState<Record<string, Alert["status"]>>(
    Object.fromEntries(alerts.map((alert) => [alert.id, alert.status])),
  );

  const filtered = alerts.filter(
    (alert) => filter === "Semua" || alert.severity === filter.toLowerCase(),
  );
  const selected = alerts.find((alert) => alert.id === selectedId) ?? alerts[0];
  const status = statuses[selected.id];

  function updateStatus(next: Alert["status"]) {
    setStatuses((prev) => ({ ...prev, [selected.id]: next }));
  }

  return (
    <div className="grid gap-4 xl:grid-cols-5">
      <Panel className="xl:col-span-3">
        <PanelHeader
          title="Daftar prioritas"
          subtitle="Dikelompokkan agar tidak membanjiri — maksimal 1 notifikasi gabungan per kejadian"
          action={<Tag tone="neutral">{filtered.length} peringatan</Tag>}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Semua", "Kritis", "Peringatan", "Info"].map((item) => (
            <Chip key={item} active={filter === item} onClick={() => setFilter(item)}>
              {item}
            </Chip>
          ))}
        </div>

        <div className="mt-3 space-y-2">
          {filtered.map((alert) => {
            const isActive = alert.id === selected.id;
            return (
              <button
                key={alert.id}
                type="button"
                onClick={() => setSelectedId(alert.id)}
                className={cn(
                  "w-full rounded-2xl border p-3 text-left transition-all",
                  isActive
                    ? "border-brand/30 bg-brand-tint shadow-[0_14px_30px_-24px_rgba(249,115,22,0.8)]"
                    : "border-line-soft bg-glass-soft hover:border-line hover:bg-glass",
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <SeverityBadge severity={alert.severity} />
                  <span className="text-[10px] text-ink-muted">{alert.id}</span>
                  <span className="ml-auto text-[10px] text-ink-muted">{alert.time}</span>
                </div>
                <p className="mt-1.5 text-[12.5px] font-semibold leading-snug text-ink">{alert.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-ink-muted">
                  <span>{alert.kpi}</span>
                  <span className="font-semibold text-ink-soft">{alert.value}</span>
                  <span>· ambang {alert.threshold}</span>
                  <Tag tone={statusTone[statuses[alert.id]]} className="ml-auto">
                    {statusLabel[statuses[alert.id]]}
                  </Tag>
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel className="xl:col-span-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <SeverityBadge severity={selected.severity} />
          <span className="text-[10px] text-ink-muted">{selected.id}</span>
          <Tag tone={statusTone[status]} className="ml-auto">
            {statusLabel[status]}
          </Tag>
        </div>
        <h3 className="mt-2 font-display text-[16px] font-semibold leading-snug text-ink">
          {selected.title}
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-line-soft/70 p-2.5">
            <p className="text-[10px] text-ink-muted">Nilai saat ini</p>
            <p className="mt-0.5 font-display text-[18px] font-semibold text-ink">{selected.value}</p>
          </div>
          <div className="rounded-xl bg-line-soft/70 p-2.5">
            <p className="text-[10px] text-ink-muted">Ambang</p>
            <p className="mt-0.5 font-display text-[18px] font-semibold text-ink">{selected.threshold}</p>
          </div>
        </div>

        <div className="mt-2 rounded-xl border border-line-soft bg-glass-soft p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Perkiraan penyebab
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{selected.cause}</p>
          <p className="mt-1.5 text-[10.5px] font-semibold text-brand">{selected.change}</p>
        </div>

        <dl className="mt-3 space-y-1.5 text-[11px]">
          {[
            { label: "KPI", value: selected.kpi },
            { label: "Pemilik", value: selected.owner },
            { label: "Kanal", value: selected.channel },
            { label: "Aturan", value: selected.rule },
          ].map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-3">
              <dt className="text-ink-muted">{row.label}</dt>
              <dd className="max-w-[62%] text-right font-medium text-ink-soft">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateStatus("diakui")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-ink py-2 text-[11.5px] font-semibold text-white hover:bg-ink/90"
          >
            <Check className="size-3.5" />
            Akui
          </button>
          <button
            type="button"
            onClick={() => updateStatus("ditugaskan")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-glass py-2 text-[11.5px] font-semibold text-ink-soft hover:text-ink"
          >
            <UserPlus className="size-3.5" />
            Tugaskan
          </button>
          <button
            type="button"
            onClick={() => updateStatus("selesai")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-glass py-2 text-[11.5px] font-semibold text-ink-soft hover:text-ink"
          >
            <CheckCheck className="size-3.5" />
            Selesai
          </button>
          <button
            type="button"
            onClick={() => updateStatus("selesai")}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-glass py-2 text-[11.5px] font-semibold text-ink-soft hover:text-ink"
          >
            <Flag className="size-3.5" />
            False positive
          </button>
        </div>

        <div className="mt-3 space-y-2 border-t border-line-soft pt-3">
          {[
            { label: "Terdeteksi", time: selected.time, done: true },
            { label: "Notifikasi terkirim", time: "≤ 5 menit setelah data", done: true },
            { label: "Menunggu tindakan", time: "Eskalasi otomatis dalam 4 jam", done: false },
          ].map((step) => (
            <div key={step.label} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-0.5 grid size-5 place-items-center rounded-full",
                  step.done ? "bg-mint-soft text-mint-strong" : "bg-line-soft text-ink-muted",
                )}
              >
                {step.done ? <Check className="size-3" /> : <Clock3 className="size-3" />}
              </span>
              <div>
                <p className="text-[11px] font-medium text-ink">{step.label}</p>
                <p className="text-[10px] text-ink-muted">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
