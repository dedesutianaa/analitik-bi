"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Camera,
  Check,
  Database,
  Download,
  FileText,
  GitBranch,
  MessageSquare,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui-kit/breadcrumb";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { Chip, IconButton, PillSelect, Tag } from "@/components/ui-kit/pill";
import { Certified, Delta, Freshness, RagBadge } from "@/components/ui-kit/rag";
import { TrendChart, type TrendSeries } from "@/components/charts/trend-chart";
import { ContributionBars } from "@/components/charts/contribution";
import { Waterfall } from "@/components/charts/waterfall";
import { useAppState } from "@/lib/app-state";
import { comparisonOptions, type Comparison } from "@/lib/metrics";
import { downloadChartPng, downloadCsv } from "@/lib/export";
import { accentHex, type Kpi } from "@/lib/data";
import { cn } from "@/lib/utils";

const granularities = ["Bulanan", "Kuartalan", "Tahunan"];
const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];

const round = (value: number) => Math.round(value * 10) / 10;
const clampScore = (value: number) => Math.max(60, Math.min(99.9, round(value)));

type Mode = "sum" | "avg";

/** Collapses the monthly series onto the selected granularity. */
function regroup(values: number[], granularity: string, mode: Mode) {
  if (granularity === "Bulanan") return values;
  if (granularity === "Tahunan") return [reduce(values, mode)];
  return quarterLabels.map((_, index) => reduce(values.slice(index * 3, index * 3 + 3), mode));
}

function reduce(values: number[], mode: Mode) {
  if (!values.length) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  return round(mode === "sum" ? total : total / values.length);
}

function metricKind(kpi: Kpi) {
  const value = kpi.value.trim();
  if (value.endsWith("%")) return "percent" as const;
  if (value.endsWith("x")) return "ratio" as const;
  if (/^Rp/i.test(value)) return "currency" as const;
  return "count" as const;
}

const versionTimeline = (kpi: Kpi) => [
  {
    id: "v1.3",
    date: "18 Nov 2026",
    author: "Timotius Halim",
    status: "Berlaku",
    note: "Sertifikasi ulang; pemetaan akun COGS diperbarui tanpa mengubah angka historis.",
    formula: kpi.formula,
    source: kpi.source,
    rag: "Hijau ≥ target · Kuning dalam 1 poin · Merah > 1 poin di bawah target",
    dimensions: "Waktu, entitas hukum, wilayah, lini produk",
  },
  {
    id: "v1.2",
    date: "02 Agu 2026",
    author: "Timotius Halim",
    status: "Arsip",
    note: "Penambahan dimensi lini produk agar bisa drill-down sampai segmen.",
    formula: kpi.formula,
    source: kpi.source,
    rag: "Hijau ≥ target · Kuning dalam 1 poin · Merah > 1 poin di bawah target",
    dimensions: "Waktu, entitas hukum, wilayah",
  },
  {
    id: "v1.1",
    date: "14 Feb 2026",
    author: "Nadia Putri",
    status: "Arsip",
    note: "Aturan RAG diubah dari deviasi absolut menjadi deviasi relatif terhadap target.",
    formula: kpi.formula,
    source: "Ekstraksi harian pukul 05:00 sebelum jurnal penyesuaian",
    rag: "Hijau ≥ 95% target · Kuning 90–95% · Merah < 90%",
    dimensions: "Waktu, entitas hukum, wilayah",
  },
  {
    id: "v1.0",
    date: "06 Jan 2025",
    author: "Data Platform",
    status: "Arsip",
    note: "Definisi awal saat migrasi ke semantic layer.",
    formula: kpi.formula,
    source: "Ekstraksi harian pukul 05:00 sebelum jurnal penyesuaian",
    rag: "Hijau ≥ 95% target · Kuning 90–95% · Merah < 90%",
    dimensions: "Waktu, entitas hukum",
  },
];

