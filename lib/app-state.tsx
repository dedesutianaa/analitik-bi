"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Comparison, Period } from "@/lib/metrics";

export type Density = "Ringkas" | "Nyaman" | "Lapang";
export type FontScale = "Kecil" | "Sedang" | "Besar";
export type Timezone = "WIB" | "WITA" | "WIT";
export type SavedView = "Harian" | "Mingguan" | "Board";

export const densityOptions: Density[] = ["Ringkas", "Nyaman", "Lapang"];
export const fontScaleOptions: FontScale[] = ["Kecil", "Sedang", "Besar"];
export const timezoneOptions: Timezone[] = ["WIB", "WITA", "WIT"];
export const languageOptions = ["Bahasa Indonesia", "English"];
export const fiscalOptions = ["Januari–Desember", "April–Maret"];
export const savedViewOptions: SavedView[] = ["Harian", "Mingguan", "Board"];

export const timezoneLabel: Record<Timezone, string> = {
  WIB: "WIB (GMT+7)",
  WITA: "WITA (GMT+8)",
  WIT: "WIT (GMT+9)",
};
export const timezoneOffset: Record<Timezone, number> = { WIB: 7, WITA: 8, WIT: 9 };

export const notificationRows: { label: string; detail: string; defaultOn: boolean }[] = [
  { label: "Peringatan kritis", detail: "Push, email, Teams", defaultOn: true },
  { label: "Peringatan peringatan", detail: "Email harian", defaultOn: true },
  { label: "Briefing pagi", detail: "07:00 WIB", defaultOn: true },
  { label: "Digest mingguan", detail: "Senin 08:00 WIB", defaultOn: true },
  { label: "Pembaruan board pack", detail: "Saat status berubah", defaultOn: false },
  { label: "WhatsApp Business", detail: "Sesuai kebijakan perusahaan", defaultOn: false },
];

const zoomFor: Record<FontScale, number> = { Kecil: 0.96, Sedang: 1, Besar: 1.06 };

type Prefs = {
  period: Period;
  comparison: Comparison;
  density: Density;
  fontScale: FontScale;
  timezone: Timezone;
  fiscal: string;
  savedView: SavedView;
  lang: string;
  quietHours: boolean;
  notifications: Record<string, boolean>;
};

const defaultPrefs: Prefs = {
  period: "YTD",
  comparison: "vs Target",
  density: "Nyaman",
  fontScale: "Sedang",
  timezone: "WIB",
  fiscal: "Januari–Desember",
  savedView: "Harian",
  lang: "Bahasa Indonesia",
  quietHours: true,
  notifications: Object.fromEntries(notificationRows.map((row) => [row.label, row.defaultOn])),
};

type AppState = Prefs & {
  zoom: number;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  setPeriod: (value: Period) => void;
  setComparison: (value: Comparison) => void;
  setDensity: (value: Density) => void;
  setFontScale: (value: FontScale) => void;
  setTimezone: (value: Timezone) => void;
  setFiscal: (value: string) => void;
  setSavedView: (value: SavedView) => void;
  setLang: (value: string) => void;
  setQuietHours: (value: boolean) => void;
  setNotification: (label: string, on: boolean) => void;
  showToast: (message: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);
const STORAGE_KEY = "execinsight:prefs";

export function AppProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const hydrated = useRef(false);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs((prev) => ({ ...prev, ...(JSON.parse(raw) as Partial<Prefs>) }));
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* storage unavailable (private mode) */
    }
  }, [prefs]);

  const update = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      ...prefs,
      zoom: zoomFor[prefs.fontScale],
      paletteOpen,
      setPaletteOpen,
      setPeriod: (next) => update("period", next),
      setComparison: (next) => update("comparison", next),
      setDensity: (next) => update("density", next),
      setFontScale: (next) => update("fontScale", next),
      setTimezone: (next) => update("timezone", next),
      setFiscal: (next) => update("fiscal", next),
      setSavedView: (next) => update("savedView", next),
      setLang: (next) => update("lang", next),
      setQuietHours: (next) => update("quietHours", next),
      setNotification: (label, on) =>
        setPrefs((prev) => ({ ...prev, notifications: { ...prev.notifications, [label]: on } })),
      showToast,
    }),
    [prefs, paletteOpen, showToast, update],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="animate-float-in fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-glass-line bg-glass px-4 py-2 text-[12px] font-medium text-ink shadow-[0_18px_40px_-20px_rgba(76,58,110,0.7)] backdrop-blur-xl"
        >
          {toast}
        </div>
      ) : null}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState harus dipakai di dalam <AppProvider>");
  return context;
}
