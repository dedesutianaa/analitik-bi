import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ExecInsight — Platform Analitik & BI Eksekutif",
    template: "%s · ExecInsight",
  },
  description:
    "Command center eksekutif untuk memahami kinerja bisnis dalam hitungan detik: KPI terkurasi, drill-down, insight AI, peringatan proaktif, dan board pack otomatis.",
  applicationName: "ExecInsight",
  keywords: ["business intelligence", "analitik eksekutif", "KPI", "board pack", "dashboard"],
  // Internal executive dashboard: keep it out of search indexes.
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5fb" },
    { media: "(prefers-color-scheme: dark)", color: "#101120" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Runs before first paint, immediately after `<meta name="color-scheme">`.
 * It only mirrors the stored override onto the meta tag (and a helper class)
 * so the page never flashes the wrong scheme. The CSS side maps that meta tag
 * back onto `color-scheme`, so no other JS is required for theming.
 */
const colorSchemeScript = `(function(){try{var m=document.querySelector('meta[name="color-scheme"]');var v=localStorage.getItem('color-scheme');if(v!=='light'&&v!=='dark'){v='light dark';}if(m){m.setAttribute('content',v);}var dark=v==='dark'||(v==='light dark'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var c=document.documentElement.classList;c.toggle('dark',dark);c.toggle('light',!dark);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
      </head>
      <body className="antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
