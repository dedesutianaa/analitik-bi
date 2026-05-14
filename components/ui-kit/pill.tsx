"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const base =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-glass-line bg-glass px-3.5 text-[12.5px] font-medium text-ink-soft shadow-[0_2px_10px_-6px_rgba(76,58,110,0.5)] transition-colors hover:bg-glass-strong hover:text-ink";

export function Pill({
  children,
  className,
  icon,
  ...props
}: React.ComponentProps<"button"> & { icon?: ReactNode }) {
  return (
    <button type="button" className={cn(base, className)} {...props}>
      {icon}
      {children}
    </button>
  );
}

export function PillSelect({
  label,
  value,
  options,
  onSelect,
  icon,
  className,
  align = "end",
  menuLabel,
}: {
  label?: string;
  value: string;
  options: string[];
  onSelect?: (value: string) => void;
  icon?: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  menuLabel?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button type="button" className={cn(base, className)}>
            {icon}
            <span className="text-ink-muted">{label}</span>
            <span className="font-semibold text-ink">{value}</span>
            <ChevronDown className="size-3.5 text-ink-muted" />
          </button>
        }
      />
      <DropdownMenuContent align={align} className="w-52 rounded-2xl border-line p-1.5">
        {menuLabel ? <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-ink-muted">{menuLabel}</DropdownMenuLabel> : null}
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onSelect?.(option)}
            className={cn(
              "rounded-xl px-2.5 py-2 text-[13px]",
              option === value && "bg-brand-soft text-brand-strong font-semibold",
            )}
          >
            {option}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-xl px-2.5 py-2 text-[13px] text-ink-muted">
          Sesuaikan periode…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function IconButton({
  children,
  className,
  label,
  ...props
}: React.ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid size-9 place-items-center rounded-xl border border-glass-line bg-glass text-ink-muted shadow-[0_2px_10px_-6px_rgba(76,58,110,0.5)] transition-colors hover:bg-glass-strong hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Chip({
  children,
  active,
  className,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors",
        active
          ? "border-brand/30 bg-brand-soft text-brand-strong"
          : "border-line bg-glass text-ink-soft hover:bg-glass-strong hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "mint" | "violet" | "sky" | "rose" | "amber";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-line-soft text-ink-soft",
    brand: "bg-brand-soft text-brand-strong",
    mint: "bg-mint-soft text-mint-strong",
    violet: "bg-violet-soft text-violet-strong",
    sky: "bg-sky-soft text-sky-strong",
    rose: "bg-rose-soft text-rose-strong",
    amber: "bg-amber-soft text-amber-strong",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
