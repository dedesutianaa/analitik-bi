"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  GripVertical,
  Lock,
  Plus,
  Presentation,
  RotateCcw,
  Share2,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { Chip, IconButton, Tag } from "@/components/ui-kit/pill";
import { TrendChart } from "@/components/charts/trend-chart";
import { useAppState } from "@/lib/app-state";
import { downloadCsv } from "@/lib/export";
import { approvalFlow, boardPackSections } from "@/lib/data";
import { cn } from "@/lib/utils";

type Section = { id: string; title: string; type: string; status: string; pages: number };
type Step = { name: string; role: string; status: string; time: string };

const sectionTypes = ["Narasi AI", "Grafik + tabel", "Grafik", "Heatmap", "Tabel RAG", "Narasi"];
const statusTone = (status: string) => (status === "Siap" ? "mint" : status === "Perlu review" ? "amber" : "neutral");
const nextStatus = (status: string) => (status === "Draf" ? "Perlu review" : status === "Perlu review" ? "Siap" : "Siap");

export function BoardPackBuilder() {
  const { showToast } = useAppState();
  const [sections, setSections] = useState<Section[]>(boardPackSections);
  const [steps, setSteps] = useState<Step[]>(approvalFlow);
  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftType, setDraftType] = useState(sectionTypes[0]);

  const totalPages = useMemo(() => sections.reduce((sum, section) => sum + section.pages, 0) || 1, [sections]);
  const safePage = Math.min(page, totalPages);

  /** Maps the current page number onto the section that owns it. */
  const currentSection = useMemo(() => {
    let cursor = 0;
    for (const section of sections) {
      cursor += section.pages;
      if (safePage <= cursor) return section;
    }
    return sections[sections.length - 1];
  }, [sections, safePage]);

  const approved = steps.every((step) => step.status === "selesai");
  const activeStep = steps.find((step) => step.status === "aktif");

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    setSections((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
    showToast("Bagian dihapus dari board pack");
  };

  const cycleStatus = (id: string) => {
    setSections((prev) => prev.map((section) => (section.id === id ? { ...section, status: nextStatus(section.status) } : section)));
  };

  const addSection = () => {
    const title = draftTitle.trim();
    if (!title) return;
    setSections((prev) => [...prev, { id: `s${Date.now()}`, title, type: draftType, status: "Draf", pages: 1 }]);
    setDraftTitle("");
    setAdding(false);
    showToast("Bagian baru ditambahkan sebagai draf");
  };

  const approve = () => {
    setSteps((prev) => {
      const index = prev.findIndex((step) => step.status === "aktif");
      if (index === -1) return prev;
      return prev.map((step, position) =>
        position === index
          ? { ...step, status: "selesai", time: "Baru saja" }
          : position === index + 1
            ? { ...step, status: "aktif", time: "Menunggu" }
            : step,
      );
    });
    showToast("Persetujuan diberikan ke tahap berikutnya");
  };

  const requestRevision = () => {
    setSteps((prev) => prev.map((step) => (step.status === "aktif" ? { ...step, time: "Revisi diminta" } : step)));
    setSections((prev) => prev.map((section) => (section.status === "Siap" ? { ...section, status: "Perlu review" } : section)));
    showToast("Revisi diminta — bagian Siap ditandai perlu review");
  };

  const resetFlow = () => {
    setSteps(approvalFlow);
    showToast("Alur persetujuan direset ke kondisi awal");
  };

  const exportSections = () => {
    downloadCsv("board-pack-q4-2026-bagian.csv", [
      ["Urutan", "Bagian", "Tipe", "Halaman", "Status"],
      ...sections.map((section, index) => [index + 1, section.title, section.type, section.pages, section.status]),
    ]);
    showToast("Struktur board pack diunduh sebagai CSV");
  };

  const printPdf = () => {
    showToast("Menyiapkan PDF siap cetak…");
    window.setTimeout(() => window.print(), 350);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Tautan ruang aman direksi disalin (kedaluwarsa 7 hari)");
    } catch {
      showToast(`Tautan: ${url}`);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Pelaporan"
        title="Board pack Q4 2026"
        subtitle="Templat kuartalan · terisi otomatis dari data terkini. Angka dibekukan saat final agar tidak berubah retroaktif."
        actions={
          <>
            <BrandButton
              variant="ghost"
              icon={<Eye className="size-3.5" />}
              onClick={() => {
                setPage(1);
                showToast("Pratinjau direset ke halaman 1");
              }}
            >
              Pratinjau
            </BrandButton>
            <BrandButton variant="ghost" icon={<Download className="size-3.5" />} onClick={printPdf}>
              Ekspor PDF
            </BrandButton>
            <BrandButton icon={<Share2 className="size-3.5" />} onClick={share}>
              Bagikan ke direksi
            </BrandButton>
          </>
        }
      />

      <Panel className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3.5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">Templat</p>
          <p className="text-[12px] font-semibold text-ink">Kuartalan · Direksi</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">Periode</p>
          <p className="text-[12px] font-semibold text-ink">Q4 2026 · Okt–Des</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">Status</p>
          <Tag tone={approved ? "mint" : "amber"} className="mt-0.5">
            {approved ? "Final terkunci" : `Menunggu ${activeStep?.name ?? "persetujuan"}`}
          </Tag>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">Terakhir disimpan</p>
          <p className="text-[12px] font-semibold text-ink">Hari ini · 07:05 WIB</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tag tone="mint">{totalPages} halaman</Tag>
          <Tag tone="neutral">Snapshot 30 Nov 2026</Tag>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel>
          <PanelHeader
            title="Bagian laporan"
            subtitle="Urutkan, ubah status, atau tambah bagian"
            action={<Tag tone="neutral">{sections.length} bagian</Tag>}
          />
          <div className="mt-3 space-y-1.5">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="group flex items-center gap-1.5 rounded-xl border border-line-soft bg-glass-soft px-2.5 py-2 transition-colors hover:border-line hover:bg-glass"
              >
                <GripVertical className="size-3.5 shrink-0 text-ink-muted" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-semibold text-ink">{section.title}</p>
                  <p className="text-[10px] text-ink-muted">
                    {section.type} · {section.pages} halaman
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => cycleStatus(section.id)}
                  aria-label={`Ubah status ${section.title}`}
                  title="Ubah status"
                >
                  <Tag tone={statusTone(section.status)}>{section.status}</Tag>
                </button>
                <div className="flex items-center">
                  <IconButton
                    label={`Naikkan ${section.title}`}
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="size-7 disabled:opacity-30"
                  >
                    <ArrowUp className="size-3.5" />
                  </IconButton>
                  <IconButton
                    label={`Turunkan ${section.title}`}
                    onClick={() => move(index, 1)}
                    disabled={index === sections.length - 1}
                    className="size-7 disabled:opacity-30"
                  >
                    <ArrowDown className="size-3.5" />
                  </IconButton>
                  <IconButton
                    label={`Hapus ${section.title}`}
                    onClick={() => removeSection(section.id)}
                    className="size-7 hover:text-danger-strong"
                  >
                    <Trash2 className="size-3.5" />
                  </IconButton>
                </div>
              </div>
            ))}

            {adding ? (
              <form
                className="space-y-2 rounded-xl border border-line-soft bg-glass-soft p-2.5"
                onSubmit={(event) => {
                  event.preventDefault();
                  addSection();
                }}
              >
                <input
                  autoFocus
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="Judul bagian baru…"
                  className="h-9 w-full rounded-lg border border-line bg-glass px-3 text-[12px] text-ink outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-brand/40"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  {sectionTypes.map((type) => (
                    <Chip key={type} active={draftType === type} onClick={() => setDraftType(type)} className="h-7 text-[11px]">
                      {type}
                    </Chip>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <BrandButton className="h-9 px-4 text-[12px]">Tambah</BrandButton>
                  <Chip className="h-9" onClick={() => setAdding(false)}>
                    Batal
                  </Chip>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line py-2 text-[11px] font-semibold text-ink-muted hover:border-brand/40 hover:text-brand"
              >
                <Plus className="size-3.5" />
                Tambah bagian
              </button>
            )}
          </div>
        </Panel>

        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Pratinjau halaman"
            subtitle={`Halaman ${safePage} · ${currentSection?.title ?? ""}`}
            action={
              <>
                <IconButton label="Halaman sebelumnya" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={safePage === 1} className="disabled:opacity-30">
                  <ChevronLeft className="size-4" />
                </IconButton>
                <span className="text-[11px] font-semibold text-ink-soft">
                  {safePage} / {totalPages}
                </span>
                <IconButton
                  label="Halaman berikutnya"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={safePage === totalPages}
                  className="disabled:opacity-30"
                >
                  <ChevronRight className="size-4" />
                </IconButton>
              </>
            }
          />

          <div className="mt-3 rounded-2xl bg-gradient-to-br from-violet-soft to-rose-soft p-3">
            <div className="mx-auto aspect-[16/9] w-full max-w-[720px] overflow-hidden rounded-xl bg-surface p-5 shadow-[0_20px_50px_-30px_rgba(76,58,110,0.6)]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid size-6 place-items-center rounded-lg bg-gradient-to-br from-[#fb923c] to-[#f97316] text-[9px] font-bold text-white">
                    NG
                  </span>
                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Nusantara Group</p>
                    <p className="text-[9px] font-semibold text-ink">Board Pack Q4 2026</p>
                  </div>
                </div>
                <span className="rounded-full bg-danger-soft px-2 py-0.5 text-[7px] font-bold uppercase tracking-wide text-danger-strong">
                  Rahasia
                </span>
              </div>

              <h3 className="mt-4 font-display text-[15px] font-semibold leading-tight text-ink">{currentSection?.title}</h3>
              <p className="mt-1 max-w-[92%] text-[8.5px] leading-relaxed text-ink-soft">
                Pendapatan YTD Rp 4,82 T (+12,4% YoY). Margin kotor turun 2,3 poin akibat biaya bahan baku; rencana
                pemulihan +1,1 poin sudah berjalan.
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: "Pendapatan", value: "Rp 4,82 T", delta: "+12,4%" },
                  { label: "EBITDA", value: "Rp 1,12 T", delta: "+6,1%" },
                  { label: "Margin kotor", value: "38,6%", delta: "−2,3 pp" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-line-soft/70 px-2 py-1.5">
                    <p className="text-[7px] uppercase tracking-wide text-ink-muted">{item.label}</p>
                    <p className="text-[11px] font-semibold text-ink">{item.value}</p>
                    <p className="text-[7px] font-semibold text-brand">{item.delta}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2">
                <TrendChart
                  labels={["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]}
                  series={[
                    {
                      name: "Realisasi",
                      color: "var(--brand)",
                      values: [312, 328, 351, 366, 389, 402, 418, 431, 452, 468, 481, 502],
                    },
                    {
                      name: "Target",
                      color: "var(--violet)",
                      values: [330, 340, 352, 365, 378, 390, 402, 415, 428, 440, 452, 465],
                      dashed: true,
                      area: false,
                    },
                  ]}
                  height={132}
                  showLegend={false}
                  showYAxis={false}
                />
              </div>

              <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-brand-tint px-2 py-1.5">
                  <p className="text-[7px] font-semibold uppercase tracking-wide text-brand-strong">Keputusan diminta</p>
                  <p className="text-[7.5px] leading-snug text-ink-soft">
                    Setujui renegosiasi 2 pemasok bahan baku dan CAPEX otomasi gudang Rp 84 M.
                  </p>
                </div>
                <div className="rounded-lg bg-line-soft/70 px-2 py-1.5">
                  <p className="text-[7px] font-semibold uppercase tracking-wide text-ink-muted">Fokus kuartal depan</p>
                  <p className="text-[7.5px] leading-snug text-ink-soft">
                    Pemulihan margin +1,1 pp, OTD Indonesia Timur, dan retensi teknisi Logistik.
                  </p>
                </div>
              </div>

              <div className="mt-1.5 flex items-center justify-between border-t border-line-soft pt-1.5 text-[7px] text-ink-muted">
                <span>Nusantara Group · Board Pack Q4 2026</span>
                <span>
                  Halaman {safePage} dari {totalPages}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Tag tone="mint">Narasi AI terverifikasi</Tag>
            <Tag tone="neutral">Format angka: Rp, titik ribuan, koma desimal</Tag>
            <span className="ml-auto text-[10px] text-ink-muted">Semua angka cocok dengan sumber · 0 selisih</span>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel>
          <PanelHeader
            title="Alur persetujuan"
            subtitle="Draf → review → final terkunci"
            action={
              <IconButton label="Reset alur persetujuan" onClick={resetFlow}>
                <RotateCcw className="size-4" />
              </IconButton>
            }
          />
          <ol className="mt-3 space-y-3">
            {steps.map((step, index) => (
              <li key={step.name} className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                    step.status === "selesai"
                      ? "bg-mint-soft text-mint-strong"
                      : step.status === "aktif"
                        ? "bg-brand-soft text-brand-strong"
                        : "bg-line-soft text-ink-muted",
                  )}
                >
                  {step.status === "selesai" ? <Check className="size-3.5" /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold text-ink">{step.name}</p>
                  <p className="text-[10px] text-ink-muted">{step.role}</p>
                </div>
                <span className="text-[10px] text-ink-muted">{step.time}</span>
              </li>
            ))}
          </ol>

          {approved ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-mint-soft px-3 py-2 text-[11px] font-semibold text-mint-strong">
              <Lock className="size-3.5" />
              Disetujui penuh — angka dibekukan
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <BrandButton className="h-9 px-4 text-[12px]" icon={<Check className="size-3.5" />} onClick={approve}>
                Setujui
              </BrandButton>
              <Chip className="h-9" onClick={requestRevision}>
                Minta revisi
              </Chip>
            </div>
          )}

          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-line-soft/70 px-3 py-2 text-[10px] text-ink-muted">
            <Clock3 className="size-3.5" />
            Versi final tidak dapat diubah; revisi membuat versi baru.
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Ekspor & branding" subtitle="Format angka dan catatan kaki dipertahankan" />
          <div className="mt-3 space-y-2">
            {[
              { icon: FileText, label: "PDF", note: "Siap cetak · watermark dinamis", tone: "brand" as const, onClick: printPdf },
              {
                icon: Presentation,
                label: "PPTX",
                note: "Grafik tetap dapat diedit",
                tone: "violet" as const,
                onClick: () => showToast("PPTX dirender — grafik tetap dapat diedit"),
              },
              {
                icon: FileSpreadsheet,
                label: "XLSX",
                note: "Tabel & lampiran angka",
                tone: "mint" as const,
                onClick: exportSections,
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="flex w-full items-center gap-2.5 rounded-xl border border-line-soft bg-glass-soft px-3 py-2 text-left transition-colors hover:bg-glass"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-line-soft text-ink-soft">
                  <item.icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold text-ink">{item.label}</p>
                  <p className="text-[10px] text-ink-muted">{item.note}</p>
                </div>
                <Tag tone={item.tone}>Ekspor</Tag>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-muted">
            Branding perusahaan: logo, palet warna, dan font sudah diterapkan pada semua format.
          </p>
        </Panel>

        <Panel>
          <PanelHeader title="Ruang aman direksi" subtitle="Akses terbatas waktu & watermark" />
          <div className="mt-3 space-y-2">
            {[
              { icon: Lock, label: "Tautan kedaluwarsa", value: "7 hari" },
              { icon: ShieldCheck, label: "Watermark dinamis", value: "Aktif" },
              { icon: Download, label: "Unduh & cetak", value: "Dinonaktifkan" },
              { icon: Eye, label: "Akses tercatat", value: "12 kunjungan" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2"
              >
                <item.icon className="size-3.5 text-ink-muted" />
                <span className="text-[11px] text-ink-soft">{item.label}</span>
                <span className="ml-auto text-[10.5px] font-semibold text-ink">{item.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-brand-tint px-3 py-2 text-[10.5px] leading-relaxed text-ink-soft">
            Akses dapat dicabut seketika. Setiap kunjungan tercatat di audit log.
          </p>
        </Panel>
      </div>
    </div>
  );
}
