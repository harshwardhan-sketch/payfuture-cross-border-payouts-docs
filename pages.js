/* PayFuture Enterprise — page content.
   Merchant-facing: only public sources are linked (document.payfuture.net, docs.payfuturefs.com, coverage.payfuture.net).
   Every feature carries a Live / Testing / Planned tag. Anything not confirmed carries TO CONFIRM (see REVIEW.md). */

const I = PAGES.ige, C = PAGES.cbs;

/* ================= ENTERPRISE ON IGE ================= */
NAV.ige = [
  ['Get started', [['start', 'Welcome'], ['onboarding', 'Before you start'], ['signing', 'Authentication & signing']]],
  ['Build', [['funding', 'Funding with USDT'], ['payout', 'Send a payout'], ['status', 'Check status'], ['callbacks', 'Callbacks']]],
  ['Operations', [['reconciliation', 'Balance & reconciliation'], ['limits', 'Limits & coverage']]],
  ['Test and go live', [['testing', 'Testing on a live MID']]],
  ['Troubleshooting', [['errors', 'Error codes'], ['faq', 'FAQ']]],
];

I.start = () => `<h1>Enterprise on IGE</h1>
<p class="lead">Fund in USDT, then send local-currency payouts through one endpoint. Every payout gets a callback and can be checked with a status call. ${LIVE}</p>
${table(['Environment', 'URL', 'Status'], [
  ['Production', '<code>https://igateway-gwapi.payfuture.net/api/process/request</code>', LIVE],
  ['Sandbox', 'None for merchants. You test on a limited live MID (see <a href="#/ige/testing">Testing</a>)', '—'],
])}
<p>Every call is <code>POST</code> to the same URL, with <code>Content-Type: application/json</code> and the header <code>api-version: 2.0</code>. The operation is chosen by <code>requestType</code>:</p>
${code(`{
  "requestType": "PAYOUT",
  "data": { "midCode": "<your MID>", "...": "..." }
}`)}
${callout('<p><b>IGE always answers HTTP 200</b>, even for errors. Read <code>success</code> and <code>error[]</code> in the body. The only exception is HTTP 403 when your server IP is not whitelisted.</p>')}
${steps([['Get your MID, secret and IP whitelisting', 'See <a href="#/ige/onboarding">Before you start</a>.'], ['Fund your balance in USDT', 'See <a href="#/ige/funding">Funding with USDT</a>.'], ['Send a payout and handle the callback', 'See <a href="#/ige/payout">Send a payout</a> and <a href="#/ige/callbacks">Callbacks</a>.'], ['Test on a limited live MID, then go live', 'See <a href="#/ige/testing">Testing</a>.']])}
${src(['document.payfuture.net', IGE_DOCS])}`;

I.onboarding = () => `<h1>Before you start</h1>
<p class="lead">You need four things from onboarding before your first call.</p>
${steps([
  ['MID and MID secret', 'PayFuture issues these. The secret signs every request, so keep it on your server only, never in an app or browser.'],
  ['IP whitelisting', 'Send PayFuture the public IPs of the servers that will call the API. Calls from other IPs get HTTP 403.'],
  ['Callback URL', 'A public HTTPS URL on your side. You send it on each payout in <code>merchantUrl.notificationUrl</code>.'],
  ['Funding instructions', 'PayFuture Finance gives you the USDT address and network for your account. They are never published on this site.'],
])}
${src(['document.payfuture.net', IGE_DOCS])}`;

