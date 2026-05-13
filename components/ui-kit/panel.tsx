import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("panel rounded-[26px] p-5", className)} {...props}>
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  subtitle,
  insight,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  insight?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h3 className="font-display text-[15px] font-semibold text-ink">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-[12px] text-ink-muted">{subtitle}</p> : null}
        {insight ? (
          <p className="mt-2 max-w-xl text-[12.5px] leading-relaxed text-ink-soft">{insight}</p>
        ) : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mt-4", className)}>{children}</div>;
}
