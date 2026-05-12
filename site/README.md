# Remedia — Encyclopedia website

Next.js 14 (App Router) + Tailwind + Framer Motion + d3.
Content is merged from two sources at build time:

1. **Curated markdown** in the repo root (`../01_Indian_Ayurvedic.md` … `../05_Other_Global.md`
   plus appendices) — traditional entries, edit freely.
2. **Extended JSON datasets** in `data/extended/*.json` — machine-generated entries
   with optional `confidence` and `attribution` fields.

## Quick start

```powershell
cd site
npm install
Copy-Item .env.example .env.local   # optional; works in dev without it
npm run dev
```

Open http://localhost:3000 (falls back to `:3001` if busy).

## Routes

**Marketing & library**
- `/` — homepage (hero, feature grid, region strip, preview, pricing).
- `/encyclopedia` — full library, search + region filters.
- `/encyclopedia/[slug]` — remedy detail, with variant-driven hero, taste radar, and confidence meter.
- `/browse` — free preview (balanced across regions).
- `/symptoms` — cross-cultural symptom index.

**Interactive tools**
- `/compass` — taste & energetics radial selector.
- `/body-map` — tap-a-region symptom finder.
- `/compare` — one concern, five traditions side-by-side.
- `/graph` — force-directed herb relationship graph.
- `/recipe` — drag-drop blend builder with interaction warnings.
- `/rituals` + `/rituals/[slug]` — guided rituals with step timers and ambient audio.
- `/seasonal` — hemisphere-aware harvest calendar.
- `/quiz` — three-question recommender.

**Personal / account**
- `/me` — streaks, ritual history, saved recipes (localStorage).
- `/favorites` — saved remedies.
- `/signin` — magic-link auth (Supabase optional).

**Legal**
- `/disclaimer`, `/terms`, `/privacy`, `/affiliate-disclosure`

**API**
- `/api/unlock?tier=full|pdf|starter|none` — dev cookie setter.
- `/api/shopify/webhook` — Shopify `order paid` HMAC-verified webhook.
- `/api/print/[slug]` — print-friendly remedy page.
- `/sitemap.xml`, `/robots.txt` — generated via `app/sitemap.ts` and `app/robots.ts`.

## Architecture

```
site/
├── app/
│   ├── layout.tsx              # theme, nav, footer, metadata
│   ├── page.tsx                # homepage
│   ├── sitemap.ts, robots.ts   # SEO
│   ├── encyclopedia/, browse/, symptoms/
│   ├── compass/, body-map/, compare/, graph/
│   ├── recipe/, rituals/, seasonal/, quiz/
│   ├── me/, favorites/, signin/
│   └── api/
├── components/
│   ├── Nav.tsx, RemedyCard.tsx, Paywall.tsx, PricingTiers.tsx
│   ├── ThemeProvider.tsx, RouteTransition.tsx
│   ├── motion/                 # reusable FadeUp / Stagger primitives
│   ├── home/Hero.tsx
│   ├── compass/, bodymap/, compare/, graph/
│   ├── recipe/, rituals/, seasonal/
│   └── remedy/                 # RemedyHero, TasteRadar, ConfidenceMeter
├── lib/
│   ├── content.ts              # parses ../*.md + data/extended/*.json
│   ├── energetics.ts           # taste + energetic inference
│   ├── bodyMap.ts / bodyMapServer.ts
│   ├── graphData.ts            # builds nodes/edges for /graph
│   ├── seasonal.ts             # harvest calendar data
│   ├── interactions.ts         # herb/drug interaction rules
│   ├── rituals.ts              # curated ritual scripts
│   ├── personal.ts             # localStorage for streaks + saved recipes
│   ├── tier.ts, shopify.ts, jwt.ts, supabase.ts, email.ts, auth.ts
│   └── enrichment.ts           # per-herb metadata (why/who/when/warnings)
├── data/extended/              # ayurveda.json, tcm.json, kampo.json, andean.json, global.json
├── tailwind.config.ts, next.config.mjs, tsconfig.json
└── .env.example
```

## Data model

A `Remedy` has: `slug`, `region`, `name`, `latin?`, `benefit?`, `recipe?`, `sourcing?`,
`extras[]` (cautions), `confidence` (`traditional` | `verified` | `preliminary`), `attribution?`,
`tags?`. Markdown entries default to `traditional`; extended entries earn `verified`
only when they carry an explicit `attribution` citation.

## Environment

All optional in dev; set in production:

```
NEXT_PUBLIC_SITE_URL=https://remedia.app

# Shopify (leave blank to use dev-mode /api/unlock)
NEXT_PUBLIC_SHOPIFY_DOMAIN=yourshop.myshopify.com
NEXT_PUBLIC_SHOPIFY_VARIANT_STARTER=...
NEXT_PUBLIC_SHOPIFY_VARIANT_PDF=...
NEXT_PUBLIC_SHOPIFY_VARIANT_FULL=...
SHOPIFY_WEBHOOK_SECRET=...

# Auth (magic links via Supabase)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...

# Email (optional; for magic links / receipts)
RESEND_API_KEY=...
```

## Simulating a purchase in dev

Visit `/api/unlock?tier=full` — sets an HttpOnly `rem_tier` cookie granting
access. `tier=none` clears it.

## Shopify (production)

1. Create 3 products matching the tiers in `components/PricingTiers.tsx`.
2. Copy each variant ID into `.env.local`.
3. In **Settings → Notifications → Webhooks**, create an `Order paid` webhook to
   `https://yoursite.com/api/shopify/webhook` and put the signing secret in
   `SHOPIFY_WEBHOOK_SECRET`.
4. The webhook verifies HMAC, maps variant → tier, and emails the buyer a
   magic link that hits `/api/unlock?token=JWT(email,tier)`.

## Deploying to Vercel

The `lib/content.ts` loader reads markdown from **the repo root** (`..` relative
to `site/`). On Vercel set the project root to the repo (not `site/`) or copy
the markdown into `site/content/` before build — otherwise `../01_*.md` won't
exist in the deployed bundle.

```powershell
npm i -g vercel
vercel
```

Set env vars in the Vercel dashboard, then `vercel --prod`.

## Safety

The site displays educational content only. `/disclaimer` is linked from every
page footer. Never ship without an up-to-date disclaimer, terms, and privacy
policy; herbal health content carries real liability.

## Content expansion ideas

- **i18n** (Spanish / Hindi / Mandarin / Japanese) — planned; strings are English-only today.
- **Per-herb product pages** with affiliate links.
- **Community-submitted family recipes** (moderated).
- **Practitioner directory**.
- **Weekly newsletter** — 1 remedy per week.
