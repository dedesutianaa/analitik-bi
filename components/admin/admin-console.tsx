"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Database,
  Download,
  Fingerprint,
  KeyRound,
  Plus,
  ScrollText,
  Server,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { SummaryTile } from "@/components/ui-kit/stat-card";
import { Chip, Tag } from "@/components/ui-kit/pill";
import { SimpleTable } from "@/components/ui-kit/table";
import { Tabs } from "@/components/ui-kit/tabs";
import { BarTrend } from "@/components/charts/bar-chart";
import { useAppState } from "@/lib/app-state";
import { downloadCsv } from "@/lib/export";
import { adminUsers, auditLog, connectors, roles, usageStats } from "@/lib/data";

type User = (typeof adminUsers)[number];

const roleNames = roles.map((role) => role.name);
const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export function AdminConsole() {
  const { showToast } = useAppState();
  const [users, setUsers] = useState<User[]>(adminUsers);
  const [inviting, setInviting] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftRole, setDraftRole] = useState(roleNames[1] ?? roleNames[0]);
  const [auditQuery, setAuditQuery] = useState("");

  const filteredAudit = useMemo(() => {
    const query = auditQuery.trim().toLowerCase();
    if (!query) return auditLog;
    return auditLog.filter((entry) =>
      [entry.user, entry.action, entry.object, entry.result].some((value) => value.toLowerCase().includes(query)),
    );
  }, [auditQuery]);

  const invite = () => {
    const name = draftName.trim();
    const email = draftEmail.trim();
    if (!name || !email) return;
    setUsers((prev) => [...prev, { name, email, role: draftRole, unit: "—", status: "Aktif", last: "Belum masuk" }]);
    showToast(`Undangan dikirim ke ${email}`);
    setDraftName("");
    setDraftEmail("");
    setInviting(false);
  };

  const downloadAudit = () => {
    downloadCsv("execinsight-audit-log.csv", [
      ["Waktu", "Pengguna", "Aksi", "Objek", "IP", "Hasil"],
      ...filteredAudit.map((entry) => [entry.time, entry.user, entry.action, entry.object, entry.ip, entry.result]),
    ]);
    showToast(`Audit log diunduh (${filteredAudit.length} baris)`);
  };

  const usersTab = (
    <div className="space-y-4">
      <Panel>
        <PanelHeader
          title="Pengguna & akses"
          subtitle={`Provisioning otomatis lewat SCIM · ${users.length} pengguna terdaftar`}
          action={
            <BrandButton
              variant="ghost"
              icon={<Plus className="size-3.5" />}
              onClick={() => setInviting((value) => !value)}
            >
              Undang pengguna
            </BrandButton>
          }
        />

        {inviting ? (
          <form
            className="mt-3 grid gap-2 rounded-2xl border border-line-soft bg-glass-soft p-3 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              invite();
            }}
          >
            <input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              placeholder="Nama lengkap"
              aria-label="Nama pengguna baru"
              className="h-9 rounded-lg border border-line bg-glass px-3 text-[12px] text-ink outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-brand/40"
            />
            <input
              type="email"
              value={draftEmail}
              onChange={(event) => setDraftEmail(event.target.value)}
              placeholder="nama@nusantara.co.id"
              aria-label="Email pengguna baru"
              className="h-9 rounded-lg border border-line bg-glass px-3 text-[12px] text-ink outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-brand/40"
            />
            <div className="flex flex-wrap items-center gap-1.5 sm:col-span-2">
              {roleNames.map((role) => (
                <Chip key={role} active={draftRole === role} onClick={() => setDraftRole(role)} className="h-7 text-[11px]">
                  {role}
                </Chip>
              ))}
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <BrandButton className="h-9 px-4 text-[12px]">Kirim undangan</BrandButton>
              <Chip className="h-9" onClick={() => setInviting(false)}>
                Batal
              </Chip>
              <span className="text-[10px] text-ink-muted">Peran menentukan cakupan data & izin ekspor.</span>
            </div>
          </form>
        ) : null}

        <SimpleTable
          className="mt-3"
          minWidth={760}
          columns={["Nama", "Peran", "Unit", "Status", "Aktivitas terakhir"]}
          rows={users.map((user) => [
            <div key="name" className="flex items-center gap-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#ffd0ae] to-[#f9a86a] text-[9px] font-bold text-white">
                {initialsOf(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-ink">{user.name}</p>
                <p className="truncate text-[10px] text-ink-muted">{user.email}</p>
              </div>
            </div>,
            <Tag key="role" tone="violet">
              {user.role}
            </Tag>,
            <span key="unit" className="text-[11px]">
              {user.unit}
            </span>,
            <Tag key="status" tone={user.status === "Aktif" ? "mint" : "amber"}>
              {user.status}
            </Tag>,
            <span key="last" className="text-[10.5px] text-ink-muted">
              {user.last}
            </span>,
          ])}
        />
      </Panel>

      <Panel>
        <PanelHeader title="Peran & cakupan data" subtitle="RBAC + row-level security" />
        <SimpleTable
          className="mt-3"
          minWidth={720}
          columns={["Peran", "Anggota", "Cakupan", "RLS", "Ekspor"]}
          rows={roles.map((role) => [
            <span key="name" className="text-[12px] font-semibold text-ink">
              {role.name}
            </span>,
            <span key="members" className="text-[11px]">
              {role.members}
            </span>,
            <span key="scope" className="text-[11px]">
              {role.scope}
            </span>,
            <span key="rls" className="text-[11px]">
              {role.rls}
            </span>,
            <span key="export" className="text-[11px]">
              {role.export}
            </span>,
          ])}
        />
      </Panel>
    </div>
  );

  const securityTab = (
    <div className="grid gap-4 xl:grid-cols-3">
      <Panel className="xl:col-span-2">
        <PanelHeader title="Identitas & akses" subtitle="SSO, MFA, dan kebijakan sesi" />
        <div className="mt-3 space-y-2">
          {[
            { icon: KeyRound, label: "SSO SAML 2.0 / OIDC", value: "Microsoft Entra ID", tone: "mint" as const },
            { icon: Users, label: "Provisioning SCIM", value: `Aktif · ${users.length} pengguna`, tone: "mint" as const },
            { icon: Fingerprint, label: "MFA wajib", value: "Luar jaringan + perangkat baru", tone: "mint" as const },
            { icon: ShieldCheck, label: "Row & column level security", value: "Ditegakkan di lapisan data", tone: "mint" as const },
            { icon: Activity, label: "Batas sesi", value: "8 jam · IP allowlist", tone: "amber" as const },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-xl border border-line-soft bg-glass-soft px-3 py-2.5"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-line-soft text-ink-soft">
                <item.icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold text-ink">{item.label}</p>
                <p className="text-[10px] text-ink-muted">{item.value}</p>
              </div>
              <Tag tone={item.tone}>{item.tone === "mint" ? "Aktif" : "Perhatian"}</Tag>
            </div>
          ))}
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel>
          <PanelHeader title="Kebijakan DLP" subtitle="Watermark & pembatasan ekspor" />
          <div className="mt-3 space-y-2 text-[11px]">
            {[
              ["Watermark dinamis", "Aktif"],
              ["Blokir unduh (rahasia)", "Aktif"],
              ["Tautan kedaluwarsa", "7 hari"],
              ["Ekspor tercatat", "Semua format"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-line-soft/60 px-3 py-2">
                <span className="text-ink-soft">{label}</span>
                <span className="font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Kepatuhan" subtitle="UU PDP & standar keamanan" />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["UU PDP 27/2022", "ISO 27001 (target)", "SOC 2 Type II (target)", "Residensi data ID"].map((item) => (
              <Tag key={item} tone="mint">
                {item}
              </Tag>
            ))}
          </div>
          <p className="mt-3 text-[10.5px] leading-relaxed text-ink-muted">
            Pemetaan kontrol ditinjau tim legal & keamanan sebelum GA. Audit log retensi 12 bulan.
          </p>
        </Panel>
      </div>
    </div>
  );

  const integrationTab = (
    <div className="space-y-4">
      <Panel>
        <PanelHeader
          title="Konektor data"
          subtitle="Mode query, kesegaran, dan status pipeline"
          action={
            <BrandButton
              variant="ghost"
              icon={<Plus className="size-3.5" />}
              onClick={() => showToast("Form konektor baru dibuka (mock)")}
            >
              Tambah konektor
            </BrandButton>
          }
        />
        <SimpleTable
          className="mt-3"
          minWidth={760}
          columns={["Konektor", "Tipe", "Mode", "Kesegaran", "Baris", "Status"]}
          rows={connectors.map((connector) => [
            <div key="name" className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-line-soft text-ink-soft">
                <Database className="size-3.5" />
              </span>
              <span className="text-[12px] font-semibold text-ink">{connector.name}</span>
            </div>,
            <span key="type" className="text-[11px]">
              {connector.type}
            </span>,
            <span key="mode" className="text-[11px]">
              {connector.mode}
            </span>,
            <span key="fresh" className="text-[11px]">
              {connector.freshness}
            </span>,
            <span key="records" className="text-[11px]">
              {connector.records}
            </span>,
            <Tag
              key="status"
              tone={connector.status === "Sehat" ? "mint" : connector.status === "Terlambat" ? "rose" : "amber"}
            >
              {connector.status}
            </Tag>,
          ])}
        />
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel>
          <PanelHeader title="SLA kesegaran" subtitle="Per domain KPI" />
          <div className="mt-3 space-y-2 text-[11px]">
            {[
              ["Keuangan", "H+1 · 07:00", "mint"],
              ["Operasional", "15–60 menit", "mint"],
              ["Penjualan", "Per jam", "mint"],
              ["SDM", "Mingguan", "amber"],
            ].map(([label, value, tone]) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-line-soft/60 px-3 py-2">
                <span className="text-ink-soft">{label}</span>
                <Tag tone={tone as "mint" | "amber"}>{value}</Tag>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="xl:col-span-2">
          <PanelHeader title="Pemantauan pipeline" subtitle="Kegagalan & KPI terdampak" />
          <div className="mt-3 space-y-2">
            {[
              { name: "fact_revenue", status: "Sukses", time: "06:40", impact: "—" },
              { name: "fact_cogs", status: "Sukses", time: "06:42", impact: "—" },
              { name: "ga4_sessions", status: "Terlambat", time: "05:10", impact: "ROAS, CAC" },
              { name: "hr_headcount", status: "Peringatan", time: "Senin 06:00", impact: "Attrition" },
            ].map((job) => (
              <div
                key={job.name}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2"
              >
                <span className="font-mono text-[11px] text-ink-soft">{job.name}</span>
                <Tag tone={job.status === "Sukses" ? "mint" : job.status === "Terlambat" ? "rose" : "amber"}>
                  {job.status}
                </Tag>
                <span className="text-[10px] text-ink-muted">{job.time}</span>
                <span className="ml-auto text-[10px] text-ink-muted">KPI terdampak: {job.impact}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );

  const auditTab = (
    <Panel>
      <PanelHeader
        title="Audit log"
        subtitle="Tidak dapat diubah · dapat diekspor ke SIEM · retensi 12 bulan"
        action={
          <BrandButton variant="ghost" icon={<Download className="size-3.5" />} onClick={downloadAudit}>
            Unduh CSV
          </BrandButton>
        }
      />
      <div className="mt-3 flex items-center gap-2">
        <input
          value={auditQuery}
          onChange={(event) => setAuditQuery(event.target.value)}
          placeholder="Cari pengguna, aksi, objek, atau hasil…"
          aria-label="Cari audit log"
          className="h-9 min-w-[220px] flex-1 rounded-full border border-line bg-glass px-3.5 text-[12px] text-ink outline-none placeholder:text-ink-muted focus-visible:ring-2 focus-visible:ring-brand/40"
        />
        <Tag tone="neutral">{filteredAudit.length} baris</Tag>
      </div>
      <SimpleTable
        className="mt-3"
        minWidth={820}
        columns={["Waktu", "Pengguna", "Aksi", "Objek", "IP", "Hasil"]}
        rows={filteredAudit.map((entry) => [
          <span key="time" className="whitespace-nowrap text-[10.5px] text-ink-muted">
            {entry.time}
          </span>,
          <span key="user" className="text-[11.5px] font-medium text-ink">
            {entry.user}
          </span>,
          <span key="action" className="text-[11px]">
            {entry.action}
          </span>,
          <span key="object" className="font-mono text-[10.5px] text-ink-muted">
            {entry.object}
          </span>,
          <span key="ip" className="font-mono text-[10.5px] text-ink-muted">
            {entry.ip}
          </span>,
          <Tag key="result" tone={entry.result === "Diblokir DLP" ? "rose" : "mint"}>
            {entry.result}
          </Tag>,
        ])}
      />
    </Panel>
  );

  const usageTab = (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {usageStats.map((stat) => (
          <SummaryTile key={stat.label} icon={Activity} label={stat.label} value={stat.value} sub={stat.sub} accent={stat.accent} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Pengguna aktif mingguan"
            subtitle="Executive Weekly Active Rate (EWAR)"
            insight="EWAR 84% — di atas target 70%. Puncak penggunaan pada Senin pagi dan hari rapat direksi."
            action={<Tag tone="mint">Target tercapai</Tag>}
          />
          <div className="mt-4">
            <BarTrend
              labels={["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]}
              values={[68, 72, 74, 79, 76, 81, 83, 84]}
              highlight={7}
              height={220}
              unit="%"
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Biaya komputasi" subtitle="Per unit bisnis · 30 hari" />
          <div className="mt-3 space-y-2.5">
            {[
              { name: "Keuangan", value: "Rp 4,2 jt", pct: 34 },
              { name: "Operasi", value: "Rp 3,1 jt", pct: 25 },
              { name: "Penjualan", value: "Rp 2,6 jt", pct: 21 },
              { name: "SDM", value: "Rp 1,4 jt", pct: 11 },
              { name: "Lainnya", value: "Rp 1,1 jt", pct: 9 },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-ink-soft">{item.name}</span>
                  <span className="text-[11px] font-semibold text-ink">{item.value}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-soft">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-brand-tint px-3 py-2 text-[10.5px] leading-relaxed text-ink-soft">
            Biaya per pengguna aktif Rp 18,4 rb — di bawah anggaran Rp 25 rb.
          </p>
        </Panel>
      </div>
    </div>
  );

  const observabilityTab = (
    <div className="grid gap-4 xl:grid-cols-3">
      <Panel className="xl:col-span-2">
        <PanelHeader title="Kesehatan layanan" subtitle="SLO 99,9% per bulan" action={<Tag tone="mint">Semua normal</Tag>} />
        <div className="mt-3 space-y-2">
          {[
            { name: "Web app", latency: "p95 1,8 dtk", uptime: "99,98%", status: "Sehat" },
            { name: "Query engine", latency: "p95 2,4 dtk", uptime: "99,95%", status: "Sehat" },
            { name: "Tanya Data (AI)", latency: "p95 6,1 dtk", uptime: "99,92%", status: "Sehat" },
            { name: "Pipeline data", latency: "—", uptime: "99,84%", status: "Perhatian" },
          ].map((service) => (
            <div
              key={service.name}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2.5"
            >
              <span className="grid size-7 place-items-center rounded-lg bg-line-soft text-ink-soft">
                <Server className="size-3.5" />
              </span>
              <span className="text-[11.5px] font-semibold text-ink">{service.name}</span>
              <span className="text-[10.5px] text-ink-muted">{service.latency}</span>
              <span className="ml-auto text-[10.5px] text-ink-muted">Uptime {service.uptime}</span>
              <Tag tone={service.status === "Sehat" ? "mint" : "amber"}>{service.status}</Tag>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Insiden & on-call" subtitle="30 hari terakhir" />
        <div className="mt-3 space-y-2">
          {[
            { title: "Job fact_revenue gagal", time: "2 hari lalu", status: "Pulih 42 mnt" },
            { title: "Latensi query naik", time: "8 hari lalu", status: "Pulih 12 mnt" },
            { title: "Sertifikat TLS diperbarui", time: "14 hari lalu", status: "Terjadwal" },
          ].map((incident) => (
            <div key={incident.title} className="rounded-xl border border-line-soft bg-glass-soft px-3 py-2">
              <p className="text-[11px] font-semibold text-ink">{incident.title}</p>
              <p className="text-[10px] text-ink-muted">
                {incident.time} · {incident.status}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-line-soft/70 px-3 py-2 text-[10px] text-ink-muted">
          <ScrollText className="size-3.5" />
          Peringatan on-call otomatis saat SLO terlampaui.
        </div>
      </Panel>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Administrasi"
        title="Konsol admin"
        subtitle="Kelola pengguna, peran, keamanan, konektor data, audit, dan biaya — tanpa bantuan engineering."
        actions={
          <>
            <BrandButton variant="ghost" icon={<ScrollText className="size-3.5" />} onClick={downloadAudit}>
              Unduh audit log
            </BrandButton>
            <BrandButton
              icon={<Plus className="size-4" />}
              onClick={() => {
                setInviting(true);
                showToast("Buka tab Pengguna & peran untuk mengundang");
              }}
            >
              Undang pengguna
            </BrandButton>
          </>
        }
      />

      <Tabs
        items={[
          { id: "users", label: "Pengguna & peran", badge: String(users.length), content: usersTab },
          { id: "security", label: "Keamanan & SSO", content: securityTab },
          { id: "integrations", label: "Integrasi data", badge: String(connectors.length), content: integrationTab },
          { id: "audit", label: "Audit log", content: auditTab },
          { id: "usage", label: "Penggunaan & biaya", content: usageTab },
          { id: "observability", label: "Observabilitas", content: observabilityTab },
        ]}
      />
    </div>
  );
}
