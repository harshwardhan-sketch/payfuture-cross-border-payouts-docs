/* Integration guide (#/guide/...): learn, build, go live. Guide-first, modelled on Airwallex and Razorpay.
   Scope: India payouts (live). Pakistan: API ready, testing in progress (Confluence PMA 1979875329: coming soon); its API is on #/corridors/pk. Otherwise it only appears as a
   "coming soon" card. Facts come from document.payfuture.net (API), Confluence (live scope, limits) and the
   product offering page (funding currencies, proof of payment). Anything unconfirmed is left out. */

const GD = PAGES.guide;
const IMG = f => `assets/site/${f}`;
const fig = (f, alt) => `<img class="pf-img" src="${IMG(f)}" alt="${esc(alt)}" loading="lazy">`;
const next = (href, label) => `<p class="next"><a class="btn btn-navy" href="${href}">${label} →</a></p>`;
const spec = rows => `<dl class="spec">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
const ramp = nodes => `<div class="ramp">${nodes.map(([t, s], i) => `${i ? '<span class="ramp-arrow" aria-hidden="true">→</span>' : ''}<div class="ramp-node${s === 'hub' ? ' hub' : ''}"><b>${t}</b>${s && s !== 'hub' ? `<span>${s}</span>` : ''}</div>`).join('')}</div>`;
const API_URL = 'https://igateway-gwapi.payfuture.net/api/process/request';
/* India payout facts used on several pages (one place, so they never disagree) */
const IN_LIMITS = 'INR 500 – 400,000 per payout';

NAV.guide = [
  ['Start here', [['welcome', 'Welcome'], ['how-it-works', 'How a payout works'], ['glossary', 'Glossary']]],
  ['Get started', [['journey', 'Integration journey'], ['quickstart', 'Quickstart: your first payout']]],
  ['Build', [['funding', 'Funding & balance']]],
  ['Go live', [['go-live', 'Test & go live'], ['checklist', 'Go-live checklist']]],
  ['Help', [['faq', 'FAQ'], ['support', 'Support']]],
];

/* ================= HOME (#/) ================= */
function home() {
  const ql = (href, t, d) => `<a class="ql" href="${href}"><b>${t}</b><span>${d}</span></a>`;
  return `<section class="ent-hero">
  <div class="ent-hero-in">
    <div class="hero-txt">
      <span class="kicker">Payfuture Cross-border Payouts · Developer docs</span>
      <h1>Fund in USDT, USD or EUR. <em>Pay out locally.</em></h1>
      <p>Fund your Payfuture balance once, and pay individuals and businesses in their local currency, payout by payout, through one API. Everything you need to understand, build and launch is here.</p>
      <div class="hero-ctas"><a class="btn btn-yellow" href="#/guide/welcome">Start the guide</a><a class="btn btn-ghost" href="#/api/start">API reference</a></div>

      <ul class="hero-facts"><li>One API for payouts, status, balance and reconciliation</li><li>A callback with the final status of every payout</li><li>Every error code explained, with how to fix it</li></ul>
    </div>
    <div class="hero-flow" aria-label="How a payout flows">
      <span class="hero-flow-t">How a payout flows</span>
      <ol>
        <li><span class="hf-n">1</span><div><b>You fund your balance</b><small>USDT, USD or EUR</small></div></li>
        <li><span class="hf-n">2</span><div><b>Converted to local currency</b><small>Your balance is ready to pay out</small></div></li>
        <li><span class="hf-n">3</span><div><b>You send a payout</b><small>One API call per beneficiary</small></div></li>
        <li class="done"><span class="hf-n">✓</span><div><b>Beneficiary is paid</b><small>To a bank account or wallet · result in the callback</small></div></li>
      </ol>
    </div>
  </div>
