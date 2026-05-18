"use client";

import type { ReactNode } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

export function Gauge({
  value,
  color = "var(--brand)",
  track = "var(--line-soft)",
  size = 196,
  children,
}: {
  value: number;
  color?: string;
  track?: string;
  size?: number;
  children?: ReactNode;
}) {
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="78%"
          outerRadius="100%"
          data={[{ value }]}
          startAngle={215}
          endAngle={-35}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            background={{ fill: track }}
            dataKey="value"
            cornerRadius={40}
            fill={color}
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">{children}</div>
      </div>
    </div>
  );
}
