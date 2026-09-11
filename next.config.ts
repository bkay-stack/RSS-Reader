import type { NextConfig } from "next";

/**
 * Security headers, sent with every response.
 *
 *   Content-Security-Policy   Which sources the browser may load scripts,
 *                             styles, images and connections from. Blocks
 *                             injected third-party scripts, <object> embeds
 *                             and <base> tag hijacks.
 *   X-Frame-Options           Stops other sites from putting this app in an
 *                             iframe (clickjacking). frame-ancestors in the
 *                             CSP does the same for modern browsers.
 *   X-Content-Type-Options    Stops browsers from guessing file types.
 *   Referrer-Policy           Other sites only see our origin, not full URLs.
 *   Permissions-Policy        Turns off camera, microphone and location.
 *   Strict-Transport-Security Browsers use HTTPS only (ignored on http://localhost).
 *
 * CSP notes
 *   - 'unsafe-inline' for scripts is needed because Next.js injects inline
 *     scripts. Moving to per-request nonces would remove it.
 *   - 'unsafe-eval' and ws: are only added in development (React Fast Refresh).
 *   - connect-src allows the Supabase project, which the browser talks to for
 *     sign-in/sign-up (https) and realtime (wss).
 *   - Fonts come from next/font, which self-hosts them, so 'self' is enough.
 */

const isDev = process.env.NODE_ENV === "development";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseRealtime = supabaseUrl.replace(/^http/, "ws");

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${supabaseUrl} ${supabaseRealtime}${isDev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Don't advertise the framework in an `X-Powered-By: Next.js` header.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
