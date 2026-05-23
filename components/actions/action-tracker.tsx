"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleDashed,
  Clock4,
  Download,
  Plus,
  Search,
  TriangleAlert,
} from "lucide-react";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { SummaryTile } from "@/components/ui-kit/stat-card";
import { Chip, PillSelect, Tag } from "@/components/ui-kit/pill";
import { SimpleTable } from "@/components/ui-kit/table";
import { Tabs } from "@/components/ui-kit/tabs";
import { useAppState } from "@/lib/app-state";
import { downloadCsv } from "@/lib/export";
import { actionItems, decisions, kpis, type ActionItem } from "@/lib/data";

const statuses: ActionItem["status"][] = ["terbuka", "dikerjakan", "selesai", "terlambat"];
const statusFilters = ["Semua", "terbuka", "dikerjakan", "terlambat", "selesai"];

const statusTone = (status: string) =>
  status === "selesai" ? "mint" : status === "terlambat" ? "rose" : status === "dikerjakan" ? "sky" : "neutral";

const priorityTone = (priority: string) =>
  priority === "tinggi" ? "rose" : priority === "sedang" ? "amber" : "neutral";

const decisionTags = ["Margin", "Harga", "CAPEX", "Risiko"];

const searchInput =
  "h-9 w-full rounded-full border border-line bg-glass px-3 text-[12px] text-ink outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-brand/40";

