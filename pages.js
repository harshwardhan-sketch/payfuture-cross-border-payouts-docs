/* API reference (#/api/...): one endpoint for payouts, balances, status and reconciliation.
   Source: document.payfuture.net (payout, balance, other, error-code pages; checked 9 Nov 2026). India only. */

const I = PAGES.api;

NAV.api = [
  ['Get started', [['start', 'Overview'], ['onboarding', 'Before you start'], ['signing', 'Authentication & signing']]],
  ['Payouts', [['payout', 'Send a payout'], ['status', 'Check status'], ['callbacks', 'Callbacks']]],
  ['Operations', [['reconciliation', 'Balance & reconciliation']]],
  ['Troubleshooting', [['errors', 'Error codes']]],
];

I.start = () => `<h1>Payouts API</h1>
<p class="lead">One endpoint for everything you do in code: send payouts, check your balance, check a payout's status and pull your transactions for reconciliation. Every payout also gets a callback.</p>
${table(['Environment', 'URL'], [
  ['Production', `<code>${API_URL}</code>`],
  ['Sandbox', 'None. You test on a limited live MID (see <a href="#/guide/go-live">Test & go live</a>)'],
])}
<p>Every call is <code>POST</code> to the same URL, with <code>Content-Type: application/json</code> and the header <code>api-version: 2.0</code>. The operation is chosen by <code>requestType</code>:</p>
${table(['requestType', 'What it does'], [
  ['<code>PAYOUT</code>', 'Send money to a bank account in India. <a href="#/api/payout">Send a payout</a>'],
  ['<code>GetBalance</code>', 'Your available balance. <a href="#/api/reconciliation">Balance & reconciliation</a>'],
  ['<code>GetStatus</code>', 'The status of one payout. <a href="#/api/status">Check status</a>'],
  ['<code>GetTransactionList</code>', 'Your transactions, for reconciliation. <a href="#/api/reconciliation">Balance & reconciliation</a>'],
])}
${code(`{
  "requestType": "PAYOUT",
  "data": { "midCode": "<your MID>", "...": "..." }
}`)}
${callout('<p><b>The API always answers HTTP 200</b>, even for errors. Read <code>success</code> and <code>error[]</code> in the body. The only exception is HTTP 403 when your server IP is not whitelisted.</p>')}
${src(['document.payfuture.net', API_DOCS])}`;

I.onboarding = () => `<h1>Before you start</h1>
<p class="lead">You need four things from onboarding before your first call.</p>
${steps([
  ['MID and MID secret', 'PayFuture issues these. The secret signs every request, so keep it on your server only, never in an app or browser.'],
  ['IP whitelisting', 'Send PayFuture the public IPs of the servers that will call the API. Calls from other IPs get HTTP 403.'],
  ['Callback URL', 'A public HTTPS URL on your side. You send it on each payout in <code>merchantUrl.notificationUrl</code>.'],
  ['Funding instructions', 'PayFuture Finance gives you the USDT address or the bank details for USD and EUR. They are never published on this site.'],
])}
${callout('<p><b>Not the PayFuture Gateway.</b> Payouts run on <code>igateway-gwapi.payfuture.net</code>. Gateway (paygate10.com) MIDs and secrets do not work here.</p>', 'warn')}
${src(['document.payfuture.net', API_DOCS])}`;

/* every formula the site shows; the hash playground uses the same list */
const SIG_RECIPES = [
  ['payout', 'Payout · India Net Banking', 'SHA256(midcode~amount~currency~bank_name~midsecret)'],
  ['resp', 'Payout response (verify)', 'SHA256(midcode~transactionid~merchantrefno~txnstatus~amount~midsecret)'],
  ['callback', 'Payout callback (verify)', 'SHA256(midcode transactionid amount midsecret)'],
  ['getstatus', 'GetStatus request', 'SHA256(midcode~transaction_id~transaction_type~midsecret)'],
  ['getbalance', 'GetBalance request', 'SHA256(midcode~midsecret)'],
  ['txlist', 'GetTransactionList signature', 'SHA256(midcode~midsecret)'],
];

I.signing = () => `<h1>Authentication & signing</h1>
<p class="lead">There is no login or token. Each request is authenticated by your MID and a signature made with your MID secret. Use the HMAC header for new integrations.</p>
${table(['Method', 'How it works'], [
  ['HMAC header (recommended)', '<code>X-Callback-Signature: sha256=&lt;hex&gt;</code>, where hex = HMAC-SHA256(key = MID secret in lower case, message = the exact raw request body). When it is valid, the body <code>hash</code> is not required.'],
  ['Body hash', '<code>hash</code> = SHA-256 of named fields joined with <code>~</code>, in the order of the formula.'],
])}
${callout('<p><b>Sign the exact bytes you send.</b> Serialise the JSON first, then sign it. Re-serialising or adding whitespace after signing breaks the HMAC, and a wrong signature returns error <code>11031</code>. Despite its name, <code>X-Callback-Signature</code> signs your request to PayFuture, not callbacks.</p>', 'warn')}
<h2>Body hash rules</h2>
<ul><li>Amount with exactly two decimals, for example <code>1500.00</code>.</li><li>MID secret in lower case.</li><li>Fields in the exact order of the formula, joined with <code>~</code>. The callback hash uses <b>no separator</b>.</li><li>Output: lower-case hex.</li></ul>
${table(['Request', 'Formula'], SIG_RECIPES.map(([, l, f]) => [l, `<code>${f}</code>${f.includes('~') ? '' : ' <span class="muted">(joined with no separator)</span>'}`]))}
<div class="callout ok"><p><b>Want to try it?</b> The <a href="#/playground">hash playground</a> builds every formula above, signs HMAC bodies and diagnoses hashes that don't match.</p></div>
${src(['document.payfuture.net · Request signature', API_DOCS], ['Payout hashes', API_DOCS + '/payout.shtml'])}`;

