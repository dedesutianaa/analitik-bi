"use client";

import { useState } from "react";
import { Download, ThumbsUp } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { IconButton, PillSelect } from "@/components/ui-kit/pill";
import { TrendChart, type TrendSeries } from "@/components/charts/trend-chart";
import { BarTrend } from "@/components/charts/bar-chart";
import { Gauge } from "@/components/charts/gauge";
import { ContributionBars } from "@/components/charts/contribution";
import { Delta } from "@/components/ui-kit/rag";
import { downloadCsv } from "@/lib/export";
import { useAppState } from "@/lib/app-state";

/** Chart colours resolve through the colour scheme tokens so they stay legible in dark mode. */
const realisasi = [312, 328, 351, 366, 389, 402, 418, 431, 452, 468, 481, 502];
const target = [330, 340, 352, 365, 378, 390, 402, 415, 428, 440, 452, 465];
const tahunLalu = [280, 292, 305, 318, 330, 342, 355, 366, 378, 390, 402, 415];

const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const quarters = ["Q1", "Q2", "Q3", "Q4"];
const granularities = ["Bulanan", "Kuartalan", "Tahunan"];

const total = (values: number[]) => values.reduce((sum, value) => sum + value, 0);
const byQuarter = (values: number[]) => quarters.map((_, index) => total(values.slice(index * 3, index * 3 + 3)));

/** Re-shapes the monthly series for the selected granularity. */
function buildRevenue(granularity: string): { labels: string[]; series: TrendSeries[] } {
  if (granularity === "Kuartalan") {
    return {
      labels: quarters,
      series: [
        { name: "Realisasi", color: "var(--brand)", values: byQuarter(realisasi) },
        { name: "Target", color: "var(--violet)", values: byQuarter(target) },
        { name: "Tahun lalu", color: "var(--ink-muted)", values: byQuarter(tahunLalu), dashed: true },
      ],
    };
  }
  if (granularity === "Tahunan") {
    return {
      labels: ["Tahun lalu", "Target", "Realisasi"],
      series: [
        { name: "Total tahunan", color: "var(--brand)", values: [total(tahunLalu), total(target), total(realisasi)] },
      ],
    };
  }
  return {
    labels: months,
    series: [
      { name: "Realisasi", color: "var(--brand)", values: realisasi },
      { name: "Target", color: "var(--violet)", values: target },
      { name: "Tahun lalu", color: "var(--ink-muted)", values: tahunLalu, dashed: true },
    ],
  };
}

export function RevenueCard() {
  const { showToast } = useAppState();
  const [granularity, setGranularity] = useState("Bulanan");
  const { labels, series } = buildRevenue(granularity);

  const handleDownload = () => {
    downloadCsv("tren-pendapatan.csv", [
      ["Periode", "Realisasi (Rp miliar)", "Target (Rp miliar)", "Tahun lalu (Rp miliar)"],
      ...labels.map((label, index) => [
        label,
        series[0].values[index],
        series[1].values[index] ?? "",
        series[2]?.values[index] ?? "",
      ]),
    ]);
    showToast(`Grafik pendapatan (${granularity}) diunduh sebagai CSV`);
  };

  return (
    <Panel>
      <PanelHeader
        title="Tren pendapatan & target"
        subtitle={`Konsolidasi grup · Rp miliar · ${granularity}`}
        insight="Pendapatan tumbuh 12,4% YoY dan mulai melampaui target sejak September."
        action={
          <>
            <PillSelect value={granularity} options={granularities} onSelect={setGranularity} />
            <IconButton label="Unduh grafik" onClick={handleDownload}>
              <Download className="size-4" />
            </IconButton>
          </>
        }
      />
      <TrendChart
        className="mt-4"
        labels={labels}
        series={series}
        height={252}
        unit=" M"
        callout={
          granularity === "Bulanan"
            ? {
                title: "Nov 2026",
                rows: [
                  { label: "Realisasi", value: "Rp 481 M", color: "var(--brand)" },
                  { label: "Target", value: "Rp 452 M", color: "var(--violet)" },
                  { label: "Tahun lalu", value: "Rp 402 M", color: "var(--ink-muted)" },
                ],
                left: "46%",
                top: "2%",
              }
            : undefined
        }
      />
    </Panel>
  );
}

