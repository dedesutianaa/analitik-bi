import { Archive, Bell, CalendarClock, Download, Mail, Plus, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { Tag } from "@/components/ui-kit/pill";
import { SimpleTable } from "@/components/ui-kit/table";
import { Delta } from "@/components/ui-kit/rag";
import { reports } from "@/lib/data";

export const metadata = { title: "Briefing & laporan" };

const briefingKpis = [
  { label: "Pendapatan YTD", value: "Rp 4,82 T", delta: 12.4, suffix: "%", good: true },
  { label: "Margin kotor", value: "38,6%", delta: -2.3, suffix: " pp", good: false },
  { label: "Arus kas operasional", value: "Rp 684 M", delta: 9.8, suffix: "%", good: true },
  { label: "On-time delivery", value: "94,2%", delta: 1.4, suffix: " pp", good: true },
];

export default function ReportsPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Pelaporan"
        title="Briefing & laporan"
        subtitle="Ringkasan otomatis yang sampai sebelum rapat, dengan penerima yang hanya melihat data sesuai hak aksesnya."
        actions={
          <>
            <BrandButton variant="ghost" icon={<CalendarClock className="size-3.5" />}>
              Jadwalkan laporan
            </BrandButton>
            <BrandButton icon={<Plus className="size-4" />}>Buat laporan</BrandButton>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Pratinjau briefing pagi"
            subtitle="Dikirim 07:00 WIB ke 5 eksekutif"
            action={
              <>
                <Tag tone="mint">Terkirim</Tag>
                <BrandButton variant="ghost" icon={<Download className="size-3.5" />}>
                  PDF
                </BrandButton>
              </>
            }
          />

          <div className="mt-3 rounded-2xl border border-line-soft bg-glass p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line-soft pb-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-[#fb923c] to-[#f97316] text-[10px] font-bold text-white">
                  NG
                </span>
                <div>
                  <p className="text-[11.5px] font-semibold text-ink">Briefing Pagi Eksekutif</p>
                  <p className="text-[10px] text-ink-muted">Nusantara Group · 22 Nov 2026 · 07:00 WIB</p>
                </div>
              </div>
              <Tag tone="neutral">Untuk: CEO, CFO, COO, CRO, CHRO</Tag>
            </div>

            <p className="mt-3 text-[12px] font-semibold text-ink">
              Margin kotor menurun 2,3 poin, pendapatan tetap tumbuh dua digit
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
              Pendapatan YTD Rp 4,82 T (+12,4% YoY). Tekanan margin berasal dari kenaikan harga bahan baku
              dua pemasok utama. Pipeline coverage melemah ke 3,4x dan attrition Logistik 12,4%.
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {briefingKpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="flex items-center justify-between rounded-xl bg-line-soft/60 px-3 py-2"
                >
                  <div>
                    <p className="text-[10px] text-ink-muted">{kpi.label}</p>
                    <p className="text-[12.5px] font-semibold text-ink">{kpi.value}</p>
                  </div>
                  <Delta value={kpi.delta} suffix={kpi.suffix} good={kpi.good} />
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-brand/20 bg-brand-tint px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-strong">
                Perlu perhatian hari ini
              </p>
              <ul className="mt-1 space-y-1 text-[11px] text-ink-soft">
                <li>• Margin kotor di bawah ambang kritis — renegosiasi pemasok (tenggat hari ini).</li>
                <li>• DSO 48 hari — 12 pelanggan enterprise Kalimantan menunggak.</li>
              </ul>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line-soft pt-2.5">
              <span className="text-[10px] text-ink-muted">Buka di ExecInsight untuk drill-down</span>
              <span className="ml-auto text-[10px] font-semibold text-brand">Lihat beranda →</span>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Pengaturan pengiriman" subtitle="Per peran, per kanal" />
            <div className="mt-3 space-y-2">
              {[
                { icon: Mail, label: "Email", value: "07:00 WIB" },
                { icon: Bell, label: "Push mobile", value: "07:00 WIB" },
                { icon: CalendarClock, label: "Jam tenang", value: "21:00–06:00" },
                { icon: ShieldCheck, label: "Hak akses", value: "Per penerima" },
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
          </Panel>

          <Panel>
            <PanelHeader title="Arsip & snapshot" subtitle="Angka dibekukan saat tutup buku" />
            <div className="mt-3 space-y-2">
              {["Board pack Q3 2026", "Business review Okt 2026", "Board pack Q2 2026"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2"
                >
                  <Archive className="size-3.5 text-ink-muted" />
                  <span className="min-w-0 flex-1 truncate text-[11px] text-ink-soft">{item}</span>
                  <Tag tone="neutral">Terkunci</Tag>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel>
        <PanelHeader
          title="Laporan terjadwal"
          subtitle="Setiap penerima hanya menerima data yang berhak ia lihat"
          action={<Tag tone="neutral">{reports.length} jadwal</Tag>}
        />
        <SimpleTable
          className="mt-3"
          minWidth={760}
          columns={["Laporan", "Jadwal", "Penerima", "Kanal", "Terakhir", "Status"]}
          rows={reports.map((report) => [
            <div key="name">
              <p className="text-[12px] font-semibold text-ink">{report.name}</p>
              <p className="font-mono text-[10px] text-ink-muted">{report.id}</p>
            </div>,
            <span key="schedule" className="text-[11px]">
              {report.schedule}
            </span>,
            <span key="audience" className="text-[11px]">
              {report.audience}
            </span>,
            <span key="channel" className="text-[11px]">
              {report.channel}
            </span>,
            <span key="last" className="text-[10.5px] text-ink-muted">
              {report.last}
            </span>,
            <Tag key="status" tone={report.status === "Aktif" ? "mint" : "neutral"}>
              {report.status}
            </Tag>,
          ])}
        />
      </Panel>
    </div>
  );
}