</section>
<div class="home-ent home-wide">
  <section class="home-row">
    <div class="home-col">
      <h2>Start here</h2>
      <div class="path-list">
        <a class="tile" href="#/guide/how-it-works"><span class="tag">1 · Understand</span><b>How a payout works</b><span>Watch a payout travel from your request to the beneficiary's bank.</span></a>
        <a class="tile" href="#/guide/quickstart"><span class="tag">2 · Build</span><b>Send your first payout</b><span>Five steps from balance check to a confirmed payout.</span></a>
        <a class="tile" href="#/guide/checklist"><span class="tag">3 · Go live</span><b>Go-live checklist</b><span>Tick off everything before Payfuture raises your limits.</span></a>
      </div>
    </div>
    <div class="home-col">
      <h2>Corridors</h2>
      <div class="cards cor-cards">
        <a class="card enterprise" href="#/corridors/in"><span class="pill">Live</span><h2>🇮🇳 India</h2><p>Fund in USDT, USD or EUR and pay out INR to bank accounts over IMPS. ${IN_LIMITS}.</p><div class="go">See the India corridor →</div></a>
        <a class="card soon" href="#/corridors/pk"><span class="pill">API ready · testing</span><h2>🇵🇰 Pakistan</h2><p>Pay out PKR to bank accounts (IBAN) and Easypaisa or JazzCash wallets. The API is ready to build against; Pakistan goes live once testing is complete.</p><div class="go">See the Pakistan API →</div></a>
      </div>
    </div>
  </section>
  <section>
    <h2>Jump into the API reference</h2>
    <div class="ql-grid">
      ${ql('#/api/payout', 'Payout', 'Send money to a bank account or wallet')}
      ${ql('#/api/hashes', 'Hash generation', 'The recipe for every request')}
      ${ql('#/api/callbacks', 'Callbacks', 'What we send to your notificationUrl')}
      ${ql('#/api/op-get-status', 'Get Status', 'Check one transaction')}
      ${ql('#/api/balance', 'Get Balance', 'Your available balance')}
      ${ql('#/api/errors', 'Error codes', `All ${D[F].errors.length}, each with how to fix it`)}
      ${ql('#/playground', 'Hash playground', 'Find out why a hash does not match')}
      ${ql('#/api/op-get-transaction-list', 'Get Transaction List', 'Reconcile in bulk')}
    </div>
  </section>
  <section class="home-help">
    <div><h2>Need help?</h2><p>Reach out to us on your integration channel, on the platform agreed at onboarding. Your integration contact there handles credentials, IP whitelisting, funding instructions and limits.</p></div>
    <a class="btn btn-yellow help-cta" href="#/guide/support">Contact Support</a>
  </section>
  <footer class="home-foot">
    <img src="assets/logo.svg" alt="Payfuture">
    <span><a href="https://www.payfuture.net/" target="_blank" rel="noopener">payfuture.net ↗</a> · <a href="https://www.payfuture.net/contact/" target="_blank" rel="noopener">Contact ↗</a> · <a href="https://www.payfuture.net/terms-and-conditions/" target="_blank" rel="noopener">Terms ↗</a> · <a href="https://www.payfuture.net/privacy-policy/" target="_blank" rel="noopener">Privacy ↗</a></span>
  </footer>
</div>`;
}

/* ================= START HERE ================= */
GD.welcome = () => `<div class="pf-banner">${fig('Global-businesses.webp', 'Welcome')}<div class="pf-banner-text"><h1>Welcome to Payfuture Cross-border Payouts</h1><p>Fund once, pay out in India, payout by payout.</p></div></div>
<p class="lead">This guide takes you from your first question to your first live payout. Read it in order, or jump to what you need.</p>
<div class="grid2">
  <a class="tile" href="#/guide/how-it-works"><span class="tag">New here</span><b>How a payout works</b><span>Fund, convert, pay out, get the callback. Press play to watch one.</span></a>
  <a class="tile" href="#/corridors"><span class="tag">Corridors</span><b>India, and what's next</b><span>Limits, speed and what you send, per corridor.</span></a>
  <a class="tile" href="#/guide/quickstart"><span class="tag">Developers</span><b>Quickstart: your first payout</b><span>Check your balance, sign, send, receive the callback, confirm.</span></a>
  <a class="tile" href="#/playground"><span class="tag">Tools</span><b>Hash playground</b><span>Build and debug request signatures in your browser.</span></a>
</div>
<h2>Popular tasks</h2>
<ul class="tasks">
  <li><a href="#/playground">Generate or debug a request signature</a></li>
  <li><a href="#/guide/how-it-works">Watch a payout travel from request to bank account</a></li>
  <li><a href="#/corridors">Check India limits and what you send</a></li>
  <li><a href="#/guide/checklist">Tick off the go-live checklist</a></li>