I.payout = () => `<h1>Send a payout</h1>
<p class="lead"><code>requestType: "PAYOUT"</code>. The response only confirms the payout was accepted; the final result comes by callback.</p>
${ep('POST', API_URL)}
${code(`{
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
    "userInfo": {
      "firstName": "Asha",
      "lastName": "Rao",
      "phone": "9000000000",
      "email": "asha@example.com"
    },
    "paymentMethod": "NB",
    "paymMethodFields": {
      "account_number": "000000000000",
      "account_name": "Asha Rao",
      "bank_name": "Example Bank",
      "bank_ifsc": "EXMP0000001",
      "payout_type": "Individual"
    }
  }
}`)}
<h2>Request fields</h2>
${fields([
  ['midCode', 'String', true, 'Your MID.'],
  ['integrationType', 'String', true, '<code>S</code> (seamless).'],
  ['amount', 'Number', true, 'Payout amount. Hash it with two decimals.'],
  ['hash', 'String', 'Unless HMAC', 'SHA-256 body hash. Not required when the request carries a valid <code>X-Callback-Signature</code> header.'],
  ['currency, country', 'String', true, '<code>INR</code>, <code>IN</code>.'],
  ['merchantUrl.notificationUrl', 'String', true, 'Your callback URL.'],
  ['merchantRefNo', 'String', true, 'Your unique reference for this payout.'],
  ['userInfo', 'Object', true, 'India payouts: <code>firstName</code>, <code>lastName</code>, <code>phone</code> (10–14), <code>email</code>. Optional: <code>ipAddress</code>, <code>city</code>, <code>postCode</code>, <code>address</code>, <code>state</code>.'],
  ['paymentMethod', 'String', true, '<code>NB</code> (Net Banking).'],
  ['paymMethodFields', 'Object', true, 'See below.'],
  ['customField', 'Object', false, '<code>customField1</code>…<code>customField5</code>, returned to you unchanged.'],
])}
<h2>paymMethodFields</h2>
${fields([
  ['account_number', 'String', true, 'Beneficiary\'s bank account number.'],
  ['account_name', 'String', true, 'Name of the account holder.'],
  ['bank_name', 'String', true, 'Beneficiary\'s bank name. Part of the hash.'],
  ['bank_ifsc', 'String', true, 'IFSC of the branch.'],
  ['payout_type', 'String', true, '<code>Individual</code> or <code>Corporate</code>.'],
  ['bank_branch, bank_address', 'String', false, 'Branch details.'],
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
${callout('<p>Make <code>merchantRefNo</code> unique for every payout, and store PayFuture\'s <code>transaction_id</code>. You need both for status checks and support.</p>')}
${src(['Payout reference', API_DOCS + '/payout.shtml'])}`;

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
<p><code>transaction_type</code> is <code>payout</code>, in lower case, in the request and in the hash. The response includes <code>status</code>, <code>utrnumber</code> (the bank reference) and a response hash.</p>
${table(['Status', 'Meaning', 'Final?'], [
  ['<code>PENDING</code>', 'Accepted, waiting to be sent', 'No'],
  ['<code>IN-PROCESS</code>', 'Sent to the bank', 'No'],
  ['<code>APPROVED</code>', 'Paid to the beneficiary', '<b>Yes</b>'],
  ['<code>DECLINED</code>', 'Failed or rejected; funds stay in your balance', '<b>Yes</b>'],
])}
${src(['Other operations', API_DOCS + '/other.shtml'])}`;

I.callbacks = () => `<h1>Callbacks</h1>
<p class="lead">PayFuture sends one <code>POST</code> to your <code>notificationUrl</code> when a payout reaches a final status. It is form-encoded (<code>application/x-www-form-urlencoded</code>), not JSON.</p>
${table(['Field', 'Description'], [
  ['<code>payoutid</code>', 'PayFuture transaction ID'], ['<code>reference1</code>', 'Your <code>merchantRefNo</code>'],
  ['<code>amount</code>, <code>currency</code>', 'Payout amount'], ['<code>status</code>', 'Final status'],
  ['<code>utrnumber</code>', 'Bank reference (UTR)'], ['<code>errorcode</code>, <code>remark</code>', 'Reason, when declined'],
  ['<code>payoutby</code>', 'Instant or Batch'], ['<code>key</code>', 'Your MID'], ['<code>hash</code>', 'Signature to verify'],
])}
<h2>Verify the callback</h2>
<p>Recompute <code>SHA256(midcode + transactionid + amount + midsecret)</code>, joined with <b>no separator</b>, with the amount in two decimals and the secret in lower case. Compare it to <code>hash</code>. The <a href="#/playground">hash playground</a> has this formula.</p>
${callout(`<p><b>Plan for these:</b></p><ul>
<li>The callback hash does not cover <code>status</code>. Before you act on a final status, confirm it with <a href="#/api/status">GetStatus</a>.</li>
<li>Reply HTTP 200 quickly. Anything else counts as a failure.</li>
<li>Reconcile daily with <a href="#/api/reconciliation">GetTransactionList</a> to catch anything you missed.</li></ul>`, 'warn')}
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

