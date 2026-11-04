# PayFuture Enterprise Developer Docs

A static, build-free docs site for **PayFuture Enterprise**: one platform, two products.

- **Collections (pay-ins)**: an INR collection account in India, settled in USDT, USD or EUR.
- **Payouts (remittance)**: fund in USDT, USD or EUR and pay out to India and Pakistan through the Enterprise API (`igateway-gwapi.payfuture.net`).

It is kept separate from the Legacy (IG) site in `~/payfuture-merchant-docs`.

## Run it

Open `index.html` in a browser. There is no server and no build step.

## Files

| File | What it holds |
|---|---|
| `index.html` | The page shell and the header tabs: About PayFuture · Enterprise guide · API reference |
| `app.js` | Router, helpers and SHA-256 |
| `about.js` | The company pages (who we are, what we do, markets, industries, the solutions behind Enterprise). Copy and images come from payfuture.net and live in `assets/site/` |
| `guide.js` | The Enterprise guide (Collections, Payouts, funding, corridors, quickstart), plus the home page, product finder, payout simulator, signature playground and go-live checklist |
| `pages.js` | The Enterprise API reference |
| `data.js` | Error codes curated from document.payfuture.net `ErrorCodeList.json` to the 149 an Enterprise call can return |
| `styles.css`, `assets/logo.svg` | Shared PayFuture theme, copied from the Legacy site |
| `enterprise.css` | Enterprise styles: hero, flow diagrams, finder, simulator, playground, checklist |
| `REVIEW.md` | Internal: open questions and sources. **Do not ship to merchants** |

## Rules

- coverage.payfuture.net is the source of truth for products, corridors, funding and limits; document.payfuture.net for the API.
- Show only **Live** features. Nothing in testing or on the roadmap.
- Anything unconfirmed carries a `TO CONFIRM` badge and a matching entry in REVIEW.md.
- Never publish secrets, funding addresses, bank details or internal hosts (QA, UAT, CBS Demo URLs).