const IGE_RECIPES = {
  in_nb: {label: 'Payout · India Net Banking', formula: 'SHA256(midcode~amount~currency~bank_name~midsecret)', tokens: ['midcode', 'amount', 'currency', 'bank_name', 'midsecret'], sep: '~'},
  pk_wallet: {label: 'Payout · Pakistan Easypaisa / JazzCash', formula: 'SHA256(midcode~merchantrefno~wallet_number~document_id~amount~currency~midsecret)', tokens: ['midcode', 'merchantrefno', 'wallet_number', 'document_id', 'amount', 'currency', 'midsecret'], sep: '~'},
  pk_bt: {label: 'Payout · Pakistan bank transfer', formula: 'SHA256(midcode~account_name~account_number~bank_code~amount~currency~midsecret)', tokens: ['midcode', 'account_name', 'account_number', 'bank_code', 'amount', 'currency', 'midsecret'], sep: '~'},
  ng_bt: {label: 'Payout · Nigeria bank transfer', formula: 'SHA256(midcode~amount~midsecret~currency~account_number~merchantrefno)', tokens: ['midcode', 'amount', 'midsecret', 'currency', 'account_number', 'merchantrefno'], sep: '~'},
  eg_wallet: {label: 'Payout · Egypt mobile wallet', formula: 'SHA256(midcode~wallet_number~amount~currency~midsecret)', tokens: ['midcode', 'wallet_number', 'amount', 'currency', 'midsecret'], sep: '~'},
  eg_deposit: {label: 'Payout · Egypt bank deposit', formula: 'SHA256(midcode~amount~midsecret~currency~merchantrefno)', tokens: ['midcode', 'amount', 'midsecret', 'currency', 'merchantrefno'], sep: '~'},
  eg_cash: {label: 'Payout · Egypt cash', formula: 'SHA256(midcode~document_id~amount~currency~midsecret)', tokens: ['midcode', 'document_id', 'amount', 'currency', 'midsecret'], sep: '~'},
  payout_resp: {label: 'Payout response (verify)', formula: 'SHA256(midcode~transactionid~merchantrefno~txnstatus~amount~midsecret)', tokens: ['midcode', 'transactionid', 'merchantrefno', 'txnstatus', 'amount', 'midsecret'], sep: '~'},
  getstatus: {label: 'GetStatus request', formula: 'SHA256(midcode~transaction_id~transaction_type~midsecret)', tokens: ['midcode', 'transaction_id', 'transaction_type', 'midsecret'], sep: '~'},
  getbalance: {label: 'GetBalance request', formula: 'SHA256(midcode~midsecret)', tokens: ['midcode', 'midsecret'], sep: '~'},
  callback: {label: 'Payout callback (verify)', formula: 'SHA256(midcode transactionid amount midsecret), joined with no separator', tokens: ['midcode', 'transactionid', 'amount', 'midsecret'], sep: ''},
};

I.signing = () => `<h1>Authentication & signing</h1>
<p class="lead">There is no login or token. Each request is authenticated by your MID and a signature made with your MID secret. Use the HMAC header for new integrations.</p>
${table(['Method', 'How it works', 'Status'], [
  ['HMAC header (recommended)', '<code>X-Callback-Signature: sha256=&lt;hex&gt;</code>, where hex = HMAC-SHA256(key = MID secret, message = the exact raw request body). When it is valid, the body <code>hash</code> is ignored.', LIVE],
  ['Body hash', '<code>hash</code> = SHA-256 of named fields joined with <code>~</code>. The field list differs by country and method.', LIVE],
])}
${callout('<p><b>Sign the exact bytes you send.</b> Re-serialising the JSON or adding whitespace after signing breaks the HMAC. A wrong signature returns error <code>11031</code>. Despite its name, <code>X-Callback-Signature</code> signs your request to PayFuture, not callbacks.</p>', 'warn')}
<h2>Body hash rules</h2>
<ul><li>Amount with exactly two decimals, for example <code>1500.00</code>.</li><li>MID secret in lower case.</li><li>Fields in the exact order of the formula, joined with <code>~</code>.</li><li>Output: lower-case hex.</li></ul>
${table(['Request', 'Formula'], Object.values(IGE_RECIPES).map(r => [r.label, `<code>${r.formula}</code>`]))}
<div class="callout ok"><p><b>Want to try it?</b> The <a href="#/guide/playground">signature playground</a> builds every formula above, signs HMAC bodies and diagnoses hashes that don't match.</p></div>
${src(['document.payfuture.net · Request signature', IGE_DOCS], ['Payout hashes', IGE_DOCS + '/payout.shtml'])}`;