</ul>`;

function flowSvg() {
  const box = (x, y, t, a, b, main) => `<rect class="${main ? 'main' : 'box'}" x="${x}" y="${y}" width="164" height="72" rx="8"/>
  <text class="t" x="${x + 82}" y="${y + 24}" text-anchor="middle">${t}</text><text class="s" x="${x + 82}" y="${y + 44}" text-anchor="middle">${a}</text><text class="s" x="${x + 82}" y="${y + 60}" text-anchor="middle">${b}</text>`;
  return `<svg class="flow" viewBox="0 0 760 132" role="img" aria-label="How money moves: you fund, Payfuture converts to INR, you send a payout through the API, the beneficiary is paid">
  <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrhead"/></marker></defs>
  <text class="lane" x="22" y="26">INDIA PAYOUTS</text>
  ${[['You fund', 'USDT, USD or EUR', 'to Payfuture', 0], ['Converted to INR', 'credited to your', 'INR balance', 0], ['PAYOUT via API', 'one call per', 'beneficiary', 1], ['Beneficiary paid', 'over IMPS;', 'callback to you', 0]].map(([t, a, b, m], i) => box(22 + i * 184, 38, t, a, b, m)).join('')}
  ${[0, 1, 2].map(i => `<path class="ln" d="M${186 + i * 184} 74H${206 + i * 184}" marker-end="url(#arr)"/>`).join('')}
  <text class="s" x="22" y="126">Highlighted = where you integrate</text></svg>`;
}

GD['how-it-works'] = () => `<h1>How a payout works</h1>
<p class="lead">Payouts are prefunded and asynchronous. Money lands in your Payfuture balance first. Each payout request is <b>accepted</b> in milliseconds, and the money <b>arrives</b> minutes later.</p>
<h2>How money moves</h2>
${flowSvg()}
<h2>Watch one</h2>
<p>Pick an outcome, then press play.</p>
<div class="sim" id="sim">
  <div class="sim-controls">
    <div class="seg" data-k="outcome"><button class="on" data-v="ok">Paid</button><button data-v="fail">Declined</button></div>
    <button class="btn btn-yellow" id="simRun">▶ Send a payout</button>
  </div>
  <ol class="sim-track" id="simTrack"><li class="muted">Pick an outcome, then press play.</li></ol>
