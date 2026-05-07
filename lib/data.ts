export type Rag = "green" | "amber" | "red";
export type Accent = "brand" | "mint" | "violet" | "sky" | "rose" | "amber";

/**
 * Accent colours are exposed as CSS custom properties rather than raw hex so
 * every inline style follows the active colour scheme (see `app/globals.css`).
 */
export const accentHex: Record<Accent, string> = {
  brand: "var(--brand)",
  mint: "var(--mint)",
  violet: "var(--violet)",
  sky: "var(--sky)",
  rose: "var(--rose)",
  amber: "var(--amber)",
};

export const accentSoft: Record<Accent, string> = {
  brand: "var(--brand-soft)",
  mint: "var(--mint-soft)",
  violet: "var(--violet-soft)",
  sky: "var(--sky-soft)",
  rose: "var(--rose-soft)",
  amber: "var(--amber-soft)",
};

export const ragMeta: Record<Rag, { label: string; hex: string; soft: string; text: string }> = {
  green: { label: "Sesuai target", hex: "var(--mint)", soft: "var(--mint-soft)", text: "var(--mint-strong)" },
  amber: { label: "Perlu perhatian", hex: "var(--amber)", soft: "var(--amber-soft)", text: "var(--amber-strong)" },
  red: { label: "Di bawah target", hex: "var(--danger)", soft: "var(--danger-soft)", text: "var(--danger-strong)" },
};

export type Kpi = {
  id: string;
  name: string;
  domain: string;
  value: string;
  delta: number;
  deltaSuffix: string;
  deltaLabel: string;
  rag: Rag;
  target: string;
  achievement: number;
  owner: string;
  steward: string;
  source: string;
  freshness: string;
  certified: boolean;
  formula: string;
  direction: "up" | "down";
  description: string;
  accent: Accent;
  icon: string;
  trend: { label: string; value: number; target: number }[];
  drivers: { label: string; value: number; share: number; accent: Accent }[];
};

const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function series(values: number[], target: number[]) {
  return values.map((value, i) => ({ label: months[i], value, target: target[i] }));
}