const versionFields: { key: keyof ReturnType<typeof versionTimeline>[number]; label: string }[] = [
  { key: "date", label: "Tanggal berlaku" },
  { key: "author", label: "Penulis" },
  { key: "status", label: "Status" },
  { key: "formula", label: "Rumus" },
  { key: "source", label: "Sumber data" },
  { key: "rag", label: "Aturan RAG" },
  { key: "dimensions", label: "Dimensi diizinkan" },
];

type Comment = {
  id: string;
  name: string;
  role: string;
  time: string;
  initials: string;
  text: string;
  mention?: string;
  parent?: string;
};

const initialComments: Comment[] = [
  {
    id: "c1",
    name: "Rani Prameswari",
    role: "CFO",
    time: "Hari ini · 07:14",
    initials: "RP",
    text: "Kenaikan harga dari PT Sinar Baja sudah di luar klausul indeks. Saya minta renegosiasi selesai sebelum 12 Desember.",
    mention: "@Kepala Pengadaan",
  },
  {
    id: "c2",
    name: "Bayu Nugroho",
    role: "COO",
    time: "Hari ini · 07:32",
    initials: "BN",
    text: "Efisiensi logistik menambah 0,1 poin. Armada tambahan di Balikpapan mulai beroperasi 1 Desember.",
  },
  {
    id: "c3",
    name: "Timotius Halim",
    role: "Data Steward",
    time: "Kemarin · 18:02",
    initials: "TH",
    text: "Definisi v1.3 sudah disertifikasi. Perubahan hanya pada pemetaan akun COGS, angka historis tidak berubah.",
    parent: "c1",
  },
];

