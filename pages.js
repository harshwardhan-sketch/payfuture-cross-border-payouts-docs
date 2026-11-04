/* PayFuture Enterprise — API reference (#/api/…).
   One Enterprise API for payouts, balances, status and reconciliation. Collections need no API call: PayFuture gives you a collection account.
   Merchant-facing: only public sources are linked (document.payfuture.net, coverage.payfuture.net).
   Only Live features are shown. Anything not confirmed carries TO CONFIRM (see REVIEW.md). */

const I = PAGES.api;
const API_URL = 'https://igateway-gwapi.payfuture.net/api/process/request';

NAV.api = [
  ['Get started', [['start', 'Overview'], ['onboarding', 'Before you start'], ['signing', 'Authentication & signing']]],
  ['Payouts', [['funding', 'Funding & balance'], ['payout', 'Send a payout'], ['status', 'Check status'], ['callbacks', 'Callbacks']]],
  ['Operations', [['reconciliation', 'Balance & reconciliation'], ['limits', 'Limits by corridor']]],
  ['Test and go live', [['testing', 'Testing on a live MID']]],
  ['Troubleshooting', [['errors', 'Error codes'], ['faq', 'FAQ']]],
];

I.start = () => `<h1>Enterprise API</h1>
<p class="lead">One endpoint for everything you do in code: send payouts, check your balance, check a payout's status and pull your transactions for reconciliation. Every payout also gets a callback.</p>
${table(['Environment', 'URL'], [
  ['Production', `<code>${API_URL}</code>`],
  ['Sandbox', 'None. You test on a limited live MID (see <a href="#/api/testing">Testing</a>)'],
])}
<p>Every call is <code>POST</code> to the same URL, with <code>Content-Type: application/json</code> and the header <code>api-version: 2.0</code>. The operation is chosen by <code>requestType</code>:</p>
${table(['requestType', 'What it does'], [
  ['<code>PAYOUT</code>', 'Send money to a bank account or wallet. <a href="#/api/payout">Send a payout</a>'],
  ['<code>GetBalance</code>', 'Your available balance. <a href="#/api/reconciliation">Balance & reconciliation</a>'],
  ['<code>GetStatus</code>', 'The status of one payout. <a href="#/api/status">Check status</a>'],
  ['<code>GetTransactionList</code>', 'Your transactions, for reconciliation. <a href="#/api/reconciliation">Balance & reconciliation</a>'],
])}
${code(`{
  "requestType": "PAYOUT",
  "data": { "midCode": "<your MID>", "...": "..." }
}`)}
${callout('<p><b>The API always answers HTTP 200</b>, even for errors. Read <code>success</code> and <code>error[]</code> in the body. The only exception is HTTP 403 when your server IP is not whitelisted.</p>')}
${callout('<p><b>Collections</b> need no API call. PayFuture gives you an INR collection account, and money paid into it is converted and added to your balance. See <a href="#/guide/collections">Collections</a>.</p>', 'ok')}
${src(['document.payfuture.net', API_DOCS])}`;

I.onboarding = () => `<h1>Before you start</h1>
<p class="lead">You need four things from onboarding before your first call.</p>
${steps([
  ['MID and MID secret', 'PayFuture issues these. The secret signs every request, so keep it on your server only, never in an app or browser.'],
  ['IP whitelisting', 'Send PayFuture the public IPs of the servers that will call the API. Calls from other IPs get HTTP 403.'],
  ['Callback URL', 'A public HTTPS URL on your side. You send it on each payout in <code>merchantUrl.notificationUrl</code>.'],
  ['Funding instructions', 'PayFuture Finance gives you the USDT address and network, or the bank details for USD and EUR. They are never published on this site.'],
])}
${callout('<p><b>Not the PayFuture Gateway.</b> Enterprise runs on <code>igateway-gwapi.payfuture.net</code>. Gateway (paygate10.com) MIDs and secrets do not work here.</p>', 'warn')}
${src(['document.payfuture.net', API_DOCS])}`;