export const kpis: Kpi[] = [
  {
    id: "pendapatan",
    name: "Pendapatan YTD",
    domain: "Keuangan",
    value: "Rp 4,82 T",
    delta: 12.4,
    deltaSuffix: "%",
    deltaLabel: "vs tahun lalu",
    rag: "green",
    target: "Rp 5,10 T",
    achievement: 94.5,
    owner: "CFO — Rani Prameswari",
    steward: "Kepala Akuntansi Manajemen",
    source: "Buku besar ERP (SAP) · setelah jurnal penyesuaian",
    freshness: "H+1 · 06:40 WIB",
    certified: true,
    formula: "Σ pendapatan bersih seluruh entitas setelah eliminasi antar-entitas",
    direction: "up",
    description:
      "Total pendapatan bersih konsolidasi grup untuk periode berjalan, sudah dikurangi retur dan diskon, serta dieliminasi antar-entitas.",
    accent: "brand",
    icon: "revenue",
    trend: series(
      [312, 328, 351, 366, 389, 402, 418, 431, 452, 468, 481, 502],
      [330, 340, 352, 365, 378, 390, 402, 415, 428, 440, 452, 465],
    ),
    drivers: [
      { label: "Segmen Enterprise", value: 1.92, share: 40, accent: "brand" },
      { label: "Segmen Ritel", value: 1.44, share: 30, accent: "violet" },
      { label: "Segmen UMKM", value: 0.96, share: 20, accent: "sky" },
      { label: "Lainnya", value: 0.5, share: 10, accent: "mint" },
    ],
  },
  {
    id: "margin-kotor",
    name: "Margin Kotor",
    domain: "Keuangan",
    value: "38,6%",
    delta: -2.3,
    deltaSuffix: " pp",
    deltaLabel: "vs bulan lalu",
    rag: "red",
    target: "40,9%",
    achievement: 94.4,
    owner: "CFO — Rani Prameswari",
    steward: "Kepala Akuntansi Manajemen",
    source: "Buku besar ERP + modul persediaan",
    freshness: "H+1 · 06:40 WIB",
    certified: true,
    formula: "(Pendapatan − Harga Pokok Penjualan) ÷ Pendapatan",
    direction: "up",
    description:
      "Persentase laba kotor terhadap pendapatan bersih. Penurunan 2,3 poin bulan ini dipicu kenaikan biaya bahan baku dari dua pemasok utama.",
    accent: "rose",
    icon: "margin",
    trend: series(
      [41.2, 41.0, 40.8, 40.6, 40.9, 40.4, 40.1, 39.8, 39.6, 39.2, 38.9, 38.6],
      [40.9, 40.9, 40.9, 40.9, 40.9, 40.9, 40.9, 40.9, 40.9, 40.9, 40.9, 40.9],
    ),
    drivers: [
      { label: "Biaya bahan baku", value: -1.4, share: 61, accent: "rose" },
      { label: "Diskon penjualan", value: -0.5, share: 22, accent: "amber" },
      { label: "Bauran produk", value: -0.3, share: 13, accent: "violet" },
      { label: "Efisiensi logistik", value: 0.1, share: 4, accent: "mint" },
    ],
  },
  {
    id: "ebitda",
    name: "EBITDA",
    domain: "Keuangan",
    value: "Rp 1,12 T",
    delta: 6.1,
    deltaSuffix: "%",
    deltaLabel: "vs tahun lalu",
    rag: "amber",
    target: "Rp 1,25 T",
    achievement: 89.6,
    owner: "CFO — Rani Prameswari",
    steward: "Head of FP&A",
    source: "Konsolidasi ERP · skema EBITDA tersertifikasi",
    freshness: "H+1 · 06:40 WIB",
    certified: true,
    formula: "Laba usaha + depresiasi + amortisasi",
    direction: "up",
    description:
      "Laba sebelum bunga, pajak, depresiasi, dan amortisasi. Pertumbuhan tertahan oleh kenaikan biaya bahan baku dan beban SDM.",
    accent: "violet",
    icon: "ebitda",
    trend: series(
      [78, 82, 88, 91, 96, 99, 103, 106, 109, 111, 112, 118],
      [92, 95, 98, 101, 104, 107, 110, 113, 116, 119, 122, 125],
    ),
    drivers: [
      { label: "Pendapatan", value: 0.42, share: 52, accent: "brand" },
      { label: "Beban pokok", value: -0.24, share: 30, accent: "rose" },
      { label: "Beban SDM", value: -0.1, share: 12, accent: "amber" },
      { label: "Efisiensi OPEX", value: 0.05, share: 6, accent: "mint" },
    ],
  },
  {
    id: "arus-kas",
    name: "Arus Kas Operasional",
    domain: "Keuangan",
    value: "Rp 684 M",
    delta: 9.8,
    deltaSuffix: "%",
    deltaLabel: "vs tahun lalu",
    rag: "green",
    target: "Rp 720 M",
    achievement: 95,
    owner: "CFO — Rani Prameswari",
    steward: "Treasury Manager",
    source: "Modul treasury + rekonsiliasi bank",
    freshness: "Harian · 05:30 WIB",
    certified: true,
    formula: "Kas dari operasi sebelum perubahan modal kerja + perubahan modal kerja",
    direction: "up",
    description: "Kas bersih yang dihasilkan dari aktivitas operasi, termasuk perubahan modal kerja.",
    accent: "mint",
    icon: "cash",
    trend: series(
      [42, 48, 51, 55, 58, 61, 63, 66, 68, 70, 68, 72],
      [50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72],
    ),
    drivers: [
      { label: "Penagihan pelanggan", value: 0.52, share: 58, accent: "mint" },
      { label: "Pembayaran pemasok", value: -0.22, share: 26, accent: "rose" },
      { label: "Beban operasional", value: -0.1, share: 12, accent: "amber" },
      { label: "Lainnya", value: 0.04, share: 4, accent: "sky" },
    ],
  },
  {
    id: "pelanggan-aktif",
    name: "Pelanggan Aktif",
    domain: "Pelanggan",
    value: "128.450",
    delta: 4.2,
    deltaSuffix: "%",
    deltaLabel: "vs bulan lalu",
    rag: "green",
    target: "135.000",
    achievement: 95.1,
    owner: "CRO — Dimas Anggara",
    steward: "Head of Customer Analytics",
    source: "CRM Salesforce + data transaksi POS",
    freshness: "Harian · 04:00 WIB",
    certified: true,
    formula: "Pelanggan unik dengan ≥ 1 transaksi dalam 90 hari terakhir",
    direction: "up",
    description: "Jumlah pelanggan unik yang bertransaksi dalam 90 hari terakhir.",
    accent: "sky",
    icon: "users",
    trend: series(
      [104, 108, 111, 113, 116, 118, 120, 122, 124, 125, 127, 128],
      [110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132],
    ),
    drivers: [
      { label: "Akuisisi baru", value: 6.1, share: 48, accent: "sky" },
      { label: "Reaktivasi", value: 2.4, share: 22, accent: "violet" },
      { label: "Churn", value: -3.1, share: 24, accent: "rose" },
      { label: "Lainnya", value: 0.6, share: 6, accent: "mint" },
    ],
  },
  {
    id: "pipeline",
    name: "Pipeline Coverage",
    domain: "Penjualan",
    value: "3,4x",
    delta: -0.3,
    deltaSuffix: "x",
    deltaLabel: "vs kuartal lalu",
    rag: "amber",
    target: "4,0x",
    achievement: 85,
    owner: "CRO — Dimas Anggara",
    steward: "Sales Operations Lead",
    source: "CRM Salesforce · pipeline tersertifikasi",
    freshness: "Per jam · 08:00 WIB",
    certified: true,
    formula: "Nilai pipeline terbuka ÷ target pendapatan kuartal",
    direction: "up",
    description: "Rasio nilai peluang penjualan terbuka terhadap target pendapatan kuartal berjalan.",
    accent: "amber",
    icon: "pipeline",
    trend: series(
      [3.9, 4.1, 4.0, 3.8, 3.7, 3.9, 3.8, 3.6, 3.5, 3.6, 3.5, 3.4],
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    ),
    drivers: [
      { label: "Enterprise", value: 1.6, share: 47, accent: "brand" },
      { label: "Mid-market", value: 1.1, share: 32, accent: "violet" },
      { label: "SMB", value: 0.7, share: 21, accent: "sky" },
    ],
  },
  {
    id: "otd",
    name: "On-Time Delivery",
    domain: "Operasi",
    value: "94,2%",
    delta: 1.4,
    deltaSuffix: " pp",
    deltaLabel: "vs bulan lalu",
    rag: "green",
    target: "96,0%",
    achievement: 98.1,
    owner: "COO — Bayu Nugroho",
    steward: "Head of Supply Chain",
    source: "WMS + sistem logistik pihak ketiga",
    freshness: "15 menit",
    certified: true,
    formula: "Pengiriman tepat waktu ÷ total pengiriman",
    direction: "up",
    description: "Persentase pengiriman yang tiba sesuai janji waktu ke pelanggan.",
    accent: "mint",
    icon: "truck",
    trend: series(
      [91, 91.4, 92, 92.2, 92.8, 93, 93.4, 93.1, 93.6, 93.9, 94, 94.2],
      [96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96],
    ),
    drivers: [
      { label: "Jawa & Bali", value: 96.4, share: 44, accent: "mint" },
      { label: "Sumatera", value: 94.1, share: 26, accent: "sky" },
      { label: "Kalimantan", value: 91.2, share: 18, accent: "amber" },
      { label: "Indonesia Timur", value: 88.6, share: 12, accent: "rose" },
    ],
  },
  {
    id: "attrition",
    name: "Attrition Karyawan",
    domain: "SDM",
    value: "7,8%",
    delta: 1.1,
    deltaSuffix: " pp",
    deltaLabel: "vs kuartal lalu",
    rag: "amber",
    target: "6,5%",
    achievement: 83.3,
    owner: "CHRO — Sari Wulandari",
    steward: "People Analytics Lead",
    source: "HRIS Workday · data per 30 Nov",
    freshness: "Mingguan · Senin 06:00",
    certified: true,
    formula: "Karyawan keluar ÷ rata-rata headcount periode",
    direction: "down",
    description: "Tingkat perputaran karyawan tahunan. Arah baik: lebih rendah.",
    accent: "rose",
    icon: "userMinus",
    trend: series(
      [6.1, 6.2, 6.4, 6.3, 6.6, 6.8, 6.9, 7.1, 7.2, 7.4, 7.6, 7.8],
      [6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5],
    ),
    drivers: [
      { label: "Unit Logistik", value: 12.4, share: 38, accent: "rose" },
      { label: "Unit Ritel", value: 9.1, share: 27, accent: "amber" },
      { label: "Unit Manufaktur", value: 6.2, share: 21, accent: "violet" },
      { label: "Kantor Pusat", value: 3.4, share: 14, accent: "mint" },
    ],
  },
];

export const kpiById = (id: string) => kpis.find((k) => k.id === id);

export type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  meta: string;
  severity: "kritis" | "peringatan" | "info";
  kpiId: string;
  impact: string;
};

export const attentionItems: AttentionItem[] = [
  {
    id: "att-1",
    title: "Margin kotor turun 2,3 poin",
    detail: "Kenaikan harga bahan baku dari PT Sinar Baja menyumbang 61% penurunan.",
    meta: "Keuangan · 2 jam lalu",
    severity: "kritis",
    kpiId: "margin-kotor",
    impact: "Dampak Rp 96 M",
  },
  {
    id: "att-2",
    title: "DSO naik ke 48 hari",
    detail: "Penagihan segmen enterprise melambat di wilayah Kalimantan.",
    meta: "Keuangan · 5 jam lalu",
    severity: "peringatan",
    kpiId: "arus-kas",
    impact: "Dampak Rp 41 M",
  },
  {
    id: "att-3",
    title: "Attrition unit Logistik 12,4%",
    detail: "Di atas ambang 10% selama 3 bulan berturut-turut.",
    meta: "SDM · kemarin",
    severity: "peringatan",
    kpiId: "attrition",
    impact: "Dampak Rp 8,2 M",
  },
  {
    id: "att-4",
    title: "Tindak lanjut jatuh tempo",
    detail: "Review kontrak pemasok bahan baku — Kepala Pengadaan, tenggat hari ini.",
    meta: "Tindak lanjut · hari ini",
    severity: "info",
    kpiId: "margin-kotor",
    impact: "Tenggat H-0",
  },
];

export type Alert = {
  id: string;
  title: string;
  kpi: string;
  kpiId: string;
  severity: "kritis" | "peringatan" | "info";
  status: "baru" | "diakui" | "ditugaskan" | "selesai";
  value: string;
  threshold: string;
  change: string;
  cause: string;
  time: string;
  owner: string;
  channel: string;
  rule: string;
};

