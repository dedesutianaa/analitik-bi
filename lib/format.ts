export function formatCompact(value: number, prefix = "Rp") {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) return `${prefix} ${trim(value / 1_000_000_000_000)} T`;
  if (abs >= 1_000_000_000) return `${prefix} ${trim(value / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `${prefix} ${trim(value / 1_000_000)} jt`;
  if (abs >= 1_000) return `${prefix} ${trim(value / 1_000)} rb`;
  return `${prefix} ${trim(value)}`;
}

function trim(n: number) {
  return n
    .toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2)
    .replace(".", ",")
    .replace(/,0+$/, "");
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits).replace(".", ",")}%`;
}

export function formatDelta(value: number, suffix = "%") {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1).replace(".", ",")}${suffix}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
