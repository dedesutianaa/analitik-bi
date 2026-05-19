import { cn } from "@/lib/utils";

export function Heatmap({
  rows,
  cols,
  values,
  className,
}: {
  rows: string[];
  cols: string[];
  values: number[][];
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="min-w-[420px]">
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `120px repeat(${cols.length}, minmax(0, 1fr))` }}
        >
          <span />
          {cols.map((col) => (
            <span key={col} className="pb-1 text-center text-[10px] font-medium text-ink-muted">
              {col}
            </span>
          ))}
          {rows.map((row, rowIndex) => (
            <div key={row} className="contents">
              <span className="flex items-center text-[11px] font-medium text-ink-soft">{row}</span>
              {cols.map((col, colIndex) => {
                const value = values[rowIndex]?.[colIndex] ?? 0;
                const alpha = 0.08 + (value / 100) * 0.82;
                return (
                  <div
                    key={`${row}-${col}`}
                    className="grid h-9 place-items-center rounded-lg text-[10.5px] font-semibold transition-transform hover:scale-[1.04]"
                    style={{
                      background: `rgba(249, 115, 22, ${alpha})`,
                      color: value > 55 ? "#ffffff" : "#8a4a12",
                    }}
                    title={`${row} · ${col}: ${value}`}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-ink-muted">
          <span>Rendah</span>
          {[0.12, 0.3, 0.5, 0.7, 0.9].map((alpha) => (
            <span
              key={alpha}
              className="size-3 rounded-[4px]"
              style={{ background: `rgba(249,115,22,${alpha})` }}
            />
          ))}
          <span>Tinggi</span>
        </div>
      </div>
    </div>
  );
}