export const alerts: Alert[] = [
  {
    id: "ALR-2481",
    title: "Margin kotor di bawah ambang kritis",
    kpi: "Margin Kotor",
    kpiId: "margin-kotor",
    severity: "kritis",
    status: "baru",
    value: "38,6%",
    threshold: "< 39,0%",
    change: "−2,3 pp MoM",
    cause: "Biaya bahan baku naik 8,4% dari PT Sinar Baja dan PT Logam Jaya.",
    time: "Hari ini · 06:42",
    owner: "Rani Prameswari (CFO)",
    channel: "Push + Email + Teams",
    rule: "Ambang batas · Margin Kotor < 39%",
  },
  {
    id: "ALR-2479",
    title: "DSO melewati batas 45 hari",
    kpi: "DSO",
    kpiId: "arus-kas",
    severity: "peringatan",
    status: "diakui",
    value: "48 hari",
    threshold: "> 45 hari",
    change: "+4 hari MoM",
    cause: "Keterlambatan penagihan 12 pelanggan enterprise di Kalimantan.",
    time: "Hari ini · 05:10",
    owner: "Treasury Manager",
    channel: "Email",
    rule: "Ambang batas · DSO > 45 hari",
  },
  {
    id: "ALR-2476",
    title: "Anomali attrition unit Logistik",
    kpi: "Attrition",
    kpiId: "attrition",
    severity: "peringatan",
    status: "ditugaskan",
    value: "12,4%",
    threshold: "> 10,0%",
    change: "+2,1 pp QoQ",
    cause: "Pola musiman pasca-Lebaran + beban lembur 3 bulan terakhir.",
    time: "Kemarin · 16:20",
    owner: "Sari Wulandari (CHRO)",
    channel: "Push",
    rule: "Anomali cerdas · sensitif musiman",
  },
  {
    id: "ALR-2470",
    title: "Pipeline coverage di bawah target",
    kpi: "Pipeline Coverage",
    kpiId: "pipeline",
    severity: "info",
    status: "baru",
    value: "3,4x",
    threshold: "< 4,0x",
    change: "−0,3x QoQ",
    cause: "Konversi tahap proposal turun 6 poin di segmen mid-market.",
    time: "Kemarin · 09:05",
    owner: "Dimas Anggara (CRO)",
    channel: "Email",
    rule: "Penyimpangan target · QTD",
  },
  {
    id: "ALR-2465",
    title: "Keterlambatan data warehouse",
    kpi: "Pendapatan YTD",
    kpiId: "pendapatan",
    severity: "info",
    status: "selesai",
    value: "Terlambat 42 mnt",
    threshold: "SLA 07:00 WIB",
    change: "Pulih 07:42",
    cause: "Job transformasi `fact_revenue` gagal dan dijalankan ulang otomatis.",
    time: "2 hari lalu · 07:42",
    owner: "Data Platform",
    channel: "Slack",
    rule: "Kesegaran data · SLA",
  },
];

export type Domain = {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  accent: Accent;
  questions: string[];
  kpis: { label: string; value: string; delta: string; rag: Rag }[];
  trend: {
    title: string;
    insight: string;
    labels: string[];
    series: { name: string; color: string; values: number[] }[];
    unit: string;
  };
  breakdown: { title: string; insight: string; items: { label: string; value: string; pct: number; accent: Accent }[] };
  bars: { title: string; insight: string; labels: string[]; values: number[]; highlight: number; unit: string };
  table: { title: string; columns: string[]; rows: (string | number)[][] };
  annotations: { label: string; note: string }[];
};

