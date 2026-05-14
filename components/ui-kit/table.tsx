import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Data table shared by the KPI catalog, alerts and board pack.
 *
 * The wrapper carries `.table-wrapper` (see `app/globals.css`), which turns the
 * table into a scrollable, container-query-driven component: the header sticks
 * while scrolling, and below 640px each row collapses into a stacked card whose
 * cells are labelled through `data-label` (no duplicated markup).
 */
export function SimpleTable({
  columns,
  rows,
  minWidth = 640,
  className,
  caption,
}: {
  columns: string[];
  rows: ReactNode[][];
  minWidth?: number;
  className?: string;
  caption?: string;
}) {
  return (
    <div className={cn("soft-scroll table-wrapper", className)}>
      <table className="w-full border-separate border-spacing-y-1 text-left" style={{ minWidth }}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap bg-glass px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted backdrop-blur"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="group">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  data-label={columns[cellIndex]}
                  className="bg-glass-soft px-3 py-2.5 align-middle text-[12px] text-ink-soft transition-colors first:rounded-l-xl last:rounded-r-xl group-hover:bg-glass"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
