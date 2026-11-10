/* API reference (#/api/...): Overview and Before you start are written here; every other page mirrors the live
   API docs (document.payfuture.net) through apiref.js and api-data.js. Re-import with: sh tools/refresh.sh */

const I = PAGES.api;
const OPS = otherOps(F).map(s => ['op-' + s.id, s.title]);

NAV.api = [
  ['Get started', [['start', 'Overview'], ['onboarding', 'Before you start'], ['signing', 'Signing & hash calculator']]],
  ['Requests', [['payout', 'Payout'], ['payin', 'Payin'], ['refund', 'Refund']]],
  ['Utilities', [['balance', 'Get Balance'], ...OPS]],
  ['Reference', [['errors', 'Error codes']]],
];
Object.keys(API_PAGES).forEach(k => { I[k] = () => apiPage(F, k); });
OPS.forEach(([id]) => { I[id] = () => opPage(F, id.slice(3)); });
I.signing = () => P.signing(F);
INIT.signing = arg => initCalc(F, arg);
I.errors = arg => errorsPage(F, arg ? decodeURIComponent(arg) : '');
INIT.errors = () => filterErrors();
document.addEventListener('input', e => { if (e.target.id === 'errSearch') filterErrors(); });

I.start = () => `<h1>API overview</h1>
<p class="lead">One endpoint for everything you do in code: send payouts, check your balance and a transaction's status, and pull your transactions for reconciliation. Every transaction also gets a callback.</p>
${table(['Environment', 'URL'], [
  ['Production', `<code>${API_URL}</code>`],
  ['Sandbox', 'None. You test on a limited live MID (see <a href="#/guide/go-live">Test & go live</a>)'],
])}
<p>Every call is <code>POST</code> to the same URL, with <code>Content-Type: application/json</code> and the header <code>api-version: 2.0</code>. The operation is chosen by <code>requestType</code>:</p>
${table(['requestType', 'What it does'], [
  ['<code>PAYOUT</code>', 'Send money to a bank account or wallet. <a href="#/api/payout">Payout</a>'],
  ['<code>PAYIN</code>', 'Collect a payment. <a href="#/api/payin">Payin</a>'],
  ['<code>REFUND</code>', 'Refund an approved pay-in. <a href="#/api/refund">Refund</a>'],
  ['<code>GetBalance</code>', 'Your available balance. <a href="#/api/balance">Get Balance</a>'],
  ['<code>GetStatus</code>', 'The status of one transaction. <a href="#/api/op-get-status">Get Status</a>'],
  ['<code>GetTransactionList</code>', 'Your transactions, for reconciliation. <a href="#/api/op-get-transaction-list">Get Transaction List</a>'],
])}
${callout('<p><b>What is live for you.</b> This reference mirrors the full live API docs at document.payfuture.net, including methods and countries that may not be enabled on your MID. India payouts are live today; see <a href="#/corridors">Corridors</a>, and ask your Payfuture contact before you build anything else.</p>', 'warn')}
${code(`{
  "requestType": "PAYOUT",
  "data": { "midCode": "<your MID>", "...": "..." }
}`)}
${callout('<p><b>The API always answers HTTP 200</b>, even for errors. Read <code>success</code> and <code>error[]</code> in the body. The only exception is HTTP 403 when your server IP is not whitelisted.</p>')}
${src(['document.payfuture.net', API_DOCS])}`;

I.onboarding = () => `<h1>Before you start</h1>
<p class="lead">You need four things from onboarding before your first call.</p>
${steps([
  ['MID and MID secret', 'Payfuture issues these. The secret signs every request, so keep it on your server only, never in an app or browser.'],
  ['IP whitelisting', 'Send Payfuture the public IPs of the servers that will call the API. Calls from other IPs get HTTP 403.'],
  ['Callback URL', 'A public HTTPS URL on your side. You send it on each payout in <code>merchantUrl.notificationUrl</code>.'],
  ['Funding instructions', 'Payfuture Finance gives you the USDT address or the bank details for USD and EUR. They are never published on this site.'],
])}
${callout('<p><b>Not the Payfuture Gateway.</b> Payouts run on <code>igateway-gwapi.payfuture.net</code>. Gateway (paygate10.com) MIDs and secrets do not work here.</p>', 'warn')}
${src(['document.payfuture.net', API_DOCS])}`;

