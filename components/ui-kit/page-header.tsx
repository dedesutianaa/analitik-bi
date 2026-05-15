import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 font-display text-[25px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[28px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-ink-soft">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionTitle({
  children,
  action,
  className,
}: {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2 className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">{children}</h2>
      {action}
    </div>
  );
}
