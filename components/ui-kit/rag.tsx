import { ArrowDownRight, ArrowUpRight, Clock3, Minus, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ragMeta, type Rag } from "@/lib/data";

export function Delta({
  value,
  suffix = "%",
  good,
  className,
  showIcon = true,
}: {
  value: number;
  suffix?: string;
  good?: boolean;
  className?: string;
  showIcon?: boolean;
}) {
  const positive = value > 0;
  const neutral = value === 0;
  const isGood = good ?? positive;
  const Icon = neutral ? Minus : positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11.5px] font-semibold",
        neutral ? "text-ink-muted" : isGood ? "text-mint-strong" : "text-danger-strong",
        className,
      )}
    >
      {showIcon ? <Icon className="size-3.5" strokeWidth={2.4} /> : null}
      {positive ? "+" : value < 0 ? "−" : ""}
      {Math.abs(value).toFixed(1).replace(".", ",")}
      {suffix}
    </span>
  );
}

export function RagBadge({ rag, label, className }: { rag: Rag; label?: string; className?: string }) {
  const meta = ragMeta[rag];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        className,
      )}
      style={{ background: meta.soft, color: meta.text }}
    >
      <span className="size-1.5 rounded-full" style={{ background: meta.hex }} />
      {label ?? meta.label}
    </span>
  );
}

export function StatusDot({ rag, className }: { rag: Rag; className?: string }) {
  return (
    <span
      className={cn("inline-block size-2 rounded-full", className)}
      style={{ background: ragMeta[rag].hex }}
    />
  );
}

export function Freshness({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] text-ink-muted", className)}>
      <Clock3 className="size-3" />
      {children}
    </span>
  );
}

export function Certified({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[10.5px] font-semibold text-mint-strong",
        className,
      )}
    >
      <ShieldCheck className="size-3" />
      Bersertifikat
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: "kritis" | "peringatan" | "info" }) {
  const map = {
    kritis: { bg: "var(--danger-soft)", color: "var(--danger-strong)", label: "Kritis" },
    peringatan: { bg: "var(--amber-soft)", color: "var(--amber-strong)", label: "Peringatan" },
    info: { bg: "var(--sky-soft)", color: "var(--sky-strong)", label: "Info" },
  }[severity];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
      style={{ background: map.bg, color: map.color }}
    >
      <span className="size-1.5 rounded-full" style={{ background: map.color }} />
      {map.label}
    </span>
  );
}
