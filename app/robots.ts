import type { MetadataRoute } from "next";

/**
 * ExecInsight is an internal executive dashboard and is intentionally kept out
 * of search indexes (see `robots` in `app/layout.tsx`). This route keeps the
 * `robots.txt` file consistent with that metadata.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
