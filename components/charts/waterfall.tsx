"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type WaterfallItem = { label: string; value: number; type?: "start" | "delta" | "total" };

export function Waterfall({
  items,
  height = 240,
  unit = "",
  domain,
}: {
  items: WaterfallItem[];
  height?: number;
  unit?: string;
  domain?: [number, number];
}) {
  const floor = domain?.[0] ?? 0;
  let running = 0;
  const data = items.map((item) => {
    const type = item.type ?? "delta";
    if (type === "start") {
      running = item.value;
      return {
        label: item.label,
        base: floor,
        bar: item.value - floor,
        display: item.value,
        color: "var(--violet)",
      };
    }
    if (type === "total") {
      return {
        label: item.label,
        base: floor,
        bar: running - floor,
        display: running,
        color: "var(--ink)",
      };
    }
    const base = item.value >= 0 ? running : running + item.value;
    running += item.value;
    return {
      label: item.label,
      base,
      bar: Math.abs(item.value),
      display: item.value,
      color: item.value >= 0 ? "var(--mint)" : "var(--danger)",
    };
  });

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="2 7" vertical={false} stroke="var(--line)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "var(--ink-muted)" }}
            dy={8}
            interval={0}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10.5, fill: "var(--ink-muted)" }}
            width={46}
            domain={domain}
            allowDataOverflow
          />
          <Tooltip
            cursor={{ fill: "rgba(139,92,246,0.05)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0].payload as { display: number; color: string };
              return (
                <div className="rounded-2xl border border-glass-line bg-glass-strong px-3 py-2 shadow-[0_18px_40px_-20px_rgba(76,58,110,0.55)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">{label}</p>
                  <p className="mt-1 text-[12px] font-semibold" style={{ color: row.color }}>
                    {row.display > 0 ? "+" : ""}
                    {row.display.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
                    {unit}
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="bar" stackId="w" radius={[7, 7, 7, 7]} isAnimationActive={false}>
            {data.map((row) => (
              <Cell key={row.label} fill={row.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
