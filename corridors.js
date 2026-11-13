/* Corridors tab (#/corridors): where you can pay out, how much, how fast and what you send.
   Replaces the Remittances part of coverage.payfuture.net (being sunset).
   Live scope from Confluence "Enterprise - Live Payment Methods Summary" (PMA 1979875329): India payouts,
   INR 500 – 400,000 per payout; Pakistan coming soon. Fields and proof of payment from document.payfuture.net.
   Funding currencies from the product offering page. Rate type and funding windows differ between sources,
   so they are not stated: Payfuture confirms them at onboarding. The API reference mirrors the whole live docs,
   so the table at the end says which of the documented methods are live.
   Pakistan (#/corridors/pk): the API is documented on document.payfuture.net and merchants can build now; testing
   is still in progress, so limits, funding and timings are not stated. */
(() => {
  const PK_REQ = (method, fields) => JSON.stringify({requestType: 'PAYOUT', data: {midCode: '<your MID>', integrationType: 'S', amount: 25000, currency: 'PKR', country: 'PK',
    merchantRefNo: 'PO-10001', merchantUrl: {notificationUrl: 'https://yourcompany.example/payfuture/callback'}, paymentMethod: method, paymMethodFields: fields,
    hash: '<SHA-256 of the recipe below>'}}, null, 2);
  const tabs = cur => `<div class="cor-tabs" role="tablist" aria-label="Corridor">
  <a class="chip${cur === 'in' ? ' on' : ''}" role="tab" aria-selected="${cur === 'in'}" href="#/corridors/in">🇮🇳 India · Live</a>
  <a class="chip soon${cur === 'pk' ? ' on' : ''}" role="tab" aria-selected="${cur === 'pk'}" href="#/corridors/pk">🇵🇰 Pakistan · API ready, testing in progress</a>
</div>`;
  const page = id => {
    const cur = id === 'pk' ? 'pk' : 'in';
    return `<h1>Corridors</h1>
<p class="lead">Where you can pay out, how much, how fast and what you send.</p>
${callout(`<p><b>Limits can change.</b> ${LIMITS_NOTE}</p>`, 'warn')}
${tabs(cur)}
<div class="cor-2">
  <div class="cor-main">${cur === 'pk' ? pakistan() : india()}</div>
  <aside class="cor-side" aria-label="At a glance"><div class="api2-sticky">${cur === 'pk' ? sidePk() : sideIn()}</div></aside>
</div>
${rest()}`;
  };
  const india = () => `<section class="cor">
  <h2>🇮🇳 India: USDT, USD or EUR to INR</h2>
  <p>Send funds to individuals and businesses in India, payout by payout, from a prefunded INR balance.</p>
  ${ramp([['USDT / USD / EUR', 'you fund'], ['Converted to INR', 'hub'], ['INR balance', 'held for you'], ['Beneficiary', 'Indian bank account']])}
  <h3>Step by step</h3>
  ${steps([
    ['Fund your balance', 'In USDT, USD or EUR, to the details Payfuture Finance gives you.'],
    ['Payfuture converts it to INR', 'Your INR balance goes up once the funds are received and converted.'],
    ['You send a payout', 'One API call per beneficiary.'],
    ['The beneficiary is paid', 'Over IMPS, in real time, 24x7. A UTR (bank reference) comes back in the callback.'],
  ])}
</section>

`;

  const pakistan = () => `<section class="cor pk">
  <h2>🇵🇰 Pakistan: PKR payouts <span class="st-soon">API ready · testing in progress</span></h2>
  ${callout('<p><b>Build now, go live after testing.</b> The Pakistan API is documented and ready to integrate against. Payfuture is completing testing; once it is done, Pakistan is enabled on your MID and your limits, funding and timings are confirmed.</p>', 'warn')}

  <h3>Bank transfer (IBAN)</h3>
  ${table(['Field', 'Type', 'Length', 'Required', 'Description'], [
    ['<code>account_number</code>', 'String', 'Max 24', 'Yes', "Beneficiary's IBAN: 24 characters, always starting with <code>PK</code>."],
    ['<code>account_name</code>', 'String', 'Max 200', 'Yes', 'Name of the account holder.'],
    ['<code>bank_code</code>', 'String', 'Max 20', 'Yes', "The bank's code, for example <code>PK035</code>. Ask your Payfuture contact for the list of codes."],
  ])}
  <p><b>Request hash</b></p>
  ${code('SHA256(midcode~account_name~account_number~bank_code~amount~currency~midsecret)', 'text')}
  <details class="cor-ex"><summary>Example request</summary>${code(PK_REQ('BT', {account_number: 'PK36SCBL0000001123456702', account_name: 'Test Beneficiary', bank_code: 'PK035'}))}</details>

  <h3>Easypaisa and JazzCash wallets</h3>
  ${table(['Field', 'Type', 'Length', 'Required', 'Description'], [
    ['<code>wallet_number</code>', 'String', 'Max 20', 'Yes', '11 digits starting with <code>03</code>, without the <code>+92</code> country code.'],
    ['<code>document_id</code>', 'String', 'Max 50', 'Yes', "The beneficiary's CNIC: 13 digits."],
  ])}
  <p>Use <code>paymentMethod: "EP"</code> for Easypaisa and <code>"JC"</code> for JazzCash.</p>
  <p><b>Request hash</b></p>
  ${code('SHA256(midcode~merchantrefno~wallet_number~document_id~amount~currency~midsecret)', 'text')}
  <details class="cor-ex"><summary>Example request</summary>${code(PK_REQ('EP', {wallet_number: '03001234567', document_id: '4210112345671'}))}</details>

  <p class="src">Values in <code>&lt;…&gt;</code> are placeholders. <code>userInfo</code> is only needed for India payouts. Response and callback hashes are the same as for India; see the <a href="#/api/payout">Payout API</a>.</p>
</section>`;

  /* right column: the corridor's specification and links (the only copy on the page) */
  const glance = (title, st, rows, links) => `<div class="glance"><div class="glance-h"><b>${title}</b>${st}</div>
    <dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
    <div class="glance-l">${links.map(([h, t]) => `<a href="${h}">${t} →</a>`).join('')}</div></div>`;
  const sideIn = () => glance('🇮🇳 India: specifications', '<span class="st-live">Live</span>', [
    ['Currency', 'INR'],
    ['Fund with', 'USDT, USD or EUR'],
    ['Pay to', 'Individuals and businesses (<code>payout_type</code> Individual or Corporate)'],
    ['Rail', 'IMPS: real time, 24x7'],
    ['Per payout', IN_LIMITS + '<small class="lim-note">Indicative: can change at short notice</small>'],
    ['paymentMethod', '<code>"NB"</code>'],
    ['You send', 'Account number, account name, bank name, IFSC, payout type, and the beneficiary\'s name, phone and email'],
    ['Business payouts', 'Invoice and GST number required'],
    ['Proof of payment', 'UTR on every successful payout, in the callback and in GetStatus'],
    ['Processing', 'The callback tells you whether a payout went out Instant or in a Batch (<code>payoutby</code>)'],
    ['Funding window and FX rate', 'Confirmed by Payfuture Finance when you onboard'],
  ], [['#/guide/quickstart', 'Quickstart: your first payout'], ['#/api/payout/seamless-net-banking-india', 'Payout API'], ['#/guide/funding', 'Funding & balance']]);
  const sidePk = () => glance('🇵🇰 Pakistan: what you can send', '<span class="st-soon">API ready · testing</span>', [
    ['Currency and country', '<code>PKR</code>, <code>PK</code>'],
    ['Methods', 'Bank transfer to an IBAN (<code>paymentMethod: "BT"</code>) · Easypaisa wallet (<code>"EP"</code>) · JazzCash wallet (<code>"JC"</code>)'],
    ['Integration', 'Seamless (<code>integrationType: "S"</code>): you send the beneficiary details in <code>paymMethodFields</code>'],
    ['Amount', 'Whole number only: no decimals for Pakistan (otherwise error <code>11440</code>)'],
    ['Result', 'Callback to your <code>notificationUrl</code>, and <code>GetStatus</code> at any time'],
    ['Limits, funding and speed', 'Confirmed by Payfuture when Pakistan goes live on your MID'],
  ], [['#/api/payout/seamless-bank-transfer-pakistan', 'Payout API'], ['#/api/signing', 'Signing & hashes'], ['#/playground', 'Hash playground'], ['#/api/errors', 'Error codes']]);

  const rest = () => `<h2>Everything else in the API reference</h2>
<p>The <a href="#/api/start">API reference</a> mirrors the full live API docs, so it also documents methods that are not live for Cross-border Payouts. Build only what is live for your MID, and ask your Payfuture contact before you build anything else.</p>
${table(['What', 'Where', 'Status'], [
  ['Payouts · Net Banking', '🇮🇳 India', '<span class="st-live">Live</span>'],
  ['Payouts · Bank Transfer, Easypaisa, JazzCash', '🇵🇰 Pakistan', '<span class="st-soon">API ready · testing in progress</span> <a href="#/corridors/pk">Details</a>'],
  ['Payouts · Bank Transfer', '🇳🇬 Nigeria · 🇵🇭 Philippines', '<span class="st-doc">In the API docs; ask your contact</span>'],
  ['Payouts · Mobile Wallet, Bank Deposit, Cash', '🇪🇬 Egypt', '<span class="st-doc">In the API docs; ask your contact</span>'],
  ['Pay-ins and prefunding quotes', 'Several markets', '<span class="st-doc">In the API docs; ask your contact</span>'],
])}`;
  SOLO.corridors = ['Corridors', page];
})();
