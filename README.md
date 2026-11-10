# Payfuture Cross-border Payouts: developer docs

Merchant-facing docs for Payfuture Cross-border Payouts: fund in USDT, USD or EUR, pay out INR in India.
Build-free static site: open `index.html` or serve the folder; no build step.

## Tabs
Integration guide · Corridors · API reference · Hash playground · About Payfuture ↗ (opens payfuture.net)

## Files
- `index.html`: header, tabs, script order
- `app.js`: router (guide/api sections with their own menus, full-width tool pages, redirects for old links), helpers, SHA-256 and HMAC (pure JS, works on file://)
- `guide.js`: home page and Integration guide
- `pages.js`: API reference navigation, Overview and Before you start; every other API page is rendered from the live docs
- `apiref.js`: renders the imported live docs (same engine as the Gateway docs), signing page with calculators, error codes
- `api-data.js`: generated from document.payfuture.net by `sh tools/refresh.sh` (needs Chrome). Do not edit by hand
- `corridors.js`: Corridors tab (India live; Pakistan coming soon)
- `playground.js`: Hash playground (body hash, HMAC header, hash detective, code snippets)
- `search.js`: site search (header button, Ctrl/⌘K, "/")
- `motion.js`: subtle animations (off under reduced motion)
- `styles.css` (shared with the Gateway docs) + `enterprise.css` (this site's components)

## Content rules
- The API reference mirrors document.payfuture.net exactly (re-import after every change to the live docs). Sources for the guide: document.payfuture.net, Confluence "Enterprise - Live Payment Methods Summary" (live scope, limits), product offering page (funding currencies).
- Only live, confirmed facts. India payouts are live; Pakistan is shown only as "coming soon"; the Corridors tab marks the other documented methods as "ask your contact".
- No internal names in anything visible (Enterprise, IGE, CBS, Legacy), no provider names, no secrets or funding details.

## Before every commit
Run `python3 tools/stamp.py`. It adds `?v=<hash>` to every CSS/JS link in index.html so browsers never mix a new page with cached old files. `python3 tools/stamp.py --check` fails if a stamp is stale.
