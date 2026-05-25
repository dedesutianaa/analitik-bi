"use client";

import {
  Bell,
  CircleHelp,
  Fingerprint,
  Globe2,
  LayoutGrid,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { PageHeader } from "@/components/ui-kit/page-header";
import { BrandButton } from "@/components/ui-kit/brand-button";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { Chip, PillSelect, Tag } from "@/components/ui-kit/pill";
import { Toggle } from "@/components/ui-kit/toggle";
import {
  densityOptions,
  fiscalOptions,
  fontScaleOptions,
  languageOptions,
  notificationRows,
  savedViewOptions,
  timezoneLabel,
  timezoneOptions,
  useAppState,
  type FontScale,
  type SavedView,
  type Timezone,
} from "@/lib/app-state";
import { useTheme } from "@/lib/theme";

const savedViewDetails: Record<SavedView, string> = {
  Harian: "5 KPI + peringatan",
  Mingguan: "Tren + driver",
  Board: "Ringkasan direksi",
};

export function SettingsView() {
  const {
    lang,
    setLang,
    timezone,
    setTimezone,
    fiscal,
    setFiscal,
    density,
    setDensity,
    fontScale,
    setFontScale,
    savedView,
    setSavedView,
    quietHours,
    setQuietHours,
    notifications,
    setNotification,
    showToast,
  } = useAppState();
  const { resolved, select } = useTheme();

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Preferensi"
        title="Pengaturan"
        subtitle="Preferensi tersinkron antar perangkat. Perubahan bahasa dan tampilan tidak menghilangkan konteks filter."
        actions={
          <BrandButton variant="ghost" onClick={() => showToast("Preferensi tersimpan di perangkat ini")}>
            Simpan perubahan
          </BrandButton>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel>
            <PanelHeader title="Profil & peran" subtitle="Dikelola lewat SSO perusahaan" />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#ffb27a] to-[#f97316] font-display text-[18px] font-bold text-white">
                AK
              </span>
              <div className="min-w-0">
                <p className="font-display text-[15px] font-semibold text-ink">Ardi Kusuma</p>
                <p className="text-[11px] text-ink-muted">ardi.kusuma@nusantara.co.id</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <Tag tone="violet">CEO</Tag>
                  <Tag tone="neutral">Kantor Pusat</Tag>
                  <Tag tone="mint">SSO aktif</Tag>
                </div>
              </div>
              <BrandButton
                variant="ghost"
                className="ml-auto"
                icon={<UserRound className="size-3.5" />}
                onClick={() => showToast("Profil dikelola lewat SSO perusahaan")}
              >
                Kelola profil
              </BrandButton>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Tampilan & lokalisasi" subtitle="Bahasa, zona waktu, kepadatan, dan ukuran teks" />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="flex items-center justify-between gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2">
                <span className="text-[11px] text-ink-soft">Bahasa</span>
                <PillSelect value={lang} options={languageOptions} onSelect={setLang} />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2">
                <span className="text-[11px] text-ink-soft">Zona waktu</span>
                <PillSelect
                  value={timezoneLabel[timezone]}
                  options={timezoneOptions.map((option) => timezoneLabel[option])}
                  onSelect={(value) => {
                    const next = timezoneOptions.find((option) => timezoneLabel[option] === value);
                    if (next) setTimezone(next as Timezone);
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2">
                <span className="text-[11px] text-ink-soft">Kalender fiskal</span>
                <PillSelect value={fiscal} options={fiscalOptions} onSelect={setFiscal} />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2">
                <span className="text-[11px] text-ink-soft">Kepadatan</span>
                <PillSelect
                  value={density}
                  options={densityOptions}
                  onSelect={(value) => setDensity(value as typeof density)}
                />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2 sm:col-span-2">
                <span className="text-[11px] text-ink-soft">Ukuran teks</span>
                <PillSelect
                  value={fontScale}
                  options={fontScaleOptions}
                  onSelect={(value) => setFontScale(value as FontScale)}
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 rounded-xl border border-line-soft bg-glass-soft px-3 py-2.5">
              <Globe2 className="size-4 text-ink-muted" />
              <span className="text-[11px] text-ink-soft">Format angka lokal</span>
              <span className="text-[11px] font-semibold text-ink">Rp 4.820.000.000.000</span>
              <Tag tone="neutral" className="ml-auto">
                Titik ribuan · koma desimal
              </Tag>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2.5">
              <div>
                <p className="text-[11px] font-medium text-ink">Mode gelap</p>
                <p className="text-[10px] text-ink-muted">
                  {resolved === "dark" ? "Aktif" : "Nonaktif"} · palet ramah buta warna tetap diterapkan
                </p>
              </div>
              <Toggle
                label="Mode gelap"
                on={resolved === "dark"}
                onChange={(on) => select(on ? "dark" : "light")}
              />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Notifikasi" subtitle="Pilih kanal dan tingkat keparahan" action={<Tag tone="mint">Opt-out 4%</Tag>} />
            <div className="mt-3 space-y-1.5">
              {notificationRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-3 rounded-xl border border-line-soft bg-glass-soft px-3 py-2.5"
                >
                  <Bell className="size-3.5 shrink-0 text-ink-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-medium text-ink">{row.label}</p>
                    <p className="text-[10px] text-ink-muted">{row.detail}</p>
                  </div>
                  <Toggle
                    label={row.label}
                    on={notifications[row.label] ?? row.defaultOn}
                    onChange={(on) => setNotification(row.label, on)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-line-soft/70 px-3 py-2 text-[10.5px] text-ink-muted">
              <Toggle label="Jam tenang" on={quietHours} onChange={setQuietHours} />
              <span>Jam tenang 21:00–06:00 {timezoneLabel[timezone]}</span>
              <span className="ml-auto">Maksimal 1 notifikasi gabungan per kejadian</span>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Tampilan tersimpan" subtitle="Berpindah dalam 1 ketukan" />
            <div className="mt-3 space-y-2">
              {savedViewOptions.map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => {
                    setSavedView(view);
                    showToast(`Tampilan ${view} diterapkan di beranda`);
                  }}
                  aria-pressed={savedView === view}
                  className="flex w-full items-center gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2 text-left transition-colors hover:border-brand/25 hover:bg-glass"
                >
                  <LayoutGrid className="size-3.5 text-ink-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-semibold text-ink">{view}</p>
                    <p className="text-[10px] text-ink-muted">{savedViewDetails[view]}</p>
                  </div>
                  {savedView === view ? <Tag tone="brand">Default</Tag> : <Tag tone="neutral">Pilih</Tag>}
                </button>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Keamanan perangkat" subtitle="MFA & biometrik" />
            <div className="mt-3 space-y-2">
              {[
                { icon: ShieldCheck, label: "MFA", value: "Aktif" },
                { icon: Fingerprint, label: "Biometrik mobile", value: "Aktif" },
                { icon: Smartphone, label: "Perangkat tepercaya", value: "2" },
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
            <p className="mt-2 text-[10px] leading-relaxed text-ink-muted">
              Sesi berakhir otomatis setelah 8 jam. Cabut sesi jarak jauh kapan saja.
            </p>
          </Panel>

          <Panel>
            <PanelHeader title="Delegasi" subtitle="Asisten atas nama Anda" />
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2">
              <span className="grid size-7 place-items-center rounded-full bg-violet-soft text-[9px] font-bold text-violet">
                NP
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold text-ink">Nadia Putri</p>
                <p className="text-[10px] text-ink-muted">Chief of Staff · akses delegasi</p>
              </div>
              <Tag tone="mint">Aktif</Tag>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-ink-muted">
              Aksi delegasi tercatat terpisah di audit log dan dapat dicabut kapan saja.
            </p>
          </Panel>

          <Panel>
            <PanelHeader title="Bantuan & umpan balik" subtitle="Kami respons dalam SLA" />
            <div className="mt-3 space-y-2">
              {["Tur onboarding (5 menit)", "Laporkan “Angka ini salah?”"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => showToast(`Permintaan "${item}" dikirim ke tim dukungan`)}
                  className="flex w-full items-center gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2 text-left transition-colors hover:border-brand/25 hover:bg-glass"
                >
                  <CircleHelp className="size-3.5 text-ink-muted" />
                  <span className="text-[11px] text-ink-soft">{item}</span>
                  <Chip className="ml-auto h-7 px-2.5 text-[10.5px]">Buka</Chip>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