export const domains: Domain[] = [
  {
    slug: "keuangan",
    name: "Keuangan",
    tagline: "Profitabilitas, kas, dan realisasi anggaran",
    icon: "wallet",
    accent: "brand",
    questions: [
      "Apakah kita on track terhadap target pendapatan tahun ini?",
      "Mengapa margin kotor turun bulan ini?",
      "Berapa runway kas pada skenario baseline?",
      "Divisi mana yang paling menyimpang dari anggaran OPEX?",
    ],
    kpis: [
      { label: "Pendapatan YTD", value: "Rp 4,82 T", delta: "+12,4%", rag: "green" },
      { label: "Margin Kotor", value: "38,6%", delta: "−2,3 pp", rag: "red" },
      { label: "EBITDA", value: "Rp 1,12 T", delta: "+6,1%", rag: "amber" },
      { label: "Arus Kas Ops.", value: "Rp 684 M", delta: "+9,8%", rag: "green" },
    ],
    trend: {
      title: "Pendapatan vs target konsolidasi",
      insight: "Pendapatan tumbuh 12,4% YoY, tetapi masih 5,5% di bawah target YTD.",
      labels: months,
      unit: "Rp miliar",
      series: [
        { name: "Realisasi", color: "#f97316", values: [312, 328, 351, 366, 389, 402, 418, 431, 452, 468, 481, 502] },
        { name: "Target", color: "#8b5cf6", values: [330, 340, 352, 365, 378, 390, 402, 415, 428, 440, 452, 465] },
        { name: "Tahun lalu", color: "#c9c4d8", values: [280, 292, 305, 318, 330, 342, 355, 366, 378, 390, 402, 415] },
      ],
    },
    breakdown: {
      title: "Kontribusi penurunan margin",
      insight: "Biaya bahan baku menyumbang 61% dari penurunan 2,3 poin.",
      items: [
        { label: "Biaya bahan baku", value: "−1,4 pp", pct: 61, accent: "rose" },
        { label: "Diskon penjualan", value: "−0,5 pp", pct: 22, accent: "amber" },
        { label: "Bauran produk", value: "−0,3 pp", pct: 13, accent: "violet" },
        { label: "Efisiensi logistik", value: "+0,1 pp", pct: 4, accent: "mint" },
      ],
    },
    bars: {
      title: "Realisasi vs anggaran OPEX per divisi",
      insight: "Divisi Operasi 8,2% di atas anggaran; dua divisi lain masih dalam toleransi.",
      labels: ["Operasi", "Penjualan", "SDM", "TI", "Keuangan"],
      values: [108, 97, 94, 101, 89],
      highlight: 0,
      unit: "% dari anggaran",
    },
    table: {
      title: "Entitas dengan varians terbesar",
      columns: ["Entitas", "Pendapatan", "Varians", "Margin", "Status"],
      rows: [
        ["PT Nusantara Ritel", "Rp 1,44 T", "+6,2%", "34,1%", "Hijau"],
        ["PT Nusantara Manufaktur", "Rp 1,92 T", "−3,8%", "41,6%", "Merah"],
        ["PT Nusantara Logistik", "Rp 0,86 T", "+2,1%", "29,4%", "Kuning"],
        ["PT Nusantara Digital", "Rp 0,60 T", "+18,4%", "46,2%", "Hijau"],
      ],
    },
    annotations: [
      { label: "Mar", note: "Kenaikan harga bahan baku" },
      { label: "Agu", note: "Promo nasional" },
    ],
  },
  {
    slug: "penjualan",
    name: "Penjualan & Pendapatan",
    tagline: "Pipeline, konversi, dan kinerja kanal",
    icon: "trending",
    accent: "violet",
    questions: [
      "Kanal mana yang menurunkan konversi bulan ini?",
      "Berapa win rate segmen enterprise kuartal ini?",
      "Wilayah mana yang paling tertinggal dari target?",
      "Bagaimana forecast pendapatan kuartal depan?",
    ],
    kpis: [
      { label: "Pipeline Coverage", value: "3,4x", delta: "−0,3x", rag: "amber" },
      { label: "Win Rate", value: "28,4%", delta: "+1,2 pp", rag: "green" },
      { label: "Nilai Transaksi Rata-rata", value: "Rp 42,6 jt", delta: "+3,4%", rag: "green" },
      { label: "Siklus Penjualan", value: "64 hari", delta: "+5 hari", rag: "red" },
    ],
    trend: {
      title: "Pipeline vs target kuartalan",
      insight: "Coverage turun ke 3,4x karena konversi tahap proposal melemah di mid-market.",
      labels: months,
      unit: "Rp miliar",
      series: [
        { name: "Pipeline", color: "#8b5cf6", values: [820, 860, 910, 880, 840, 900, 870, 830, 800, 820, 790, 760] },
        { name: "Target", color: "#f97316", values: [800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020] },
      ],
    },
    breakdown: {
      title: "Konversi per tahap funnel",
      insight: "Tahap proposal → negosiasi turun 6 poin, penyebab utama pelemahan pipeline.",
      items: [
        { label: "Lead → Kualifikasi", value: "62%", pct: 62, accent: "sky" },
        { label: "Kualifikasi → Proposal", value: "48%", pct: 48, accent: "violet" },
        { label: "Proposal → Negosiasi", value: "31%", pct: 31, accent: "amber" },
        { label: "Negosiasi → Menang", value: "28%", pct: 28, accent: "mint" },
      ],
    },
    bars: {
      title: "Pendapatan per wilayah (Rp miliar)",
      insight: "Jawa masih mendominasi; Kalimantan tumbuh paling lambat.",
      labels: ["Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali-Nusra"],
      values: [2140, 1120, 620, 540, 400],
      highlight: 2,
      unit: "Rp miliar",
    },
    table: {
      title: "Peluang terbesar yang berisiko",
      columns: ["Peluang", "Nilai", "Tahap", "Hari terbuka", "Risiko"],
      rows: [
        ["Modernisasi gudang PT Andalan", "Rp 84 M", "Negosiasi", "112", "Tinggi"],
        ["Kontrak ritel Nusantara Mart", "Rp 62 M", "Proposal", "78", "Sedang"],
        ["Ekspansi pabrik Surabaya", "Rp 48 M", "Kualifikasi", "41", "Rendah"],
        ["Digitalisasi cabang Kalimantan", "Rp 36 M", "Proposal", "96", "Tinggi"],
      ],
    },
    annotations: [
      { label: "Mei", note: "Peluncuran paket enterprise" },
      { label: "Okt", note: "Perubahan kebijakan diskon" },
    ],
  },
  {
    slug: "operasi",
    name: "Operasi & Rantai Pasok",
    tagline: "Layanan, produktivitas, dan persediaan",
    icon: "factory",
    accent: "mint",
    questions: [
      "Cabang mana yang di bawah standar layanan minggu ini?",
      "Berapa on-time delivery per wilayah?",
      "Di mana risiko kehabisan stok tertinggi?",
      "Bagaimana utilisasi kapasitas pabrik?",
    ],
    kpis: [
      { label: "On-Time Delivery", value: "94,2%", delta: "+1,4 pp", rag: "green" },
      { label: "OEE", value: "78,6%", delta: "−1,1 pp", rag: "amber" },
      { label: "Tingkat Cacat", value: "1,8%", delta: "−0,3 pp", rag: "green" },
      { label: "Perputaran Stok", value: "6,4x", delta: "+0,2x", rag: "green" },
    ],
    trend: {
      title: "On-time delivery per wilayah",
      insight: "Indonesia Timur tertinggal 7,4 poin di bawah standar layanan 96%.",
      labels: months,
      unit: "%",
      series: [
        { name: "Nasional", color: "#22b892", values: [91, 91.4, 92, 92.2, 92.8, 93, 93.4, 93.1, 93.6, 93.9, 94, 94.2] },
        { name: "Indonesia Timur", color: "#ef4444", values: [84, 85, 85.4, 86, 86.2, 87, 87.4, 87.1, 87.6, 88, 88.2, 88.6] },
        { name: "Standar", color: "#c9c4d8", values: [96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96, 96] },
      ],
    },
    breakdown: {
      title: "Penyebab keterlambatan pengiriman",
      insight: "Kapasitas armada kurang menyumbang 44% keterlambatan.",
      items: [
        { label: "Kapasitas armada", value: "44%", pct: 44, accent: "rose" },
        { label: "Dokumen ekspedisi", value: "26%", pct: 26, accent: "amber" },
        { label: "Cuaca & akses", value: "18%", pct: 18, accent: "sky" },
        { label: "Kesalahan gudang", value: "12%", pct: 12, accent: "violet" },
      ],
    },
    bars: {
      title: "Utilisasi kapasitas pabrik (%)",
      insight: "Pabrik Cikarang mendekati batas 92% — perlu rencana ekspansi.",
      labels: ["Cikarang", "Surabaya", "Medan", "Semarang", "Makassar"],
      values: [92, 84, 76, 71, 64],
      highlight: 0,
      unit: "%",
    },
    table: {
      title: "Cabang di bawah standar layanan",
      columns: ["Cabang", "OTD", "SLA", "Keluhan", "Status"],
      rows: [
        ["Balikpapan", "88,6%", "96%", "42", "Merah"],
        ["Makassar", "90,1%", "96%", "31", "Merah"],
        ["Medan", "93,4%", "96%", "18", "Kuning"],
        ["Semarang", "96,2%", "96%", "9", "Hijau"],
      ],
    },
    annotations: [
      { label: "Feb", note: "Gangguan sistem WMS" },
      { label: "Sep", note: "Penambahan armada" },
    ],
  },
  {
    slug: "pemasaran",
    name: "Pemasaran",
    tagline: "Akuisisi, efisiensi biaya, dan kanal",
    icon: "megaphone",
    accent: "rose",
    questions: [
      "Kanal mana dengan CAC terendah kuartal ini?",
      "Bagaimana ROAS kampanye Q4?",
      "Di mana funnel paling banyak kehilangan calon pelanggan?",
      "Berapa biaya per lead per kanal?",
    ],
    kpis: [
      { label: "CAC", value: "Rp 1,24 jt", delta: "−6,2%", rag: "green" },
      { label: "ROAS", value: "4,8x", delta: "+0,4x", rag: "green" },
      { label: "Biaya per Lead", value: "Rp 186 rb", delta: "+3,1%", rag: "amber" },
      { label: "Konversi Funnel", value: "3,4%", delta: "−0,2 pp", rag: "amber" },
    ],
    trend: {
      title: "CAC vs ROAS per bulan",
      insight: "Efisiensi membaik: CAC turun 6,2% sementara ROAS naik ke 4,8x.",
      labels: months,
      unit: "indeks",
      series: [
        { name: "CAC (juta Rp)", color: "#ec4899", values: [1.62, 1.58, 1.55, 1.5, 1.48, 1.42, 1.4, 1.36, 1.32, 1.3, 1.28, 1.24] },
        { name: "ROAS (x)", color: "#f97316", values: [3.6, 3.7, 3.9, 4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8] },
      ],
    },
    breakdown: {
      title: "Kontribusi kanal terhadap lead",
      insight: "Kanal organik memberi 34% lead dengan CAC terendah.",
      items: [
        { label: "Organik & SEO", value: "34%", pct: 34, accent: "mint" },
        { label: "Berbayar digital", value: "28%", pct: 28, accent: "brand" },
        { label: "Kemitraan", value: "22%", pct: 22, accent: "violet" },
        { label: "Event & lainnya", value: "16%", pct: 16, accent: "sky" },
      ],
    },
    bars: {
      title: "ROAS per kanal (x)",
      insight: "Kemitraan memberi ROAS tertinggi; berbayar digital perlu optimasi.",
      labels: ["Kemitraan", "Organik", "Email", "Berbayar", "Afiliasi"],
      values: [6.2, 5.4, 4.6, 3.1, 2.8],
      highlight: 3,
      unit: "x",
    },
    table: {
      title: "Kampanye Q4",
      columns: ["Kampanye", "Belanja", "Lead", "CAC", "ROAS"],
      rows: [
        ["Akhir Tahun Enterprise", "Rp 2,4 M", "1.842", "Rp 1,30 jt", "5,1x"],
        ["Ritel Hemat Akhir Tahun", "Rp 1,8 M", "3.120", "Rp 577 rb", "4,2x"],
        ["Kemitraan B2B", "Rp 1,1 M", "684", "Rp 1,61 jt", "6,2x"],
        ["Retargeting", "Rp 640 jt", "1.240", "Rp 516 rb", "3,4x"],
      ],
    },
    annotations: [
      { label: "Jun", note: "Rebranding kampanye" },
      { label: "Nov", note: "Harbolnas" },
    ],
  },
  {
    slug: "pelanggan",
    name: "Pelanggan",
    tagline: "Retensi, kepuasan, dan nilai pelanggan",
    icon: "users",
    accent: "sky",
    questions: [
      "Berapa churn rate segmen enterprise?",
      "Wilayah mana dengan NPS terendah?",
      "Bagaimana retensi kohort 2025?",
      "Berapa CLV rata-rata per segmen?",
    ],
    kpis: [
      { label: "Pelanggan Aktif", value: "128.450", delta: "+4,2%", rag: "green" },
      { label: "Churn", value: "2,1%", delta: "+0,3 pp", rag: "amber" },
      { label: "NPS", value: "48", delta: "+3", rag: "green" },
      { label: "CLV", value: "Rp 18,4 jt", delta: "+5,1%", rag: "green" },
    ],
    trend: {
      title: "Retensi kohort per kuartal",
      insight: "Kohort Q1 2026 retensi 6 bulan 91% — terbaik dalam 3 tahun.",
      labels: ["Bln 1", "Bln 2", "Bln 3", "Bln 4", "Bln 5", "Bln 6", "Bln 7", "Bln 8"],
      unit: "%",
      series: [
        { name: "Kohort Q1 2026", color: "#3b82f6", values: [100, 97, 95, 94, 93, 91, 90, 89] },
        { name: "Kohort Q4 2025", color: "#8b5cf6", values: [100, 96, 93, 91, 89, 87, 86, 84] },
        { name: "Kohort Q1 2025", color: "#c9c4d8", values: [100, 95, 92, 89, 87, 85, 83, 81] },
      ],
    },
    breakdown: {
      title: "Alasan churn utama",
      insight: "Harga dan kualitas layanan menyumbang 58% churn.",
      items: [
        { label: "Harga", value: "32%", pct: 32, accent: "rose" },
        { label: "Kualitas layanan", value: "26%", pct: 26, accent: "amber" },
        { label: "Pindah kompetitor", value: "24%", pct: 24, accent: "violet" },
        { label: "Lainnya", value: "18%", pct: 18, accent: "sky" },
      ],
    },
    bars: {
      title: "NPS per wilayah",
      insight: "Kalimantan paling rendah (32) — terkait keterlambatan pengiriman.",
      labels: ["Jawa", "Bali-Nusra", "Sumatera", "Sulawesi", "Kalimantan"],
      values: [56, 51, 46, 41, 32],
      highlight: 4,
      unit: "skor",
    },
    table: {
      title: "Segmen pelanggan",
      columns: ["Segmen", "Pelanggan", "Churn", "NPS", "CLV"],
      rows: [
        ["Enterprise", "1.240", "0,8%", "62", "Rp 184 jt"],
        ["Mid-market", "8.460", "1,6%", "51", "Rp 42 jt"],
        ["Ritel", "64.200", "2,4%", "46", "Rp 8,4 jt"],
        ["UMKM", "54.550", "2,9%", "39", "Rp 3,1 jt"],
      ],
    },
    annotations: [
      { label: "Apr", note: "Program loyalitas baru" },
      { label: "Okt", note: "Gangguan layanan" },
    ],
  },
  {
    slug: "sdm",
    name: "SDM",
    tagline: "Headcount, produktivitas, dan biaya SDM",
    icon: "userMinus",
    accent: "amber",
    questions: [
      "Unit mana yang attrition-nya tertinggi?",
      "Berapa produktivitas per FTE?",
      "Bagaimana biaya SDM terhadap pendapatan?",
      "Posisi kritis mana yang belum terisi?",
    ],
    kpis: [
      { label: "Headcount", value: "8.420", delta: "+2,1%", rag: "green" },
      { label: "Attrition", value: "7,8%", delta: "+1,1 pp", rag: "amber" },
      { label: "Time-to-Hire", value: "38 hari", delta: "−4 hari", rag: "green" },
      { label: "Biaya SDM / Pendapatan", value: "18,4%", delta: "+0,6 pp", rag: "amber" },
    ],
    trend: {
      title: "Attrition per unit bisnis",
      insight: "Unit Logistik 12,4% — 2,4 poin di atas ambang kebijakan.",
      labels: months,
      unit: "%",
      series: [
        { name: "Logistik", color: "#ef4444", values: [8.1, 8.4, 8.8, 9.2, 9.6, 10.1, 10.4, 10.8, 11.2, 11.6, 12, 12.4] },
        { name: "Ritel", color: "#f0a020", values: [7.2, 7.4, 7.6, 7.8, 8, 8.2, 8.4, 8.6, 8.8, 8.9, 9, 9.1] },
        { name: "Grup", color: "#22b892", values: [6.1, 6.2, 6.4, 6.3, 6.6, 6.8, 6.9, 7.1, 7.2, 7.4, 7.6, 7.8] },
      ],
    },
    breakdown: {
      title: "Komposisi biaya SDM",
      insight: "Gaji tetap mendominasi 68% biaya SDM.",
      items: [
        { label: "Gaji tetap", value: "68%", pct: 68, accent: "brand" },
        { label: "Insentif & bonus", value: "14%", pct: 14, accent: "violet" },
        { label: "Lembur", value: "11%", pct: 11, accent: "amber" },
        { label: "Pelatihan", value: "7%", pct: 7, accent: "mint" },
      ],
    },
    bars: {
      title: "Produktivitas per FTE (Rp juta)",
      insight: "Divisi Digital paling produktif; Logistik perlu otomasi.",
      labels: ["Digital", "Keuangan", "Penjualan", "Manufaktur", "Logistik"],
      values: [842, 620, 584, 512, 386],
      highlight: 4,
      unit: "Rp juta",
    },
    table: {
      title: "Posisi kritis",
      columns: ["Posisi", "Unit", "Hari terbuka", "Kandidat", "Status"],
      rows: [
        ["Head of Fleet", "Logistik", "62", "2", "Kritis"],
        ["Plant Manager", "Manufaktur", "48", "3", "Perhatian"],
        ["Data Engineer", "TI", "34", "5", "Perhatian"],
        ["Finance Business Partner", "Keuangan", "21", "4", "Aman"],
      ],
    },
    annotations: [
      { label: "Mar", note: "Penyesuaian UMP" },
      { label: "Jul", note: "Program retensi" },
    ],
  },
  {
    slug: "risiko",
    name: "Risiko & Kepatuhan",
    tagline: "Insiden, temuan audit, dan kepatuhan",
    icon: "shield",
    accent: "rose",
    questions: [
      "Berapa temuan audit yang masih terbuka?",
      "Di mana risiko kepatuhan tertinggi?",
      "Apakah ada insiden keamanan informasi bulan ini?",
      "Bagaimana status remediasi risiko kritis?",
    ],
    kpis: [
      { label: "Insiden Material", value: "2", delta: "−1", rag: "green" },
      { label: "Temuan Audit Terbuka", value: "14", delta: "−3", rag: "amber" },
      { label: "Kepatuhan Regulasi", value: "96,4%", delta: "+1,2 pp", rag: "green" },
      { label: "Insiden Keamanan", value: "0", delta: "0", rag: "green" },
    ],
    trend: {
      title: "Temuan audit terbuka per kategori",
      insight: "Temuan proses operasional turun 3, tetapi TI masih 6 terbuka.",
      labels: months,
      unit: "temuan",
      series: [
        { name: "TI", color: "#8b5cf6", values: [9, 9, 8, 8, 7, 7, 7, 6, 6, 6, 6, 6] },
        { name: "Operasional", color: "#f97316", values: [8, 8, 7, 7, 6, 6, 5, 5, 5, 4, 4, 4] },
        { name: "Keuangan", color: "#22b892", values: [5, 5, 4, 4, 4, 3, 3, 3, 3, 3, 3, 4] },
      ],
    },
    breakdown: {
      title: "Peta risiko per kategori",
      insight: "Risiko siber dan rantai pasok berada di kuadran tinggi.",
      items: [
        { label: "Siber & data", value: "Tinggi", pct: 82, accent: "rose" },
        { label: "Rantai pasok", value: "Tinggi", pct: 74, accent: "amber" },
        { label: "Kepatuhan", value: "Sedang", pct: 48, accent: "violet" },
        { label: "Keuangan", value: "Rendah", pct: 26, accent: "mint" },
      ],
    },
    bars: {
      title: "Kepatuhan per regulasi (%)",
      insight: "Kepatuhan UU PDP 92% — dua kontrol masih dalam proses.",
      labels: ["UU PDP", "OJK", "Ketenagakerjaan", "Pajak", "Lingkungan"],
      values: [92, 97, 99, 98, 96],
      highlight: 0,
      unit: "%",
    },
    table: {
      title: "Temuan prioritas",
      columns: ["Temuan", "Kategori", "Pemilik", "Tenggat", "Status"],
      rows: [
        ["Kontrol akses basis data", "TI", "CISO", "12 Des 2026", "Terbuka"],
        ["Rekonsiliasi pajak cabang", "Keuangan", "Tax Manager", "20 Des 2026", "Terbuka"],
        ["Uji DR rantai pasok", "Operasional", "COO", "05 Jan 2027", "Dalam proses"],
        ["Pelatihan UU PDP", "Kepatuhan", "Legal", "15 Des 2026", "Selesai"],
      ],
    },
    annotations: [{ label: "Jun", note: "Audit internal" }],
  },
  {
    slug: "strategi",
    name: "Portofolio Strategis",
    tagline: "Inisiatif, manfaat, dan progres OKR",
    icon: "target",
    accent: "violet",
    questions: [
      "Inisiatif strategis mana yang berisiko terlambat?",
      "Berapa realisasi manfaat YTD?",
      "Bagaimana progres OKR perusahaan?",
      "Proyek mana yang perlu keputusan direksi?",
    ],
    kpis: [
      { label: "Inisiatif Aktif", value: "24", delta: "+2", rag: "green" },
      { label: "On Track", value: "71%", delta: "−4 pp", rag: "amber" },
      { label: "Realisasi Manfaat", value: "Rp 412 M", delta: "+18%", rag: "green" },
      { label: "Progres OKR", value: "68%", delta: "+6 pp", rag: "amber" },
    ],
    trend: {
      title: "Progres OKR perusahaan",
      insight: "OKR 3 (Efisiensi operasi) tertinggal di 48% menjelang akhir kuartal.",
      labels: ["O1", "O2", "O3", "O4", "O5"],
      unit: "%",
      series: [
        { name: "Progres", color: "#8b5cf6", values: [82, 74, 48, 71, 65] },
        { name: "Target", color: "#f97316", values: [80, 80, 80, 80, 80] },
      ],
    },
    breakdown: {
      title: "Status inisiatif strategis",
      insight: "4 inisiatif merah, seluruhnya terkait rantai pasok.",
      items: [
        { label: "Hijau (on track)", value: "17", pct: 71, accent: "mint" },
        { label: "Kuning (perhatian)", value: "3", pct: 12, accent: "amber" },
        { label: "Merah (berisiko)", value: "4", pct: 17, accent: "rose" },
      ],
    },
    bars: {
      title: "Realisasi manfaat per inisiatif (Rp miliar)",
      insight: "Otomasi gudang memberi manfaat terbesar tahun ini.",
      labels: ["Otomasi gudang", "Digital sales", "Efisiensi energi", "Konsolidasi ERP", "Ekspansi ritel"],
      values: [142, 108, 74, 56, 32],
      highlight: 0,
      unit: "Rp miliar",
    },
    table: {
      title: "Inisiatif berisiko",
      columns: ["Inisiatif", "Pemilik", "Progres", "Tenggat", "Status"],
      rows: [
        ["Konsolidasi ERP", "CFO", "54%", "Q1 2027", "Merah"],
        ["Ekspansi ritel Kalimantan", "COO", "61%", "Q4 2026", "Merah"],
        ["Otomasi gudang Cikarang", "COO", "88%", "Des 2026", "Kuning"],
        ["Digital sales platform", "CRO", "76%", "Feb 2027", "Hijau"],
      ],
    },
    annotations: [{ label: "Q2", note: "Revisi portofolio" }],
  },
];