I.funding = () => `<h1>Funding with USDT</h1>
<p class="lead">You prefund your payout balance in USDT. PayFuture converts it to the payout currency at the rate of the day. ${LIVE}</p>
${steps([
  ['Send USDT on TRON (TRC-20)', 'Use the address PayFuture Finance gives you. Other networks need Finance approval.'],
  ['PayFuture converts it', 'At the daily rate. For INR the cut-off is 3:30 PM IST. For PKR, funds are usable 30–60 minutes after the bank receives them, Monday to Saturday.'],
  ['Check your balance', 'Call <code>GetBalance</code> before sending payouts (see <a href="#/ige/reconciliation">Balance & reconciliation</a>).'],
])}
${callout(`<p>Same-day availability for INR applies to funds received before the cut-off. ${TC}</p>`)}
${callout(`<p><b>Quote APIs.</b> The API reference also lists <code>PayoutPrefundingQuote</code>, <code>PayoutPrefunding_ApproveQuote</code> and <code>AcceptQuote</code>. They are not part of the current live flow. Don't build on them unless PayFuture enables them for you. ${TC}</p>`, 'warn')}
${src(['coverage.payfuture.net', COVERAGE], ['Other operations', IGE_DOCS + '/other.shtml'])}`;

I.payout = () => `<h1>Send a payout</h1>
<p class="lead"><code>requestType: "PAYOUT"</code>. The response only confirms the payout was accepted; the final result comes by callback. ${LIVE}</p>
${ep('POST', 'https://igateway-gwapi.payfuture.net/api/process/request')}
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
${table(['Country · method', '<code>paymentMethod</code>', '<code>paymMethodFields</code>'], [
  ['India · Net Banking', '<code>NB</code>', 'account_number, account_name, bank_name, bank_ifsc, payout_type (Individual / Corporate)'],
  ['Pakistan · Easypaisa / JazzCash', '<code>EP</code>', 'wallet_number (03…, 11 digits), document_id (13-digit CNIC)'],
  ['Pakistan · Bank transfer', '<code>BT</code>', 'account_number (24-character IBAN), account_name, bank_code'],
  ['Nigeria · Bank transfer', '<code>BT</code>', 'account_number (10 digits), bank_code'],
])}
${callout('<p>Make <code>merchantRefNo</code> unique for every payout, and store PayFuture\'s <code>transaction_id</code>. You need both for status checks and support.</p>')}
${callout(`<p>Egypt, Philippines and other corridors: check the <a href="${IGE_DOCS}/payout.shtml" target="_blank" rel="noopener">payout reference</a> and confirm with PayFuture that they are enabled for your MID. ${TC}</p>`)}
${src(['Payout reference', IGE_DOCS + '/payout.shtml'])}`;

I.status = () => `<h1>Check status</h1>
<p class="lead">Use <code>GetStatus</code> to confirm a payout's final result, especially before acting on a callback. ${LIVE}</p>
${code(`{
  "requestType": "GetStatus",
  "data": {
    "midcode": "<your MID>",
    "transaction_id": "INV78I1757502089824",
    "transaction_type": "payout",
    "hash": "<SHA256(midcode~transaction_id~transaction_type~midsecret)>"
  }
}`)}
<p><code>transaction_type</code> must be lower case (<code>payout</code> or <code>payin</code>), in the request and in the hash. The response includes <code>status</code>, <code>utrnumber</code> (the bank reference for India) and a response hash.</p>
${table(['Status', 'Meaning', 'Final?'], [
  ['<code>PENDING</code>', 'Accepted, waiting to be sent', 'No'],
  ['<code>IN-PROCESS</code>', 'Sent to the bank or wallet', 'No'],
  ['<code>APPROVED</code>', 'Paid to the beneficiary', '<b>Yes</b>'],
  ['<code>DECLINED</code>', 'Failed or rejected; funds stay in your balance', '<b>Yes</b>'],
])}
${callout(`<p>Looking up by your own <code>merchant_ref_no</code> instead of <code>transaction_id</code> is ${TESTING}. Use <code>transaction_id</code> until it is live.</p>`)}
${src(['Other operations', IGE_DOCS + '/other.shtml'])}`;

I.callbacks = () => `<h1>Callbacks</h1>
<p class="lead">IGE sends one <code>POST</code> to your <code>notificationUrl</code> when a payout reaches a final status. It is form-encoded (<code>application/x-www-form-urlencoded</code>), not JSON. ${LIVE}</p>
${table(['Field', 'Description'], [
  ['<code>payoutid</code>', 'PayFuture transaction ID'], ['<code>reference1</code>', 'Your <code>merchantRefNo</code>'],
  ['<code>amount</code>, <code>currency</code>', 'Payout amount'], ['<code>status</code>', 'Final status'],
  ['<code>utrnumber</code>', 'Bank reference (India)'], ['<code>errorcode</code>, <code>remark</code>', 'Reason, when declined'],
  ['<code>payoutby</code>', 'Instant or Batch'], ['<code>key</code>', 'Your MID'], ['<code>hash</code>', 'Signature to verify'],
])}
<h2>Verify the callback</h2>
<p>Recompute <code>SHA256(midcode + transactionid + amount + midsecret)</code>, joined with <b>no separator</b>, and compare it to <code>hash</code>. The <a href="#/ige/signing">calculator</a> has this formula. ${TC}</p>
${callout(`<p><b>Plan for these:</b></p><ul>
<li>The callback hash does not cover <code>status</code>. Before you act on a final status, confirm it with <a href="#/ige/status">GetStatus</a>.</li>
<li>Reply HTTP 200 quickly. Anything else counts as a failure, and IGE retries only a few times.</li>
<li>Only one callback is sent per payout. Reconcile daily with <a href="#/ige/reconciliation">GetTransactionList</a> to catch any later change.</li></ul>`, 'warn')}
${src(['Payout reference · Callback', IGE_DOCS + '/payout.shtml'])}`;

I.reconciliation = () => `<h1>Balance & reconciliation</h1>
<h2>GetBalance</h2>
<p>Hash: <code>SHA256(midcode~midsecret)</code>. Returns <code>available_balance</code>, <code>running_balance</code>, <code>available_instant_payout_balance</code> and <code>currency</code>.</p>
${code(`{
  "requestType": "GetBalance",
  "data": { "midcode": "<your MID>", "hash": "<SHA256(midcode~midsecret)>" }
}`)}
<h2>GetTransactionList</h2>
<p>Lists your transactions for reconciliation: up to 100 per page (<code>skip</code>, <code>take</code>), up to 180 days back. Dates are IST for merchants registered in India and UTC for everyone else. It uses a <code>signature</code> field: <code>SHA256(midcode~midsecret)</code>.</p>
${callout(`<p>If your balance is too low when you send a payout, you may get error <code>11081</code>, or the payout may wait as <code>PENDING</code> until you fund. ${TC} Always check <code>GetBalance</code> first.</p>`)}
${src(['Get Balance', IGE_DOCS + '/balance.shtml'], ['Other operations', IGE_DOCS + '/other.shtml'])}`;

I.limits = () => `<h1>Limits & coverage</h1>
<p class="lead">Typical limits per payout. Your contracted limits may differ; ask PayFuture for yours.</p>
${table(['Country', 'Method', 'Per payout', 'Speed'], [
  ['India', 'IMPS', `INR 1,000 – 400,000 ${TC}`, 'Real time, 24x7'],
  ['India', 'NEFT', 'From INR 200,000, no maximum', 'Same day, about 45 minutes'],
  ['Pakistan', 'Bank, Easypaisa, JazzCash', 'PKR 100 – 200,000', 'T+1; bank cut-off 4:00 PM PKT'],
  ['Nigeria', 'Bank transfer', 'NGN 100 – 10,000,000', 'T+3'],
  ['Egypt', 'Bank transfer, wallet', 'EGP 100 – 150,000', 'T+5'],
])}
<ul><li>India payouts support B2B, B2C, C2B and C2C. Business payouts need an invoice and GST number.</li><li>The bank reference (UTR) is returned in the callback.</li><li>Pakistan account titles are verified before funds move.</li></ul>
${src(['coverage.payfuture.net', COVERAGE])}`;

I.testing = () => `<h1>Testing on a live MID</h1>
<p class="lead">IGE has <b>no sandbox</b> for merchants. You test in production on a MID with low limits and a small real top-up. Every test payout moves real money.</p>
${steps([
  ['Get a limited live MID', 'Ask PayFuture, and get your server IPs whitelisted.'],
  ['Fund a small amount', 'Send a small USDT amount and confirm it with <code>GetBalance</code>.'],
  ['One payout per method', 'Send to an account you control, for each method you will use.'],
  ['Check the callback, then the status', 'Verify the callback hash and confirm with <code>GetStatus</code>.'],
  ['Test a failure', 'Send a wrong hash and check you handle error <code>11031</code>.'],
  ['Go live', 'Ask PayFuture to raise your limits once your results are signed off.'],
])}`;

I.errors = () => {
  const rows = ENT_DATA.igeErrors;
  return `<h1>Error codes</h1>
