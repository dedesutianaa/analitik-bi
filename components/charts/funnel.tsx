import { cn } from "@/lib/utils";

const palette = ["#f97316", "#fb923c", "#a78bfa", "#8b5cf6", "#22b892"];

export function Funnel({
  items,
  className,
}: {
  items: { label: string; value: string; pct: number }[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div key={item.label} className="flex justify-center">
          <div
            className="flex h-11 items-center justify-between gap-3 rounded-xl px-3.5 text-white shadow-[0_10px_20px_-14px_rgba(76,58,110,0.7)]"
            style={{
              width: `${Math.max(46, item.pct)}%`,
              background: `linear-gradient(90deg, ${palette[index % palette.length]}, ${palette[(index + 1) % palette.length]})`,
            }}
          >
            <span className="truncate text-[11px] font-medium">{item.label}</span>
            <span className="shrink-0 text-[11.5px] font-bold">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
