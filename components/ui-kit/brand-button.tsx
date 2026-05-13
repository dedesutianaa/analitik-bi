import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const brand =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fb923c] to-[#f97316] px-4 text-[12.5px] font-semibold text-white shadow-[0_14px_26px_-14px_rgba(249,115,22,0.95)] transition-all hover:brightness-[1.04] active:scale-[0.99]";

const ghost =
  "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-glass-line bg-glass px-4 text-[12.5px] font-semibold text-ink-soft shadow-[0_2px_10px_-6px_rgba(76,58,110,0.5)] transition-colors hover:bg-glass-strong hover:text-ink";

export function BrandButton({
  children,
  href,
  icon,
  className,
  variant = "brand",
  ...props
}: {
  children: ReactNode;
  href?: string;
  icon?: ReactNode;
  className?: string;
  variant?: "brand" | "ghost";
} & React.ComponentProps<"button">) {
  const classes = cn(variant === "brand" ? brand : ghost, className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {icon}
      {children}
    </button>
  );
}
