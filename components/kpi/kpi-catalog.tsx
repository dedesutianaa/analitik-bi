"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { Panel } from "@/components/ui-kit/panel";
import { Chip, Tag } from "@/components/ui-kit/pill";
import { Certified, Delta, RagBadge } from "@/components/ui-kit/rag";
import { SimpleTable } from "@/components/ui-kit/table";
import type { Rag } from "@/lib/data";

export type CatalogRow = {
  id: string;
  name: string;
  domain: string;
  value: string;
  delta: number;
  deltaSuffix: string;
  target: string;
  owner: string;
  freshness: string;
  certified: boolean;
  rag: Rag;
};

export function KpiCatalog({ rows }: { rows: CatalogRow[] }) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("Semua");
  const [onlyIssues, setOnlyIssues] = useState(false);

  const domains = useMemo(() => ["Semua", ...Array.from(new Set(rows.map((row) => row.domain)))], [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.owner.toLowerCase().includes(q) ||
        row.domain.toLowerCase().includes(q);
      const matchesDomain = domain === "Semua" || row.domain === domain;
      const matchesIssue = !onlyIssues || row.rag !== "green";
      return matchesQuery && matchesDomain && matchesIssue;
    });
  }, [rows, query, domain, onlyIssues]);

  return (
    <Panel>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-full border border-glass-line bg-glass px-3.5">
          <Search className="size-3.5 text-ink-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari KPI, pemilik, atau domain…"
            aria-label="Cari KPI"
            className="w-full bg-transparent text-[12.5px] text-ink placeholder:text-ink-muted focus:outline-none"
          />
        </div>
        <Chip active={onlyIssues} onClick={() => setOnlyIssues((value) => !value)}>
          Hanya perlu perhatian
        </Chip>
        <Tag tone="neutral">{filtered.length} KPI</Tag>
      </div>

      <div className="soft-scroll mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
        {domains.map((item) => (
          <Chip key={item} active={domain === item} onClick={() => setDomain(item)}>
            {item}
          </Chip>
        ))}
      </div>

      <SimpleTable
        className="mt-3"
        minWidth={860}
        columns={["KPI", "Nilai", "Perubahan", "Target", "Pemilik", "Kesegaran", "Sertifikasi", "Status"]}
        rows={filtered.map((row) => [
          <div key="name" className="min-w-[150px]">
            <Link
              href={`/kpi/${row.id}`}
              className="group inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink hover:text-brand"
            >
              {row.name}
              <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <p className="text-[10.5px] text-ink-muted">{row.domain}</p>
          </div>,
          <span key="value" className="font-display text-[13px] font-semibold text-ink">
            {row.value}
          </span>,
          <Delta key="delta" value={row.delta} suffix={row.deltaSuffix} />,
          <span key="target" className="text-[11.5px]">
            {row.target}
          </span>,
          <span key="owner" className="text-[11.5px]">
            {row.owner}
          </span>,
          <span key="fresh" className="text-[11px] text-ink-muted">
            {row.freshness}
          </span>,
          row.certified ? <Certified key="cert" /> : <Tag key="cert" tone="amber">Perlu review</Tag>,
          <RagBadge key="rag" rag={row.rag} />,
        ])}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-ink-muted">
        <span>
          Menampilkan {filtered.length} dari 48 KPI terkurasi · hanya KPI bersertifikat yang tampil di beranda
        </span>
        <span>Definisi terakhir ditinjau 18 Nov 2026</span>
      </div>
    </Panel>
  );
}
