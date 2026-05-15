"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Toggle({
  defaultOn = false,
  on: controlled,
  onChange,
  label,
  className,
}: {
  defaultOn?: boolean;
  /** Supply `on` + `onChange` to use the switch in controlled mode. */
  on?: boolean;
  onChange?: (on: boolean) => void;
  label: string;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultOn);
  const on = controlled ?? internal;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => {
        if (controlled === undefined) setInternal((value) => !value);
        onChange?.(!on);
      }}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors",
        on ? "bg-brand" : "bg-line",
        className,
      )}
    >
      <span
        className={cn(
          "block size-4 rounded-full bg-white shadow-sm transition-transform",
          on ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
