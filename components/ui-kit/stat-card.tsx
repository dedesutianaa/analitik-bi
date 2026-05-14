import Link from "next/link";
import { cn } from "@/lib/utils";
import { accentHex, accentSoft, ragMeta, type Accent, type Rag } from "@/lib/data";
import { DomainIcon } from "@/components/ui-kit/icons";
import { Delta, RagBadge } from "@/components/ui-kit/rag";

export function StatCard({
  label,
  value,
  delta,
  deltaSuffix = "%",
  deltaLabel,
  rag,
  accent,
  icon,
  href,
  good,
  className,
}: {
  label: string;
  value: string;
  delta: number;
  deltaSuffix?: string;
  deltaLabel?: string;
  rag: Rag;
  accent: Accent;
  icon: string;
  href?: string;
  good?: boolean;
  className?: string;
}) {
  const body = (
    <>
      <span
        className="grid size-12 shrink-0 place-items-center rounded-full"
        style={{ background: accentSoft[accent] }}
      >
        <DomainIcon name={icon} className="size-[21px]" style={{ color: accentHex[accent] }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[23px] font-semibold leading-none tracking-[-0.02em] text-ink">
          {value}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 truncate text-[11.5px] font-medium text-ink-muted">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: ragMeta[rag].hex }}
            aria-hidden="true"
          />
          {label}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <Delta value={delta} suffix={deltaSuffix} good={good} />
          {deltaLabel ? <span className="text-[10.5px] text-ink-muted">{deltaLabel}</span> : null}
        </div>
      </div>
    </>
  );

  const classes = cn(
    "panel group flex items-start gap-3 rounded-[22px] p-4 transition-all duration-200",
    href && "hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-26px_rgba(76,58,110,0.55)]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }

  return <div className={classes}>{body}</div>;
}

export function SummaryTile({
  icon: Icon,
  label,
  value,
  sub,
  accent = "brand",
  className,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  sub?: string;
  accent?: Accent;
  className?: string;
}) {
  return (
    <div className={cn("panel flex items-center gap-3 rounded-[20px] p-3.5", className)}>
      <span
        className="grid size-10 shrink-0 place-items-center rounded-xl"
        style={{ background: accentSoft[accent] }}
      >
        <Icon className="size-[18px]" style={{ color: accentHex[accent] }} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-[18px] font-semibold leading-none text-ink">{value}</p>
        <p className="mt-1 truncate text-[10.5px] text-ink-muted">{label}</p>
      </div>
      {sub ? <span className="ml-auto shrink-0 text-[10px] font-medium text-ink-muted">{sub}</span> : null}
    </div>
  );
}

export function MiniStat({
  label,
  value,
  delta,
  rag,
  className,
}: {
  label: string;
  value: string;
  delta: string;
  rag: Rag;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-line-soft bg-glass-soft p-3.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium text-ink-muted">{label}</p>
        <RagBadge rag={rag} label="" className="px-1.5 py-1" />
      </div>
      <p className="mt-1.5 font-display text-[19px] font-semibold leading-none text-ink">{value}</p>
      <p className="mt-1 text-[10.5px] text-ink-muted">{delta}</p>
    </div>
  );
}