const SIG_RECIPES = {
  in_nb: {label: 'Payout · India Net Banking', formula: 'SHA256(midcode~amount~currency~bank_name~midsecret)'},
  pk_wallet: {label: 'Payout · Pakistan Easypaisa / JazzCash', formula: 'SHA256(midcode~merchantrefno~wallet_number~document_id~amount~currency~midsecret)'},
  pk_bt: {label: 'Payout · Pakistan bank transfer', formula: 'SHA256(midcode~account_name~account_number~bank_code~amount~currency~midsecret)'},
  payout_resp: {label: 'Payout response (verify)', formula: 'SHA256(midcode~transactionid~merchantrefno~txnstatus~amount~midsecret)'},
  getstatus: {label: 'GetStatus request', formula: 'SHA256(midcode~transaction_id~transaction_type~midsecret)'},
  getbalance: {label: 'GetBalance request', formula: 'SHA256(midcode~midsecret)'},
  callback: {label: 'Payout callback (verify)', formula: 'SHA256(midcode transactionid amount midsecret), joined with no separator'},
};

I.signing = () => `<h1>Authentication & signing</h1>
<p class="lead">There is no login or token. Each request is authenticated by your MID and a signature made with your MID secret. Use the HMAC header for new integrations.</p>
${table(['Method', 'How it works'], [
  ['HMAC header (recommended)', '<code>X-Callback-Signature: sha256=&lt;hex&gt;</code>, where hex = HMAC-SHA256(key = MID secret, message = the exact raw request body). When it is valid, the body <code>hash</code> is ignored.'],
  ['Body hash', '<code>hash</code> = SHA-256 of named fields joined with <code>~</code>. The field list differs by country and method.'],
])}
${callout('<p><b>Sign the exact bytes you send.</b> Re-serialising the JSON or adding whitespace after signing breaks the HMAC. A wrong signature returns error <code>11031</code>. Despite its name, <code>X-Callback-Signature</code> signs your request to PayFuture, not callbacks.</p>', 'warn')}
<h2>Body hash rules</h2>
<ul><li>Amount with exactly two decimals, for example <code>1500.00</code>.</li><li>MID secret in lower case.</li><li>Fields in the exact order of the formula, joined with <code>~</code>.</li><li>Output: lower-case hex.</li></ul>
${table(['Request', 'Formula'], Object.values(SIG_RECIPES).map(r => [r.label, `<code>${r.formula}</code>`]))}
<div class="callout ok"><p><b>Want to try it?</b> The <a href="#/guide/playground">signature playground</a> builds every formula above, signs HMAC bodies and diagnoses hashes that don't match.</p></div>
${src(['document.payfuture.net · Request signature', API_DOCS], ['Payout hashes', API_DOCS + '/payout.shtml'])}`;

I.funding = () => `<h1>Funding & balance</h1>
<p class="lead">Payouts are prefunded. You fund your PayFuture balance, PayFuture converts it into the payout currency at the rate of the day, and each payout draws from it.</p>
${table(['Corridor', 'Fund with', 'Timing'], [
  ['India (INR)', 'USDT (TRON / TRC-20), USD or EUR', 'Fund or convert between 11 AM and 3 PM IST and it completes in 2–3 hours'],
  ['Pakistan (PKR)', 'USDT (TRON / TRC-20) only', 'USDT to PayFuture by 2:30 PM GST. PKR is available 30–60 minutes after the bank receives it, Monday to Saturday'],
])}
${steps([
  ['Fund', 'Use the address or bank details PayFuture Finance gives you. Other networks or currencies need Finance approval.'],
  ['PayFuture converts it', 'At the rate of the day, into INR or PKR.'],
  ['Check your balance', 'Call <code>GetBalance</code> before sending payouts (see <a href="#/api/reconciliation">Balance & reconciliation</a>).'],
])}
${src(['coverage.payfuture.net', COVERAGE])}`;

