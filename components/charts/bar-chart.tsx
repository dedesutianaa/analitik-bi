"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";

export function BarTrend({
  labels,
  values,
  highlight = -1,
  height = 240,
  unit = "",
  color = "var(--brand)",
  mutedColor = "var(--line-soft)",
  decimals = 0,
  showYAxis = true,
  reference,
}: {
  labels: string[];
  values: number[];
  highlight?: number;
  height?: number;
  unit?: string;
  color?: string;
  mutedColor?: string;
  decimals?: number;
  showYAxis?: boolean;
  reference?: { value: number; label?: string };
}) {
  const data = labels.map((label, index) => ({ label, value: values[index] }));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: showYAxis ? -6 : 0, bottom: 0 }} barCategoryGap="34%">
          <CartesianGrid strokeDasharray="2 7" vertical={false} stroke="var(--line)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10.5, fill: "var(--ink-muted)" }}
            dy={8}
            interval={0}
          />
          {showYAxis ? (
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10.5, fill: "var(--ink-muted)" }}
              width={46}
            />
          ) : null}
          <Tooltip
            content={<ChartTooltip unit={unit} decimals={decimals} />}
            cursor={{ fill: "rgba(249,115,22,0.05)" }}
          />
          {reference ? (
            <ReferenceLine
              y={reference.value}
              stroke="var(--violet)"
              strokeDasharray="4 4"
              label={{
                value: reference.label,
                position: "insideTopRight",
                fontSize: 10,
                fill: "var(--violet)",
              }}
            />
          ) : null}
          <Bar dataKey="value" name="Nilai" radius={[9, 9, 9, 9]} maxBarSize={48} isAnimationActive={false}>
            {data.map((entry, index) => (
              <Cell
                key={entry.label}
                fill={highlight === -1 || highlight === index ? color : mutedColor}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