export const domainBySlug = (slug: string) => domains.find((d) => d.slug === slug);

export type ActionItem = {
  id: string;
  title: string;
  kpi: string;
  owner: string;
  due: string;
  status: "terbuka" | "dikerjakan" | "selesai" | "terlambat";
  priority: "tinggi" | "sedang" | "rendah";
  source: string;
};

export const actionItems: ActionItem[] = [
  {
    id: "ACT-118",
    title: "Review kontrak pemasok bahan baku PT Sinar Baja",
    kpi: "Margin Kotor",
    owner: "Kepala Pengadaan",
    due: "Hari ini",
    status: "terlambat",
    priority: "tinggi",
    source: "Peringatan ALR-2481",
  },
  {
    id: "ACT-121",
    title: "Susun rencana penagihan 12 pelanggan enterprise Kalimantan",
    kpi: "DSO",
    owner: "Treasury Manager",
    due: "25 Nov 2026",
    status: "dikerjakan",
    priority: "tinggi",
    source: "Peringatan ALR-2479",
  },
  {
    id: "ACT-124",
    title: "Program retensi teknisi Logistik (30 hari)",
    kpi: "Attrition",
    owner: "CHRO",
    due: "05 Des 2026",
    status: "terbuka",
    priority: "sedang",
    source: "Analisis SDM",
  },
  {
    id: "ACT-126",
    title: "Validasi ulang asumsi forecast Q1 2027",
    kpi: "Pendapatan YTD",
    owner: "Head of FP&A",
    due: "12 Des 2026",
    status: "dikerjakan",
    priority: "sedang",
    source: "Board pack Q4",
  },
  {
    id: "ACT-119",
    title: "Tutup temuan audit kontrol akses basis data",
    kpi: "Temuan Audit",
    owner: "CISO",
    due: "12 Des 2026",
    status: "terbuka",
    priority: "tinggi",
    source: "Risiko & Kepatuhan",
  },
  {
    id: "ACT-112",
    title: "Optimasi kampanye berbayar digital (ROAS 3,1x)",
    kpi: "ROAS",
    owner: "CMO",
    due: "28 Nov 2026",
    status: "selesai",
    priority: "rendah",
    source: "Pemasaran",
  },
];