const ERR_GROUPS = [
  ['Request & signature', 'Fix the request or signature, then retry with the same <code>merchantRefNo</code>.'],
  ['Payout details', 'Fix the beneficiary or payout fields, then send again.'],
  ['Balance & limits', 'Fund your balance or wait for the limit to reset, then send again with a new <code>merchantRefNo</code>.'],
  ['Bank or wallet outcome', 'The bank refused the payout. Check the beneficiary details with your customer before retrying.'],
  ['Status & reports', 'Fix the GetStatus or GetTransactionList request.'],
];
I.errors = () => {
  const rows = ENT_DATA.errors;
  return `<h1>Error codes</h1>
<p class="lead">Errors come back in <code>error[]</code> as <code>{errorCode, errorMessage}</code>, with HTTP 200. This list has the ${rows.length} codes a payout integration can return, grouped by what to do next.</p>
<h2>The ones you'll see most</h2>
${table(['Code', 'Meaning', 'What to do'], [
  ['<code>11031</code>', 'Hash or signature mismatch', 'Check field order, two-decimal amount and secret case in the <a href="#/playground">hash playground</a>'],
  ['<code>11027</code>', 'Duplicate <code>merchantRefNo</code>', 'This reference was already used. Check its status instead of sending again'],
  ['<code>11081</code>', 'Insufficient balance', 'Fund, then retry with a new <code>merchantRefNo</code>'],
  ['<code>11088</code>', 'Payout disabled for this MID', 'Contact PayFuture'],
  ['<code>11120</code>, <code>11121</code>, <code>11397</code>, <code>11398</code>', 'Daily limit reached', 'Retry the next day or ask for a higher limit'],
  ['<code>11346</code>–<code>11350</code>', 'Rejected by the beneficiary bank', 'Check the beneficiary details'],
])}
<h2>All codes</h2>
<div class="chips" id="errGroups"><button class="chip on" data-g="">All</button>${ERR_GROUPS.map(([g]) => `<button class="chip" data-g="${g}">${g}</button>`).join('')}</div>
<p id="errHint" class="muted"></p>
<p><input id="errQ" type="search" placeholder="Search codes or messages…" aria-label="Search error codes"> <span id="errCount" class="src">${rows.length} codes</span></p>
<table id="errTable"><thead><tr><th>Code</th><th>Message</th><th>Group</th></tr></thead><tbody>${rows.map(([c, m, g]) => `<tr data-g="${g}"><td><code>${esc(c)}</code></td><td>${esc(m)}</td><td>${g}</td></tr>`).join('')}</tbody></table>
<p class="src">The full list on document.payfuture.net has more codes because it also covers PayFuture products this API doesn't use, such as card and UPI pay-ins. Source: <a href="${API_DOCS}/error-code.shtml" target="_blank" rel="noopener">Error codes</a></p>`;
};
/* #/api/errors/<code> opens the list filtered to that code (used by search) */
INIT.errors = arg => {
  let g = '';
  const q = document.getElementById('errQ'), hint = document.getElementById('errHint');
  const apply = () => {
    const words = q.value.toLowerCase().split(/\s+/).filter(Boolean); let n = 0;
    document.querySelectorAll('#errTable tbody tr').forEach(tr => { const t = tr.textContent.toLowerCase(), show = (!g || tr.dataset.g === g) && words.every(w => t.includes(w)); tr.style.display = show ? '' : 'none'; n += show; });
    document.getElementById('errCount').textContent = n ? `${n} codes` : 'No codes match. Try a code number or one word from the message.';
    hint.innerHTML = g ? `<b>What to do:</b> ${ERR_GROUPS.find(x => x[0] === g)[1]}` : '';
  };
  document.getElementById('errGroups').onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return;
    g = b.dataset.g; document.querySelectorAll('#errGroups .chip').forEach(c => c.classList.toggle('on', c === b)); apply();
  };
  q.oninput = apply;
  if (arg) { q.value = arg; apply(); }
};