<p class="lead">Errors come back in <code>error[]</code> as <code>{errorCode, errorMessage}</code>, with HTTP 200.</p>
<h2>The ones you'll see most</h2>
${table(['Code', 'Meaning', 'What to do'], [
  ['<code>11031</code>', 'Hash or signature mismatch', 'Check field order, two-decimal amount and secret case'],
  ['<code>11081</code>', 'Insufficient balance', 'Fund, then retry with a new <code>merchantRefNo</code>'],
  ['<code>11088</code>', 'Payout disabled for this MID', 'Contact PayFuture'],
  ['<code>11120</code>, <code>11121</code>, <code>11397</code>, <code>11398</code>', 'Daily limit reached', 'Retry the next day or ask for a higher limit'],
  ['<code>11346</code>–<code>11350</code>', 'Rejected by the beneficiary bank', 'Check the beneficiary details'],
])}
<h2>All codes</h2>
<p><input id="errSearch" placeholder="Search codes or messages…" style="width:100%;max-width:420px;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)"> <span id="errCount" class="src">${rows.length} codes</span></p>
<table id="errTable"><thead><tr><th>Code</th><th>Message</th></tr></thead><tbody>${rows.map(([c, m]) => `<tr><td><code>${esc(c)}</code></td><td>${esc(m)}</td></tr>`).join('')}</tbody></table>
${src(['Error codes', IGE_DOCS + '/error-code.shtml'])}`;
};

I.faq = () => {
  const q = (t, a) => `<h3>${t}</h3>${a}`;
  return `<h1>FAQ</h1>
