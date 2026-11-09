/* Corridors tab (#/corridors): where you can pay out, how much, how fast and what you send.
   Replaces the Remittances part of coverage.payfuture.net (being sunset).
   Live scope from Confluence "Enterprise - Live Payment Methods Summary" (PMA 1979875329): India payouts,
   INR 500 – 400,000 per payout; Pakistan coming soon. Fields and proof of payment from document.payfuture.net.
   Funding currencies from the product offering page. Rate type and funding windows differ between sources,
   so they are not stated: PayFuture confirms them at onboarding. The API reference mirrors the whole live docs,
   so the table at the end says which of the documented methods are live. */
(() => {
  const page = () => `<h1>Corridors</h1>
<p class="lead">Where you can pay out today, how much, how fast and what you send. Your contracted limits may differ; PayFuture confirms them at onboarding.</p>
<div class="cor-tabs" role="group" aria-label="Corridor">
  <span class="chip on">🇮🇳 India · Live</span>
  <span class="chip soon">🇵🇰 Pakistan · Coming soon</span>
</div>

<section class="cor">
  <h2>🇮🇳 India: USDT, USD or EUR to INR</h2>
  <p>Send funds to individuals and businesses in India, payout by payout, from a prefunded INR balance.</p>
  ${ramp([['USDT / USD / EUR', 'you fund'], ['Converted to INR', 'hub'], ['INR balance', 'held for you'], ['Beneficiary', 'Indian bank account']])}
  <h3>Step by step</h3>
  ${steps([
    ['Fund your balance', 'In USDT, USD or EUR, to the details PayFuture Finance gives you.'],
    ['PayFuture converts it to INR', 'Your INR balance goes up once the funds are received and converted.'],
    ['You send a payout', 'One API call per beneficiary.'],
    ['The beneficiary is paid', 'Over IMPS, in real time, 24x7. A UTR (bank reference) comes back in the callback.'],
  ])}
  <h3>Specifications</h3>
  ${spec([
    ['Currency', 'INR'],
    ['Fund with', 'USDT, USD or EUR'],
    ['Pay to', 'Individuals and businesses (<code>payout_type</code> Individual or Corporate)'],
    ['Rail', 'IMPS: real time, 24x7'],
    ['Per payout', IN_LIMITS],
    ['You send', 'Account number, account name, bank name, IFSC, payout type, and the beneficiary\'s name, phone and email'],
    ['Business payouts', 'Invoice and GST number required'],
    ['Proof of payment', 'UTR on every successful payout, in the callback and in GetStatus'],
    ['Processing', 'The callback tells you whether a payout went out Instant or in a Batch (<code>payoutby</code>)'],
    ['Funding window and FX rate', 'Confirmed by PayFuture Finance when you onboard'],
  ])}
  <p class="pm-dev"><b>For developers:</b> <a href="#/guide/quickstart">Quickstart: your first payout</a> · <a href="#/api/payout">Payout API</a> · <a href="#/guide/funding">Funding & balance</a></p>
</section>

<section class="cor soon">
  <h2>🇵🇰 Pakistan: coming soon</h2>
  <p>PKR payouts are on the way. Ask your PayFuture contact for timing; this page will show the details when the corridor is live.</p>
</section>

<h2>Everything else in the API reference</h2>
<p>The <a href="#/api/start">API reference</a> mirrors the full live API docs, so it also documents methods that are not live for Cross-border Payouts. Build only what is live for your MID, and ask your PayFuture contact before you build anything else.</p>
${table(['What', 'Where', 'Status'], [
  ['Payouts · Net Banking', '🇮🇳 India', '<span class="st-live">Live</span>'],
  ['Payouts · Wallet, Bank Transfer', '🇵🇰 Pakistan', '<span class="st-soon">Coming soon</span>'],
  ['Payouts · Bank Transfer', '🇳🇬 Nigeria · 🇵🇭 Philippines', '<span class="st-doc">In the API docs; ask your contact</span>'],
  ['Payouts · Mobile Wallet, Bank Deposit, Cash', '🇪🇬 Egypt', '<span class="st-doc">In the API docs; ask your contact</span>'],
  ['Pay-ins, refunds and quotes', 'Several markets', '<span class="st-doc">In the API docs; ask your contact</span>'],
])}`;
  SOLO.corridors = ['Corridors', page];
})();
