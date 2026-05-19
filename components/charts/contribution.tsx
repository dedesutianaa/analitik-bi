import { accentHex, type Accent } from "@/lib/data";
import { cn } from "@/lib/utils";

export function ContributionBars({
  items,
  className,
}: {
  items: { label: string; value: string; pct: number; accent: Accent }[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-3.5", className)}>
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11.5px] font-medium text-ink-soft">{item.label}</span>
            <span className="text-[11.5px] font-semibold text-ink">{item.value}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line-soft">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(4, item.pct))}%`, background: accentHex[item.accent] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RankedList({
  items,
  className,
}: {
  items: { label: string; value: string; pct: number; accent: Accent }[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-line-soft text-[10.5px] font-bold text-ink-soft">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[11.5px] font-medium text-ink-soft">{item.label}</span>
              <span className="text-[11.5px] font-semibold text-ink">{item.value}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-soft">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(100, Math.max(4, item.pct))}%`, background: accentHex[item.accent] }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
