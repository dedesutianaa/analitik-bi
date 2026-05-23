"use client";

import { useState } from "react";
import { Bell, BellRing, CheckCheck, Plus, Settings2, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { SummaryTile } from "@/components/ui-kit/stat-card";
import { Chip, Tag } from "@/components/ui-kit/pill";
import { SimpleTable } from "@/components/ui-kit/table";
import { Toggle } from "@/components/ui-kit/toggle";
import { AlertsCenter } from "@/components/alerts/alerts-center";
import { useAppState } from "@/lib/app-state";
import { alerts } from "@/lib/data";

type Rule = {
  name: string;
  type: string;
  channel: string;
  owner: string;
  active: boolean;
};

const initialRules: Rule[] = [
  { name: "Margin Kotor < 39%", type: "Ambang batas", channel: "Push + Email + Teams", owner: "CFO", active: true },
  { name: "DSO > 45 hari", type: "Ambang batas", channel: "Email", owner: "Treasury", active: true },
  { name: "Anomali attrition (musiman)", type: "Anomali cerdas", channel: "Push", owner: "CHRO", active: true },
  { name: "Kesegaran data > SLA", type: "Kualitas data", channel: "Slack", owner: "Data Platform", active: true },
  { name: "Pipeline < 4,0x QTD", type: "Penyimpangan target", channel: "Email", owner: "CRO", active: false },
];

export function AlertsPageView() {
  const { showToast } = useAppState();
  const [rules, setRules] = useState(initialRules);
  const [draft, setDraft] = useState<string | null>(null);

  const activeCount = rules.filter((rule) => rule.active).length;

  const toggleRule = (name: string, active: boolean) => {
    setRules((prev) => prev.map((rule) => (rule.name === name ? { ...rule, active } : rule)));
    showToast(`${name} ${active ? "diaktifkan" : "dinonaktifkan"}`);
  };

  const addRule = () => {
    const name = draft?.trim();
    if (!name) return;
    setRules((prev) => [...prev, { name, type: "Ambang batas", channel: "Email", owner: "Saya", active: true }]);
    setDraft(null);
    showToast(`Aturan "${name}" dibuat dan langsung aktif`);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Proaktif"
        title="Pusat peringatan"
        subtitle="Anomali, KPI di luar target, dan tindak lanjut jatuh tempo — dengan konteks dan aksi satu langkah."
        actions={
          <>
            <BrandButton href="/pengaturan" variant="ghost" icon={<Settings2 className="size-3.5" />}>
              Atur langganan
            </BrandButton>
            <BrandButton icon={<Plus className="size-4" />} onClick={() => setDraft("")}>
              Buat aturan
            </BrandButton>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile icon={BellRing} label="Baru" value="2" sub="perlu tindakan" accent="brand" />
        <SummaryTile icon={Bell} label="Diakui" value="1" sub="dalam proses" accent="sky" />
        <SummaryTile icon={UserCheck} label="Ditugaskan" value="1" sub="pemilik jelas" accent="violet" />
        <SummaryTile icon={CheckCheck} label="Selesai (7 hari)" value="12" sub="respons 86%" accent="mint" />
      </div>

      <AlertsCenter />

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Riwayat peringatan"
            subtitle="Status dan akurasi untuk menyetel ambang"
            action={<Tag tone="neutral">30 hari terakhir</Tag>}
          />
          <SimpleTable
            className="mt-3"
            minWidth={620}
            columns={["ID", "Peringatan", "KPI", "Nilai", "Status", "Waktu"]}
            rows={alerts.map((alert) => [
              <span key="id" className="font-mono text-[10.5px] text-ink-muted">
                {alert.id}
              </span>,
              <span key="title" className="font-medium text-ink">
                {alert.title}
              </span>,
              <span key="kpi">{alert.kpi}</span>,
              <span key="value" className="font-semibold text-ink">
                {alert.value}
              </span>,
              <Tag
                key="status"
                tone={
                  alert.status === "baru"
                    ? "brand"
                    : alert.status === "diakui"
                      ? "sky"
                      : alert.status === "ditugaskan"
                        ? "violet"
                        : "mint"
                }
              >
                {alert.status}
              </Tag>,
              <span key="time" className="text-[10.5px] text-ink-muted">
                {alert.time}
              </span>,
            ])}
          />
        </Panel>

        <Panel>
          <PanelHeader
            title="Aturan peringatan"
            subtitle="Dikonfigurasi tanpa kode"
            action={<Tag tone="violet">{activeCount} aktif</Tag>}
          />
          <div className="mt-3 space-y-2">
            {rules.map((rule) => (
              <div key={rule.name} className="rounded-xl border border-line-soft bg-glass-soft px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11.5px] font-semibold text-ink">{rule.name}</p>
                  <Toggle label={`Aktifkan ${rule.name}`} on={rule.active} onChange={(on) => toggleRule(rule.name, on)} />
                </div>
                <p className="mt-0.5 text-[10px] text-ink-muted">
                  {rule.type} · {rule.channel} · {rule.owner}
                </p>
              </div>
            ))}

            {draft !== null ? (
              <form
                className="space-y-2 rounded-xl border border-brand/25 bg-glass-soft p-2.5"
                onSubmit={(event) => {
                  event.preventDefault();
                  addRule();
                }}
              >
                <label className="block text-[10.5px] font-semibold text-ink-muted" htmlFor="aturan-baru">
                  Nama aturan baru
                </label>
                <input
                  id="aturan-baru"
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Contoh: OTD < 92% dua minggu berturut-turut"
                  className="h-9 w-full rounded-xl border border-line bg-surface px-2.5 text-[12px] text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                />
                <div className="flex items-center gap-2">
                  <BrandButton className="h-8 px-3 text-[11.5px]">Simpan</BrandButton>
                  <Chip className="h-8" onClick={() => setDraft(null)}>
                    Batal
                  </Chip>
                </div>
              </form>
            ) : null}
          </div>
          <p className="mt-3 rounded-xl bg-brand-tint px-3 py-2 text-[10.5px] leading-relaxed text-ink-soft">
            Tingkat opt-out notifikasi 4% — di bawah guardrail 15%. Peringatan digabung per kejadian.
          </p>
        </Panel>
      </div>
    </div>
  );
}
