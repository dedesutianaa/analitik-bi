/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy.
 *
 * Every route is statically prerendered (`generateStaticParams`), so a
 * nonce-based policy is not viable: Next.js bakes its inline bootstrap scripts
 * into the HTML at build time and a request-time nonce cannot be injected into
 * that markup. Without a nonce, `'unsafe-inline'` is required for the framework
 * bootstrap and for React/Recharts inline styles. Every other directive is
 * locked to the app origin, and the dangerous sinks (`object-src`, `base-uri`,
 * `frame-ancestors`, `form-action`) are denied outright.
 *
 * The dev-only relaxations (Turbopack `eval`, HMR websocket) never ship to
 * production because `NODE_ENV` is fixed at build time.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "manifest-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self'${isDev ? " ws: http://localhost:*" : ""}`,
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Isolate the browsing context: no opener relationship, no foreign subresources.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig = {
  // Do not advertise the framework version.
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
