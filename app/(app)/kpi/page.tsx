import { Archive, ListChecks, Plus, ShieldCheck, TriangleAlert, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { SummaryTile } from "@/components/ui-kit/stat-card";
import { Tag } from "@/components/ui-kit/pill";
import { KpiCatalog, type CatalogRow } from "@/components/kpi/kpi-catalog";
import { kpis } from "@/lib/data";

export const metadata = { title: "Katalog KPI" };

const extra: CatalogRow[] = [
  {
    id: "dso",
    name: "DSO",
    domain: "Keuangan",
    value: "48 hari",
    delta: 4,
    deltaSuffix: " hari",
    target: "≤ 45 hari",
    owner: "Treasury Manager",
    freshness: "Harian",
    certified: true,
    rag: "red",
  },
  {
    id: "roas",
    name: "ROAS",
    domain: "Pemasaran",
    value: "4,8x",
    delta: 0.4,
    deltaSuffix: "x",
    target: "4,5x",
    owner: "CMO",
    freshness: "Harian",
    certified: true,
    rag: "green",
  },
  {
    id: "nps",
    name: "NPS",
    domain: "Pelanggan",
    value: "48",
    delta: 3,
    deltaSuffix: " poin",
    target: "50",
    owner: "CRO",
    freshness: "Bulanan",
    certified: true,
    rag: "amber",
  },
  {
    id: "oee",
    name: "OEE",
    domain: "Operasi",
    value: "78,6%",
    delta: -1.1,
    deltaSuffix: " pp",
    target: "82,0%",
    owner: "COO",
    freshness: "15 menit",
    certified: true,
    rag: "amber",
  },
  {
    id: "win-rate",
    name: "Win Rate",
    domain: "Penjualan",
    value: "28,4%",
    delta: 1.2,
    deltaSuffix: " pp",
    target: "30,0%",
    owner: "CRO",
    freshness: "Per jam",
    certified: true,
    rag: "amber",
  },
  {
    id: "headcount",
    name: "Headcount",
    domain: "SDM",
    value: "8.420",
    delta: 2.1,
    deltaSuffix: "%",
    target: "8.600",
    owner: "CHRO",
    freshness: "Mingguan",
    certified: false,
    rag: "green",
  },
];

const glossary = [
  { term: "Omzet", alias: "Pendapatan", owner: "Data steward" },
  { term: "Laba kotor", alias: "Gross profit", owner: "Kepala Akuntansi" },
  { term: "Pelanggan aktif", alias: "Active customer (90 hari)", owner: "Head of CX" },
  { term: "Wilayah", alias: "Region (5 klaster)", owner: "Sales Ops" },
];

const certification = [
  { step: "Draf", detail: "Diusulkan pemilik bisnis", done: true },
  { step: "Review", detail: "Divalidasi data steward", done: true },
  { step: "Bersertifikat", detail: "Disetujui & tampil di beranda", done: true },
  { step: "Usang", detail: "Ditandai bila sumber berubah", done: false },
];

export default function KpiCatalogPage() {
  const rows: CatalogRow[] = [
    ...kpis.map((kpi) => ({
      id: kpi.id,
      name: kpi.name,
      domain: kpi.domain,
      value: kpi.value,
      delta: kpi.delta,
      deltaSuffix: kpi.deltaSuffix,
      target: kpi.target,
      owner: kpi.owner.split("—")[0].trim(),
      freshness: kpi.freshness,
      certified: kpi.certified,
      rag: kpi.rag,
    })),
    ...extra,
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Tata kelola data"
        title="Katalog KPI"
        subtitle="Satu definisi untuk setiap KPI: rumus, pemilik, sumber, kesegaran, dan status sertifikasi. Hanya KPI bersertifikat yang boleh tampil di beranda dan board pack."
        actions={
          <>
            <BrandButton variant="ghost" icon={<Upload className="size-3.5" />}>
              Impor target
            </BrandButton>
            <BrandButton icon={<Plus className="size-4" />}>Ajukan KPI baru</BrandButton>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile icon={ListChecks} label="KPI terkurasi" value="48" sub="MVP 30–50" accent="brand" />
        <SummaryTile icon={ShieldCheck} label="Bersertifikat" value="42" sub="87,5%" accent="mint" />
        <SummaryTile icon={TriangleAlert} label="Perlu review" value="4" sub="2 terlambat" accent="amber" />
        <SummaryTile icon={Archive} label="Usang" value="2" sub="sumber berubah" accent="rose" />
      </div>

      <KpiCatalog rows={rows} />

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel>
          <PanelHeader
            title="Glosarium bisnis"
            subtitle="Sinonim yang dipakai mesin pencari & Tanya Data"
            action={<Tag tone="violet">Dikelola steward</Tag>}
          />
          <ul className="mt-3 space-y-2">
            {glossary.map((item) => (
              <li
                key={item.term}
                className="flex items-center justify-between gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2"
              >
                <div>
                  <p className="text-[12px] font-semibold text-ink">{item.term}</p>
                  <p className="text-[10.5px] text-ink-muted">= {item.alias}</p>
                </div>
                <span className="text-[10px] text-ink-muted">{item.owner}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader title="Alur sertifikasi KPI" subtitle="Perubahan definisi tercatat di audit log" />
          <ol className="mt-3 space-y-2.5">
            {certification.map((item, index) => (
              <li key={item.step} className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                    item.done ? "bg-mint-soft text-mint-strong" : "bg-line-soft text-ink-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-ink">{item.step}</p>
                  <p className="text-[10.5px] text-ink-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded-xl bg-brand-tint px-3 py-2 text-[10.5px] leading-relaxed text-ink-soft">
            Perubahan definisi tidak mengubah laporan yang sudah diarsipkan — snapshot board pack tetap
            memakai versi saat dibuat.
          </p>
        </Panel>

        <Panel>
          <PanelHeader title="Kualitas data" subtitle="Skor per dataset sumber KPI" />
          <div className="mt-3 space-y-3">
            {[
              { name: "fact_revenue", score: 98, note: "Lulus 24 uji" },
              { name: "fact_cogs", score: 91, note: "2 uji peringatan" },
              { name: "dim_customer", score: 96, note: "Lulus 18 uji" },
              { name: "fact_hr_headcount", score: 84, note: "1 uji kritis" },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] text-ink-soft">{item.name}</span>
                  <span className="text-[11px] font-semibold text-ink">{item.score}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-soft">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.score}%`,
                      background: item.score >= 95 ? "#22b892" : item.score >= 88 ? "#f0a020" : "#ef4444",
                    }}
                  />
                </div>
                <p className="mt-0.5 text-[10px] text-ink-muted">{item.note}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
