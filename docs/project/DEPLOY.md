# Deployment — veloracss.io

Canonical public layout (2026-08):

| Surface | URL | Host | Role |
| --- | --- | --- | --- |
| **Showcase** | `https://veloracss.io` | Vercel (primary) | Cinematic reference UI, live catalogs |
| **Docs** | `https://docs.veloracss.io` | Vercel | Astro guides (`apps/docs`) |
| **Examples** | `https://examples.veloracss.io` | Hostinger VPS | WordPress, Tailwind host, static demos |
| **Showcase fallback** | GitHub Pages (`/Velora/`) | GitHub Actions | Backup if Vercel is unavailable |
| **Package** | npm `@velora/css` | npm registry | See [PUBLISH.md](./PUBLISH.md) |

GoDaddy holds **DNS only** for `veloracss.io`. Do not point the apex to Hostinger unless you intentionally move the main product site.

---

## 1. Vercel — Showcase (`veloracss.io`)

### Create project

1. [Vercel](https://vercel.com) → **Add New Project** → import `erikconnect/Velora`.
2. **Root Directory:** `apps/showcase`
3. Vercel reads `apps/showcase/vercel.json` (build + output).
4. **Domains:** add `veloracss.io` and `www.veloracss.io`.
5. Redirect `www` → apex in Vercel domain settings.

### Local parity

```bash
pnpm generate:catalog && pnpm sync:showcase-css && pnpm --filter showcase build
# output: apps/showcase/dist
```

Preview: `pnpm --filter showcase preview`

---

## 2. Vercel — Docs (`docs.veloracss.io`)

### Create project (separate)

1. Second Vercel project, same repo.
2. **Root Directory:** `apps/docs`
3. Uses `apps/docs/vercel.json` and `astro.config.mjs` (`site: https://docs.veloracss.io`).
4. **Domain:** `docs.veloracss.io`

### Local parity

```bash
pnpm generate:catalog && pnpm --filter docs build
pnpm dev:docs   # http://localhost:4321
```

Docs link to the showcase on the apex domain; showcase footer can link back to `https://docs.veloracss.io`.

---

## 3. GoDaddy DNS

After adding domains in each Vercel project, Vercel shows the required records. Typical setup:

| Type | Name | Value | Purpose |
| --- | --- | --- | --- |
| `A` | `@` | `76.76.21.21` | Apex → Vercel (showcase project) |
| `CNAME` | `www` | `cname.vercel-dns.com` | www redirect (Vercel handles → apex) |
| `CNAME` | `docs` | `cname.vercel-dns.com` | Docs project |
| `A` or `CNAME` | `examples` | Hostinger VPS IP / hostname | VPS examples |

Use the **exact** values Vercel displays for your account (IPs can change).

Propagation: minutes to 48h. Verify with `dig veloracss.io` / `dig docs.veloracss.io`.

---

## 4. GitHub Pages (showcase fallback)

Workflow: `.github/workflows/pages.yml` deploys `apps/showcase/dist` to GitHub Pages with base path `/Velora/` (rewrite for project URL).

- **Primary:** do not advertise this URL once Vercel is live.
- **Fallback:** useful if Vercel billing/domain issues occur.
- **Custom domain on Pages:** optional; if enabled, use a subdomain like `fallback.veloracss.io` to avoid conflicting with Vercel apex.

No GitHub Pages workflow exists for `apps/docs` — docs are Vercel-only.

---

## 5. Hostinger VPS — examples (`examples.veloracss.io`)

Use the VPS for integrations that need a real server, not for the main static showcase.

### Recommended contents

| Path on VPS | Source in repo | Notes |
| --- | --- | --- |
| WordPress demo | `examples/wordpress/` | Enqueue `motion-core.css`, Gutenberg pattern |
| Tailwind host | `examples/tailwind-host/` | Static or minimal Node |
| Future PHP/cPanel demos | `examples/` | Host-agnostic proofs |

### DNS

Point `examples.veloracss.io` (GoDaddy) → VPS public IP. Terminate TLS with Let's Encrypt (Certbot) on nginx/Caddy.

### Do not

- Run the canonical showcase build as the only copy on VPS (Vercel CDN is faster and matches CI).
- Serve outdated CSS — sync from `packages/css/dist/` after each release.

---

## 6. Environment checklist before launch

- [ ] Vercel showcase: `veloracss.io` serves home + 12 pages (no `/Velora/` prefix)
- [ ] Vercel docs: `docs.veloracss.io` builds 12 Astro routes
- [ ] `pnpm verify:contract` green on `main`
- [ ] npm publish when ready ([PUBLISH.md](./PUBLISH.md))
- [ ] VPS examples documented with live URL in `examples/README.md`
- [ ] Update honest messaging: npm status, no fake FPS claims

---

## 7. Related docs

- [PUBLISH.md](./PUBLISH.md) — `@velora/css` npm/CDN
- [WORKSPACE.md](./WORKSPACE.md) — monorepo scripts
- [Showcase readiness audit](../audits/showcase-readiness-2026.md)