export type Decision = {
  id: string;
  title: string;
  date: string;
  owner: string;
  rationale: string;
  impact: string;
  kpi: string;
  status: "diputuskan" | "dipantau" | "ditinjau";
};

export const decisions: Decision[] = [
  {
    id: "DEC-042",
    title: "Menunda kenaikan harga ritel hingga Q1 2027",
    date: "18 Nov 2026",
    owner: "CEO — Ardi Kusuma",
    rationale: "Menjaga volume di tengah pelemahan daya beli; margin dikompensasi efisiensi logistik.",
    impact: "Margin kotor −0,4 pp, volume +2,1%",
    kpi: "Margin Kotor",
    status: "dipantau",
  },
  {
    id: "DEC-041",
    title: "Renegosiasi kontrak dua pemasok bahan baku",
    date: "14 Nov 2026",
    owner: "CFO — Rani Prameswari",
    rationale: "Kenaikan harga 8,4% tidak sejalan dengan klausul indeks harga di kontrak.",
    impact: "Potensi pemulihan margin +1,1 pp",
    kpi: "Margin Kotor",
    status: "diputuskan",
  },
  {
    id: "DEC-039",
    title: "Percepat otomasi gudang Cikarang",
    date: "02 Nov 2026",
    owner: "COO — Bayu Nugroho",
    rationale: "Utilisasi 92% dan OTD Indonesia Timur 88,6% membutuhkan kapasitas tambahan.",
    impact: "CAPEX Rp 84 M, OTD +2,4 pp",
    kpi: "On-Time Delivery",
    status: "dipantau",
  },
  {
    id: "DEC-036",
    title: "Setujui skenario optimis untuk anggaran 2027",
    date: "21 Okt 2026",
    owner: "Direksi",
    rationale: "Pipeline enterprise dan ekspansi wilayah mendukung pertumbuhan 14%.",
    impact: "Target pendapatan 2027 Rp 6,4 T",
    kpi: "Pendapatan YTD",
    status: "ditinjau",
  },
];