export function MarginGaugeCard() {
  const { showToast } = useAppState();

  const handleDownload = () => {
    downloadCsv("ringkasan-margin.csv", [
      ["Metrik", "Nilai", "Pembanding"],
      ["Pencapaian margin terhadap target", "94%", "Target 100%"],
      ["Margin kotor", "38,6%", "-2,3 pp"],
      ["Target margin kotor", "40,9%", "YTD 2026"],
    ]);
    showToast("Ringkasan margin diunduh sebagai CSV");
  };

  return (
    <Panel className="flex flex-col">
      <PanelHeader
        title="Kesehatan margin"
        subtitle="Pencapaian terhadap target YTD"
        action={
          <IconButton label="Unduh ringkasan" onClick={handleDownload}>
            <Download className="size-4" />
          </IconButton>
        }
      />
      <div className="mt-1 flex flex-1 flex-col justify-center">
        <Gauge value={94} color="var(--brand)" track="var(--line-soft)" size={188}>
          <span className="mx-auto grid size-10 place-items-center rounded-full bg-brand-soft">
            <ThumbsUp className="size-[18px] text-brand" />
          </span>
          <p className="mt-1.5 font-display text-[26px] font-semibold leading-none text-ink">94%</p>
          <p className="mt-1 text-[10.5px] text-ink-muted">dari target</p>
        </Gauge>
        <div className="mx-auto mt-1 flex w-[188px] justify-between px-1 text-[10px] text-ink-muted">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-line-soft/70 p-2.5">
          <p className="text-[10px] text-ink-muted">Margin kotor</p>
          <p className="mt-0.5 font-display text-[15px] font-semibold text-ink">38,6%</p>
          <Delta value={-2.3} suffix=" pp" good={false} />
        </div>
        <div className="rounded-xl bg-line-soft/70 p-2.5">
          <p className="text-[10px] text-ink-muted">Target</p>
          <p className="mt-0.5 font-display text-[15px] font-semibold text-ink">40,9%</p>
          <span className="text-[11px] font-medium text-ink-muted">YTD 2026</span>
        </div>
      </div>
    </Panel>
  );
}

const divisions = [
  { label: "Divisi Digital", value: "92%", pct: 92, accent: "mint" as const },
  { label: "Divisi Manufaktur", value: "84%", pct: 84, accent: "violet" as const },
  { label: "Divisi Ritel", value: "78%", pct: 78, accent: "sky" as const },
  { label: "Divisi Logistik", value: "65%", pct: 65, accent: "brand" as const },
];

export function DivisionCard() {
  const { showToast } = useAppState();

  const handleDownload = () => {
    downloadCsv("kinerja-divisi.csv", [
      ["Divisi", "Pencapaian target pendapatan"],
      ...divisions.map((division) => [division.label, division.value]),
    ]);
    showToast("Data divisi diunduh sebagai CSV");
  };

  return (
    <Panel className="flex flex-col">
      <PanelHeader
        title="Kinerja per divisi"
        subtitle="Pencapaian target pendapatan"
        action={
          <IconButton label="Unduh data divisi" onClick={handleDownload}>
            <Download className="size-4" />
          </IconButton>
        }
      />
      <ContributionBars className="mt-4" items={divisions} />
      <div className="mt-auto pt-4">
        <p className="rounded-xl bg-brand-tint px-3 py-2 text-[11px] leading-relaxed text-ink-soft">
          <span className="font-semibold text-brand-strong">Insight:</span> Divisi Logistik tertinggal 35
          poin dari target karena keterlambatan pengiriman di Kalimantan.
        </p>
      </div>
    </Panel>
  );
}

const segments = ["Enterprise", "Ritel", "UMKM", "Digital", "Lainnya"];
const segmentYtd = [1920, 1440, 960, 500, 320];
const segmentScopes = ["MTD", "QTD", "YTD"];
/** Share of the year-to-date figure each scope represents. */
const segmentFactor: Record<string, number> = { MTD: 0.085, QTD: 0.26, YTD: 1 };

export function SegmentCard() {
  const { showToast } = useAppState();
  const [scope, setScope] = useState("YTD");
  const factor = segmentFactor[scope];
  const values = segmentYtd.map((value) => Math.round(value * factor));

  const handleDownload = () => {
    downloadCsv(`pendapatan-segmen-${scope.toLowerCase()}.csv`, [
      ["Segmen", `Pendapatan (Rp miliar, ${scope})`],
      ...segments.map((segment, index) => [segment, values[index]]),
    ]);
    showToast(`Data segmen (${scope}) diunduh sebagai CSV`);
  };

  return (
    <Panel>
      <PanelHeader
        title="Pendapatan per segmen"
        subtitle={`${scope} 2026 · Rp miliar`}
        insight="Enterprise menyumbang 40% pendapatan dan tumbuh paling cepat (+18,4%)."
        action={
          <>
            <PillSelect value={scope} options={segmentScopes} onSelect={setScope} />
            <IconButton label="Unduh grafik" onClick={handleDownload}>
              <Download className="size-4" />
            </IconButton>
          </>
        }
      />
      <div className="mt-4">
        <BarTrend labels={segments} values={values} highlight={0} height={236} unit=" M" />
      </div>
    </Panel>
  );
}
