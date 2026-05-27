import Link from "next/link";
import { ArrowUpRight, LayoutTemplate, Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { Tag } from "@/components/ui-kit/pill";
import { DomainIcon } from "@/components/ui-kit/icons";
import { RagBadge } from "@/components/ui-kit/rag";
import { accentHex, accentSoft, domains } from "@/lib/data";

export const metadata = { title: "Dashboard domain" };

export default function DashboardIndexPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Dashboard eksekutif"
        title="Dashboard domain"
        subtitle="Delapan dashboard terkurasi, masing-masing menjawab maksimal lima pertanyaan kunci fungsi. Semua memakai semantic layer yang sama."
        actions={
          <>
            <BrandButton variant="ghost" icon={<LayoutTemplate className="size-3.5" />}>
              Dari templat
            </BrandButton>
            <BrandButton icon={<Plus className="size-4" />}>Buat dashboard</BrandButton>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {domains.map((domain) => (
          <Link
            key={domain.slug}
            href={`/dashboard/${domain.slug}`}
            className="panel group flex flex-col rounded-[24px] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-28px_rgba(76,58,110,0.55)]"
          >
            <div className="flex items-start justify-between">
              <span
                className="grid size-11 place-items-center rounded-2xl"
                style={{ background: accentSoft[domain.accent] }}
              >
                <DomainIcon
                  name={domain.icon}
                  className="size-5"
                  style={{ color: accentHex[domain.accent] }}
                />
              </span>
              <ArrowUpRight className="size-4 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
            </div>
            <h3 className="mt-3 font-display text-[14.5px] font-semibold text-ink">{domain.name}</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">{domain.tagline}</p>

            <div className="mt-3 space-y-1.5 border-t border-line-soft pt-3">
              {domain.kpis.slice(0, 2).map((kpi) => (
                <div key={kpi.label} className="flex items-center justify-between gap-2">
                  <span className="truncate text-[10.5px] text-ink-muted">{kpi.label}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-ink">{kpi.value}</span>
                    <RagBadge rag={kpi.rag} label="" className="px-1 py-0.5" />
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <Tag tone="neutral">{domain.questions.length} pertanyaan kunci</Tag>
              <span className="ml-auto text-[10px] font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Buka
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Pertanyaan yang paling sering diajukan eksekutif"
            subtitle="Satu ketukan membuka jawaban di Tanya Data"
            action={<Tag tone="violet">AI</Tag>}
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              "Apakah kita on track terhadap target tahun ini?",
              "Mengapa margin kotor turun bulan ini?",
              "Cabang mana yang di bawah standar layanan?",
              "Kanal mana yang menurunkan konversi?",
              "Unit mana yang attrition-nya tertinggi?",
              "Inisiatif strategis mana yang berisiko?",
            ].map((question) => (
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
          <PanelHeader title="Templat industri" subtitle="Impor & sesuaikan dalam < 1 hari" />
          <div className="mt-3 space-y-2">
            {["Ritel & distribusi", "Perbankan & jasa keuangan", "Manufaktur", "Logistik", "Kesehatan"].map(
              (template) => (
                <div
                  key={template}
                  className="flex items-center justify-between rounded-xl border border-line-soft bg-glass-soft px-3 py-2"
                >
                  <span className="text-[11.5px] font-medium text-ink-soft">{template}</span>
                  <span className="text-[10px] font-semibold text-brand">Gunakan</span>
                </div>
              ),
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