I.payout = () => `<h1>Send a payout</h1>
<p class="lead"><code>requestType: "PAYOUT"</code>. The response only confirms the payout was accepted; the final result comes by callback.</p>
${ep('POST', API_URL)}
${tabs([
  ['India · Net Banking', code(`{
  "requestType": "PAYOUT",
  "data": {
    "midCode": "<your MID>",
    "integrationType": "S",
    "amount": 1500,
    "hash": "<SHA-256 hex, or send the HMAC header instead>",
    "currency": "INR",
    "country": "IN",
    "merchantUrl": { "notificationUrl": "https://merchant.example/payfuture/callback" },
    "merchantRefNo": "PO-000123",
    "userInfo": { "firstName": "Asha", "lastName": "Rao", "phone": "9000000000", "email": "asha@example.com", "ipAddress": "203.0.113.10" },
    "paymentMethod": "NB",
    "paymMethodFields": {
      "account_number": "000000000000",
      "account_name": "Asha Rao",
      "bank_name": "Example Bank",
      "bank_ifsc": "EXMP0000001",
      "payout_type": "Individual"
    }
  }
}`)],
  ['Pakistan · Wallet', code(`{
  "requestType": "PAYOUT",
  "data": {
    "midCode": "<your MID>",
    "amount": 1000,
    "hash": "<SHA-256 hex>",
    "currency": "PKR",
    "country": "PK",
    "merchantUrl": { "notificationUrl": "https://merchant.example/payfuture/callback" },
    "merchantRefNo": "PO-000124",
    "paymentMethod": "EP",
    "paymMethodFields": { "wallet_number": "03000000000", "document_id": "0000000000000" }
  }
}`)],
  ['Pakistan · Bank', code(`{
  "requestType": "PAYOUT",
  "data": {
    "midCode": "<your MID>",
    "amount": 1000,
    "hash": "<SHA-256 hex>",
    "currency": "PKR",
    "country": "PK",
    "merchantUrl": { "notificationUrl": "https://merchant.example/payfuture/callback" },
    "merchantRefNo": "PO-000125",
    "paymentMethod": "BT",
    "paymMethodFields": { "account_number": "PK00XXXX0000000000000000", "account_name": "Test Beneficiary", "bank_code": "<bank code>" }
  }
}`)],
])}
<h2>Response</h2>
${code(`{
  "success": true,
  "midCode": "<your MID>",
  "requestType": "PAYOUT",
  "merchantRefNo": "PO-000123",
  "error": [],
  "data": {
    "transaction_id": "INV78I1757502089824",
    "hash": "<response hash>",
    "amount": 1500,
    "currency": "INR",
    "status": "PENDING",
    "message": "Payout Request will be processed shortly."
  }
}`)}
<p>Verify the response hash: <code>SHA256(midcode~transactionid~merchantrefno~txnstatus~amount~midsecret)</code>.</p>
<h2>Method fields</h2>
${table(['Corridor · method', '<code>paymentMethod</code>', '<code>paymMethodFields</code>'], [
  ['India · Net Banking (IMPS / NEFT)', '<code>NB</code>', 'account_number, account_name, bank_name, bank_ifsc, payout_type (Individual / Corporate)'],
  ['Pakistan · Easypaisa / JazzCash', '<code>EP</code>', 'wallet_number (03…, 11 digits), document_id (13-digit CNIC)'],
  ['Pakistan · Bank transfer', '<code>BT</code>', 'account_number (24-character IBAN), account_name, bank_code'],
])}
${callout('<p>Make <code>merchantRefNo</code> unique for every payout, and store PayFuture\'s <code>transaction_id</code>. You need both for status checks and support. India business payouts need an invoice and GST number.</p>')}
${src(['Payout reference', API_DOCS + '/payout.shtml'], ['coverage.payfuture.net', COVERAGE])}`;

I.status = () => `<h1>Check status</h1>
<p class="lead">Use <code>GetStatus</code> to confirm a payout's final result, especially before acting on a callback.</p>
${code(`{
  "requestType": "GetStatus",
  "data": {
    "midcode": "<your MID>",
    "transaction_id": "INV78I1757502089824",
    "transaction_type": "payout",
    "hash": "<SHA256(midcode~transaction_id~transaction_type~midsecret)>"
  }
}`)}
<p><code>transaction_type</code> is <code>payout</code>, in lower case, in the request and in the hash. The response includes <code>status</code>, <code>utrnumber</code> (the bank reference for India) and a response hash.</p>
${table(['Status', 'Meaning', 'Final?'], [
  ['<code>PENDING</code>', 'Accepted, waiting to be sent', 'No'],
  ['<code>IN-PROCESS</code>', 'Sent to the bank or wallet', 'No'],
  ['<code>APPROVED</code>', 'Paid to the beneficiary', '<b>Yes</b>'],
  ['<code>DECLINED</code>', 'Failed or rejected; funds stay in your balance', '<b>Yes</b>'],
])}
${src(['Other operations', API_DOCS + '/other.shtml'])}`;

