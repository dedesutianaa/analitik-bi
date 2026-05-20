"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type ThemeMode } from "@/lib/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "light", label: "Terang", icon: Sun },
  { mode: "dark", label: "Gelap", icon: Moon },
  { mode: "system", label: "Ikuti sistem", icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, resolved, select } = useTheme();
  const TriggerIcon = resolved === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              "grid size-9 place-items-center rounded-full border border-glass-line bg-glass text-ink-soft backdrop-blur shadow-[0_2px_10px_-6px_rgba(76,58,110,0.5)] transition-colors hover:bg-glass-strong",
              className,
            )}
            aria-label="Ubah tema terang atau gelap"
          >
            <TriggerIcon className="size-4" />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-48 rounded-2xl border-line p-1.5">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.mode}
            onClick={() => select(option.mode)}
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[13px]"
          >
            <option.icon className="size-3.5 text-ink-muted" />
            <span className="flex-1">{option.label}</span>
            {mode === option.mode ? <Check className="size-3.5 text-brand" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