export function KpiDetail({ kpi }: { kpi: Kpi }) {
  const { showToast, comparison, setComparison } = useAppState();
  const [granularity, setGranularity] = useState("Bulanan");
  const [versionA, setVersionA] = useState("v1.2");
  const [versionB, setVersionB] = useState("v1.3");
  const [nodeIndex, setNodeIndex] = useState(1);
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLInputElement>(null);

  const color = accentHex[kpi.accent];
  const good = kpi.direction === "down" ? kpi.delta < 0 : kpi.delta > 0;
  const kind = metricKind(kpi);
  const mode: Mode = kind === "percent" || kind === "ratio" ? "avg" : "sum";
  const unit = kind === "percent" ? "%" : kind === "ratio" ? "x" : "";
  const decimals = kind === "percent" || kind === "ratio" ? 1 : 0;

  const labels = kpi.trend.map((point) => point.label);
  const actualRaw = kpi.trend.map((point) => point.value);

  const compareName =
    comparison === "vs Target" ? "Target" : comparison === "vs Periode lalu" ? "Bulan lalu" : "Tahun lalu";
  const compareRaw =
    comparison === "vs Target"
      ? kpi.trend.map((point) => point.target)
      : comparison === "vs Periode lalu"
        ? actualRaw.map((value, index) => (index === 0 ? value : actualRaw[index - 1]))
        : actualRaw.map((value) => round(value / 1.115));

  const chartLabels = granularity === "Bulanan" ? labels : granularity === "Kuartalan" ? quarterLabels : ["Total"];
  const series: TrendSeries[] = [
    { name: kpi.name, color, values: regroup(actualRaw, granularity, mode) },
    { name: compareName, color: "var(--violet)", values: regroup(compareRaw, granularity, mode), dashed: true, area: false },
  ];

  /* ---------- Jembatan perubahan (waterfall) ---------- */
  const last = kpi.trend.length - 1;
  const startValue = kpi.trend[last - 1].value;
  const endValue = kpi.trend[last].value;
  const change = round(endValue - startValue);
  const totalShare = kpi.drivers.reduce((sum, driver) => sum + driver.share, 0) || 1;
  const steps = kpi.drivers.map((driver) => ({
    label: driver.label,
    value: round((change * driver.share) / totalShare),
  }));
  if (steps.length) {
    const drift = round(change - steps.reduce((sum, step) => sum + step.value, 0));
    steps[steps.length - 1].value = round(steps[steps.length - 1].value + drift);
  }
  const running: number[] = [startValue];
  steps.reduce((acc, step) => {
    running.push(round(acc + step.value));
    return acc + step.value;
  }, startValue);
  const low = Math.min(...running);
  const high = Math.max(...running);
  const pad = (high - low) * 0.35 || Math.abs(high) * 0.05 || 1;

  /* ---------- Skor kualitas data ---------- */
  const seed = [...kpi.id].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const jitter = (seed % 7) / 2 - 1.5;
  const dimensions = [
    { label: "Kelengkapan", value: clampScore((kpi.certified ? 99.2 : 91.4) + jitter * 0.3) },
    { label: "Akurasi", value: clampScore((kpi.certified ? 97.6 : 89.1) + jitter * 0.6) },
    { label: "Ketepatan waktu", value: clampScore((kpi.freshness.includes("H+1") ? 96.4 : 88.6) + jitter * 0.5) },
    { label: "Konsistensi", value: clampScore((kpi.certified ? 95.8 : 84.2) + jitter * 0.8) },
  ];
  const qualityScore = round(dimensions.reduce((sum, item) => sum + item.value, 0) / dimensions.length);
  const weakest = dimensions.reduce((min, item) => (item.value < min.value ? item : min), dimensions[0]);
  const checks = [
    { label: "Nilai kosong 30 hari terakhir", value: kpi.certified ? "0" : "3", ok: kpi.certified },
    { label: "Duplikat pada grain entitas-bulan", value: "0", ok: true },
    { label: "Uji anomali lolos", value: `${kpi.drivers.length + 2}/${kpi.drivers.length + 2}`, ok: true },
    { label: "SLA kesegaran", value: kpi.freshness, ok: kpi.freshness.includes("H+1") },
  ];

  /* ---------- Riwayat versi ---------- */
  const versions = useMemo(() => versionTimeline(kpi), [kpi]);
  const versionOf = (id: string) => versions.find((version) => version.id === id) ?? versions[0];
  const left = versionOf(versionA);
  const right = versionOf(versionB);

  /* ---------- Garis keturunan ---------- */
  const lineage = [
    {
      icon: Database,
      title: "SAP ERP · Buku besar",
      stage: "Sumber",
      detail: { Pemilik: "Tim Data Platform", Kesegaran: "Harian 05:00 WIB", Volume: "1,2 juta baris/tahun", SLA: "99,9%" },
    },
    {
      icon: GitBranch,
      title: `Snowflake · fact_${kpi.id.replace(/-/g, "_")}`,
      stage: "Transformasi",
      detail: { Pemilik: "Analytics Engineering", Kesegaran: "Harian 06:10 WIB", "Uji kualitas": "18 uji lolos", SLA: "99,5%" },
    },
    {
      icon: Sparkles,
      title: `Semantic layer · ${kpi.id} v1.3`,
      stage: "Metrik",
      detail: { Pemilik: kpi.steward, Kesegaran: kpi.freshness, Formula: kpi.formula, SLA: "Sertifikasi tahunan" },
    },
    {
      icon: FileText,
      title: "Dashboard Keuangan & Board pack",
      stage: "Konsumsi",
      detail: { Pemilik: kpi.owner, "Pengguna aktif": "24 eksekutif", "Dipakai di": "4 tampilan tersimpan", SLA: "≤ 2 detik" },
    },
  ];
  const activeNode = lineage[nodeIndex];

  /* ---------- Komentar ---------- */
  const roots = comments.filter((comment) => !comment.parent);
  const repliesOf = (id: string) => comments.filter((comment) => comment.parent === id);
  const activeReplyTo = replyTo ? comments.find((comment) => comment.id === replyTo) : null;

  const submitComment = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c${prev.length + 1}`,
        name: "Ardi Kusuma",
        role: "CEO",
        time: "Baru saja",
        initials: "AK",
        text,
        parent: replyTo ?? undefined,
      },
    ]);
    setDraft("");
    setReplyTo(null);
    showToast(replyTo ? "Balasan terkirim ke diskusi KPI" : "Komentar ditambahkan ke diskusi KPI");
  };

  const exportTrend = () => {
    downloadCsv(`kpi-${kpi.id}-tren.csv`, [
      ["Periode", kpi.name, compareName],
      ...labels.map((label, index) => [label, actualRaw[index], compareRaw[index]]),
    ]);
    showToast("Data KPI diunduh sebagai CSV");
  };

  const exportChart = () => {
    const svg = chartRef.current?.querySelector("svg");
    if (!svg) return;
    const background = getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() || "#ffffff";
    downloadChartPng(svg, `kpi-${kpi.id}.png`, background, () => showToast("Grafik diekspor sebagai PNG"));
  };

  const share = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Tautan KPI disalin ke papan klip");
    } catch {
      showToast(`Tautan KPI: ${url}`);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <Breadcrumb
        items={[{ label: "Katalog KPI", href: "/kpi" }, { label: kpi.domain, href: "/kpi" }, { label: kpi.name }]}
      />

      <PageHeader
        eyebrow={`${kpi.domain} · ${kpi.certified ? "KPI bersertifikat" : "Perlu review"}`}
        title={kpi.name}
        subtitle={kpi.description}
        actions={
          <>
            <BrandButton href="/tanya-data" variant="ghost" icon={<Sparkles className="size-3.5" />}>
              Tanya Data
            </BrandButton>
            <BrandButton
              icon={<FileText className="size-3.5" />}
              onClick={() => showToast(`${kpi.name} ditambahkan ke board pack sebagai bagian baru`)}
            >
              Tambah ke board pack
            </BrandButton>
          </>
        }
      />

      {qualityScore < 92 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-amber/30 bg-amber-soft px-4 py-3">
          <Tag tone="amber">Kualitas data perlu perhatian</Tag>
          <p className="text-[11.5px] text-amber-strong">
            Skor kualitas {qualityScore}% · dimensi terlemah {weakest.label} ({weakest.value}%). Angka tetap dipublikasikan
            dengan banner ini sampai ambang terpenuhi.
          </p>
          <Link href="/admin" className="ml-auto text-[11px] font-semibold text-amber-strong underline-offset-2 hover:underline">
            Lihat detail di tata kelola
          </Link>
        </div>
      ) : null}

      <Panel className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <div>
          <p className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-ink-muted">Nilai saat ini</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="font-display text-[34px] font-semibold leading-none tracking-[-0.02em] text-ink">{kpi.value}</p>
            <Delta value={kpi.delta} suffix={kpi.deltaSuffix} good={good} className="mb-1" />
          </div>
          <p className="mt-1 text-[11px] text-ink-muted">{kpi.deltaLabel}</p>
        </div>
        <div className="h-12 w-px bg-line" />
        <div>
          <p className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-ink-muted">Target</p>
          <p className="mt-1 font-display text-[20px] font-semibold text-ink">{kpi.target}</p>
          <p className="mt-1 text-[11px] text-ink-muted">Pencapaian {kpi.achievement}%</p>
        </div>
        <div className="h-12 w-px bg-line" />
        <div>
          <p className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-ink-muted">Status</p>
          <div className="mt-1.5">
            <RagBadge rag={kpi.rag} />
          </div>
          <Freshness className="mt-1.5">{kpi.freshness}</Freshness>
        </div>
        <div className="h-12 w-px bg-line" />
        <div>
          <p className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-ink-muted">Kualitas data</p>
          <p className="mt-1 font-display text-[20px] font-semibold text-ink">{qualityScore}%</p>
          <p className="mt-1 text-[11px] text-ink-muted">{kpi.certified ? "Disertifikasi steward" : "Menunggu review"}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {kpi.certified ? <Certified /> : <Tag tone="amber">Perlu review</Tag>}
          <IconButton label="Bagikan KPI" onClick={share}>
            <Share2 className="size-4" />
          </IconButton>
          <IconButton label="Unduh data KPI" onClick={exportTrend}>
            <Download className="size-4" />
          </IconButton>
          <IconButton label="Buat peringatan" onClick={() => showToast(`Aturan peringatan untuk ${kpi.name} dibuat`)}>
            <Bell className="size-4" />
          </IconButton>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel>
            <PanelHeader
              title="Tren & pembanding"
              subtitle={`12 bulan terakhir · ${kpi.direction === "up" ? "lebih tinggi lebih baik" : "lebih rendah lebih baik"}`}
              insight={
                kpi.rag === "red"
                  ? "Nilai berada di bawah ambang kritis selama 3 bulan berturut-turut."
                  : "Tren bergerak mendekati target; dua bulan terakhir stabil."
              }
              action={
                <>
                  <PillSelect value={granularity} options={granularities} onSelect={setGranularity} />
                  <PillSelect
                    value={comparison}
                    options={comparisonOptions}
                    onSelect={(value) => setComparison(value as Comparison)}
                  />
                  <IconButton label="Ekspor grafik sebagai PNG" onClick={exportChart}>
                    <Camera className="size-4" />
                  </IconButton>
                </>
              }
            />
            <div ref={chartRef}>
              <TrendChart
                className="mt-4"
                labels={chartLabels}
                series={series}
                height={250}
                unit={unit}
                decimals={decimals}
                yDomain={kind === "percent" || kind === "ratio" ? ["dataMin - 2", "dataMax + 2"] : undefined}
              />
            </div>
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <PanelHeader
                title="Mengapa berubah?"
                subtitle="Analisis kontribusi terhadap perubahan"
                action={<Tag tone="violet">AI</Tag>}
              />
              <ContributionBars
                className="mt-4"
                items={kpi.drivers.map((driver) => ({
                  label: driver.label,
                  value: `${driver.value > 0 ? "+" : ""}${driver.value.toLocaleString("id-ID", { maximumFractionDigits: 2 })}`,
                  pct: driver.share,
                  accent: driver.accent,
                }))}
              />
              <p className="mt-4 rounded-xl bg-brand-tint px-3 py-2 text-[11px] leading-relaxed text-ink-soft">
                <span className="font-semibold text-brand-strong">Kesimpulan:</span> {kpi.drivers[0].label} adalah
                penyebab terbesar ({kpi.drivers[0].share}% dari perubahan).
              </p>
            </Panel>

            <Panel>
              <PanelHeader
                title="Jembatan perubahan"
                subtitle={`Dari ${kpi.trend[last - 1].label} ke ${kpi.trend[last].label}${unit ? ` · ${unit}` : ""}`}
              />
              <div className="mt-2">
                <Waterfall
                  height={220}
                  unit={unit}
                  domain={[round(low - pad), round(high + pad)]}
                  items={[
                    { label: kpi.trend[last - 1].label, value: startValue, type: "start" },
                    ...steps,
                    { label: kpi.trend[last].label, value: 0, type: "total" },
                  ]}
                />
              </div>
              <p className="mt-2 text-[10.5px] leading-relaxed text-ink-muted">
                Selisih {change > 0 ? "+" : ""}
                {change.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
                {unit} diatribusikan proporsional terhadap bobot kontribusi tiap driver.
              </p>
            </Panel>
          </div>

          <Panel>
            <PanelHeader
              title="Diskusi & konteks pemilik KPI"
              subtitle="Komentar tampil pada kartu KPI di beranda"
              action={
                <BrandButton
                  variant="ghost"
                  icon={<MessageSquare className="size-3.5" />}
                  onClick={() => commentRef.current?.focus()}
                >
                  Tambah komentar
                </BrandButton>
              }
            />
            <div className="mt-4 space-y-3">
              {roots.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <CommentBubble
                    comment={comment}
                    onReply={() => {
                      setReplyTo(comment.id);
                      commentRef.current?.focus();
                    }}
                  />
                  {repliesOf(comment.id).map((reply) => (
                    <div key={reply.id} className="pl-8">
                      <CommentBubble comment={reply} />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <form
              className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3"
              onSubmit={(event) => {
                event.preventDefault();
                submitComment();
              }}
            >
              <input
                ref={commentRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={activeReplyTo ? `Balas ${activeReplyTo.name}…` : "Tulis komentar atau tandai rekan dengan @…"}
                className="h-10 min-w-[220px] flex-1 rounded-full border border-line bg-glass px-3.5 text-[12px] text-ink outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-brand/40"
              />
              <BrandButton className="h-10 px-4 text-[12px]">Kirim</BrandButton>
              {activeReplyTo ? (
                <Chip className="h-10" onClick={() => setReplyTo(null)}>
                  Batal balas
                </Chip>
              ) : null}
            </form>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Skor kualitas data" subtitle="Dipantau otomatis setiap pemuatan" action={<Tag tone={qualityScore >= 92 ? "mint" : "amber"}>{qualityScore}%</Tag>} />
            <div className="mt-3 space-y-2.5">
              {dimensions.map((item) => (
                <div key={item.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-ink-soft">{item.label}</span>
                    <span className="text-[11px] font-semibold text-ink">{item.value}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-soft">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.value}%`,
                        background: item.value >= 92 ? "var(--mint)" : "var(--amber)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1.5 border-t border-line-soft pt-3">
              {checks.map((check) => (
                <div key={check.label} className="flex items-center gap-2 text-[11px]">
                  <span
                    className={cn(
                      "grid size-4 place-items-center rounded-full",
                      check.ok ? "bg-mint-soft text-mint-strong" : "bg-amber-soft text-amber-strong",
                    )}
                  >
                    <Check className="size-2.5" />
                  </span>
                  <span className="text-ink-soft">{check.label}</span>
                  <span className="ml-auto font-semibold text-ink">{check.value}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Definisi KPI" subtitle={`Versi ${right.id} · ditinjau ${right.date}`} />
            <dl className="mt-3 space-y-2.5 text-[11.5px]">
              {[
                { label: "Rumus", value: right.formula },
                { label: "Pemilik bisnis", value: kpi.owner },
                { label: "Data steward", value: kpi.steward },
                { label: "Sumber", value: right.source },
                { label: "Frekuensi & kesegaran", value: kpi.freshness },
                {
                  label: "Arah baik",
                  value: kpi.direction === "up" ? "Lebih tinggi lebih baik" : "Lebih rendah lebih baik",
                },
                { label: "Aturan RAG", value: right.rag },
                { label: "Dimensi diizinkan", value: right.dimensions },
              ].map((row) => (
                <div key={row.label} className="rounded-xl bg-line-soft/60 px-3 py-2">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">{row.label}</dt>
                  <dd className="mt-0.5 leading-relaxed text-ink-soft">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel>
            <PanelHeader title="Riwayat versi & bandingkan" subtitle="Jejak perubahan definisi yang dapat diaudit" />
            <ol className="mt-3 space-y-2">
              {versions.map((version) => (
                <li
                  key={version.id}
                  className={cn(
                    "rounded-xl border px-3 py-2",
                    version.status === "Berlaku" ? "border-brand/25 bg-brand-tint" : "border-line-soft bg-glass-soft",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10.5px] font-semibold text-ink">{version.id}</span>
                    <span className="text-[10px] text-ink-muted">{version.date}</span>
                    <Tag tone={version.status === "Berlaku" ? "brand" : "neutral"} className="ml-auto">
                      {version.status}
                    </Tag>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">{version.note}</p>
                  <p className="mt-0.5 text-[10px] text-ink-muted">{version.author}</p>
                </li>
              ))}
            </ol>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3">
              <PillSelect label="Versi A" value={versionA} options={versions.map((v) => v.id)} onSelect={setVersionA} align="start" />
              <PillSelect label="Versi B" value={versionB} options={versions.map((v) => v.id)} onSelect={setVersionB} align="start" />
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-line-soft">
              <div className="grid grid-cols-[92px_1fr_1fr] bg-line-soft/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
                <span>Field</span>
                <span>{left.id}</span>
                <span>{right.id}</span>
              </div>
              {versionFields
                .filter((field) => field.key !== "date" && field.key !== "author" && field.key !== "status")
                .map((field) => {
                  const changed = left[field.key] !== right[field.key];
                  return (
                    <div
                      key={field.key}
                      className={cn(
                        "grid grid-cols-[92px_1fr_1fr] gap-2 border-t border-line-soft px-3 py-2 text-[10.5px]",
                        changed && "bg-amber-soft/50",
                      )}
                    >
                      <span className="font-semibold text-ink-muted">{field.label}</span>
                      <span className="text-ink-soft">{left[field.key]}</span>
                      <span className="text-ink-soft">{right[field.key]}</span>
                    </div>
                  );
                })}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Garis keturunan data" subtitle="Klik simpul untuk melihat detail" />
            <ol className="mt-3 space-y-2">
              {lineage.map((node, index) => (
                <li key={node.title}>
                  <button
                    type="button"
                    onClick={() => setNodeIndex(index)}
                    aria-pressed={nodeIndex === index}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors",
                      nodeIndex === index
                        ? "border-brand/30 bg-brand-tint"
                        : "border-line-soft bg-glass-soft hover:bg-glass",
                    )}
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-line-soft text-ink-soft">
                      <node.icon className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-medium text-ink">{node.title}</p>
                      <p className="text-[10px] text-ink-muted">{node.stage}</p>
                    </div>
                    {index < lineage.length - 1 ? (
                      <ArrowRight className="ml-auto mt-1.5 size-3 text-ink-muted" />
                    ) : null}
                  </button>
                </li>
              ))}
            </ol>
            <dl className="mt-3 space-y-1.5 rounded-xl border border-line-soft bg-glass-soft p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                {activeNode.stage} · {activeNode.title}
              </p>
              {Object.entries(activeNode.detail).map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-3 text-[11px]">
                  <dt className="text-ink-muted">{label}</dt>
                  <dd className="max-w-[62%] text-right font-medium text-ink-soft">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel>
            <PanelHeader title="Tindak lanjut terkait" subtitle="Dari insight ke aksi" />
            <div className="mt-3 space-y-2">
              {[
                { title: "Renegosiasi kontrak pemasok", owner: "Kepala Pengadaan", due: "12 Des" },
                { title: "Validasi bauran produk Q4", owner: "Head of FP&A", due: "05 Des" },
              ].map((task) => (
                <Link
                  key={task.title}
                  href="/tindak-lanjut"
                  className="flex items-center gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2 hover:bg-glass"
                >
                  <UserRound className="size-3.5 text-ink-muted" />
                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-medium text-ink">{task.title}</p>
                    <p className="text-[10px] text-ink-muted">
                      {task.owner} · tenggat {task.due}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto size-3.5 text-ink-muted" />
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function CommentBubble({ comment, onReply }: { comment: Comment; onReply?: () => void }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#ffd0ae] to-[#f9a86a] text-[10px] font-bold text-white">
        {comment.initials}
      </span>
      <div className="min-w-0 flex-1 rounded-2xl border border-line-soft bg-glass-soft px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-x-2">
          <p className="text-[12px] font-semibold text-ink">{comment.name}</p>
          <span className="text-[10px] text-ink-muted">{comment.role}</span>
          <span className="ml-auto text-[10px] text-ink-muted">{comment.time}</span>
        </div>
        <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">
          {comment.text} {comment.mention ? <span className="font-semibold text-brand">{comment.mention}</span> : null}
        </p>
        {onReply ? (
          <button
            type="button"
            onClick={onReply}
            className="mt-1.5 text-[10.5px] font-semibold text-brand hover:text-brand-strong"
          >
            Balas
          </button>
        ) : null}
      </div>
    </div>
  );
}
