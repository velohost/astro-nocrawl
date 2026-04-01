# astro-nocrawl

**Block search engine crawling on non-production Astro sites**

`astro-nocrawl` is a tiny, static-first Astro integration that prevents search engines from crawling staging, preview, or internal environments by generating a restrictive `robots.txt` file at build time.

Compatible with Astro v4, v5, and v6.

No runtime code.  
No HTML mutation.  
No adapters.  

---

## Why this exists

It’s very easy to accidentally:

- deploy a staging site publicly
- expose preview builds
- let Google crawl test environments
- leak internal documentation URLs

Once crawled, URLs can persist in search engines for months.

`astro-nocrawl` solves this **once, safely, and automatically**.

---

## What it does (v1)

On `astro build`, the plugin:

- checks the configured `site` hostname
- compares it against an allowlist
- writes a blocking `robots.txt` **only if the host is not allowed**

Generated file:

```
/robots.txt
```

Contents:

```
User-agent: *
Disallow: /
```

---

## What it does NOT do

This plugin deliberately does **not**:

- run at runtime
- mutate HTML files
- inject meta tags
- depend on adapters
- read environment variables
- expose secrets
- guess environments

It operates **purely at build time**.

---

## Installation

```bash
npm install astro-nocrawl
```

Or via Astro:

```bash
npx astro add astro-nocrawl
```

---

## Basic usage

```ts
import { defineConfig } from "astro/config";
import astroNoCrawl from "astro-nocrawl";

export default defineConfig({
  site: "https://staging.example.com",
  integrations: [
    astroNoCrawl({
      allow: ["example.com"]
    })
  ]
});
```

### Result

- `example.com` → crawling allowed
- `staging.example.com` → crawling blocked
- `robots.txt` written automatically

---

## Configuration options

### `enabled`

Enable or disable the plugin entirely.

```ts
astroNoCrawl({
  enabled: false
})
```

Default: `true`

---

### `allow`

List of **exact hostnames** that are allowed to be crawled.

```ts
astroNoCrawl({
  allow: ["example.com", "velohost.co.uk"]
})
```

Rules:
- exact hostname matching only
- subdomains are **not** implicitly allowed
- safest default for staging environments

---

## Behaviour summary

| Site hostname | allow list | robots.txt |
|--------------|------------|------------|
| example.com | ["example.com"] | ❌ |
| staging.example.com | ["example.com"] | ✅ |
| preview.site.dev | [] | ✅ |
| site missing | any | ✅ |

---

## CDN & caching

Because `robots.txt` is static:

- safe to cache
- works behind any CDN
- compatible with Cloudflare, Netlify, Vercel, S3

---

## Failure behaviour

If the file cannot be written:

- a warning is logged
- the build continues
- the site is not broken

This plugin must never break a deployment.

---

## License

MIT

---

## Author

Built and maintained by **Velohost**  
https://velohost.co.uk/

Project homepage:  
https://velohost.co.uk/plugins/astro-nocrawl/
