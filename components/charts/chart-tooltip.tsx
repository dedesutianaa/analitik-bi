"use client";

type TooltipEntry = {
  name?: string | number;
  value?: number | string;
  color?: string;
  fill?: string;
  dataKey?: string | number;
};

export function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
  decimals = 0,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  unit?: string;
  decimals?: number;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-[150px] rounded-2xl border border-glass-line bg-glass-strong px-3 py-2 shadow-[0_18px_40px_-20px_rgba(76,58,110,0.55)] backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">{label}</p>
      <div className="mt-1.5 space-y-1">
        {payload.map((entry, index) => (
          <div key={`${entry.dataKey}-${index}`} className="flex items-center gap-2 text-[11.5px]">
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ background: entry.color ?? entry.fill ?? "var(--brand)" }}
            />
            <span className="text-ink-soft">{entry.name}</span>
            <span className="ml-auto font-semibold text-ink">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString("id-ID", {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                  })
                : entry.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
