# SimpleStock — Full Package

## Deploy layout (any static host: Netlify, Vercel, Cloudflare Pages, Nginx)

```
/                  → index.html        (landing page)
/app/              → app/index.html    (the app)
/manifest.webmanifest
/sw.js             (MUST be served from root for full-site scope)
/offline.html
/favicon.svg
/icon-192.png
/icon-512.png
/og-image.png
/privacy.html
/terms.html
/robots.txt
/sitemap.xml
```

## What changed vs your original index.html

**Phase 1 — Quick wins**
- Added meta description, favicon, Open Graph + Twitter Card tags, noscript fallback
- Pricing updated to GH₵20/month with new GH₵5/week option
- Plan card, upgrade sheet (with weekly/monthly toggle), and WhatsApp message all reflect new pricing

**Phase 2 — Landing page**
- Full marketing page at `/` with hero, problem/solution, 4 features, 3-step how-it-works, pricing table with weekly/monthly toggle, 3 testimonials, 8-question FAQ, final CTA, footer with WhatsApp + legal links
- JSON-LD structured data (SoftwareApplication + FAQPage) for SEO
- Targeted Ghana-market keywords

**Phase 3 — PWA**
- Real `/manifest.webmanifest` (was inline data-URI before)
- Real service worker (`sw.js`) caching app shell + offline fallback
- Dedicated `/offline.html` page (no more browser error screen)
- Auto-shows Android install banner 5 seconds after first load

**Phase 4 — Missing features**
- Sort dropdown: Newest, Name A–Z, Qty low→high, Last updated
- CSV export button (one tap → downloads all products as CSV)
- Per-product min-stock alert (already existed — kept)
- Category autocomplete via `<datalist>` (suggests existing categories)
- Pull-to-refresh on the dashboard

**Phase 5 — Polish**
- Terms of Service + Privacy Policy one-pagers, linked from footer
- See "Supabase RLS audit checklist" below

## Supabase RLS audit checklist (do this in your Supabase SQL editor)

1. **products**
   ```sql
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   CREATE POLICY products_owner ON products FOR ALL TO authenticated
     USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
   ```
2. **stock_movements** — same pattern
   ```sql
   ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
   CREATE POLICY sm_owner ON stock_movements FOR ALL TO authenticated
     USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
   ```
3. **profiles**
   ```sql
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   CREATE POLICY profiles_self ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
   CREATE POLICY profiles_update ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
   CREATE POLICY profiles_insert ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
   ```
4. Sign up a second test account and confirm no rows leak across users.
5. Confirm the anon key embedded in the HTML is the **publishable anon** key (it is — JWT role = `anon`).

## Notes

- WhatsApp number is `233531344454` (used everywhere)
- Pro pricing: GH₵5/week or GH₵20/month
- Free limit: 10 products
