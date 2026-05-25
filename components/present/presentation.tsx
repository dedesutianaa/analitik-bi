"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChartNoAxesCombined, ChevronLeft, ChevronRight, X } from "lucide-react";
import { presentationSlides } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Presentation() {
  const [index, setIndex] = useState(0);
  const total = presentationSlides.length;
  const slide = presentationSlides[index];

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setIndex((value) => Math.min(total - 1, value + 1));
      }
      if (event.key === "ArrowLeft") {
        setIndex((value) => Math.max(0, value - 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#141220] text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full bg-[#f97316]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-1/3 size-[460px] rounded-full bg-[#8b5cf6]/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 size-[380px] rounded-full bg-[#22b892]/10 blur-[120px]" />

      <div className="relative h-1 w-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-[#fb923c] to-[#f97316] transition-all duration-500"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <header className="relative flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#fb923c] to-[#f97316]">
            <ChartNoAxesCombined className="size-4 text-white" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">ExecInsight</p>
            <p className="text-[12px] font-medium text-white/80">Business Review Q4 2026</p>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11.5px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Keluar
          <X className="size-3.5" />
        </Link>
      </header>

      <main className="relative flex flex-1 items-center px-5 py-6 sm:px-8">
        <div key={index} className="animate-float-in mx-auto w-full max-w-5xl">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-[#ffb27a]">
            {slide.kicker}
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-[28px] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[40px] lg:text-[46px]">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[12.5px] leading-relaxed text-white/65 sm:text-[14.5px]">
            {slide.body}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {slide.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/45">
                  {stat.label}
                </p>
                <p className="mt-1.5 font-display text-[24px] font-semibold leading-none">{stat.value}</p>
                <p className="mt-1.5 text-[11px] font-semibold text-[#ffb27a]">{stat.delta}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-1.5">
          {presentationSlides.map((item, dotIndex) => (
            <button
              key={item.kicker}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Slide ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                dotIndex === index ? "w-7 bg-[#f97316]" : "w-1.5 bg-white/25 hover:bg-white/50",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="mr-1 text-[11px] tabular-nums text-white/50">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={index === 0}
            aria-label="Slide sebelumnya"
            className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((value) => Math.min(total - 1, value + 1))}
            disabled={index === total - 1}
            aria-label="Slide berikutnya"
            className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#fb923c] to-[#f97316] text-white transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
