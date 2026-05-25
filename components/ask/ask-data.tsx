"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Database,
  Mic,
  Send,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui-kit/panel";
import { Chip, Tag } from "@/components/ui-kit/pill";
import { Delta } from "@/components/ui-kit/rag";
import { BarTrend } from "@/components/charts/bar-chart";
import { askAnswer, askSuggestions, kpiById, kpis, type Kpi } from "@/lib/data";
import { cn } from "@/lib/utils";

const round = (value: number) => Math.round(value * 10) / 10;

/** Keyword aliases so executives can ask in natural language. */
const aliases: Record<string, string[]> = {
  pendapatan: ["pendapatan", "revenue", "omzet", "penjualan"],
  "margin-kotor": ["margin", "laba kotor", "gross"],
  ebitda: ["ebitda", "laba operasi"],
  "arus-kas": ["arus kas", "cash", "kas"],
  "pelanggan-aktif": ["pelanggan", "customer", "retensi"],
  pipeline: ["pipeline", "coverage", "prospek"],
  otd: ["otd", "on-time", "pengiriman", "keterlambatan", "terlambat"],
  attrition: ["attrition", "turnover", "karyawan", "sdm", "resign"],
};

const regions = ["Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali-Nusra"];
const regionWeights = [1.33, 0.88, -0.25, 0.81, 1.08];

type Chart = { labels: string[]; values: number[]; unit: string; decimals: number; highlight: number };

type Answer = {
  kpiId: string;
  metricName: string;
  formula: string;
  owner: string;
  text: string;
  value: string;
  delta: number;
  suffix: string;
  headlineTag: string;
  chart: Chart;
  basis: { metric: string; filters: string; source: string; freshness: string; rows: string };
  followUps: string[];
};

type Message = { id: number; role: "user"; text: string } | { id: number; role: "assistant"; answer: Answer };

const seedOf = (text: string) => [...text].reduce((sum, character) => sum + character.charCodeAt(0), 0);

/** Picks the KPI that best matches the question, with a deterministic fallback. */
function matchKpi(question: string): Kpi {
  const query = question.toLowerCase();
  for (const [id, keys] of Object.entries(aliases)) {
    if (keys.some((key) => query.includes(key))) {
      const kpi = kpiById(id);
      if (kpi) return kpi;
    }
  }
  const named = kpis.find(
    (kpi) => query.includes(kpi.name.toLowerCase()) || query.includes(kpi.domain.toLowerCase()),
  );
  if (named) return named;
  return kpis[seedOf(question) % kpis.length];
}

/** Builds an answer strictly from the authorised semantic-layer numbers of one KPI. */
function buildAnswer(kpi: Kpi, question: string): Answer {
  const query = question.toLowerCase();
  const trend = kpi.trend;

  if (query.includes("wilayah") || query.includes("region")) {
    const values = regionWeights.map((weight) => round(kpi.delta * weight));
    const best = values.indexOf(Math.max(...values));
    const worst = values.indexOf(Math.min(...values));
    return {
      ...baseOf(kpi),
      text: `${kpi.name} per wilayah: ${regions[best]} memimpin (${values[best] > 0 ? "+" : ""}${values[best]}%), sementara ${regions[worst]} ${values[worst] < 0 ? "turun" : "tertinggal"} (${values[worst]}%).`,
      chart: { labels: regions, values, unit: "%", decimals: 1, highlight: best },
      followUps: [
        `Apa penyebab terbesarnya di ${regions[worst]}?`,
        `Tampilkan tren 12 bulan ${kpi.name}`,
        `Mengapa ${kpi.name} berubah?`,
      ],
    };
  }

  if (query.includes("mengapa") || query.includes("kenapa") || query.includes("penyebab") || query.includes("why")) {
    const drivers = kpi.drivers;
    const top = drivers.reduce((max, driver) => (driver.share > max.share ? driver : max), drivers[0]);
    return {
      ...baseOf(kpi),
      text: `${top.label} adalah pendorong terbesar (${top.share}% dari perubahan). ${kpi.name} kini ${kpi.value}, ${kpi.delta >= 0 ? "naik" : "turun"} ${Math.abs(kpi.delta)}${kpi.deltaSuffix} ${kpi.deltaLabel}.`,
      chart: {
        labels: drivers.map((driver) => driver.label),
        values: drivers.map((driver) => driver.share),
        unit: "%",
        decimals: 0,
        highlight: drivers.indexOf(top),
      },
      followUps: [
        `${top.label}: apa penyebabnya?`,
        `Tampilkan tren 12 bulan ${kpi.name}`,
        `Bagaimana ${kpi.name} per wilayah?`,
      ],
    };
  }

  const window = trend.slice(-8);
  const best = window.reduce((maxIndex, point, index) => (point.value > window[maxIndex].value ? index : maxIndex), 0);
  return {
    ...baseOf(kpi),
    text: `${kpi.name} tercatat ${kpi.value} pada ${trend[trend.length - 1].label} — ${kpi.delta >= 0 ? "naik" : "turun"} ${Math.abs(kpi.delta)}${kpi.deltaSuffix} ${kpi.deltaLabel}. Puncak 8 bulan terakhir di ${window[best].label} (${window[best].value.toLocaleString("id-ID")}).`,
    chart: {
      labels: window.map((point) => point.label),
      values: window.map((point) => point.value),
      unit: "",
      decimals: 0,
      highlight: best,
    },
    followUps: [
      `Mengapa ${kpi.name} berubah?`,
      `Bagaimana ${kpi.name} per wilayah?`,
      `Siapa pemilik ${kpi.name}?`,
    ],
  };
}