I.callbacks = () => `<h1>Callbacks</h1>
<p class="lead">PayFuture sends one <code>POST</code> to your <code>notificationUrl</code> when a payout reaches a final status. It is form-encoded (<code>application/x-www-form-urlencoded</code>), not JSON.</p>
${table(['Field', 'Description'], [
  ['<code>payoutid</code>', 'PayFuture transaction ID'], ['<code>reference1</code>', 'Your <code>merchantRefNo</code>'],
  ['<code>amount</code>, <code>currency</code>', 'Payout amount'], ['<code>status</code>', 'Final status'],
  ['<code>utrnumber</code>', 'Bank reference (India)'], ['<code>errorcode</code>, <code>remark</code>', 'Reason, when declined'],
  ['<code>payoutby</code>', 'Instant or Batch'], ['<code>key</code>', 'Your MID'], ['<code>hash</code>', 'Signature to verify'],
])}
<h2>Verify the callback</h2>
<p>Recompute <code>SHA256(midcode + transactionid + amount + midsecret)</code>, joined with <b>no separator</b>, and compare it to <code>hash</code>. The <a href="#/guide/playground">playground</a> has this formula. ${TC}</p>
${callout(`<p><b>Plan for these:</b></p><ul>
<li>The callback hash does not cover <code>status</code>. Before you act on a final status, confirm it with <a href="#/api/status">GetStatus</a>.</li>
<li>Reply HTTP 200 quickly. Anything else counts as a failure, and PayFuture retries only a few times.</li>
<li>Only one callback is sent per payout. Reconcile daily with <a href="#/api/reconciliation">GetTransactionList</a> to catch any later change.</li></ul>`, 'warn')}
${src(['Payout reference · Callback', API_DOCS + '/payout.shtml'])}`;

I.reconciliation = () => `<h1>Balance & reconciliation</h1>
<h2>GetBalance</h2>
<p>Hash: <code>SHA256(midcode~midsecret)</code>. Returns <code>available_balance</code>, <code>running_balance</code>, <code>available_instant_payout_balance</code> and <code>currency</code>.</p>
${code(`{
  "requestType": "GetBalance",
  "data": { "midcode": "<your MID>", "hash": "<SHA256(midcode~midsecret)>" }
}`)}
<h2>GetTransactionList</h2>
<p>Lists your transactions for reconciliation: up to 100 per page (<code>skip</code>, <code>take</code>), up to 180 days back. Dates are IST for merchants registered in India and UTC for everyone else. It uses a <code>signature</code> field: <code>SHA256(midcode~midsecret)</code>.</p>
${callout('<p>If your balance is too low you get error <code>11081</code> (insufficient balance). Always check <code>GetBalance</code> first.</p>')}
${src(['Get Balance', API_DOCS + '/balance.shtml'], ['Other operations', API_DOCS + '/other.shtml'])}`;

I.limits = () => `<h1>Limits by corridor</h1>
<p class="lead">Typical limits. Your contracted limits may differ; PayFuture confirms them at onboarding.</p>
${table(['Corridor', 'Method', 'Per payout', 'Speed'], [
  ['India', 'IMPS', 'INR 1,000 – 400,000', 'Real time, 24x7; usually 3–5 minutes'],
  ['India', 'NEFT', 'From INR 200,000, no maximum', 'Same day, about 45 minutes, in Indian banking hours'],
  ['Pakistan', 'Bank transfer, Easypaisa, JazzCash', 'Confirmed at onboarding', 'Up to 1,500 TPS; liquidity Monday–Saturday'],
])}
<ul><li>India payouts support B2B, B2C, C2B and C2C. Business payouts need an invoice and GST number.</li><li>The bank reference (UTR) is returned in the callback.</li><li>Pakistan account titles are verified before any money moves.</li></ul>
${src(['coverage.payfuture.net', COVERAGE])}`;

I.testing = () => `<h1>Testing on a live MID</h1>
<p class="lead">There is <b>no sandbox</b>. You test in production on a MID with low limits and a small real top-up. Every test payout moves real money.</p>
${steps([
  ['Get a limited live MID', 'Ask PayFuture, and get your server IPs whitelisted.'],
  ['Fund a small amount', 'Send a small top-up and confirm it with <code>GetBalance</code>.'],
  ['One payout per method', 'Send to an account you control, for each method you will use.'],
  ['Check the callback, then the status', 'Verify the callback hash and confirm with <code>GetStatus</code>.'],
  ['Test a failure', 'Send a wrong hash and check you handle error <code>11031</code>.'],
  ['Go live', 'Ask PayFuture to raise your limits once your results are signed off.'],
])}`;