export const boardPackSections = [
  { id: "s1", title: "Ringkasan Eksekutif", type: "Narasi AI", status: "Siap", pages: 2 },
  { id: "s2", title: "Kinerja Keuangan Konsolidasi", type: "Grafik + tabel", status: "Siap", pages: 4 },
  { id: "s3", title: "Pendapatan per Segmen & Wilayah", type: "Grafik", status: "Siap", pages: 3 },
  { id: "s4", title: "Operasi & Rantai Pasok", type: "Grafik + tabel", status: "Perlu review", pages: 3 },
  { id: "s5", title: "Risiko & Kepatuhan", type: "Heatmap", status: "Siap", pages: 2 },
  { id: "s6", title: "Inisiatif Strategis", type: "Tabel RAG", status: "Draf", pages: 2 },
  { id: "s7", title: "Keputusan yang Diminta", type: "Narasi", status: "Draf", pages: 1 },
];

export const approvalFlow = [
  { name: "Chief of Staff", role: "Penyusun", status: "selesai", time: "20 Nov · 16:20" },
  { name: "Rani Prameswari", role: "CFO — Review angka", status: "aktif", time: "Menunggu" },
  { name: "Ardi Kusuma", role: "CEO — Persetujuan akhir", status: "menunggu", time: "—" },
];

export const reports = [
  {
    id: "RPT-01",
    name: "Briefing Pagi Eksekutif",
    schedule: "Harian · 07:00 WIB",
    audience: "CEO, CFO, COO, CRO, CHRO",
    channel: "Email + Push",
    status: "Aktif",
    last: "Hari ini · 07:00",
  },
  {
    id: "RPT-02",
    name: "Business Review Bulanan",
    schedule: "Tanggal 3 · 09:00 WIB",
    audience: "Direksi & kepala divisi",
    channel: "Email + Secure portal",
    status: "Aktif",
    last: "03 Nov 2026",
  },
  {
    id: "RPT-03",
    name: "Board Pack Kuartalan",
    schedule: "Kuartalan · H-5 rapat",
    audience: "Direksi & Komisaris",
    channel: "Secure portal",
    status: "Aktif",
    last: "28 Okt 2026",
  },
  {
    id: "RPT-04",
    name: "Digest Risiko & Kepatuhan",
    schedule: "Mingguan · Senin 08:00",
    audience: "Komite Audit",
    channel: "Email",
    status: "Dijeda",
    last: "11 Nov 2026",
  },
];

export const adminUsers = [
  { name: "Ardi Kusuma", email: "ardi.kusuma@nusantara.co.id", role: "CEO", unit: "Kantor Pusat", status: "Aktif", last: "Hari ini · 06:58" },
  { name: "Rani Prameswari", email: "rani.p@nusantara.co.id", role: "CFO", unit: "Keuangan", status: "Aktif", last: "Hari ini · 07:12" },
  { name: "Bayu Nugroho", email: "bayu.n@nusantara.co.id", role: "COO", unit: "Operasi", status: "Aktif", last: "Kemarin · 18:40" },
  { name: "Dimas Anggara", email: "dimas.a@nusantara.co.id", role: "CRO", unit: "Penjualan", status: "Aktif", last: "Hari ini · 05:20" },
  { name: "Sari Wulandari", email: "sari.w@nusantara.co.id", role: "CHRO", unit: "SDM", status: "Aktif", last: "2 hari lalu" },
  { name: "Nadia Putri", email: "nadia.p@nusantara.co.id", role: "Delegate", unit: "Chief of Staff", status: "Aktif", last: "Hari ini · 07:05" },
  { name: "Hendra Wijaya", email: "hendra.w@nusantara.co.id", role: "Komisaris", unit: "Dewan Komisaris", status: "Akses terbatas", last: "12 Nov 2026" },
  { name: "Timotius Halim", email: "timotius.h@nusantara.co.id", role: "Data Steward", unit: "Data & BI", status: "Aktif", last: "Hari ini · 06:10" },
];

export const roles = [
  { name: "CEO", members: 1, scope: "Semua entitas & domain", rls: "Tanpa batas", export: "PDF, PPTX" },
  { name: "CFO", members: 3, scope: "Keuangan, seluruh entitas", rls: "Semua wilayah", export: "PDF, PPTX, XLSX" },
  { name: "COO", members: 4, scope: "Operasi & rantai pasok", rls: "3 dari 5 wilayah", export: "PDF" },
  { name: "Delegate", members: 6, scope: "Sesuai eksekutif yang didelegasikan", rls: "Mewarisi", export: "PDF" },
  { name: "Komisaris", members: 5, scope: "Board pack & ringkasan", rls: "Agregat", export: "Tidak diizinkan" },
];