${q('Can I use my Legacy (paygate10.com) MID on IGE?', '<p>No. IGE and Legacy use different hosts, MIDs and secrets.</p>')}
${q('Why do I get HTTP 403?', '<p>Your server IP is not whitelisted. Send PayFuture the IP.</p>')}
${q('Which statuses are final?', '<p>Only <code>APPROVED</code> and <code>DECLINED</code>.</p>')}
${q('I did not receive a callback.', '<p>Check that your <code>notificationUrl</code> is public HTTPS and returns 200, then call <a href="#/ige/status">GetStatus</a>.</p>')}
${q('Can I send decimal amounts?', `<p>Hash amounts with two decimals. Some methods accept only whole amounts. ${TC}</p>`)}
${q('Is there a sandbox?', '<p>No. See <a href="#/ige/testing">Testing on a live MID</a>.</p>')}`;
};

/* ================= CBS ================= */
NAV.cbs = [
  ['Get started', [['start', 'Welcome'], ['onboarding', 'Before you start'], ['auth', 'Authentication']]],
  ['Build', [['funding', 'Funding & balances'], ['payout-inr', 'Send an INR payout'], ['payout-pkr', 'Send a PKR payout'], ['status', 'Check status'], ['webhooks', 'Webhooks']]],
  ['Reference', [['endpoints', 'Endpoints'], ['errors', 'Errors'], ['limits', 'Limits & coverage']]],
  ['Test and go live', [['testing', 'Testing']]],
];

C.start = () => `<h1>CBS · Core Banking API</h1>
<p class="lead">Hold a fiat account with PayFuture and send payouts from it through a REST API. You authenticate with an API key, then call the gateway with a Bearer token. ${LIVE}</p>
${table(['Environment', 'Base URL', 'Status'], [
  ['Production · payments', '<code>https://secure-mtapi.payfuturefs.com/gateway</code>', LIVE],
  ['Production · auth', '<code>https://secure-mtapi.payfuturefs.com/auth</code>', LIVE],
  ['CBS Demo', `Same APIs; going live means swapping the API key. Merchant access ${TC}`, TESTING],
])}
<p>Successful calls return HTTP 200. Errors use real HTTP status codes with an error body (see <a href="#/cbs/errors">Errors</a>).</p>
${steps([['Get your API key and account holder ID', 'See <a href="#/cbs/onboarding">Before you start</a>.'], ['Get a token', 'See <a href="#/cbs/auth">Authentication</a>.'], ['Check your balance and send a payout', 'See <a href="#/cbs/payout-inr">Send an INR payout</a>.'], ['Poll for the final status', 'See <a href="#/cbs/status">Check status</a>.']])}
${src(['Core Banking API reference', CBS_DOCS], ['Account Management API reference', AUTH_DOCS])}`;

C.onboarding = () => `<h1>Before you start</h1>
${steps([
  ['API key', 'PayFuture creates your CBS client and API key. The key is shown <b>once</b>, so store it in a secrets manager straight away.'],
  ['Account holder ID', `PayFuture support gives you the value for the <code>X-ACCOUNT-HOLDER-ID</code> header. ${TC}`],
  ['IP whitelisting', `Token requests from an IP that is not allowed return HTTP 401 "restricted IP". Send PayFuture your server IPs. ${TC}`],
  ['Source account', 'After you authenticate, call <code>GET /accounts</code> to find the <code>accountNumber</code> you will pay out from.'],
])}
${src(['Account Management API · API Keys', AUTH_DOCS], ['Core Banking API', CBS_DOCS])}`;

C.auth = () => `<h1>Authentication</h1>
<p class="lead">Exchange your API key for a Bearer token, then send the token and your account holder ID on every gateway call. ${LIVE}</p>
<h2>1. Get a token</h2>
${ep('POST', 'https://secure-mtapi.payfuturefs.com/auth/oauth/gettoken')}
${code(`POST /auth/oauth/gettoken
Authorization: Basic <your API key>
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials`, 'http')}
<p>The response holds <code>access_token</code> (a JWT) and <code>expires_in</code> (3600 seconds in the reference example). Refresh with <code>POST /auth/oauth/token/refresh</code> while the token is still valid, or request a new one.</p>
<h2>2. Call the gateway</h2>
${code(`GET /gateway/accounts/balances
Authorization: Bearer <access_token>
X-ACCOUNT-HOLDER-ID: <your account holder ID>`, 'http')}
${table(['HTTP', 'Meaning'], [['400', 'Bad credentials'], ['401', 'Restricted IP'], ['403', 'Disabled or expired'], ['423', 'Locked'], ['428', 'Two-factor code required (<code>X-TOTP-CODE</code>)']])}
${callout('<p>CBS has no request signing. Security relies on the token and TLS, so never log or expose your API key or tokens.</p>')}
${src(['Account Management API · Authentication', AUTH_DOCS])}`;

C.funding = () => `<h1>Funding & balances</h1>
<p class="lead">Your CBS account holds a fiat balance, such as USD or EUR. Payouts are debited from it and converted to the payout currency. ${LIVE}</p>
${table(['Call', 'Use'], [
  ['<code>GET /accounts</code>', 'List your accounts and their account numbers'],
  ['<code>GET /accounts/balances</code>', 'Check balances before sending payouts'],
  ['<code>GET /exchange-rate/v2/{source}/{destination}</code>', 'Read the current rate, for example USD to INR'],
])}
<ul><li>Fiat funding cut-off for EMI merchants: 7:00 PM CET.</li><li>How to deposit fiat into your CBS account: your PayFuture contact will give you instructions. ${TC}</li></ul>
${callout(`<p>Funding CBS payouts from a <b>USDT</b> account is ${PLANNED}. It is not available yet.</p>`)}
${src(['Core Banking API · Accounts', CBS_DOCS])}`;

C['payout-inr'] = () => `<h1>Send an INR payout</h1>
<p class="lead">No saved beneficiary is needed: send the beneficiary's bank details on each payout. ${LIVE}</p>
${ep('POST', '/gateway/transfers/outbound-cbs')}
${code(`{
  "uniqueTransactionReference": "PO-000123",
  "reference": "Invoice 4471",
  "amount": { "value": 1500.00, "currency": "INR" },
  "sourceAccountNumber": "<your CBS account number>",
  "description": "Supplier payment",
  "relation": "Supplier",
  "reason": "Payment for services",
  "countryCode": "IN",
  "residenceCountry": "IN",
  "recipientName": "Asha Rao",
  "accountNumber": "000000000000",
  "bankIfsc": "EXMP0000001",
  "bankName": "Example Bank",
  "receiverType": "INDIVIDUAL",
  "senderType": "BUSINESS",
  "senderFullName": "Example Ltd",
  "senderIdNumber": "REG-12345",
  "senderAddress": "1 Example Street",
  "senderCountryCode": "GB"
}`)}
<p class="src">Example built from the request schema with placeholder values. ${TC}</p>
${fields([
  ['uniqueTransactionReference', 'string 1–60', true, 'Your unique ID for this payout; used for idempotency'],
  ['reference', 'string 1–60', true, 'Your reference; used to look up status'],
  ['amount', 'object', true, '<code>{value, currency}</code>, ISO currency code'],
  ['sourceAccountNumber', 'string', true, 'The CBS account to debit'],
  ['description', 'string ≤255', true, 'What the payout is for'],
  ['relation', 'string ≤100', true, 'Relationship between sender and receiver'],
  ['reason', 'string ≤100', true, 'Reason for the transfer'],
  ['countryCode', 'ISO-2', true, "Recipient bank's country"],
  ['residenceCountry', 'ISO-2', true, "Recipient's country of residence"],
  ['recipientName', 'string ≤80', true, 'Beneficiary legal name'],
  ['accountNumber', 'string ≤50', true, 'Beneficiary account number'],
  ['bankIfsc', 'string', true, 'IFSC code'],
  ['bankName', 'string ≤100', true, 'Beneficiary bank name'],
  ['receiverType', 'INDIVIDUAL | BUSINESS', true, ''],
  ['senderType', 'INDIVIDUAL | BUSINESS', true, ''],
  ['senderFullName', 'string 2–80', true, 'Sender name'],
  ['senderIdNumber', 'string 2–30', true, 'Sender ID or registration number'],
  ['senderAddress', 'string ≤255', true, 'Sender address'],
  ['senderCountryCode', 'ISO-2', true, "Sender's country"],
  ['senderDob', 'string', 'Conditional', 'Required when <code>senderType</code> is INDIVIDUAL (example <code>01/02/2003</code>)'],
  ['city, postcode, senderNationality, senderPostCode, senderCity', 'string', false, ''],
])}
<h2>Response</h2>
<p>HTTP 200 with the transaction: <code>id</code>, <code>transactionStatus</code>, <code>amount</code>, <code>actualAmount</code>, <code>feeAmount</code>, <code>chargedAmount</code>, <code>reference</code>, <code>transactionNumber</code>, and on failure <code>errorCode</code> and <code>errorMessage</code>. Store <code>id</code> for status checks.</p>
${src(['Core Banking API · Transactions', CBS_DOCS])}`;

C['payout-pkr'] = () => `<h1>Send a PKR payout</h1>
<p class="lead">${TESTING} Not yet available to merchants. Ask PayFuture before building against it.</p>
${ep('POST', '/gateway/transfers/outbound-cbs/pkr')}
<p>It takes the same sender and recipient fields as the <a href="#/cbs/payout-inr">INR payout</a>, without the India bank fields, plus:</p>
${fields([
  ['paymentMethod', 'EASYPAISA | JAZZCASH | BANK_TRANSFER', true, 'The PKR payout method'],
  ['paymentDetails', 'object', true, 'Depends on <code>paymentMethod</code>, see below'],
])}
${tabs([
  ['Wallet', code(`"paymentDetails": { "walletNumber": "03000000000", "documentId": "0000000000000" }`)],
  ['Bank transfer', code(`"paymentDetails": { "accountNumber": "PK00XXXX0000000000000000", "accountName": "Test Beneficiary", "bankCode": "<code from the supported bank list>" }`)],
])}
<p>Wallet numbers are 11 digits starting with 03. Bank accounts are 24-character IBANs with no spaces.</p>
${src(['Core Banking API · Transactions', CBS_DOCS])}`;

C.status = () => `<h1>Check status</h1>
<p class="lead">CBS has no callbacks yet, so poll for the final status. ${LIVE}</p>
${ep('GET', '/gateway/transactions/{transactionId}')}
${ep('GET', '/gateway/transactions/ref/{reference}')}
${ep('GET', '/gateway/transactions')}
${table(['<code>transactionStatus</code>', 'Final?'], [
  ['<code>CREATED</code>, <code>PENDING_APPROVAL</code>, <code>APPROVED</code>, <code>PROCESSING</code>, <code>PENDING</code>', 'No'],
  ['<code>COMPLETED</code>', '<b>Yes</b>: paid'],
  ['<code>DECLINED</code>, <code>FAILED</code>, <code>CANCELLED</code>', '<b>Yes</b>: not paid'],
])}
<p>For reconciliation, use <code>GET /transactions</code> or download statements from <code>/reports/transactions/csv</code> and <code>/reports/transactions/pdf</code>.</p>
${src(['Core Banking API · Transactions, Reporting', CBS_DOCS])}`;

C.webhooks = () => `<h1>Webhooks</h1>
<p class="lead">${PLANNED} CBS does not send webhooks yet. Poll <a href="#/cbs/status">transaction status</a> until a payout is final.</p>
<p>Events, payload and signature verification will be documented here when webhooks are released.</p>`;

C.endpoints = () => `<h1>Endpoints</h1>
<p class="lead">The merchant-facing endpoints. Base URL <code>https://secure-mtapi.payfuturefs.com</code>.</p>
${table(['Method', 'Path', 'Purpose', 'Status'], [
  ['POST', '<code>/auth/oauth/gettoken</code>', 'Get an access token', LIVE],
  ['POST', '<code>/auth/oauth/token/refresh</code>', 'Refresh a token', LIVE],
  ['GET', '<code>/gateway/accounts</code>', 'List accounts', LIVE],
  ['GET', '<code>/gateway/accounts/balances</code>', 'Balances', LIVE],
  ['GET', '<code>/gateway/exchange-rate/v2/{source}/{destination}</code>', 'Exchange rate', LIVE],
  ['POST', '<code>/gateway/transfers/outbound-cbs</code>', 'INR payout', LIVE],
  ['POST', '<code>/gateway/transfers/outbound-cbs/pkr</code>', 'PKR payout', TESTING],
  ['GET', '<code>/gateway/transactions/{transactionId}</code>', 'Status by ID', LIVE],
  ['GET', '<code>/gateway/transactions/ref/{reference}</code>', 'Status by your reference', LIVE],
  ['GET', '<code>/gateway/transactions</code>', 'List transactions', LIVE],
  ['GET', '<code>/gateway/reports/transactions/csv</code>, <code>/pdf</code>', 'Statements', LIVE],
])}
<p>The full reference also covers beneficiaries, account verification and report requests.</p>
${src(['Core Banking API reference', CBS_DOCS])}`;

C.errors = () => {
  const codes = ENT_DATA.cbsErrors;
  return `<h1>Errors</h1>
