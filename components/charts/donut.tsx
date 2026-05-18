"use client";

import type { ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export function Donut({
  value,
  total = 100,
  color = "#f97316",
  track = "#f1edf8",
  size = 180,
  thickness = 18,
  children,
}: {
  value: number;
  total?: number;
  color?: string;
  track?: string;
  size?: number;
  thickness?: number;
  children?: ReactNode;
}) {
  const data = [
    { name: "value", value },
    { name: "rest", value: Math.max(0, total - value) },
  ];

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={`${100 - thickness}%`}
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            cornerRadius={12}
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            <Cell fill={color} />
            <Cell fill={track} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">{children}</div>
      </div>
    </div>
  );
}