</div>
<h2>Statuses at a glance</h2>
${table(['Still moving', 'Final: paid', 'Final: not paid'], [
  ['<code>PENDING</code>, <code>IN-PROCESS</code>', '<code>APPROVED</code>', '<code>DECLINED</code>'],
])}
${callout('<p><b>Golden rule:</b> never mark a payout as paid on the first response. Wait for the callback, and confirm it with GetStatus before you act on it.</p>', 'ok')}
${next('#/guide/journey', 'Next: the integration journey')}`;
const SIM = {
  ok: [['You', 'POST PAYOUT to an Indian bank account, signed with your MID secret', 'req'], ['Payfuture', 'HTTP 200 · status PENDING · transaction_id INV78I…', 'res'], ['Payfuture', 'Debits your INR balance and sends it over IMPS · IN-PROCESS', 'mid'], ['Bank', 'Credits the beneficiary · UTR issued', 'bank'], ['Payfuture', 'Callback to your notificationUrl · APPROVED + utrnumber', 'cb'], ['You', 'GetStatus confirms APPROVED → mark as paid 🎉', 'done']],
  fail: [['You', 'POST PAYOUT to an Indian bank account', 'req'], ['Payfuture', 'HTTP 200 · status PENDING', 'res'], ['Payfuture', 'Sends it over IMPS · IN-PROCESS', 'mid'], ['Bank', 'Rejects it: rejected by the beneficiary bank', 'bank'], ['Payfuture', 'Callback · DECLINED · errorcode set', 'cb'], ['You', 'GetStatus confirms DECLINED → the money stays in your balance', 'fail']],
};
INIT['how-it-works'] = () => {
  const sim = document.getElementById('sim'), st = {outcome: 'ok'};
  let timers = [];
  sim.querySelectorAll('.seg').forEach(seg => seg.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); st[seg.dataset.k] = b.dataset.v;
  });
  document.getElementById('simRun').onclick = () => {
    timers.forEach(clearTimeout); timers = [];
    const track = document.getElementById('simTrack'); track.innerHTML = '';
    SIM[st.outcome].forEach(([who, what, kind], i) => timers.push(setTimeout(() => {
      track.insertAdjacentHTML('beforeend', `<li class="ev ${kind}"><span class="who">${who}</span><span>${what}</span></li>`);
    }, 650 * i)));
  };
};

GD.glossary = () => `<h1>Glossary</h1>
<p class="lead">The words you'll meet in this guide, in plain English.</p>
<dl class="glossary">${[
  ['Callback', 'The POST Payfuture sends to your <code>notificationUrl</code> when a payout is final.'],
  ['Cut-off', 'The time after which funding moves to the next window. Payfuture confirms yours at onboarding.'],
  ['HMAC', 'A signature over the raw request body made with your secret, sent in <code>X-Callback-Signature</code>.'],
  ['Idempotency', 'Sending the same request twice has the effect of sending it once. Use a unique <code>merchantRefNo</code> per payout.'],
  ['IFSC', 'Indian Financial System Code: identifies an Indian bank branch.'],
  ['IMPS', 'Immediate Payment Service: India\'s real-time, 24x7 bank transfer rail.'],
  ['MID / MID secret', 'Your merchant ID and the secret used to sign requests and verify callbacks.'],
  ['Off-ramp', 'Converting USDT or fiat into the INR you pay out in.'],
  ['Prefunding', 'Putting money in your Payfuture balance before you send payouts.'],
  ['USDT', 'Tether, a USD-pegged stablecoin.'],
  ['UTR', 'Unique Transaction Reference: the Indian bank\'s proof that a payout was made.'],
].map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`;

/* ================= GET STARTED ================= */
GD.journey = () => `<h1>Integration journey</h1>
<p class="lead">Five stages from first conversation to live. Most of your work is in stage 3.</p>
<div class="journey">${[
  ['Talk to us', 'Share your volumes, the beneficiaries you pay (individuals, businesses or both) and your funding currency. Payfuture sends a proposal.'],
  ['Onboard', 'Complete KYB. You receive your MID and MID secret, whitelist your server IPs and get your funding instructions.'],
  ['Build', 'Follow the quickstart: sign requests, send payouts, handle callbacks, reconcile daily.'],
  ['Test', 'A limited live MID with a small top-up. There is no sandbox.'],
  ['Go live', 'Tick the checklist, get sign-off, and Payfuture raises your limits.'],
].map(([t, d], i) => `<div class="stage"><span class="num">${i + 1}</span><b>${t}</b><span>${d}</span></div>`).join('')}</div>
${next('#/guide/quickstart', 'Next: send your first payout')}`;

GD.quickstart = () => `<h1>Quickstart: your first payout</h1>
<p class="lead">Five steps, about an hour. You need your MID, MID secret, a whitelisted server and a funded balance.</p>
${callout(`<p>All calls go to <code>POST ${API_URL}</code> with headers <code>Content-Type: application/json</code> and <code>api-version: 2.0</code>.</p>`)}
<ol class="steps big">
<li><b>Check your balance</b>Hash <code>SHA256(midcode~midsecret)</code>, then:
${code(`{ "requestType": "GetBalance", "data": { "midcode": "MID123", "hash": "<hash>" } }`)}</li>
<li><b>Sign the payout</b>For India Net Banking the formula is <code>SHA256(midcode~amount~currency~bank_name~midsecret)</code>. Amount with two decimals, secret in lower case.
${tabs([
  ['Node.js', code(`const crypto = require('crypto');

const parts = ['MID123', '1500.00', 'INR', 'Example Bank', process.env.MID_SECRET.toLowerCase()];
const hash = crypto.createHash('sha256').update(parts.join('~')).digest('hex');`, 'javascript')],
  ['Python', code(`import hashlib, os

parts = ["MID123", "1500.00", "INR", "Example Bank", os.environ["MID_SECRET"].lower()]
hash_ = hashlib.sha256("~".join(parts).encode()).hexdigest()`, 'python')],
  ['PHP', code(`<?php
$parts = ['MID123', '1500.00', 'INR', 'Example Bank', strtolower(getenv('MID_SECRET'))];
$hash = hash('sha256', implode('~', $parts));`, 'php')],
])}
<p>Prefer HMAC? Sign the exact body bytes and send <code>X-Callback-Signature: sha256=&lt;hex&gt;</code> instead. <a href="#/playground">Try both in the hash playground →</a></p></li>
<li><b>Send the payout</b>India payouts need <code>userInfo</code> (first name, last name, phone and email of the beneficiary).
${code(`{
  "requestType": "PAYOUT",
  "data": {
    "midCode": "MID123",
    "integrationType": "S",
    "amount": 1500,
    "hash": "<hash>",
    "currency": "INR",
    "country": "IN",
    "merchantUrl": { "notificationUrl": "https://merchant.example/payfuture/callback" },
    "merchantRefNo": "PO-000123",
    "userInfo": { "firstName": "Asha", "lastName": "Rao",
                  "phone": "9000000000", "email": "asha@example.com" },
    "paymentMethod": "NB",
    "paymMethodFields": { "account_number": "000123456789", "account_name": "Asha Rao", "bank_name": "Example Bank", "bank_ifsc": "EXMP0000001", "payout_type": "Individual" }
  }
}`)}
<p>You get back <code>success: true</code>, a <code>transaction_id</code> and status <code>PENDING</code>. Save both IDs.</p></li>
<li><b>Receive the callback</b>Payfuture posts a form-encoded callback to your <code>notificationUrl</code>. Verify it, reply 200 fast.
${tabs([
  ['Node.js (Express)', code(`app.post('/payfuture/callback', express.urlencoded({ extended: false }), (req, res) => {
  const { key, payoutid, amount, hash } = req.body;
  const expected = crypto.createHash('sha256')
    .update(key + payoutid + amount + process.env.MID_SECRET.toLowerCase())
    .digest('hex');
  if (expected !== hash) return res.sendStatus(400);
  queueStatusCheck(payoutid);   // confirm with GetStatus before marking paid
  res.sendStatus(200);
});`, 'javascript')],
  ['Python (Flask)', code(`@app.post("/payfuture/callback")
def callback():
    f = request.form
    raw = f["key"] + f["payoutid"] + f["amount"] + os.environ["MID_SECRET"].lower()
    if hashlib.sha256(raw.encode()).hexdigest() != f["hash"]:
        return "", 400
    queue_status_check(f["payoutid"])  # confirm with GetStatus before marking paid
    return "", 200`, 'python')],
])}</li>
<li><b>Confirm with GetStatus</b>The callback hash doesn't cover <code>status</code>, so confirm before you act:
${code(`{ "requestType": "GetStatus", "data": { "midcode": "MID123", "transaction_id": "INV78I1757502089824", "transaction_type": "payout", "hash": "<SHA256(midcode~transaction_id~transaction_type~midsecret)>" } }`)}
<p><code>APPROVED</code>? Mark it paid and store the <code>utrnumber</code>. 🎉</p></li>
</ol>
${next('#/api/payout', 'Full payout reference')}`;

/* ================= BUILD ================= */
GD.funding = () => `<h1>Funding & balance</h1>
<p class="lead">Payouts are prefunded: money lands in your Payfuture balance first, then each payout draws from it.</p>
${steps([
  ['Fund in USDT, USD or EUR', 'Use only the wallet address or bank details Payfuture Finance gives you. They are never published on this site, and you should never send to details you found anywhere else.'],
  ['Payfuture converts it to INR', 'Your INR balance goes up once the funds are received and converted.'],
  ['Check your balance', 'Call <code>GetBalance</code> before you send payouts. A payout larger than your balance is declined with <code>11081</code> (insufficient balance).'],
  ['Pay out', 'Each payout is debited from your INR balance. A declined payout leaves the money in your balance.'],
])}
${callout('<p><b>Funding window and FX rate:</b> Payfuture Finance confirms your funding cut-off and how your conversion rate is set when you onboard.</p>')}
<p>API details: <a href="#/api/balance">GetBalance</a> and <a href="#/api/op-get-transaction-list">GetTransactionList</a>.</p>`;

/* ================= GO LIVE ================= */
GD['go-live'] = () => `<h1>Test & go live</h1>
<p class="lead">There is <b>no sandbox</b>. You test in production on a MID with low limits and a small real top-up, so every test payout moves real money.</p>
${steps([
  ['Get a limited live MID', 'Payfuture issues it with low limits; whitelist your server IPs.'],
  ['Fund a small amount', 'A small top-up; confirm it with GetBalance.'],
  ['Send test payouts', 'To bank accounts you control.'],
  ['Verify callback + GetStatus', 'Both must agree before you mark a payout paid.'],
  ['Break it on purpose', 'A wrong hash should give 11031, and your code should handle it.'],
  ['Ask for limits', 'Once your results are signed off, Payfuture raises your limits.'],
])}
${next('#/guide/checklist', 'Open the go-live checklist')}`;

const CHECK = [
  ['Credentials', 'MID secret lives in a secrets manager, never in code or logs'],
  ['Credentials', 'Server IPs whitelisted with Payfuture'],
  ['Payouts', 'A unique merchantRefNo on every payout'],
  ['Payouts', 'userInfo sent on every India payout'],
  ['Payouts', 'Balance checked before sending'],
  ['Payouts', 'Payouts marked paid only on a final status'],
  ['Signing & callbacks', 'Request signatures checked in the hash playground'],
  ['Signing & callbacks', 'Callback hash verified, then confirmed with GetStatus'],
  ['Signing & callbacks', 'Callback endpoint replies 200 within a few seconds'],
  ['Operations', 'Daily reconciliation against GetTransactionList'],
  ['Operations', 'Failure paths tested: bad signature, bad beneficiary, low balance'],
];
GD.checklist = () => `<h1>Go-live checklist</h1>
<p class="lead">Tick each item as you finish it. Your progress is saved in this browser only.</p>
<div class="progress"><div id="ckBar"></div></div><p class="muted" id="ckCount"></p>
<div id="ck">${[...new Set(CHECK.map(c => c[0]))].map(g => `<h3>${g}</h3>${CHECK.map((c, i) => c[0] === g ? `<label class="ck"><input type="checkbox" data-i="${i}"><span>${c[1]}</span></label>` : '').join('')}`).join('')}</div>`;
INIT.checklist = () => {
  let done = {}; try { done = JSON.parse(localStorage.getItem('pf-payouts-check') || '{}'); } catch (_) {}
  const box = document.getElementById('ck');
  const upd = () => {
    const n = CHECK.filter((_, i) => done[i]).length;
    document.getElementById('ckBar').style.width = `${Math.round(100 * n / CHECK.length)}%`;
    document.getElementById('ckCount').textContent = n === CHECK.length ? '🚀 All done. Ask Payfuture for go-live sign-off!' : `${n} of ${CHECK.length} done`;
  };
  box.querySelectorAll('input').forEach(i => { i.checked = !!done[i.dataset.i]; });
  box.onchange = e => { done[e.target.dataset.i] = e.target.checked; try { localStorage.setItem('pf-payouts-check', JSON.stringify(done)); } catch (_) {} upd(); };
  upd();
};

/* ================= HELP ================= */
GD.faq = () => {
  const q = (t, a) => `<details class="faq"><summary>${t}</summary>${a}</details>`;
  return `<h1>FAQ</h1>
${q('Can I use my Payfuture Gateway (paygate10.com) MID here?', '<p>No. Cross-border Payouts uses its own host, MIDs and secrets.</p>')}
${q('Which countries can I pay out to?', '<p>India today. For Pakistan the API is ready, so you can build your integration now; it goes live once Payfuture completes testing. See <a href="#/corridors/pk">Pakistan</a>.</p>')}
${q('Is there a sandbox?', '<p>No. You test on a limited live MID with low limits and a small top-up. See <a href="#/guide/go-live">Test & go live</a>.</p>')}
${q('Why do I get HTTP 403?', '<p>Your server IP is not whitelisted. Send Payfuture the IP.</p>')}
${q('My hash doesn\'t match. Help!', '<p>Paste it into the <a href="#/playground">hash detective</a>. Nine times out of ten it is amount format, secret case or field order.</p>')}
${q('How do I format the amount?', '<p>In the hash, always with two decimals: <code>1500.00</code>.</p>')}
${q('Which statuses are final?', '<p>Only <code>APPROVED</code> and <code>DECLINED</code>.</p>')}
${q('I didn\'t receive a callback.', '<p>Check that your <code>notificationUrl</code> is public HTTPS and answers 200 quickly, then call <a href="#/api/op-get-status">GetStatus</a>. Reconcile daily so nothing slips through.</p>')}
${q('What is the proof that a payout was made?', '<p>The <code>utrnumber</code> (bank reference) in the callback and in GetStatus.</p>')}`;
};

GD.support = () => `<h1>Support</h1>
<p class="lead">Reach out to us on your integration channel, on the platform agreed at onboarding. Your integration contact there handles credentials, IP whitelisting, funding instructions and limits.</p>
<div class="grid2">
  <div class="tile"><span class="tag">Include</span><ul class="tight"><li>Your MID</li><li>Your merchantRefNo and Payfuture's transaction ID</li><li>Request and response, secrets removed</li></ul></div>
  <div class="tile"><span class="tag">Never send</span><ul class="tight"><li>Your MID secret</li><li>Full card or ID numbers</li></ul></div>
</div>`;
