/* API reference (#/api/...): Overview and Before you start are written here; every other page mirrors the live
   API docs (document.payfuture.net) through apiref.js and api-data.js. Re-import with: sh tools/refresh.sh */

const I = PAGES.api;
const OPS = otherOps(F).map(s => ['op-' + s.id, s.title]);

NAV.api = [
  ['Get started', [['start', 'Overview'], ['onboarding', 'Before you start']]],
  /* signing, hashes and callbacks come before the requests: a request needs its hash and notificationUrl */
  ['Before your first request', [['signing', 'Signing & hashes'], ['callbacks', 'Callbacks']]],
  ['Requests', [['payout', 'Payout'], ['payin', 'Payin']]],
  ['Utilities', [['balance', 'Get Balance'], ...OPS]],
  ['Reference', [['errors', 'Error codes']]],
];
/* Every operation (Payout, Payin, Get Balance, utilities) uses the parameters + code panel layout (apiref2.js).
   Status per country, for the badges in the picker: Confluence PMA 1979875329 (India payouts live, Pakistan testing). */
const API_STATUS = (key, country) => key === 'payout' ? ({India: 'live', Pakistan: 'soon'}[country] || 'doc') : 'doc';
Object.keys(API_PAGES).filter(k => k !== 'refund').forEach(k => { I[k] = arg => API2.render(F, k, arg ? dec(arg) : '', API_STATUS); INIT[k] = arg => API2.init(k, arg); });
I.callbacks = () => API2.callbacksPage(F);
OPS.forEach(([id]) => { I[id] = arg => API2.renderOp(F, id.slice(3), arg ? dec(arg) : ''); INIT[id] = arg => API2.init(id, arg); });
/* one page for signing: how to sign, every recipe (finder), how to check our hashes; Try it opens the Hash playground */
I.signing = arg => API2.signingPage(F, arg ? dec(arg) : '');
INIT.signing = arg => { const el = arg && document.getElementById(arg === 'hmac' ? 'hmac' : 'body-hash'); if (el) el.scrollIntoView({block: 'start'}); };
I.errors = arg => errorsPage(F, arg ? dec(arg) : '');
INIT.errors = () => filterErrors();
document.addEventListener('input', e => { if (e.target.id === 'errSearch') filterErrors(); });

I.start = () => {
  const op = (href, rt, name, what) => `<a class="op-card" href="${href}"><span class="method post">POST</span><span class="op-n"><b>${name}</b><code>${rt}</code></span><span class="op-w">${what}</span></a>`;
  const step = (n, href, t, d) => `<a class="seq" href="${href}"><span class="seq-n">${n}</span><span><b>${t}</b><small>${d}</small></span></a>`;
  return `<h1>API overview</h1>
<p class="lead">One endpoint for everything you do in code: send payouts, check your balance and a transaction's status, and pull your transactions for reconciliation. Every transaction also gets a callback.</p>
<div class="ep2"><span class="method post">POST</span><code>${API_URL}</code><button type="button" class="ep2-copy" data-copy-text="${API_URL}" aria-label="Copy endpoint">Copy</button></div>
<div class="ep2-h"><span>Headers</span> <code>Content-Type: application/json</code> <code>api-version: 2.0</code> <span>· the operation is chosen by <code>requestType</code> in the body</span></div>
${callout('<p><b>What is live for you.</b> This reference mirrors the full live API docs at document.payfuture.net, including methods and countries that may not be enabled on your MID. India payouts are live today; see <a href="#/corridors">Corridors</a>, and ask your Payfuture contact before you build anything else.</p>', 'warn')}
<h2>Build in this order</h2>
<div class="seqs">
  ${step(1, '#/api/onboarding', 'Before you start', 'MID and secret, IP whitelisting, callback URL')}
  ${step(2, '#/api/signing', 'Signing & hashes', 'Signature header or body hash, and the recipe for each request')}
  ${step(3, '#/api/callbacks', 'Callbacks', 'What we send to your notificationUrl')}
  ${step(4, '#/api/payout', 'Payout', 'Your first request')}
  ${step(5, '#/api/op-get-status', 'Get Status and Get Balance', 'Check results and funds')}
</div>
<h2>Operations</h2>
<p>Every call is <code>POST</code> to the same URL. The <code>requestType</code> picks the operation:</p>
<div class="op-cards">
  ${op('#/api/payout', 'PAYOUT', 'Payout', 'Send money to a bank account or wallet.')}
  ${op('#/api/payin', 'PAYIN', 'Payin', 'Collect a payment.')}
  ${op('#/api/balance', 'GetBalance', 'Get Balance', 'Your available balance.')}
  ${op('#/api/op-get-status', 'GetStatus', 'Get Status', 'The status of one transaction.')}
  ${op('#/api/op-get-transaction-list', 'GetTransactionList', 'Get Transaction List', 'Your transactions, for reconciliation.')}
</div>
<h2>Environments</h2>
${table(['Environment', 'URL'], [
  ['Production', `<code>${API_URL}</code>`],
  ['Sandbox', 'None. You test on a limited live MID (see <a href="#/guide/go-live">Test & go live</a>)'],
])}
<h2>Request and response shape</h2>
${code(`{
  "requestType": "PAYOUT",
  "data": { "midCode": "<your MID>", "...": "..." }
}`)}
${callout('<p><b>The API always answers HTTP 200</b>, even for errors. Read <code>success</code> and <code>error[]</code> in the body. The only exception is HTTP 403 when your server IP is not whitelisted.</p>')}
${src(['document.payfuture.net', API_DOCS])}`;
};

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

