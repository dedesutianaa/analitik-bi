"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";
import { CommandPalette } from "@/components/shell/command-palette";
import { useAppState } from "@/lib/app-state";

export function AppShell({ children }: { children: ReactNode }) {
  const { density, zoom } = useAppState();

  return (
    <div className="min-h-screen" data-density={density}>
      <Sidebar />
      <div className="lg:pl-[92px]">
        <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <Topbar />
          {/* `zoom` (with the width compensation below) implements the text-size
              preference without touching every hard-coded px size. */}
          <main className="pb-16" style={{ zoom, width: `calc(100% / ${zoom})` }}>
            {children}
          </main>
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}
