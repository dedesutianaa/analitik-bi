"use client";

import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "color-scheme";
/** Broadcast key so every theme control on the page stays in sync. */
const EVENT = "execinsight:theme";

function systemPrefers(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? systemPrefers() : mode;
}

export function readTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage can throw when site data is blocked; fall back to system.
  }
  return "system";
}

/** Mirrors the chosen mode onto `<meta name="color-scheme">` and the helper class. */
function applyTheme(mode: ThemeMode) {
  const meta = document.querySelector('meta[name="color-scheme"]');
  meta?.setAttribute("content", mode === "system" ? "light dark" : mode);

  const root = document.documentElement;
  const isDark = resolveTheme(mode) === "dark";
  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
}

/**
 * Shared theme state. The inline script in `app/layout.tsx` has already applied
 * the stored override before first paint, so this only keeps the React tree in
 * sync with it — and with any other control that changes it.
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const stored = readTheme();
    setMode(stored);
    setResolved(resolveTheme(stored));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const current = readTheme();
      setMode(current);
      setResolved(resolveTheme(current));
    };
    const onMedia = () => {
      if (readTheme() === "system") sync();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) sync();
    };

    media.addEventListener("change", onMedia);
    window.addEventListener("storage", onStorage);
    window.addEventListener(EVENT, sync);
    return () => {
      media.removeEventListener("change", onMedia);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(EVENT, sync);
    };
  }, []);

  const select = useCallback((next: ThemeMode) => {
    setMode(next);
    setResolved(resolveTheme(next));
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore persistence failures; the theme still applies for this session.
    }
    applyTheme(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { mode, resolved, select };
}
