"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Download, Filter, Play, Sparkles } from "lucide-react";
import { Breadcrumb } from "@/components/ui-kit/breadcrumb";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { Chip, IconButton, PillSelect, Tag } from "@/components/ui-kit/pill";
import { MiniStat } from "@/components/ui-kit/stat-card";
import { Freshness } from "@/components/ui-kit/rag";
import { SimpleTable } from "@/components/ui-kit/table";
import { TrendChart, type TrendSeries } from "@/components/charts/trend-chart";
import { BarTrend } from "@/components/charts/bar-chart";
import { ContributionBars } from "@/components/charts/contribution";
import { timezoneLabel, useAppState } from "@/lib/app-state";
import { downloadCsv, downloadJson } from "@/lib/export";
import { periodOptions, periodScopeDetail, scaleMetricValue, windowIndices } from "@/lib/metrics";
import type { Domain } from "@/lib/data";

const regions = ["Semua", "Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali-Nusra"];
const entities = ["Konsolidasi", "PT Nusantara Ritel", "PT Nusantara Manufaktur", "PT Nusantara Logistik"];
const segments = ["Semua", "Enterprise", "Mid-market", "Ritel", "UMKM"];
const granularities = ["Bulanan", "Kuartalan", "Tahunan"];

/** Contribution of each scope value to the consolidated figure (mock shares). */
const regionShare: Record<string, number> = {
  Semua: 1,
  Jawa: 0.42,
  Sumatera: 0.22,
  Kalimantan: 0.12,
  Sulawesi: 0.11,
  "Bali-Nusra": 0.08,
};
const entityShare: Record<string, number> = {
  Konsolidasi: 1,
  "PT Nusantara Ritel": 0.3,
  "PT Nusantara Manufaktur": 0.4,
  "PT Nusantara Logistik": 0.18,
};
const segmentShare: Record<string, number> = {
  Semua: 1,
  Enterprise: 0.42,
  "Mid-market": 0.28,
  Ritel: 0.2,
  UMKM: 0.1,
};

