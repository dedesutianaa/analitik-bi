import { type Kpi, type Rag } from "@/lib/data";
import { formatCompact, formatNumber } from "@/lib/format";

/**
 * Period / comparison model.
 *
 * The prototype ships a single set of monthly values per KPI (`kpi.trend`).
 * Every other period is derived from that series, then normalised so the
 * year-to-date figure always reproduces the authored `kpi.value` exactly.
 */
export type Period = "Hari ini" | "WTD" | "MTD" | "QTD" | "YTD" | "Kustom";
export type Comparison = "vs Target" | "vs Periode lalu" | "vs Tahun lalu";

export const periodOptions: Period[] = ["Hari ini", "WTD", "MTD", "QTD", "YTD", "Kustom"];
export const comparisonOptions: Comparison[] = ["vs Target", "vs Periode lalu", "vs Tahun lalu"];

export const periodScopeDetail: Record<Period, string> = {
  "Hari ini": "22 Nov 2026 · 1 hari",
  WTD: "Minggu ini · 18–22 Nov",
  MTD: "November 2026",
  QTD: "Q4 2026 · Okt–Des",
  YTD: "2026 · Jan–Des",
  Kustom: "01 Jan – 22 Nov 2026",
};

type Kind = "currency" | "percent" | "ratio" | "count";
type Agg = "sum" | "last" | "avg";

function kindOf(text: string): Kind {
  const value = text.trim();
  if (/^Rp/i.test(value)) return "currency";
  if (value.endsWith("%")) return "percent";
  if (value.endsWith("x")) return "ratio";
  return "count";
}

function metricKind(kpi: Kpi): Kind {
  return kindOf(kpi.value);
}

/**
 * Scales an author-authored metric string (e.g. "Rp 4,82 T") to a narrower
 * scope such as a region or segment. Rates (percent/ratio) are scope-invariant.
 */
export function scaleMetricValue(text: string, factor: number): string {
  const kind = kindOf(text);
  if (kind === "percent" || kind === "ratio") return text;
  return formatMetric(parseNumber(text) * factor, kind);
}

const aggregation: Record<Kind, Agg> = {
  currency: "sum",
  count: "last",
  percent: "avg",
  ratio: "avg",
};

/** Parses the author's id-ID formatted strings ("Rp 4,82 T", "128.450", "94,2%"). */
function parseNumber(text: string): number {
  let value = text.trim().replace(/^Rp\s*/i, "");
  let multiplier = 1;
  const unit = value.match(/(T|M|jt|rb)\s*$/);
  if (unit) {
    multiplier = { T: 1e12, M: 1e9, jt: 1e6, rb: 1e3 }[unit[1]] ?? 1;
    value = value.slice(0, unit.index).trim();
  }
  value = value.replace(/[%x]$/, "").replace(/\s*(hari|orang|poin)$/i, "").trim();

  const hasComma = value.includes(",");
  const hasDot = value.includes(".");
  let normalized = value;
  if (hasComma && hasDot) {
    normalized = value.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = value.replace(",", ".");
  } else if (hasDot) {
    const decimals = value.slice(value.indexOf(".") + 1);
    normalized = decimals.length === 3 && !decimals.includes(".") ? value.replace(/\./g, "") : value;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed * multiplier : 0;
}

function formatMetric(value: number, kind: Kind): string {
  if (kind === "currency") return formatCompact(value, "Rp");
  if (kind === "percent") return `${fixed(value, 1)}%`;
  if (kind === "ratio") return `${fixed(value, 1)}x`;
  return formatNumber(Math.round(value));
}

function fixed(value: number, digits = 1) {
  return value.toFixed(digits).replace(".", ",");
}

function aggregate(values: number[], agg: Agg): number {
  if (values.length === 0) return 0;
  if (agg === "sum") return values.reduce((total, value) => total + value, 0);
  if (agg === "avg") return values.reduce((total, value) => total + value, 0) / values.length;
  return values[values.length - 1];
}

/** Index of the months included by a period, expressed on a monthly series. */
export function windowIndices(period: Period, length: number): number[] {
  const last = length - 1;
  if (period === "Hari ini" || period === "WTD" || period === "MTD") return [last];
  if (period === "QTD") return [Math.max(0, last - 2), Math.max(0, last - 1), last];
  return Array.from({ length }, (_, index) => index);
}

function previousIndices(period: Period, length: number): number[] {
  const last = length - 1;
  if (period === "Hari ini" || period === "WTD" || period === "MTD") return [Math.max(0, last - 1)];
  if (period === "QTD") return [Math.max(0, last - 5), Math.max(0, last - 4), Math.max(0, last - 3)];
  const half = Math.max(1, Math.floor(length / 2));
  return Array.from({ length: half }, (_, index) => index);
}

function periodRaw(values: number[], period: Period, agg: Agg): number {
  const picked = windowIndices(period, values.length).map((index) => values[index]);
  let raw = aggregate(picked, agg);
  // Sub-monthly periods are carved out of the latest month (rates stay as-is).
  if (agg !== "avg") {
    if (period === "Hari ini") raw *= 1 / 30;
    else if (period === "WTD") raw *= 7 / 30;
  }
  return raw;
}

export type DerivedKpi = {
  value: string;
  delta: number;
  deltaSuffix: string;
  deltaLabel: string;
  rag: Rag;
  achievement: number;
};

export function deriveKpi(kpi: Kpi, period: Period, comparison: Comparison): DerivedKpi {
  const kind = metricKind(kpi);
  const agg = aggregation[kind];
  const values = kpi.trend.map((point) => point.value);

  const headline = parseNumber(kpi.value);
  const ytdRaw = periodRaw(values, "YTD", agg);
  const scale = ytdRaw !== 0 ? headline / ytdRaw : 1;

  const current = periodRaw(values, period, agg) * scale;
  const target = parseNumber(kpi.target);

  let delta: number;
  let deltaSuffix: string;

  if (comparison === "vs Target") {
    if (kind === "percent" || kind === "ratio") {
      delta = current - target;
      deltaSuffix = kind === "percent" ? " pp" : "x";
    } else {
      delta = target !== 0 ? ((current - target) / target) * 100 : 0;
      deltaSuffix = "%";
    }
  } else if (comparison === "vs Periode lalu") {
    const previous = aggregate(
      previousIndices(period, values.length).map((index) => values[index]),
      agg,
    ) * scale;
    if (kind === "percent" || kind === "ratio") {
      delta = current - previous;
      deltaSuffix = kind === "percent" ? " pp" : "x";
    } else {
      delta = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
      deltaSuffix = "%";
    }
  } else {
    const priorYear = current / 1.115;
    if (kind === "percent" || kind === "ratio") {
      delta = current - priorYear;
      deltaSuffix = kind === "percent" ? " pp" : "x";
    } else {
      delta = 11.5;
      deltaSuffix = "%";
    }
  }

  const achievement =
    target !== 0
      ? kpi.direction === "down"
        ? (target / (current || 1)) * 100
        : (current / target) * 100
      : 0;

  return {
    value: formatMetric(current, kind),
    delta: Math.round(delta * 10) / 10,
    deltaSuffix,
    deltaLabel:
      comparison === "vs Target"
        ? "vs target"
        : comparison === "vs Periode lalu"
          ? "vs periode lalu"
          : "vs tahun lalu",
    rag: kpi.rag,
    achievement: Math.round(achievement * 10) / 10,
  };
}