export const connectors = [
  { name: "SAP ERP", type: "ERP", mode: "Extract terjadwal", freshness: "H+1 · 06:40", status: "Sehat", records: "18,4 jt" },
  { name: "Salesforce CRM", type: "CRM", mode: "Live query", freshness: "Per jam", status: "Sehat", records: "2,1 jt" },
  { name: "Workday HRIS", type: "HRIS", mode: "Extract terjadwal", freshness: "Harian", status: "Sehat", records: "842 rb" },
  { name: "Snowflake DW", type: "Warehouse", mode: "Live query", freshness: "15 menit", status: "Sehat", records: "1,2 M" },
  { name: "Google Analytics 4", type: "Marketing", mode: "Extract terjadwal", freshness: "Harian", status: "Terlambat", records: "4,8 jt" },
  { name: "Mekari Jurnal", type: "Akuntansi", mode: "Extract terjadwal", freshness: "Harian", status: "Sehat", records: "1,4 jt" },
  { name: "Google Sheets", type: "Spreadsheet", mode: "Extract terjadwal", freshness: "Harian", status: "Perlu validasi", records: "12 rb" },
  { name: "REST API internal", type: "Custom", mode: "Webhook", freshness: "Real-time", status: "Sehat", records: "—" },
];

export const auditLog = [
  { time: "Hari ini · 07:12", user: "Rani Prameswari", action: "Membuka dashboard Keuangan", object: "Dashboard · Keuangan", ip: "10.24.8.12", result: "Diizinkan" },
  { time: "Hari ini · 07:05", user: "Nadia Putri", action: "Mengekspor board pack (draf)", object: "Board Pack Q4 2026", ip: "10.24.9.31", result: "Diizinkan" },
  { time: "Hari ini · 06:58", user: "Ardi Kusuma", action: "Melihat detail KPI Margin Kotor", object: "KPI · margin-kotor", ip: "10.24.2.4", result: "Diizinkan" },
  { time: "Hari ini · 06:44", user: "Hendra Wijaya", action: "Mencoba ekspor data transaksi", object: "Dataset · fact_sales", ip: "103.28.14.9", result: "Diblokir DLP" },
  { time: "Hari ini · 06:20", user: "Timotius Halim", action: "Memperbarui definisi KPI", object: "KPI · margin-kotor v1.3", ip: "10.24.6.77", result: "Diizinkan" },
  { time: "Kemarin · 22:10", user: "Sistem", action: "Rotasi kunci enkripsi", object: "KMS · analytics-prod", ip: "internal", result: "Berhasil" },
];

export const usageStats = [
  { label: "Pengguna aktif mingguan", value: "84%", sub: "EWAR · target ≥ 70%", accent: "mint" as Accent },
  { label: "Time-to-insight median", value: "42 dtk", sub: "target < 60 dtk", accent: "brand" as Accent },
  { label: "Sesi Tanya Data", value: "1.284", sub: "30 hari terakhir", accent: "violet" as Accent },
  { label: "Biaya komputasi / pengguna", value: "Rp 18,4 rb", sub: "anggaran Rp 25 rb", accent: "sky" as Accent },
];

export const askSuggestions = [
  "Berapa pertumbuhan pendapatan segmen enterprise kuartal ini dibanding kuartal lalu, per wilayah?",
  "Mengapa margin kotor turun bulan ini?",
  "Cabang mana yang paling sering terlambat mengirim?",
  "Bagaimana proyeksi arus kas 3 bulan ke depan?",
  "Unit mana yang attrition-nya tertinggi?",
];

export const askAnswer = {
  question: "Berapa pertumbuhan pendapatan segmen enterprise kuartal ini dibanding kuartal lalu, per wilayah?",
  headline: "Pendapatan enterprise tumbuh 8,4% QoQ, dipimpin Jawa (+11,2%) sementara Kalimantan turun 2,1%.",
  value: "Rp 1,92 T",
  delta: "+8,4% QoQ",
  chart: {
    labels: ["Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali-Nusra"],
    values: [11.2, 7.4, -2.1, 6.8, 9.1],
  },
  basis: {
    metric: "Pendapatan Enterprise (bersertifikat v2.1)",
    filters: "Segmen = Enterprise · Periode = Q3 2026 vs Q2 2026 · Entitas = Konsolidasi",
    source: "Snowflake DW · fact_revenue, dim_customer, dim_region",
    freshness: "H+1 · 06:40 WIB",
    rows: "1.284.920 baris dipindai · 0,8 dtk",
  },
  followUps: [
    "Apa penyebab terbesarnya di Kalimantan?",
    "Tampilkan tren 8 kuartal terakhir",
    "Siapa 5 pelanggan enterprise terbesar di Jawa?",
  ],
};

export const presentationSlides = [
  {
    kicker: "Business Review Q4 2026",
    title: "Kinerja grup tumbuh 12,4%, margin menjadi prioritas",
    body: "Pendapatan YTD Rp 4,82 T (+12,4% YoY). Margin kotor turun 2,3 poin akibat biaya bahan baku — rencana pemulihan sudah berjalan.",
    stats: [
      { label: "Pendapatan", value: "Rp 4,82 T", delta: "+12,4%" },
      { label: "EBITDA", value: "Rp 1,12 T", delta: "+6,1%" },
      { label: "Margin Kotor", value: "38,6%", delta: "−2,3 pp" },
    ],
  },
  {
    kicker: "Keuangan",
    title: "Pendapatan mengikuti target, margin tertinggal 2,3 poin",
    body: "Realisasi 94,5% dari target YTD. Dua pemasok bahan baku menyumbang 61% tekanan margin; renegosiasi kontrak ditargetkan selesai Desember.",
    stats: [
      { label: "Realisasi target", value: "94,5%", delta: "−5,5 pp" },
      { label: "Arus kas ops.", value: "Rp 684 M", delta: "+9,8%" },
      { label: "Runway kas", value: "14,2 bln", delta: "+0,6" },
    ],
  },
  {
    kicker: "Operasi",
    title: "Layanan membaik, Indonesia Timur masih di bawah standar",
    body: "OTD nasional 94,2% (+1,4 pp). Balikpapan dan Makassar menjadi fokus perbaikan dengan penambahan armada pada Desember.",
    stats: [
      { label: "OTD", value: "94,2%", delta: "+1,4 pp" },
      { label: "OEE", value: "78,6%", delta: "−1,1 pp" },
      { label: "Utilisasi", value: "92%", delta: "+4 pp" },
    ],
  },
  {
    kicker: "Keputusan yang diminta",
    title: "Setujui renegosiasi pemasok dan percepatan otomasi gudang",
    body: "Dua keputusan membutuhkan persetujuan direksi: renegosiasi kontrak pemasok (potensi +1,1 pp margin) dan CAPEX otomasi gudang Rp 84 M.",
    stats: [
      { label: "Dampak margin", value: "+1,1 pp", delta: "potensi" },
      { label: "CAPEX", value: "Rp 84 M", delta: "2027" },
      { label: "Payback", value: "2,4 thn", delta: "estimasi" },
    ],
  },
];

export const narrative = {
  headline: "Margin kotor menurun 2,3 poin, pendapatan tetap tumbuh dua digit",
  body: "Sejak kunjungan terakhir Anda, pendapatan YTD naik Rp 21 M menjadi Rp 4,82 T (+12,4% YoY), tetapi margin kotor turun ke 38,6% karena kenaikan harga bahan baku dari PT Sinar Baja dan PT Logam Jaya. Pipeline coverage melemah ke 3,4x dan attrition unit Logistik mencapai 12,4%. Tiga item membutuhkan keputusan Anda minggu ini.",
  updated: "Diperbarui 07:00 WIB · 22 Nov 2026",
};