const ERR_GROUPS = [
  ['Request & signature', 'Fix the request or signature, then retry with the same <code>merchantRefNo</code>.'],
  ['Payout details', 'Fix the beneficiary or payout fields, then send again.'],
  ['Balance & limits', 'Fund your balance or wait for the limit to reset, then send again with a new <code>merchantRefNo</code>.'],
  ['Bank or wallet outcome', 'The bank or wallet refused the payout. Check the beneficiary details with your customer before retrying.'],
  ['Status & reports', 'Fix the GetStatus or GetTransactionList request.'],
];
I.errors = () => {
  const rows = ENT_DATA.errors;
  return `<h1>Error codes</h1>
<p class="lead">Errors come back in <code>error[]</code> as <code>{errorCode, errorMessage}</code>, with HTTP 200. This list has the ${rows.length} codes an Enterprise call can return, grouped by what to do next.</p>
<h2>The ones you'll see most</h2>
${table(['Code', 'Meaning', 'What to do'], [
  ['<code>11031</code>', 'Hash or signature mismatch', 'Check field order, two-decimal amount and secret case in the <a href="#/guide/playground">playground</a>'],
  ['<code>11027</code>', 'Duplicate <code>merchantRefNo</code>', 'This reference was already used. Check its status instead of sending again'],
  ['<code>11081</code>', 'Insufficient balance', 'Fund, then retry with a new <code>merchantRefNo</code>'],
  ['<code>11088</code>', 'Payout disabled for this MID', 'Contact PayFuture'],
  ['<code>11120</code>, <code>11121</code>, <code>11397</code>, <code>11398</code>', 'Daily limit reached', 'Retry the next day or ask for a higher limit'],
  ['<code>11346</code>–<code>11350</code>', 'Rejected by the beneficiary bank', 'Check the beneficiary details'],
])}
<h2>All codes</h2>
<div class="chips" id="errGroups"><button class="chip on" data-g="">All</button>${ERR_GROUPS.map(([g]) => `<button class="chip" data-g="${g}">${g}</button>`).join('')}</div>
<p id="errHint" class="muted"></p>
<p><input id="errQ" placeholder="Search codes or messages…" style="width:100%;max-width:420px;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)"> <span id="errCount" class="src">${rows.length} codes</span></p>
<table id="errTable"><thead><tr><th>Code</th><th>Message</th><th>Group</th></tr></thead><tbody>${rows.map(([c, m, g]) => `<tr data-g="${g}"><td><code>${esc(c)}</code></td><td>${esc(m)}</td><td>${g}</td></tr>`).join('')}</tbody></table>
<p class="src">The full list on document.payfuture.net has 315 codes because it also covers PayFuture products that Enterprise doesn't use, such as card and UPI pay-ins. Source: <a href="${API_DOCS}/error-code.shtml" target="_blank" rel="noopener">Error codes</a></p>`;
};
INIT.errors = () => {
  let g = '';
  const q = document.getElementById('errQ'), hint = document.getElementById('errHint');
  const apply = () => {
    const s = q.value.toLowerCase(); let n = 0;
    document.querySelectorAll('#errTable tbody tr').forEach(tr => { const show = (!g || tr.dataset.g === g) && tr.textContent.toLowerCase().includes(s); tr.style.display = show ? '' : 'none'; n += show; });
    document.getElementById('errCount').textContent = `${n} codes`;
    hint.innerHTML = g ? `<b>What to do:</b> ${ERR_GROUPS.find(x => x[0] === g)[1]}` : '';
  };
  document.getElementById('errGroups').onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return;
    g = b.dataset.g; document.querySelectorAll('#errGroups .chip').forEach(c => c.classList.toggle('on', c === b)); apply();
  };
  q.oninput = apply;
};

I.faq = () => {
  const q = (t, a) => `<h3>${t}</h3>${a}`;
  return `<h1>FAQ</h1>
${q('Can I use my PayFuture Gateway (paygate10.com) MID here?', '<p>No. Enterprise and the Gateway use different hosts, MIDs and secrets.</p>')}
${q('Why do I get HTTP 403?', '<p>Your server IP is not whitelisted. Send PayFuture the IP.</p>')}
${q('Which statuses are final?', '<p>Only <code>APPROVED</code> and <code>DECLINED</code>.</p>')}
${q('I did not receive a callback.', '<p>Check that your <code>notificationUrl</code> is public HTTPS and returns 200, then call <a href="#/api/status">GetStatus</a>.</p>')}
${q('Can I send decimal amounts?', `<p>Hash amounts with two decimals. Some methods accept only whole amounts (error <code>11440</code>). ${TC}</p>`)}
${q('Is there a sandbox?', '<p>No. See <a href="#/api/testing">Testing on a live MID</a>.</p>')}`;
};

render();