export function ActionTrackerView() {
  const { showToast } = useAppState();
  const [items, setItems] = useState(actionItems);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [creating, setCreating] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftOwner, setDraftOwner] = useState("Saya");
  const [draftKpi, setDraftKpi] = useState(kpis[0].name);
  const [decisionQuery, setDecisionQuery] = useState("");

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;
        const haystack = `${item.id} ${item.title} ${item.kpi} ${item.owner}`.toLowerCase();
        return matchesStatus && haystack.includes(query.trim().toLowerCase());
      }),
    [items, query, statusFilter],
  );

  const counts = {
    terbuka: items.filter((item) => item.status === "terbuka").length,
    dikerjakan: items.filter((item) => item.status === "dikerjakan").length,
    terlambat: items.filter((item) => item.status === "terlambat").length,
  };

  const workload = useMemo(() => {
    const map = new Map<string, { count: number; late: number }>();
    items
      .filter((item) => item.status !== "selesai")
      .forEach((item) => {
        const entry = map.get(item.owner) ?? { count: 0, late: 0 };
        entry.count += 1;
        if (item.status === "terlambat") entry.late += 1;
        map.set(item.owner, entry);
      });
    return [...map.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [items]);

  const setStatus = (id: string, status: ActionItem["status"]) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    showToast(`${id} diperbarui ke "${status}"`);
  };

  const handleExport = () => {
    downloadCsv("action-tracker.csv", [
      ["ID", "Tugas", "KPI", "Pemilik", "Tenggat", "Prioritas", "Status", "Sumber"],
      ...items.map((item) => [item.id, item.title, item.kpi, item.owner, item.due, item.priority, item.status, item.source]),
    ]);
    showToast("Action tracker diunduh sebagai CSV");
  };

  const createTask = () => {
    const title = draftTitle.trim();
    if (!title) return;
    const next: ActionItem = {
      id: `ACT-${200 + items.length}`,
      title,
      kpi: draftKpi,
      owner: draftOwner.trim() || "Saya",
      due: "Minggu ini",
      status: "terbuka",
      priority: "sedang",
      source: "Dibuat manual",
    };
    setItems((prev) => [next, ...prev]);
    setCreating(false);
    setDraftTitle("");
    setDraftOwner("Saya");
    showToast(`Tugas "${title}" dibuat`);
  };

  const visibleDecisions = useMemo(() => {
    const needle = decisionQuery.trim().toLowerCase();
    if (!needle) return decisions;
    return decisions.filter((decision) =>
      `${decision.id} ${decision.title} ${decision.rationale} ${decision.kpi} ${decision.owner}`
        .toLowerCase()
        .includes(needle),
    );
  }, [decisionQuery]);

  const tracker = (
    <div className="grid gap-4 xl:grid-cols-3">
      <Panel className="xl:col-span-2">
        <PanelHeader
          title="Action tracker"
          subtitle="Dari insight atau komentar menjadi tugas dengan pemilik dan tenggat"
          action={<Tag tone="neutral">{filtered.length} dari {items.length} tugas</Tag>}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-muted" />
            <span className="sr-only">Cari tugas</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari tugas, KPI, atau pemilik…"
              className={`${searchInput} pl-9`}
            />
          </label>
          {statusFilters.map((status) => (
            <Chip key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>
              {status === "Semua" ? "Semua" : status}
            </Chip>
          ))}
        </div>

        {creating ? (
          <form
            className="mt-3 grid gap-2 rounded-2xl border border-brand/25 bg-glass-soft p-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              createTask();
            }}
          >
            <input
              autoFocus
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="Judul tugas"
              className={searchInput}
            />
            <input
              value={draftOwner}
              onChange={(event) => setDraftOwner(event.target.value)}
              placeholder="Pemilik"
              className={searchInput}
            />
            <PillSelect value={draftKpi} options={kpis.map((kpi) => kpi.name)} onSelect={setDraftKpi} align="start" />
            <div className="flex items-center gap-2">
              <BrandButton className="h-9 px-3 text-[11.5px]">Simpan</BrandButton>
              <Chip className="h-9" onClick={() => setCreating(false)}>
                Batal
              </Chip>
            </div>
          </form>
        ) : null}

        <SimpleTable
          className="mt-3"
          minWidth={760}
          columns={["ID", "Tugas", "KPI terkait", "Pemilik", "Tenggat", "Prioritas", "Status"]}
          rows={filtered.map((item) => [
            <span key="id" className="font-mono text-[10.5px] text-ink-muted">
              {item.id}
            </span>,
            <div key="title" className="min-w-[200px]">
              <p className="text-[12px] font-semibold text-ink">{item.title}</p>
              <p className="text-[10px] text-ink-muted">Sumber: {item.source}</p>
            </div>,
            <span key="kpi" className="text-[11px]">
              {item.kpi}
            </span>,
            <span key="owner" className="text-[11px]">
              {item.owner}
            </span>,
            <span
              key="due"
              className={item.status === "terlambat" ? "text-[11px] font-semibold text-danger-strong" : "text-[11px]"}
            >
              {item.due}
            </span>,
            <Tag key="priority" tone={priorityTone(item.priority)}>
              {item.priority}
            </Tag>,
            <PillSelect
              key="status"
              value={item.status}
              options={statuses}
              align="start"
              className="h-8 px-2.5 text-[11px]"
              onSelect={(value) => setStatus(item.id, value as ActionItem["status"])}
            />,
          ])}
        />
      </Panel>

      <div className="space-y-4">
        <Panel>
          <PanelHeader title="Beban per pemilik" subtitle="Tugas terbuka" />
          <div className="mt-3 space-y-2.5">
            {workload.map(([owner, load]) => (
              <div key={owner} className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-line-soft text-[9px] font-bold text-ink-soft">
                  {owner.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate text-[11px] text-ink-soft">{owner}</span>
                <span className="text-[10.5px] font-semibold text-ink">{load.count}</span>
                {load.late ? <Tag tone="rose">{load.late} terlambat</Tag> : null}
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Integrasi" subtitle="Sinkron dua arah" />
          <div className="mt-3 space-y-2">
            {["Jira", "Asana", "Microsoft Planner"].map((tool) => (
              <div
                key={tool}
                className="flex items-center justify-between rounded-xl border border-line-soft bg-glass-soft px-3 py-2"
              >
                <span className="text-[11.5px] font-medium text-ink-soft">{tool}</span>
                <Tag tone={tool === "Jira" ? "mint" : "neutral"}>{tool === "Jira" ? "Terhubung" : "Hubungkan"}</Tag>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );

  const decisionLog = (
    <div className="grid gap-4 xl:grid-cols-3">
      <Panel className="xl:col-span-2">
        <PanelHeader
          title="Decision log"
          subtitle="Keputusan, alasan, snapshot data pendukung, dan hasilnya"
          action={<Tag tone="neutral">{visibleDecisions.length} keputusan</Tag>}
        />
        <ol className="mt-4 space-y-3">
          {visibleDecisions.map((decision) => (
            <li key={decision.id} className="relative rounded-2xl border border-line-soft bg-glass-soft p-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] text-ink-muted">{decision.id}</span>
                <span className="text-[10px] text-ink-muted">{decision.date}</span>
                <Tag
                  tone={decision.status === "diputuskan" ? "mint" : decision.status === "dipantau" ? "sky" : "amber"}
                  className="ml-auto"
                >
                  {decision.status}
                </Tag>
              </div>
              <h3 className="mt-1.5 font-display text-[13.5px] font-semibold text-ink">{decision.title}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">{decision.rationale}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                <Tag tone="violet">{decision.kpi}</Tag>
                <span className="text-ink-muted">Dampak: {decision.impact}</span>
                <span className="ml-auto text-ink-muted">{decision.owner}</span>
              </div>
            </li>
          ))}
          {visibleDecisions.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-line p-4 text-center text-[11.5px] text-ink-muted">
              Tidak ada keputusan yang cocok dengan pencarian.
            </li>
          ) : null}
        </ol>
      </Panel>

      <div className="space-y-4">
        <Panel>
          <PanelHeader title="Snapshot pendukung" subtitle="Data dibekukan saat keputusan dibuat" />
          <div className="mt-3 space-y-2">
            {[
              { label: "Margin kotor", value: "40,9%", date: "18 Nov 2026" },
              { label: "Volume ritel", value: "1,44 T", date: "18 Nov 2026" },
              { label: "Harga bahan baku", value: "+8,4%", date: "14 Nov 2026" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-line-soft bg-glass-soft px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-ink-soft">{item.label}</span>
                  <span className="text-[11.5px] font-semibold text-ink">{item.value}</span>
                </div>
                <p className="text-[10px] text-ink-muted">Snapshot {item.date}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Pencarian keputusan" subtitle="Cari berdasarkan KPI atau kata kunci" />
          <label className="relative mt-3 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-muted" />
            <span className="sr-only">Cari keputusan</span>
            <input
              value={decisionQuery}
              onChange={(event) => setDecisionQuery(event.target.value)}
              placeholder="Cari keputusan…"
              className={`${searchInput} pl-9`}
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {decisionTags.map((tag) => (
              <Chip key={tag} active={decisionQuery.toLowerCase() === tag.toLowerCase()} onClick={() => setDecisionQuery(tag)}>
                {tag}
              </Chip>
            ))}
            {decisionQuery ? (
              <Chip onClick={() => setDecisionQuery("")}>Bersihkan</Chip>
            ) : null}
          </div>
        </Panel>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Kolaborasi"
        title="Tindak lanjut & keputusan"
        subtitle="Hubungkan insight dengan keputusan, penugasan, dan tindak lanjut yang terpantau."
        actions={
          <>
            <BrandButton variant="ghost" icon={<Download className="size-3.5" />} onClick={handleExport}>
              Ekspor
            </BrandButton>
            <BrandButton icon={<Plus className="size-4" />} onClick={() => setCreating(true)}>
              Buat tugas
            </BrandButton>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile icon={CircleDashed} label="Terbuka" value={String(counts.terbuka)} sub="belum dimulai" accent="brand" />
        <SummaryTile icon={Clock4} label="Dikerjakan" value={String(counts.dikerjakan)} sub="dalam proses" accent="sky" />
        <SummaryTile icon={TriangleAlert} label="Terlambat" value={String(counts.terlambat)} sub="perlu eskalasi" accent="rose" />
        <SummaryTile icon={CheckCircle2} label="Selesai (30 hari)" value="18" sub="closure 82%" accent="mint" />
      </div>

      <Tabs
        items={[
          { id: "tracker", label: "Action tracker", badge: String(items.length), content: tracker },
          { id: "decisions", label: "Decision log", badge: String(decisions.length), content: decisionLog },
        ]}
      />
    </div>
  );
}
