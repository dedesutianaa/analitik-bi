"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  items,
  className,
}: {
  items: { id: string; label: string; badge?: string; content: ReactNode }[];
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.id);
  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Bagian halaman"
        className="soft-scroll flex items-center gap-1 overflow-x-auto rounded-full border border-glass-line bg-glass p-1 backdrop-blur"
      >
        {items.map((item) => {
          const isActive = item.id === current?.id;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(item.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors",
                isActive
                  ? "bg-glass-strong text-ink shadow-[0_6px_16px_-10px_rgba(76,58,110,0.6)]"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {item.label}
              {item.badge ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    isActive ? "bg-brand-soft text-brand-strong" : "bg-line-soft text-ink-muted",
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="mt-4">
        {current?.content}
      </div>
    </div>
  );
}