/** Averages and cycle times do not shrink when the scope narrows. */
function isAdditive(label: string, value: string) {
  if (/[%x]$/.test(value.trim())) return false;
  return !/rata-rata|siklus|hari|coverage|rasio|per /i.test(label);
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

export function DomainDashboard({ domain }: { domain: Domain }) {
  const { period, setPeriod, timezone, showToast } = useAppState();
  const [region, setRegion] = useState("Semua");
  const [entity, setEntity] = useState("Konsolidasi");
  const [segment, setSegment] = useState("Semua");
  const [granularity, setGranularity] = useState("Bulanan");
  const [annotations, setAnnotations] = useState(domain.annotations);
  const [draft, setDraft] = useState<string | null>(null);

  const scope = round(regionShare[region] * entityShare[entity] * segmentShare[segment]);
  const scopeLabel = [region, entity, segment].filter((value) => value !== "Semua" && value !== "Konsolidasi");
  const scoped = scope !== 1;

  const trend = useMemo(() => {
    const indices = windowIndices(period, domain.trend.labels.length);
    const scaleNumbers = /Rp|miliar|juta/i.test(domain.trend.unit);
    const factor = scaleNumbers ? scope : 1;
    const mode: "sum" | "avg" = scaleNumbers ? "sum" : "avg";

    const keyOf = (position: number) =>
      granularity === "Tahunan" ? "Total" : `Q${Math.floor(indices[position] / 3) + 1}`;

    const build = (series: Domain["trend"]["series"][number]): TrendSeries => {
      if (granularity === "Bulanan") {
        return {
          name: series.name,
          color: series.color,
          values: indices.map((index) => round(series.values[index] * factor)),
        };
      }
      const keys = Array.from(new Set(indices.map((_, position) => keyOf(position))));
      const sums = new Map<string, number>();
      const counts = new Map<string, number>();
      indices.forEach((index, position) => {
        const key = keyOf(position);
        sums.set(key, (sums.get(key) ?? 0) + series.values[index] * factor);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      });
      return {
        name: series.name,
        color: series.color,
        values: keys.map((key) => round(mode === "sum" ? (sums.get(key) ?? 0) : (sums.get(key) ?? 0) / (counts.get(key) ?? 1))),
      };
    };

    return {
      labels:
        granularity === "Bulanan"
          ? indices.map((index) => domain.trend.labels[index])
          : Array.from(new Set(indices.map((_, position) => keyOf(position)))),
      series: domain.trend.series.map(build),
      indices,
    };
  }, [domain, period, granularity, scope]);

  const latestMonth = domain.trend.labels[trend.indices[trend.indices.length - 1]];

  const handleExportJson = () => {
    downloadJson(`dashboard-${domain.slug}.json`, {
      domain: domain.name,
      periode: period,
      rentang: periodScopeDetail[period],
      filter: { wilayah: region, entitas: entity, segmen: segment },
      kpi: domain.kpis.map((kpi) => ({
        label: kpi.label,
        nilai: isAdditive(kpi.label, kpi.value) ? scaleMetricValue(kpi.value, scope) : kpi.value,
        delta: kpi.delta,
      })),
      tren: trend.labels.map((label, index) => ({
        periode: label,
        ...Object.fromEntries(trend.series.map((series) => [series.name, series.values[index]])),
      })),
    });
    showToast(`Ekspor ${domain.name} diunduh sebagai JSON`);
  };

  const handleDownloadTrend = () => {
    downloadCsv(`tren-${domain.slug}.csv`, [
      ["Periode", ...trend.series.map((series) => series.name)],
      ...trend.labels.map((label, index) => [label, ...trend.series.map((series) => series.values[index])]),
    ]);
    showToast(`Grafik ${domain.trend.title} diunduh sebagai CSV`);
  };

  const handleDownloadBars = () => {
    downloadCsv(`distribusi-${domain.slug}.csv`, [
      [domain.bars.title, domain.bars.unit],
      ...domain.bars.labels.map((label, index) => [
        label,
        /Rp|miliar|juta/i.test(domain.bars.unit)
          ? round(domain.bars.values[index] * scope)
          : domain.bars.values[index],
      ]),
    ]);
    showToast("Data distribusi diunduh sebagai CSV");
  };

  const filteredRows = useMemo(() => {
    if (entity === "Konsolidasi") return domain.table.rows;
    const rows = domain.table.rows.filter((row) => row.some((cell) => String(cell).includes(entity)));
    return rows.length ? rows : domain.table.rows;
  }, [domain.table.rows, entity]);

  const handleDownloadTable = () => {
    downloadCsv(`tabel-${domain.slug}.csv`, [domain.table.columns, ...filteredRows]);
    showToast("Tabel diunduh sebagai CSV");
  };

  const handleSaveFilter = () => {
    showToast(
      `Filter tersimpan: ${[period, region, entity, segment].join(" · ")}`,
    );
  };

  const handleResetFilter = () => {
    setRegion("Semua");
    setEntity("Konsolidasi");
    setSegment("Semua");
    showToast("Filter dashboard diatur ulang");
  };

  const addAnnotation = () => {
    if (!draft?.trim()) return;
    setAnnotations((prev) => [...prev, { label: latestMonth, note: draft.trim() }]);
    setDraft(null);
    showToast("Anotasi ditambahkan ke sumbu waktu");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <Breadcrumb items={[{ label: "Dashboard domain", href: "/dashboard" }, { label: domain.name }]} />

      <PageHeader
        eyebrow="Dashboard domain"
        title={domain.name}
        subtitle={domain.tagline}
        actions={
          <>
            <BrandButton href="/presentasi" variant="ghost" icon={<Play className="size-3.5" />}>
              Presentasi
            </BrandButton>
            <BrandButton variant="ghost" icon={<Download className="size-3.5" />} onClick={handleExportJson}>
              Ekspor
            </BrandButton>
            <BrandButton icon={<Filter className="size-3.5" />} onClick={handleSaveFilter}>
              Filter tersimpan
            </BrandButton>
          </>
        }
      />

      <Panel className="flex flex-wrap items-center gap-2 py-3">
        <PillSelect label="Periode" value={period} options={periodOptions} onSelect={(value) => setPeriod(value as typeof period)} />
        <PillSelect label="Wilayah" value={region} options={regions} onSelect={setRegion} />
        <PillSelect label="Entitas" value={entity} options={entities} onSelect={setEntity} />
        <PillSelect label="Segmen" value={segment} options={segments} onSelect={setSegment} />
        <span className="ml-auto flex items-center gap-2">
          <Tag tone={scoped ? "violet" : "mint"}>
            {scoped ? `Cakupan ${Math.round(scope * 100)}% grup` : "Semua KPI bersertifikat"}
          </Tag>
          <Freshness>{`Diperbarui 07:00 ${timezoneLabel[timezone]}`}</Freshness>
        </span>
        {scopeLabel.length ? (
          <div className="flex w-full flex-wrap items-center gap-1.5 border-t border-line-soft pt-2.5">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
              Filter aktif
            </span>
            {scopeLabel.map((label) => (
              <Tag key={label} tone="brand">
                {label}
              </Tag>
            ))}
            <Chip className="ml-auto" onClick={handleResetFilter}>
              Atur ulang
            </Chip>
          </div>
        ) : null}
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {domain.kpis.map((kpi) => (
          <MiniStat
            key={kpi.label}
            label={kpi.label.replace(/\bYTD\b/, period)}
            value={isAdditive(kpi.label, kpi.value) ? scaleMetricValue(kpi.value, scope) : kpi.value}
            delta={`${kpi.delta} · ${periodScopeDetail[period]}`}
            rag={kpi.rag}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel>
            <PanelHeader
              title={domain.trend.title}
              subtitle={`${periodScopeDetail[period]} · ${domain.trend.unit}${scoped ? " · cakupan terfilter" : ""}`}
              insight={domain.trend.insight}
              action={
                <>
                  <PillSelect value={granularity} options={granularities} onSelect={setGranularity} />
                  <IconButton label="Unduh grafik" onClick={handleDownloadTrend}>
                    <Download className="size-4" />
                  </IconButton>
                </>
              }
            />
            <TrendChart className="mt-4" labels={trend.labels} series={trend.series} height={260} />
          </Panel>
        </div>

        <Panel className="flex flex-col">
          <PanelHeader
            title={domain.breakdown.title}
            subtitle="Kontribusi terhadap perubahan"
            action={<Tag tone="violet">AI</Tag>}
          />
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-soft">{domain.breakdown.insight}</p>
          <ContributionBars className="mt-4" items={domain.breakdown.items} />
          <div className="mt-auto pt-4">
            <Link
              href="/tanya-data"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:text-brand-strong"
            >
              Tanya “mengapa berubah?”
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel>
          <PanelHeader
            title={domain.bars.title}
            subtitle={domain.bars.unit}
            action={
              <IconButton label="Unduh grafik" onClick={handleDownloadBars}>
                <Download className="size-4" />
              </IconButton>
            }
          />
          <div className="mt-4">
            <BarTrend
              labels={domain.bars.labels}
              values={domain.bars.values.map((value) =>
                /Rp|miliar|juta/i.test(domain.bars.unit) ? round(value * scope) : value,
              )}
              highlight={domain.bars.highlight}
              height={230}
              reference={domain.slug === "keuangan" ? { value: 100, label: "Anggaran" } : undefined}
            />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">{domain.bars.insight}</p>
        </Panel>

        <div className="xl:col-span-2">
          <Panel>
            <PanelHeader
              title={domain.table.title}
              subtitle="Klik baris untuk drill-down ke level transaksi"
              action={
                <>
                  <Tag tone="neutral">Drill-down ≤ 3 klik</Tag>
                  <IconButton label="Unduh tabel" onClick={handleDownloadTable}>
                    <Download className="size-4" />
                  </IconButton>
                </>
              }
            />
            <SimpleTable
              className="mt-3"
              minWidth={560}
              columns={domain.table.columns}
              rows={filteredRows.map((row) =>
                row.map((cell, index) => (
                  <span
                    key={index}
                    className={
                      index === 0
                        ? "font-semibold text-ink"
                        : cell === "Merah" || cell === "Kritis" || cell === "Terbuka"
                          ? "font-semibold text-danger-strong"
                          : cell === "Kuning" || cell === "Perhatian" || cell === "Dalam proses"
                            ? "font-semibold text-amber-strong"
                            : cell === "Hijau" || cell === "Aman" || cell === "Selesai"
                              ? "font-semibold text-mint-strong"
                              : undefined
                    }
                  >
                    {cell}
                  </span>
                )),
              )}
            />
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Pertanyaan kunci domain ini"
            subtitle="Dijawab langsung dari semantic layer"
            action={<Tag tone="violet">Tanya Data</Tag>}
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {domain.questions.map((question) => (
              <Link
                key={question}
                href="/tanya-data"
                className="group flex items-center gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2.5 text-[11.5px] text-ink-soft transition-colors hover:border-brand/20 hover:bg-glass hover:text-ink"
              >
                <Sparkles className="size-3.5 shrink-0 text-violet" />
                <span className="min-w-0 flex-1">{question}</span>
                <ArrowUpRight className="size-3.5 shrink-0 text-ink-muted opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Anotasi peristiwa" subtitle="Penanda pada sumbu waktu" />
          <div className="mt-3 space-y-2">
            {annotations.map((annotation, index) => (
              <div
                key={`${annotation.label}-${index}`}
                className="flex items-start gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2"
              >
                <span className="mt-0.5 rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold text-brand-strong">
                  {annotation.label}
                </span>
                <p className="text-[11px] leading-relaxed text-ink-soft">{annotation.note}</p>
              </div>
            ))}

            {draft === null ? (
              <button
                type="button"
                onClick={() => setDraft("")}
                className="w-full rounded-xl border border-dashed border-line py-2 text-[11px] font-semibold text-ink-muted transition-colors hover:border-brand/40 hover:text-brand"
              >
                + Tambah anotasi
              </button>
            ) : (
              <form
                className="space-y-2 rounded-xl border border-brand/25 bg-glass-soft p-2.5"
                onSubmit={(event) => {
                  event.preventDefault();
                  addAnnotation();
                }}
              >
                <label className="block text-[10.5px] font-semibold text-ink-muted" htmlFor="anotasi-baru">
                  Anotasi untuk {latestMonth}
                </label>
                <input
                  id="anotasi-baru"
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Contoh: perubahan harga bahan baku"
                  className="h-9 w-full rounded-xl border border-line bg-surface px-2.5 text-[12px] text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                />
                <div className="flex items-center gap-2">
                  <BrandButton className="h-8 px-3 text-[11.5px]">Simpan</BrandButton>
                  <Chip className="h-8" onClick={() => setDraft(null)}>
                    Batal
                  </Chip>
                </div>
              </form>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
