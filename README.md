# PayFuture Enterprise Developer Docs

A static, build-free docs site for **PayFuture Enterprise**, covering two products:

- **Enterprise on IGE**: USDT-funded payouts on `igateway-gwapi.payfuture.net`.
- **CBS (Core Banking)**: fiat-account payouts on `secure-mtapi.payfuturefs.com`.

It is kept separate from the Legacy (IG) site in `~/payfuture-merchant-docs`.

## Run it

Open `index.html` in a browser. There is no server and no build step.

## Files

| File | What it holds |
|---|---|
| `index.html` | The page shell and the header tabs: About PayFuture · Enterprise guide · API reference |
| `app.js` | Router, helpers and SHA-256 |
| `about.js` | The company pages (who we are, what we do, markets, industries, the solutions behind Enterprise). Copy and images come from payfuture.net and live in `assets/site/` |
| `guide.js` | The Enterprise guide, plus the home page, product finder, payout simulator, signature playground and go-live checklist |
| `pages.js` | The API reference, IGE and CBS |
| `data.js` | Generated error codes: IGE codes from document.payfuture.net `ErrorCodeList.json`, CBS codes from the Core Banking API spec |
| `styles.css`, `assets/logo.svg` | Shared PayFuture theme, copied from the Legacy site |
| `enterprise.css` | Status pills (Live / Testing / Planned) and the flow diagram |
| `REVIEW.md` | Internal: open questions and sources. **Do not ship to merchants** |

## Rules

- Link only public sources: document.payfuture.net, docs.payfuturefs.com and coverage.payfuture.net.
- Every feature is tagged **Live**, **Testing** or **Planned**.
- Anything unconfirmed carries a `TO CONFIRM` badge and a matching entry in REVIEW.md.
- Never publish secrets, funding addresses, bank details or internal hosts (QA, UAT, CBS Demo URLs).