function baseOf(kpi: Kpi) {
  const seed = seedOf(kpi.id);
  return {
    kpiId: kpi.id,
    metricName: kpi.name,
    formula: kpi.formula,
    owner: kpi.owner,
    value: kpi.value,
    delta: kpi.delta,
    suffix: kpi.deltaSuffix,
    headlineTag: kpi.certified ? "Bersertifikat" : "Perlu review",
    basis: {
      metric: `${kpi.name} (${kpi.certified ? "bersertifikat" : "perlu review"})`,
      filters: `Domain = ${kpi.domain} · Pemilik = ${kpi.owner}`,
      source: kpi.source,
      freshness: kpi.freshness,
      rows: `${(1_000_000 + seed * 1237).toLocaleString("id-ID")} baris dipindai · 0,${(seed % 9) + 1} dtk`,
    },
  };
}

export function AskData() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "user", text: askAnswer.question },
    { id: 2, role: "assistant", answer: buildAnswer(matchKpi(askAnswer.question), askAnswer.question) },
  ]);
  const [input, setInput] = useState("");
  const [openBasis, setOpenBasis] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<Record<number, "up" | "down">>({});
  const [thinking, setThinking] = useState(false);

  const latest = [...messages].reverse().find((message) => message.role === "assistant") as
    | { id: number; role: "assistant"; answer: Answer }
    | undefined;

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || thinking) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", answer: buildAnswer(matchKpi(trimmed), trimmed) },
      ]);
      setThinking(false);
    }, 650);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Panel className="flex min-h-[640px] flex-col xl:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-[#c4b5fd] to-[#8b5cf6] text-white">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="text-[12.5px] font-semibold text-ink">Tanya Data</p>
              <p className="text-[10px] text-ink-muted">NL-to-metric · hanya dari semantic layer</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag tone="mint">Akurasi 92%</Tag>
            <Tag tone="neutral">ID / EN</Tag>
          </div>
        </div>

        <div className="soft-scroll mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-soft px-3.5 py-2.5 text-[12px] leading-relaxed text-brand-ink">
                  {message.text}
                </p>
              </div>
            ) : (
              <div key={message.id} className="flex gap-2.5">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-violet-soft text-violet">
                  <Sparkles className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-line-soft bg-glass-soft p-3.5">
                  <p className="text-[12.5px] font-medium leading-relaxed text-ink">{message.answer.text}</p>

                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">{message.answer.metricName}</p>
                      <p className="font-display text-[24px] font-semibold leading-none text-ink">{message.answer.value}</p>
                    </div>
                    <Delta value={message.answer.delta} suffix={message.answer.suffix} className="mb-1" />
                    <Tag tone={message.answer.headlineTag === "Bersertifikat" ? "mint" : "amber"} className="mb-1">
                      {message.answer.headlineTag}
                    </Tag>
                  </div>

                  <div className="mt-3 rounded-xl border border-line-soft bg-glass-soft p-2">
                    <BarTrend
                      labels={message.answer.chart.labels}
                      values={message.answer.chart.values}
                      highlight={message.answer.chart.highlight}
                      height={170}
                      unit={message.answer.chart.unit}
                      decimals={message.answer.chart.decimals}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenBasis((prev) => ({ ...prev, [message.id]: !prev[message.id] }))}
                      className="inline-flex items-center gap-1.5 rounded-full border border-glass-line bg-glass px-3 py-1.5 text-[11px] font-semibold text-ink-soft hover:text-ink"
                      aria-expanded={Boolean(openBasis[message.id])}
                    >
                      <ShieldCheck className="size-3.5 text-mint" />
                      Lihat dasar jawaban
                      <ChevronDown className={cn("size-3 transition-transform", openBasis[message.id] && "rotate-180")} />
                    </button>
                    <span className="text-[10px] text-ink-muted">{message.answer.basis.rows}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFeedback((prev) => ({ ...prev, [message.id]: "up" }))}
                        aria-label="Jawaban membantu"
                        className={cn(
                          "grid size-7 place-items-center rounded-lg border border-line bg-glass text-ink-muted hover:text-mint-strong",
                          feedback[message.id] === "up" && "border-mint/40 bg-mint-soft text-mint-strong",
                        )}
                      >
                        <ThumbsUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedback((prev) => ({ ...prev, [message.id]: "down" }))}
                        aria-label="Jawaban tidak membantu"
                        className={cn(
                          "grid size-7 place-items-center rounded-lg border border-line bg-glass text-ink-muted hover:text-danger-strong",
                          feedback[message.id] === "down" && "border-danger/30 bg-danger-soft text-danger-strong",
                        )}
                      >
                        <ThumbsDown className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {openBasis[message.id] ? (
                    <div className="mt-3 grid gap-2 rounded-xl bg-line-soft/60 p-3 sm:grid-cols-2">
                      {[
                        { label: "Metrik", value: message.answer.basis.metric },
                        { label: "Filter & periode", value: message.answer.basis.filters },
                        { label: "Sumber", value: message.answer.basis.source },
                        { label: "Kesegaran", value: message.answer.basis.freshness },
                      ].map((row) => (
                        <div key={row.label}>
                          <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                            {row.label}
                          </p>
                          <p className="mt-0.5 text-[10.5px] leading-relaxed text-ink-soft">{row.value}</p>
                        </div>
                      ))}
                      <p className="text-[10px] text-ink-muted sm:col-span-2">{message.answer.basis.rows}</p>
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {message.answer.followUps.map((followUp) => (
                      <Chip key={followUp} onClick={() => ask(followUp)}>
                        {followUp}
                        <ArrowUpRight className="size-3" />
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            ),
          )}

          {thinking ? (
            <div className="flex items-center gap-2 text-[11px] text-ink-muted">
              <span className="grid size-7 place-items-center rounded-full bg-violet-soft text-violet">
                <Sparkles className="size-3.5 animate-pulse" />
              </span>
              Menghitung dari semantic layer…
            </div>
          ) : null}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            ask(input);
          }}
          className="mt-4 flex items-center gap-2 rounded-2xl border border-glass-line bg-glass p-1.5 pl-3.5"
        >
          <Sparkles className="size-4 shrink-0 text-violet" />
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Tanyakan apa saja tentang kinerja bisnis…"
            aria-label="Pertanyaan untuk Tanya Data"
            className="min-w-0 flex-1 bg-transparent py-2 text-[12.5px] text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <button
            type="button"
            aria-label="Tanya dengan suara"
            className="grid size-8 place-items-center rounded-xl text-ink-muted hover:bg-line-soft hover:text-ink"
          >
            <Mic className="size-4" />
          </button>
          <button
            type="submit"
            aria-label="Kirim pertanyaan"
            className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#fb923c] to-[#f97316] text-white shadow-[0_10px_20px_-12px_rgba(249,115,22,0.9)]"
          >
            <Send className="size-4" />
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-ink-muted">
          Jawaban hanya memakai metrik bersertifikat. Angka dihitung mesin deterministik, bukan model bahasa.
        </p>
      </Panel>

      <div className="space-y-4">
        <Panel>
          <PanelHeader title="Pertanyaan yang disarankan" subtitle="Berdasarkan peran Anda (CEO)" />
          <div className="mt-3 space-y-1.5">
            {askSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => ask(suggestion)}
                className="group flex w-full items-start gap-2 rounded-xl border border-line-soft bg-glass-soft px-3 py-2 text-left text-[11px] leading-relaxed text-ink-soft transition-colors hover:border-brand/20 hover:bg-glass hover:text-ink"
              >
                <Sparkles className="mt-0.5 size-3 shrink-0 text-violet" />
                <span className="flex-1">{suggestion}</span>
                <ArrowUpRight className="mt-0.5 size-3 shrink-0 text-ink-muted opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Definisi metrik yang dipakai"
            subtitle={latest ? `Dari jawaban terakhir · ${latest.answer.metricName}` : "Dari katalog KPI"}
          />
          <div className="mt-3 space-y-2">
            {latest ? (
              <div className="rounded-xl border border-line-soft bg-glass-soft px-3 py-2">
                <p className="text-[11.5px] font-semibold text-ink">{latest.answer.metricName}</p>
                <p className="mt-0.5 font-mono text-[10px] text-ink-muted">{latest.answer.formula}</p>
                <p className="mt-0.5 text-[10px] text-ink-muted">Pemilik: {latest.answer.owner}</p>
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Guardrail AI" subtitle="Keamanan & kepercayaan" />
          <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-ink-soft">
            {[
              "Hanya metrik bersertifikat; pertanyaan di luar cakupan dijawab “tidak tahu”.",
              "Hak akses baris & kolom ditegakkan pada setiap jawaban.",
              "Data tidak dipakai melatih model pihak ketiga.",
              "Prompt dan respons dicatat untuk audit.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-mint" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-line-soft/70 px-3 py-2 text-[10px] text-ink-muted">
            <Database className="size-3.5" />
            Sumber: Snowflake DW · semantic layer v2.1
          </div>
        </Panel>
      </div>
    </div>
  );
}
