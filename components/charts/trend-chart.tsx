"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";

export type TrendSeries = {
  name: string;
  color: string;
  values: number[];
  dashed?: boolean;
  area?: boolean;
};

export function TrendChart({
  labels,
  series,
  height = 240,
  unit = "",
  decimals = 0,
  showLegend = true,
  showYAxis = true,
  yDomain,
  callout,
  className,
}: {
  labels: string[];
  series: TrendSeries[];
  height?: number;
  unit?: string;
  decimals?: number;
  showLegend?: boolean;
  showYAxis?: boolean;
  yDomain?: [number | string, number | string];
  callout?: { title: string; rows: { label: string; value: string; color: string }[]; left: string; top: string };
  className?: string;
}) {
  const uid = useId().replace(/[:]/g, "");
  const data = labels.map((label, index) => {
    const row: Record<string, string | number> = { label };
    series.forEach((s) => {
      row[s.name] = s.values[index] ?? 0;
    });
    return row;
  });

  return (
    <div className={className}>
      {showLegend ? (
        <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {series.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-soft">
              <span
                className="h-1.5 w-4 rounded-full"
                style={{ background: s.color, opacity: s.dashed ? 0.55 : 1 }}
              />
              {s.name}
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 8, left: showYAxis ? -18 : 0, bottom: 0 }}>
            <defs>
              {series.map((s, index) => (
                <linearGradient key={s.name} id={`${uid}-grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.22} />
                  <stop offset="70%" stopColor={s.color} stopOpacity={0.03} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="2 7" vertical={false} stroke="var(--line)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10.5, fill: "var(--ink-muted)" }}
              dy={8}
              interval="preserveStartEnd"
              minTickGap={18}
            />
            {showYAxis ? (
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10.5, fill: "var(--ink-muted)" }}
                width={46}
                domain={yDomain}
                tickFormatter={(value: number) =>
                  value >= 1000 ? `${(value / 1000).toFixed(1).replace(".", ",")}k` : `${value}`
                }
              />
            ) : null}
            <Tooltip
              content={<ChartTooltip unit={unit} decimals={decimals} />}
              cursor={{ stroke: "var(--line)", strokeDasharray: "4 4" }}
            />
            {series.map((s, index) => (
              <Area
                key={s.name}
                type="monotone"
                dataKey={s.name}
                name={s.name}
                stroke={s.color}
                strokeWidth={s.dashed ? 1.8 : 2.6}
                strokeDasharray={s.dashed ? "5 5" : undefined}
                fill={s.area === false ? "transparent" : `url(#${uid}-grad-${index})`}
                dot={false}
                activeDot={{ r: 4.5, strokeWidth: 2.5, stroke: "var(--surface)", fill: s.color }}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>

        {callout ? (
          <div
            className="pointer-events-none absolute z-10 hidden w-[168px] rounded-2xl border border-glass-line bg-glass-strong p-2.5 shadow-[0_18px_40px_-18px_rgba(76,58,110,0.5)] backdrop-blur sm:block"
            style={{ left: callout.left, top: callout.top }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
              {callout.title}
            </p>
            <div className="mt-1 space-y-0.5">
              {callout.rows.map((row) => (
                <div key={row.label} className="flex items-center gap-1.5 text-[10.5px]">
                  <span className="size-1.5 rounded-full" style={{ background: row.color }} />
                  <span className="text-ink-muted">{row.label}</span>
                  <span className="ml-auto font-semibold text-ink">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
