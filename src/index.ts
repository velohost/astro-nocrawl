import type { AstroIntegration } from "astro";
import fs from "node:fs";
import path from "node:path";

type NoCrawlOptions = {
  /**
   * Enable or disable the plugin.
   * Default: true
   */
  enabled?: boolean;

  /**
   * Hostnames that ARE allowed to be crawled.
   * All other hosts will receive a blocking robots.txt.
   *
   * Example:
   * allow: ["example.com", "velohost.co.uk"]
   */
  allow?: string[];
};

/**
 * astro-nocrawl
 *
 * Prevents search engines from crawling non-production Astro sites
 * by generating a restrictive robots.txt at build time.
 */
export default function astroNoCrawl(
  options: NoCrawlOptions = {}
): AstroIntegration {
  const {
    enabled = true,
    allow = []
  } = options;

  let shouldBlock = false;

  return {
    name: "astro-nocrawl",

    hooks: {
      /**
       * Decide once whether crawling should be blocked.
       */
      "astro:config:setup"({ config }) {
        if (!enabled) return;

        const site = config.site;

        // No site URL configured → safest behaviour is to block crawling
        if (typeof site !== "string") {
          shouldBlock = true;
          return;
        }

        try {
          const hostname = new URL(site).hostname;

          // Exact hostname matching only (no implicit subdomains)
          const isAllowed = allow.includes(hostname);

          shouldBlock = !isAllowed;
        } catch {
          // Invalid site URL → block crawling
          shouldBlock = true;
        }
      },

      /**
       * Write robots.txt after build completes.
       */
      "astro:build:done"({ dir }) {
        if (!enabled || !shouldBlock) return;

        const outDir = new URL(dir).pathname;
        if (!outDir || !fs.existsSync(outDir)) return;

        const robotsPath = path.join(outDir, "robots.txt");

        const contents = `User-agent: *
Disallow: /
`;

        try {
          fs.writeFileSync(robotsPath, contents, {
            encoding: "utf-8",
            flag: "w"
          });

          console.log("[astro-nocrawl] wrote blocking robots.txt");
        } catch (err) {
          console.error("[astro-nocrawl] failed to write robots.txt", err);
        }
      }
    }
  };
}