<p class="lead">Failed requests return a non-200 status with an error body. A failed payout also carries <code>errorCode</code> on the transaction.</p>
${code(`{
  "httpStatus": 400,
  "errorCode": "INSUFFICIENT_FUNDS",
  "message": "…",
  "traceId": "…",
  "errorId": 0,
  "fieldErrors": [ { "fieldName": "bankIfsc", "errorMessage": "…" } ],
  "requestPath": "/gateway/transfers/outbound-cbs",
  "httpMethod": "POST",
  "timestamp": "…"
}`)}
${callout('<p>Always log <code>traceId</code>. PayFuture support needs it to investigate.</p>')}
<h2>Common codes</h2>
${table(['Code', 'What to do'], [
  ['<code>INSUFFICIENT_FUNDS</code>', 'Fund the source account, then retry'],
  ['<code>IFSC_LOOKUP_FAILED</code>', 'Check <code>bankIfsc</code>'],
  ['<code>INVALID_MINIMUM_AMOUNT</code>, <code>INVALID_MAXIMUM_AMOUNT</code>', 'Amount outside your limits'],
  ['<code>NO_VALID_ROUTE_FOUND_FOR_TX</code>, <code>CURRENCY_PAIR_NOT_AVAILABLE</code>', 'Corridor not enabled for you; contact PayFuture'],
  ['<code>TRANSACTION_NOT_PERMITTED</code>, <code>ACCESS_DENIED</code>', 'Check permissions and <code>X-ACCOUNT-HOLDER-ID</code>'],
])}
<h2>All transaction error codes</h2>
<p><input id="errSearch" placeholder="Search codes…" style="width:100%;max-width:420px;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)"> <span id="errCount" class="src">${codes.length} codes</span></p>
<table id="errTable"><thead><tr><th>Code</th></tr></thead><tbody>${codes.map(c => `<tr><td><code>${esc(c)}</code></td></tr>`).join('')}</tbody></table>
${src(['Core Banking API · schemas', CBS_DOCS])}`;
};

C.limits = () => `<h1>Limits & coverage</h1>
<p class="lead">CBS limits are set per account. Ask PayFuture for your contracted minimum and maximum per payout. ${TC}</p>
${table(['Corridor', 'Endpoint', 'Status'], [
  ['India (INR)', '<code>/transfers/outbound-cbs</code>', LIVE],
  ['Pakistan (PKR)', '<code>/transfers/outbound-cbs/pkr</code>', TESTING],
])}
<p>Amounts outside your limits return <code>INVALID_MINIMUM_AMOUNT</code> or <code>INVALID_MAXIMUM_AMOUNT</code>.</p>`;

C.testing = () => `<h1>Testing</h1>
<p class="lead">There is no public CBS sandbox yet; a merchant sandbox is ${PLANNED}. Ask PayFuture whether you can use the CBS Demo environment. ${TC}</p>
<p>If you test in production, use small amounts:</p>
${steps([
  ['Authenticate', 'Get a token, then call <code>GET /accounts</code> and <code>GET /accounts/balances</code>.'],
  ['One small payout', 'Send to an account you control.'],
  ['Poll to a final status', 'Call <code>GET /transactions/ref/{reference}</code> until it is final.'],
  ['Check idempotency', `Send the same <code>uniqueTransactionReference</code> twice and confirm no second payout is created. ${TC}`],
  ['Check error handling', 'Send a wrong IFSC and handle the error body.'],
])}`;

render();
