/* Enterprise guide — learn the product, build, go live. Modelled on the guide-first docs of Airwallex and Razorpay:
   start with what the product is and who it's for, then hands-on quickstarts, then the interactive tools
   (product finder, payout simulator, signature playground, go-live checklist).
   Facts come from coverage.payfuture.net, document.payfuture.net and docs.payfuturefs.com; unconfirmed values carry TO CONFIRM. */

const GD = PAGES.guide;
NAV.guide = [
  ['Start here', [['welcome', 'Welcome'], ['enterprise', 'What is Enterprise?'], ['find-your-product', 'Find your product']]],
  ['Understand', [['how-payouts-work', 'How a payout works'], ['funding', 'Funding: USDT & fiat'], ['corridors', 'Corridors & limits'], ['glossary', 'Glossary']]],
  ['Build', [['journey', 'Integration journey'], ['quickstart-ige', 'Quickstart: IGE payout'], ['quickstart-cbs', 'Quickstart: CBS payout'], ['playground', 'Signature playground']]],
  ['Go live', [['go-live', 'Test & go live'], ['checklist', 'Go-live checklist']]],
  ['Help', [['faq', 'FAQ'], ['support', 'Support']]],
];

/* ================= HOME (#/) ================= */
function home() {
  return `<section class="ent-hero">
  <div class="ent-hero-in">
    <span class="kicker">PayFuture Enterprise · Developer guide</span>
    <h1>Move money into emerging markets, <em>at enterprise scale.</em></h1>
    <p>Fund in USDT or fiat, convert at transparent rates and pay out to bank accounts and wallets in India, Pakistan, Nigeria and Egypt. Everything you need to understand, build and launch is in this guide.</p>
    <div class="hero-ctas"><a class="btn btn-yellow" href="#/guide/welcome">Start the guide</a><a class="btn btn-ghost" href="#/guide/playground">Try the signature playground</a></div>
  </div>
  <div class="ent-hero-art" aria-hidden="true">
    <div class="coin c1">USDT</div><div class="coin c2">USD</div><div class="coin c3">EUR</div>
    <div class="beam"></div>
    <div class="dest d1">₹ INR</div><div class="dest d2">₨ PKR</div><div class="dest d3">₦ NGN</div><div class="dest d4">E£ EGP</div>
  </div>
</section>
<div class="home-ent">
  <div class="grid3 path">
    <a class="tile" href="#/about/who-we-are"><span class="tag">1 · Meet us</span><b>Who is PayFuture?</b><span>A payments specialist for emerging markets, trusted by 250+ merchants.</span></a>
    <a class="tile" href="#/guide/enterprise"><span class="tag">2 · Understand</span><b>What is Enterprise?</b><span>Collect, convert and pay out across borders, through IGE or CBS.</span></a>
    <a class="tile" href="#/guide/quickstart-ige"><span class="tag">3 · Build</span><b>Send your first payout</b><span>Five steps from balance check to a confirmed payout.</span></a>
  </div>
  <h2>Trusted by businesses that move money at scale</h2>
  <div class="pf-logos">${LOGOS.map(([n, f]) => `<img src="${IMG(f)}" alt="${n}" title="${n}" loading="lazy">`).join('')}</div>
  <div class="grid3 stats-row">
    <div class="tile"><span class="stat">4</span><span>payout markets documented here</span></div>
    <div class="tile"><span class="stat">1,500 TPS</span><span>Pakistan payout throughput</span></div>
    <div class="tile"><span class="stat">24x7</span><span>real-time IMPS payouts in India</span></div>
  </div>
</div>`;
}

/* ================= START HERE ================= */
GD.welcome = () => `<div class="pf-banner">${fig('Global-businesses.webp', 'Welcome')}<div class="pf-banner-text"><h1>Welcome to PayFuture Enterprise</h1><p>Everything you need to send cross-border payouts into emerging markets.</p></div></div>
<p class="lead">This guide takes you from “what is this?” to your first live payout. Read it in order, or jump to what you need.</p>
<div class="grid2">
  <a class="tile" href="#/guide/enterprise"><span class="tag">New here</span><b>Understand the product</b><span>How Enterprise collects, converts and pays out, and its two products: IGE and CBS.</span></a>
  <a class="tile" href="#/guide/find-your-product"><span class="tag">2 minutes</span><b>Find your product</b><span>Answer three questions and we’ll tell you whether to build on IGE or CBS.</span></a>
  <a class="tile" href="#/guide/quickstart-ige"><span class="tag">Developers</span><b>Quickstart: IGE payout</b><span>Check your balance, sign, send, receive the callback, confirm.</span></a>
  <a class="tile" href="#/guide/quickstart-cbs"><span class="tag">Developers</span><b>Quickstart: CBS payout</b><span>Get a token, check balances, send an INR payout, poll the status.</span></a>
</div>
<h2>Popular tasks</h2>
<ul class="tasks">
  <li><a href="#/guide/playground">Generate or debug a request signature</a></li>
  <li><a href="#/guide/how-payouts-work">Watch a payout travel from request to bank account</a></li>
  <li><a href="#/guide/corridors">Check limits, cut-offs and speed by country</a></li>
  <li><a href="#/guide/checklist">Tick off the go-live checklist</a></li>
</ul>
<h2>How we label things</h2>
<div class="legend">${LIVE} in production ${TESTING} built, being tested ${PLANNED} on the roadmap, not available ${TC} waiting for PayFuture to confirm</div>`;

GD.enterprise = () => `<h1>What is PayFuture Enterprise?</h1>
<p class="lead">Enterprise is PayFuture’s platform for businesses that move money across borders at scale: remittance companies, platforms, PSPs and global merchants. You bring the funds, PayFuture converts them and delivers local currency to your beneficiaries.</p>
<h2>Receive → Convert → Pay out</h2>
<div class="flow3">
  <div class="tile"><span class="num">1</span><b>Receive</b><span>Fund a dedicated or pooled account in USDT, USD or EUR.</span></div>
  <div class="tile"><span class="num">2</span><b>Convert</b><span>FX into the local currency at transparent rates.</span></div>
  <div class="tile"><span class="num">3</span><b>Pay out</b><span>Deliver to bank accounts and wallets, with a bank reference as proof.</span></div>
</div>
<h2>Platform capabilities</h2>
${feat([
  ['Stablecoin', 'Fund and settle in USDT alongside local fiat rails, through regulated, licensed infrastructure.'],
  ['Wallet & accounts', 'Hold funds in a dedicated or pooled account ahead of payout or withdrawal.'],
  ['FX', 'Convert into your payout currency at transparent rates, on every flow.'],
])}
<p>Platform currencies: <span class="ccy">USD</span> <span class="ccy">EUR</span> <span class="ccy">USDT</span> <span class="ccy">INR</span></p>
<h2>Two products, one Enterprise</h2>
<div class="cards inline">
  <a class="card enterprise" href="#/ige/start"><span class="pill">USDT funded</span><h2>Enterprise on IGE</h2><p>Fund in USDT, pay out INR, PKR, NGN and EGP through one endpoint, with a callback for every payout.</p><div class="go">IGE API reference →</div></a>
  <a class="card enterprise" href="#/cbs/start"><span class="pill">Fiat account</span><h2>CBS · Core Banking</h2><p>Hold a USD or EUR account and pay out INR through a REST API, with balances and statements built in.</p><div class="go">CBS API reference →</div></a>
</div>
<h2>How money moves</h2>
${flowSvg()}
<h2>Feature status</h2>
${table(['Product', 'Feature', 'Status'], [
  ['IGE', 'INR payouts (IMPS, NEFT)', LIVE], ['IGE', 'PKR payouts (bank, Easypaisa, JazzCash)', LIVE],
  ['IGE', 'HMAC-SHA256 request signing', LIVE], ['IGE', 'Status lookup by your own reference', TESTING],
  ['CBS', 'Token auth, balances, statements', LIVE], ['CBS', 'INR payouts, fiat-funded', LIVE],
  ['CBS', 'PKR payouts', TESTING], ['CBS', 'USDT funding', PLANNED], ['CBS', 'Webhooks', PLANNED], ['CBS', 'Merchant sandbox', PLANNED],
])}
${next('#/guide/find-your-product', 'Next: find your product')}
${src(['coverage.payfuture.net', COVERAGE])}`;

function flowSvg() {
  const box = (x, y, t, a, b, main) => `<rect class="${main ? 'main' : 'box'}" x="${x}" y="${y}" width="164" height="72" rx="8"/>
  <text class="t" x="${x + 82}" y="${y + 24}" text-anchor="middle">${t}</text><text class="s" x="${x + 82}" y="${y + 44}" text-anchor="middle">${a}</text><text class="s" x="${x + 82}" y="${y + 60}" text-anchor="middle">${b}</text>`;
  return `<svg class="flow" viewBox="0 0 760 310" role="img" aria-label="Enterprise money flows for IGE and CBS">
  <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrhead"/></marker></defs>
  <text class="lane" x="22" y="26">ENTERPRISE ON IGE</text>
  ${[['Fund in USDT', 'TRC-20, to the address', 'PayFuture gives you', 0], ['Converted', 'Daily rate, to INR / PKR', 'INR cut-off 3:30 PM IST', 0], ['Send PAYOUT', 'One URL, requestType', 'MID + hash or HMAC', 1], ['Beneficiary paid', 'One callback to you,', 'confirm with GetStatus', 0]].map(([t, a, b, m], i) => box(22 + i * 184, 38, t, a, b, m)).join('')}
  <text class="lane" x="22" y="150">CBS · CORE BANKING</text>
  ${[['Fiat balance', 'USD or EUR in your', 'CBS account', 0], ['Get token', 'API key to Bearer JWT', '+ account holder ID', 0], ['POST outbound-cbs', 'Debits your account,', 'converts to INR', 1], ['Beneficiary paid', 'You poll for status;', 'webhooks Planned', 0]].map(([t, a, b, m], i) => box(22 + i * 184, 162, t, a, b, m)).join('')}
  ${[0, 1, 2].map(i => `<path class="ln" d="M${186 + i * 184} 74H${206 + i * 184}" marker-end="url(#arr)"/><path class="ln" d="M${186 + i * 184} 198H${206 + i * 184}" marker-end="url(#arr)"/>`).join('')}
  <rect class="planned" x="22" y="262" width="164" height="32" rx="8"/><text class="s" x="104" y="282" text-anchor="middle">USDT funding: Planned</text>
  <path class="ln" d="M104 262V234" stroke-dasharray="4 4" marker-end="url(#arr)"/>
  <text class="s" x="206" y="282">Highlighted = the call you build · Dashed = Planned</text></svg>`;
}

/* ---------- product finder ---------- */
GD['find-your-product'] = () => `<h1>Find your product</h1>
<p class="lead">Three questions, one recommendation. You can change your answers any time.</p>
<div class="quiz" id="quiz">
  ${quizQ('fund', 'How will you fund your payouts?', [['usdt', 'USDT (stablecoin)'], ['fiat', 'USD or EUR (fiat)']])}
  ${quizQ('market', 'Where are your beneficiaries?', [['IN', 'India'], ['PK', 'Pakistan'], ['NG', 'Nigeria'], ['EG', 'Egypt']])}
  ${quizQ('updates', 'How do you want to hear about final status?', [['push', 'Push me a callback'], ['poll', 'I’ll poll an API']])}
  <div class="quiz-result" id="quizResult"><p class="muted">Pick an answer to each question.</p></div>
</div>
<h2>Side by side</h2>
${table(['', 'Enterprise on IGE', 'CBS (Core Banking)'], [
  ['You fund with', `USDT on TRON (TRC-20) ${LIVE}; USD or EUR for INR ${LIVE}`, `USD / EUR balance ${LIVE}; USDT ${PLANNED}`],
  ['You pay out', 'INR, PKR, NGN, EGP', `INR ${LIVE}; PKR ${TESTING}`],
  ['API style', 'One endpoint, <code>requestType</code> in the body', 'REST resources, Bearer token'],
  ['Credentials', 'MID + MID secret', 'API key → token + <code>X-ACCOUNT-HOLDER-ID</code>'],
  ['Request signing', 'SHA-256 hash or HMAC header', 'None (token over TLS)'],
  ['Final status', 'Callback + status API', `Polling; webhooks ${PLANNED}`],
  ['Testing', 'Limited live MID', `CBS Demo ${TC}`],
])}
<h2>What they share, and what they don't</h2>
<div class="grid2">
  <div class="tile"><span class="tag">Shared</span><ul class="tight"><li>IP whitelisting</li><li>A unique reference per payout</li><li>Pending first, final later</li><li>India: account, name, IFSC, bank name</li></ul></div>
  <div class="tile"><span class="tag">Different</span><ul class="tight"><li>Hosts, credentials and signing</li><li>IGE always answers HTTP 200; CBS uses real HTTP errors</li><li>IGE pushes callbacks; CBS is polled</li><li>CBS needs sender details on every payout</li></ul></div>
</div>
${callout('<p><b>Not the Legacy gateway.</b> Enterprise on IGE runs on <code>igateway-gwapi.payfuture.net</code>. Legacy MIDs and secrets do not work here.</p>', 'warn')}`;
const quizQ = (k, q, opts) => `<fieldset class="quiz-q"><legend>${q}</legend>${opts.map(([v, l]) => `<label><input type="radio" name="${k}" value="${v}"><span>${l}</span></label>`).join('')}</fieldset>`;
INIT['find-your-product'] = () => {
  const box = document.getElementById('quiz');
  box.onchange = () => {
    const a = Object.fromEntries([...box.querySelectorAll('input:checked')].map(i => [i.name, i.value]));
    const out = document.getElementById('quizResult');
    if (Object.keys(a).length < 3) { out.innerHTML = `<p class="muted">${3 - Object.keys(a).length} more to go…</p>`; return; }
    const why = [];
    let pick = 'IGE';
    if (a.fund === 'usdt') why.push('You fund in USDT: that is live on IGE, while USDT funding on CBS is still planned.');
    if (a.market === 'NG' || a.market === 'EG') why.push(`${a.market === 'NG' ? 'Nigeria' : 'Egypt'} payouts are only on IGE.`);
    if (a.market === 'PK' && a.fund === 'fiat') why.push('CBS PKR payouts are still in testing, so start on IGE today.');
    if (a.updates === 'push') why.push('IGE sends you a callback for every payout; CBS webhooks are planned.');
    if (a.fund === 'fiat' && a.market === 'IN' && a.updates === 'poll') { pick = 'CBS'; why.length = 0; why.push('You hold fiat and pay out INR: CBS INR payouts are live.', 'You are happy to poll, which is how CBS reports status today.', 'You also get balances, FX rates and statements through the same REST API.'); }
    if (!why.length) why.push('Fiat funding for INR payouts is also available on IGE, with callbacks included.');
    const href = pick === 'IGE' ? '#/guide/quickstart-ige' : '#/guide/quickstart-cbs';
    out.innerHTML = `<div class="result-card pop"><span class="kicker">Our pick</span><h3>${pick === 'IGE' ? 'Enterprise on IGE' : 'CBS · Core Banking'}</h3><ul>${why.map(w => `<li>${w}</li>`).join('')}</ul><a class="btn btn-navy" href="${href}">Open the ${pick} quickstart →</a></div>`;
  };
};

/* ================= UNDERSTAND ================= */
GD['how-payouts-work'] = () => `<h1>How a payout works</h1>
<p class="lead">A payout is asynchronous: your request is <b>accepted</b> in milliseconds, the money <b>arrives</b> seconds to days later. Press play and watch one travel.</p>
<div class="sim" id="sim">
  <div class="sim-controls">
    <div class="seg" data-k="product"><button class="on" data-v="ige">IGE</button><button data-v="cbs">CBS</button></div>
    <div class="seg" data-k="outcome"><button class="on" data-v="ok">Paid</button><button data-v="fail">Declined</button></div>
    <button class="btn btn-yellow" id="simRun">▶ Send a payout</button>
  </div>
  <ol class="sim-track" id="simTrack"><li class="muted">Pick a product and an outcome, then press play.</li></ol>
</div>
<h2>Statuses at a glance</h2>
${table(['', 'Still moving', 'Final: paid', 'Final: not paid'], [
  ['IGE', '<code>PENDING</code>, <code>IN-PROCESS</code>', '<code>APPROVED</code>', '<code>DECLINED</code>'],
  ['CBS', '<code>CREATED</code>, <code>PENDING_APPROVAL</code>, <code>APPROVED</code>, <code>PROCESSING</code>, <code>PENDING</code>', '<code>COMPLETED</code>', '<code>DECLINED</code>, <code>FAILED</code>, <code>CANCELLED</code>'],
])}
${callout('<p><b>Golden rule:</b> never mark a payout as paid on the first response. Wait for a final status, and on IGE confirm the callback with GetStatus before you act on it.</p>', 'ok')}`;
const SIM = {
  ige: {
    ok: [['You', 'POST PAYOUT with your MID and signature', 'req'], ['IGE', 'HTTP 200 · status PENDING · transaction_id INV78I…', 'res'], ['IGE', 'Validates, then sends to the bank · IN-PROCESS', 'mid'], ['Bank', 'Credits the beneficiary · UTR issued', 'bank'], ['IGE', 'Callback to your notificationUrl · status APPROVED', 'cb'], ['You', 'GetStatus confirms APPROVED → mark as paid 🎉', 'done']],
    fail: [['You', 'POST PAYOUT with your MID and signature', 'req'], ['IGE', 'HTTP 200 · status PENDING', 'res'], ['IGE', 'Sends to the bank · IN-PROCESS', 'mid'], ['Bank', 'Rejects: account details invalid', 'bank'], ['IGE', 'Callback · status DECLINED · errorcode set', 'cb'], ['You', 'GetStatus confirms DECLINED → funds stay in your balance', 'fail']],
  },
  cbs: {
    ok: [['You', 'POST /oauth/gettoken → Bearer token', 'req'], ['You', 'POST /transfers/outbound-cbs', 'req'], ['CBS', 'HTTP 200 · transactionStatus PROCESSING · id 3f2a…', 'res'], ['You', 'GET /transactions/ref/{reference} … still PROCESSING', 'poll'], ['Bank', 'Credits the beneficiary', 'bank'], ['You', 'GET /transactions/ref/{reference} → COMPLETED 🎉', 'done']],
    fail: [['You', 'POST /oauth/gettoken → Bearer token', 'req'], ['You', 'POST /transfers/outbound-cbs', 'req'], ['CBS', 'HTTP 200 · transactionStatus PROCESSING', 'res'], ['You', 'GET /transactions/ref/{reference} … still PROCESSING', 'poll'], ['Bank', 'Rejects the transfer', 'bank'], ['You', 'GET /transactions/ref/{reference} → FAILED · errorCode set', 'fail']],
  },
};
INIT['how-payouts-work'] = () => {
  const sim = document.getElementById('sim'), st = {product: 'ige', outcome: 'ok'};
  let timers = [];
  sim.querySelectorAll('.seg').forEach(seg => seg.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); st[seg.dataset.k] = b.dataset.v;
  });
  document.getElementById('simRun').onclick = () => {
    timers.forEach(clearTimeout); timers = [];
    const track = document.getElementById('simTrack'); track.innerHTML = '';
    SIM[st.product][st.outcome].forEach(([who, what, kind], i) => timers.push(setTimeout(() => {
      track.insertAdjacentHTML('beforeend', `<li class="ev ${kind}"><span class="who">${who}</span><span>${what}</span></li>`);
    }, 650 * i)));
  };
};

GD.funding = () => `<h1>Funding: USDT & fiat</h1>
<p class="lead">Payouts are prefunded: money lands in your PayFuture balance first, then each payout draws from it. How you fund depends on the product.</p>
${tabs([
  ['IGE · USDT', `${steps([
    ['Send USDT on TRON (TRC-20)', 'To the address PayFuture Finance gives you. Other networks need Finance approval. Never send to an address you found anywhere else.'],
    ['PayFuture converts it', 'At the rate of the day, into your payout currency.'],
    ['Check your balance', 'Call <code>GetBalance</code> before you send payouts.'],
  ])}${table(['Market', 'Cut-off', 'When funds are usable'], [
    ['India (INR)', '3:30 PM IST', `Same day for funds received before the cut-off ${TC}`],
    ['Pakistan (PKR)', '2:30 PM GST to PayFuture · 4:00 PM PKT to the bank', '30–60 minutes after the bank receives the USDT, Monday–Saturday'],
  ])}`],
  ['IGE · fiat', `<p>For India, you can also fund in <b>USD or EUR</b>, converted to INR at a fixed rate of the day. Conversions between 11 AM and 3 PM IST complete in 2–3 hours. ${LIVE}</p>`],
  ['CBS · fiat account', `<p>Your CBS account holds <b>USD or EUR</b>. Each payout is debited from it and converted, and you can read the rate first with <code>GET /exchange-rate/v2/{source}/{destination}</code>. ${LIVE}</p><p>Fiat funding cut-off for EMI merchants: 7:00 PM CET. Deposit instructions come from your PayFuture contact. ${TC}</p><p>USDT funding for CBS: ${PLANNED}</p>`],
])}
${callout(`<p><b>Quote APIs.</b> The IGE reference lists <code>PayoutPrefundingQuote</code> and friends. They are not part of the current live flow; don’t build on them unless PayFuture enables them for you. ${TC}</p>`, 'warn')}
${src(['coverage.payfuture.net', COVERAGE], ['Core Banking API', CBS_DOCS])}`;

const spec = rows => `<dl class="spec">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
GD.corridors = () => `<h1>Corridors & limits</h1>
<p class="lead">Where Enterprise pays out, how fast, and how much. Your contracted limits may differ; PayFuture confirms them at onboarding.</p>
${tabs([
  [`<img class="flag" src="${IMG('india.svg')}" alt=""> India`, spec([
    ['Products', `IGE ${LIVE} · CBS ${LIVE}`], ['Currency', 'INR'], ['Modes', 'B2B, B2C, C2B, C2C'], ['Channels', 'IMPS and NEFT'],
    ['IMPS', `Real time, 24x7 · INR 1,000 – 400,000 per payout ${TC}`], ['NEFT', 'Same day, about 45 minutes, banking hours · from INR 200,000, no maximum'],
    ['You send', 'Payout type, account number, account name, IFSC, bank name'], ['Business payouts', 'Invoice and GST number required'],
    ['Proof of payment', 'UTR on every successful payout, sent in the callback'], ['FX', 'Live interbank-based rates, 24x7'],
  ])],
  [`<img class="flag" src="${IMG('pakistan.svg')}" alt=""> Pakistan`, spec([
    ['Products', `IGE ${LIVE} · CBS ${TESTING}`], ['Currency', 'PKR'], ['Methods', 'Bank transfer, Easypaisa, JazzCash'], ['Funding', 'USDT on TRON (TRC-20)'],
    ['Per payout', 'PKR 100 – 200,000'], ['Throughput', 'Up to 1,500 TPS'], ['Cut-offs', '2:30 PM GST to PayFuture · 4:00 PM PKT to the bank'],
    ['Liquidity', 'Monday–Saturday; not on Sundays'], ['Payee check', 'Account title verified before any funds move'], ['Settlement', 'T+1'],
  ])],
  [`<img class="flag" src="${IMG('Nigeria-flag.svg')}" alt=""> Nigeria`, spec([
    ['Products', `IGE ${LIVE}`], ['Currency', 'NGN'], ['Method', 'Bank transfer'], ['Per payout', 'NGN 100 – 10,000,000'], ['You send', 'Account number (10 digits), bank code'], ['Settlement', 'T+3'],
  ])],
  [`<img class="flag" src="${IMG('egypt.svg')}" alt=""> Egypt`, spec([
    ['Products', `IGE ${TC}`], ['Currency', 'EGP'], ['Methods', 'Bank transfer; wallets (Etisalat, Vodafone, WE Cash, Orange)'], ['Per payout', 'EGP 100 – 150,000'], ['Settlement', 'T+5'],
  ])],
])}
${src(['coverage.payfuture.net', COVERAGE])}`;

GD.glossary = () => `<h1>Glossary</h1>
<p class="lead">The words you’ll meet in this guide, in plain English.</p>
<dl class="glossary">${[
  ['Account holder ID', 'CBS: the ID of your business in CBS, sent as <code>X-ACCOUNT-HOLDER-ID</code> on every call.'],
  ['API key', 'CBS: your long-lived credential. Exchanged for a short-lived Bearer token. Shown only once.'],
  ['Bearer token', 'CBS: a 1-hour access token (JWT) you put in the <code>Authorization</code> header.'],
  ['Callback', 'IGE: the POST PayFuture sends to your <code>notificationUrl</code> when a payout is final.'],
  ['CNIC', 'Pakistan’s 13-digit national identity number, sent as <code>document_id</code> for wallet payouts.'],
  ['Cut-off', 'The time after which funding or payouts move to the next window.'],
  ['HMAC', 'A signature over the raw request body made with your secret. IGE accepts it in <code>X-Callback-Signature</code>.'],
  ['IBAN', 'International bank account number. Pakistan bank payouts use a 24-character IBAN.'],
  ['Idempotency', 'Sending the same request twice has the effect of sending it once. Use a unique reference per payout.'],
  ['IFSC', 'Indian Financial System Code: identifies an Indian bank branch.'],
  ['IMPS / NEFT', 'Indian bank transfer rails: IMPS is real time 24x7; NEFT is batch, same day.'],
  ['MID / MID secret', 'IGE: your merchant ID and the secret used to sign requests and verify callbacks.'],
  ['Prefunding', 'Putting money in your PayFuture balance before you send payouts.'],
  ['TRC-20', 'The token standard on the TRON blockchain. Enterprise USDT funding uses USDT on TRC-20.'],
  ['USDT', 'Tether, a USD-pegged stablecoin.'],
  ['UTR', 'Unique Transaction Reference: the Indian bank’s proof that a payout was made.'],
].map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`;

/* ================= BUILD ================= */
GD.journey = () => `<h1>Integration journey</h1>
<p class="lead">Five stages from first conversation to live payouts. Most of the work is in stage 3.</p>
<div class="journey">${[
  ['Talk to us', 'Share your markets, volumes and funding currency. PayFuture recommends IGE or CBS and sends a proposal.'],
  ['Onboard', 'Complete KYB. Receive your MID and secret (IGE) or API key and account holder ID (CBS). Whitelist your server IPs.'],
  ['Build', 'Follow a quickstart. Sign requests, send payouts, handle callbacks or polling, reconcile daily.'],
  ['Test', 'IGE: a limited live MID with a small top-up. CBS: small production payouts, or CBS Demo if PayFuture enables it.'],
  ['Go live', 'Tick the checklist, get sign-off, and PayFuture raises your limits.'],
].map(([t, d], i) => `<div class="stage"><span class="num">${i + 1}</span><b>${t}</b><span>${d}</span></div>`).join('')}</div>
${next('#/guide/quickstart-ige', 'Next: send your first IGE payout')}`;

GD['quickstart-ige'] = () => `<h1>Quickstart: your first IGE payout</h1>
<p class="lead">Five steps, about an hour. You need your MID, MID secret, a whitelisted server and a funded balance.</p>
${callout('<p>All calls go to <code>POST https://igateway-gwapi.payfuture.net/api/process/request</code> with headers <code>Content-Type: application/json</code> and <code>api-version: 2.0</code>.</p>')}
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
<p>Prefer HMAC? Sign the exact body bytes and send <code>X-Callback-Signature: sha256=&lt;hex&gt;</code> instead. <a href="#/guide/playground">Try both in the playground →</a></p></li>
<li><b>Send the payout</b>
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
    "paymentMethod": "NB",
    "paymMethodFields": { "account_number": "000123456789", "account_name": "Asha Rao", "bank_name": "Example Bank", "bank_ifsc": "EXMP0000001", "payout_type": "Individual" }
  }
}`)}
<p>You get back <code>success: true</code>, a <code>transaction_id</code> and status <code>PENDING</code>. Save both IDs.</p></li>
<li><b>Receive the callback</b>IGE posts a form-encoded callback to your <code>notificationUrl</code>. Verify it, reply 200 fast.
${tabs([
  ['Node.js (Express)', code(`app.post('/payfuture/callback', express.urlencoded({ extended: false }), (req, res) => {
  const { key, payoutid, amount, status, hash } = req.body;
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
])}
<p class="src">Callback hash algorithm ${TC}</p></li>
<li><b>Confirm with GetStatus</b>The callback hash doesn’t cover <code>status</code>, so confirm before you act:
${code(`{ "requestType": "GetStatus", "data": { "midcode": "MID123", "transaction_id": "INV78I1757502089824", "transaction_type": "payout", "hash": "<SHA256(midcode~transaction_id~transaction_type~midsecret)>" } }`)}
<p><code>APPROVED</code>? Mark it paid and store the <code>utrnumber</code>. 🎉</p></li>
</ol>
${next('#/ige/payout', 'Full payout reference, all countries')}`;

GD['quickstart-cbs'] = () => `<h1>Quickstart: your first CBS payout</h1>
<p class="lead">Four steps with curl. You need your API key, account holder ID and a whitelisted server.</p>
<ol class="steps big">
<li><b>Get a token</b>
${code(`curl -X POST https://secure-mtapi.payfuturefs.com/auth/oauth/gettoken \\
  -H "Authorization: Basic $CBS_API_KEY" \\
  -d grant_type=client_credentials`, 'bash')}
<p>Keep <code>access_token</code>; it lasts about an hour.</p></li>
<li><b>Check your balance</b>
${code(`curl https://secure-mtapi.payfuturefs.com/gateway/accounts/balances \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "X-ACCOUNT-HOLDER-ID: $ACCOUNT_HOLDER_ID"`, 'bash')}</li>
<li><b>Send an INR payout</b>
${code(`curl -X POST https://secure-mtapi.payfuturefs.com/gateway/transfers/outbound-cbs \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "X-ACCOUNT-HOLDER-ID: $ACCOUNT_HOLDER_ID" \\
  -H "Content-Type: application/json" \\
  -d '{
    "uniqueTransactionReference": "PO-000123",
    "reference": "Invoice 4471",
    "amount": { "value": 1500.00, "currency": "INR" },
    "sourceAccountNumber": "<your CBS account number>",
    "description": "Supplier payment", "relation": "Supplier", "reason": "Payment for services",
    "countryCode": "IN", "residenceCountry": "IN", "recipientName": "Asha Rao",
    "accountNumber": "000123456789", "bankIfsc": "EXMP0000001", "bankName": "Example Bank",
    "receiverType": "INDIVIDUAL", "senderType": "BUSINESS",
    "senderFullName": "Example Ltd", "senderIdNumber": "REG-12345",
    "senderAddress": "1 Example Street", "senderCountryCode": "GB"
  }'`, 'bash')}</li>
<li><b>Poll until it’s final</b>
${code(`curl https://secure-mtapi.payfuturefs.com/gateway/transactions/ref/Invoice%204471 \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "X-ACCOUNT-HOLDER-ID: $ACCOUNT_HOLDER_ID"`, 'bash')}
<p>Back off between polls (for example 5s, 15s, 60s). <code>COMPLETED</code> means paid. 🎉</p></li>
</ol>
${next('#/cbs/payout-inr', 'Full CBS payout reference')}`;

/* ---------- signature playground ---------- */
const SAMPLE = {midcode: 'MID123', amount: '1500', currency: 'INR', bank_name: 'Example Bank', merchantrefno: 'PO-000123', wallet_number: '03001234567', document_id: '4210112345671',
  account_name: 'Asha Rao', account_number: '000123456789', bank_code: 'BANK01', transactionid: 'INV78I1757502089824', transaction_id: 'INV78I1757502089824', txnstatus: 'APPROVED', transaction_type: 'payout'};
const RECIPES = [
  ['in_nb', '🇮🇳 India payout', ['midcode', 'amount', 'currency', 'bank_name', 'midsecret'], {currency: 'INR'}],
  ['pk_wallet', '🇵🇰 Pakistan wallet', ['midcode', 'merchantrefno', 'wallet_number', 'document_id', 'amount', 'currency', 'midsecret'], {currency: 'PKR'}],
  ['pk_bt', '🇵🇰 Pakistan bank', ['midcode', 'account_name', 'account_number', 'bank_code', 'amount', 'currency', 'midsecret'], {currency: 'PKR'}],
  ['ng_bt', '🇳🇬 Nigeria bank', ['midcode', 'amount', 'midsecret', 'currency', 'account_number', 'merchantrefno'], {currency: 'NGN', account_number: '0123456789'}],
  ['eg_wallet', '🇪🇬 Egypt wallet', ['midcode', 'wallet_number', 'amount', 'currency', 'midsecret'], {currency: 'EGP', wallet_number: '01012345678'}],
  ['getstatus', '🔎 GetStatus', ['midcode', 'transaction_id', 'transaction_type', 'midsecret'], {}],
  ['getbalance', '💰 GetBalance', ['midcode', 'midsecret'], {}],
  ['resp', '✅ Payout response', ['midcode', 'transactionid', 'merchantrefno', 'txnstatus', 'amount', 'midsecret'], {}],
  ['callback', '📨 Callback', ['midcode', 'transactionid', 'amount', 'midsecret'], {}, ''],
];
GD.playground = () => `<h1>Signature playground</h1>
<p class="lead">Build an IGE signature piece by piece, watch it change as you type, and let the hash detective find out why yours doesn’t match. Everything runs in your browser; nothing is sent anywhere.</p>
${callout('<p>Use a <b>test</b> secret only. The demo secret below is fake.</p>', 'warn')}
<div class="pg">
${tabs([
  ['🧩 Body hash', `<div class="chips" id="pgRecipes">${RECIPES.map(([k, l], i) => `<button class="chip ${i ? '' : 'on'}" data-k="${k}">${l}</button>`).join('')}</div>
    <div class="pg-grid"><div id="pgFields" class="pg-fields"></div>
      <div><label class="pg-l" for="pgSecret">MID secret</label><input id="pgSecret" value="Demo_Secret_42" autocomplete="off"></div></div>
    <div class="pg-l">The string that gets hashed</div><div class="pg-string" id="pgString"></div>
    <div class="pg-fixes" id="pgFixes"></div>
    <div class="pg-l">SHA-256</div><div class="pg-out"><code id="pgHash"></code><button class="copy-mini" data-copy="pgHash">Copy</button></div>`],
  ['🔐 HMAC header', `<p>IGE also accepts an HMAC of the <b>raw body</b>. One extra space changes the signature completely. Try the buttons.</p>
    <label class="pg-l" for="hmBody">Raw request body</label><textarea id="hmBody" rows="5">{"requestType":"GetBalance","data":{"midcode":"MID123"}}</textarea>
    <div class="chips"><button class="chip" id="hmPretty">Pretty-print it</button><button class="chip" id="hmMin">Minify it</button></div>
    <label class="pg-l" for="hmSecret">MID secret</label><input id="hmSecret" value="Demo_Secret_42" autocomplete="off">
    <div class="pg-l">Header to send</div><div class="pg-out"><code id="hmOut"></code><button class="copy-mini" data-copy="hmOut">Copy</button></div>
    <p id="hmNote" class="muted"></p>`],
  ['🕵️ Hash detective', `<p>Paste the hash <b>your code</b> produced for the inputs on the Body hash tab. The detective tries the usual mistakes and tells you which one you made.</p>
    <input id="detIn" placeholder="paste your 64-character hash">
    <button class="btn btn-navy" id="detGo">Investigate</button>
    <div id="detOut" class="det-out"></div>`],
])}
</div>
<h2>The rules, once more</h2>
<ul><li>Fields in exactly the formula order, joined with <code>~</code> (callbacks: no separator).</li><li>Amount with two decimals: <code>1500.00</code>.</li><li>Secret in lower case; <code>transaction_type</code> in lower case.</li><li>Lower-case hex output.</li></ul>
<p>All formulas: <a href="#/ige/signing">Authentication & signing reference</a>.</p>`;

const norm2 = v => /^-?\d+(\.\d+)?$/.test(v.trim()) ? Number(v).toFixed(2) : v;
async function hmacHex(secret, msg) {
  if (!window.crypto || !crypto.subtle) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(msg)))].map(b => b.toString(16).padStart(2, '0')).join('');
}
INIT.playground = () => {
  let rk = 'in_nb';
  const recipe = () => RECIPES.find(r => r[0] === rk);
  const vals = {...SAMPLE};
  const fieldsBox = document.getElementById('pgFields');
  const build = (opts = {}) => {
    const [, , toks, , sepRaw] = recipe(), sep = sepRaw === undefined ? '~' : sepRaw;
    const secretRaw = document.getElementById('pgSecret').value;
    const fixes = [];
    const parts = toks.map(t => {
      if (t === 'midsecret') { const s = opts.rawSecret ? secretRaw : secretRaw.toLowerCase(); if (s !== secretRaw) fixes.push('secret lower-cased'); return {t, v: s}; }
      let v = fieldsBox.querySelector(`[data-tok="${t}"]`)?.value ?? '';
      if (t === 'amount' && !opts.rawAmount) { const n = norm2(v); if (n !== v) fixes.push(`amount ${v} → ${n}`); v = n; }
      if (t === 'transaction_type' && !opts.rawCase) { const l = v.toLowerCase(); if (l !== v) fixes.push('transaction_type lower-cased'); v = l; }
      return {t, v};
    });
    return {parts, sep, fixes};
  };
  const draw = () => {
    const [, , toks, defs] = recipe();
    fieldsBox.innerHTML = toks.filter(t => t !== 'midsecret').map(t => `<div><label class="pg-l" for="f-${t}">${t}</label><input id="f-${t}" data-tok="${t}" value="${esc(defs[t] ?? vals[t] ?? '')}"></div>`).join('');
    redraw();
  };
  const redraw = () => {
    const {parts, sep, fixes} = build();
    document.getElementById('pgString').innerHTML = parts.map((p, i) => `${i && sep ? `<span class="sep">${sep}</span>` : ''}<span class="tok t${i % 6}" title="${p.t}">${p.t === 'midsecret' ? '•'.repeat(Math.min(p.v.length, 10)) : esc(p.v) || '∅'}<small>${p.t}</small></span>`).join('');
    document.getElementById('pgFixes').innerHTML = fixes.map(f => `<span class="fix">✨ auto-fixed: ${esc(f)}</span>`).join('');
    const h = document.getElementById('pgHash'); h.textContent = sha256(parts.map(p => p.v).join(sep)); h.classList.remove('flash'); void h.offsetWidth; h.classList.add('flash');
  };
  document.getElementById('pgRecipes').onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return;
    fieldsBox.querySelectorAll('[data-tok]').forEach(i => vals[i.dataset.tok] = i.value);
    rk = b.dataset.k; document.querySelectorAll('#pgRecipes .chip').forEach(c => c.classList.toggle('on', c === b)); draw();
  };
  fieldsBox.oninput = redraw; document.getElementById('pgSecret').oninput = redraw;
  /* HMAC */
  const hb = document.getElementById('hmBody'), hs = document.getElementById('hmSecret');
  let last = '';
  const hm = async () => {
    const v = await hmacHex(hs.value, hb.value), out = document.getElementById('hmOut'), note = document.getElementById('hmNote');
    if (v === null) { out.textContent = 'HMAC needs Web Crypto: open this page over https or localhost.'; return; }
    out.textContent = 'X-Callback-Signature: sha256=' + v;
    note.textContent = last && last !== v ? 'Signature changed. Sign the exact bytes you send, or PayFuture answers 11031.' : '';
    last = v;
  };
  hb.oninput = hs.oninput = hm;
  document.getElementById('hmPretty').onclick = () => { try { hb.value = JSON.stringify(JSON.parse(hb.value), null, 2); hm(); } catch (_) { document.getElementById('hmNote').textContent = 'That body is not valid JSON.'; } };
  document.getElementById('hmMin').onclick = () => { try { hb.value = JSON.stringify(JSON.parse(hb.value)); hm(); } catch (_) { document.getElementById('hmNote').textContent = 'That body is not valid JSON.'; } };
  hm();
  /* detective */
  document.getElementById('detGo').onclick = () => {
    const raw = document.getElementById('detIn').value.trim(), out = document.getElementById('detOut');
    if (!/^[0-9a-fA-F]{64}$/.test(raw)) { out.innerHTML = '<p>🤔 That doesn’t look like a SHA-256 hex hash (64 characters, 0–9 and a–f).</p>'; return; }
    const want = raw.toLowerCase(), upper = raw !== want;
    const {parts, sep} = build(), join = (ps, s = sep) => ps.map(p => p.v).join(s);
    const cands = [['✅ Perfect match! Your signature is correct.', join(parts)]];
    const rs = build({rawSecret: true}); if (join(rs.parts) !== join(parts)) cands.push(['Your secret isn’t lower-cased. Call toLowerCase() on it first.', join(rs.parts)]);
    const ra = build({rawAmount: true}); if (join(ra.parts) !== join(parts)) cands.push(['Amount format: send it with two decimals, like 1500.00.', join(ra.parts)]);
    const rc = build({rawCase: true}); if (join(rc.parts) !== join(parts)) cands.push(['transaction_type must be lower case (payout, not PAYOUT).', join(rc.parts)]);
    ['', '|', ',', ' ', '~'].filter(s => s !== sep).forEach(s => cands.push([`Wrong separator: you joined with ${s ? `“${s}”` : 'nothing'}, but this formula uses ${sep ? `“${sep}”` : 'no separator'}.`, join(parts, s)]));
    cands.push(['You left the secret out of the string.', join(parts.filter(p => p.t !== 'midsecret'))]);
    const noSec = parts.filter(p => p.t !== 'midsecret'), sec = parts.find(p => p.t === 'midsecret');
    if (sec && parts.at(-1) !== sec) cands.push(['You put the secret at the end. In this formula it sits in the middle.', join([...noSec, sec])]);
    for (let i = 0; i < parts.length - 1; i++) { const sw = parts.slice(); [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]]; cands.push([`Field order: ${parts[i].t} and ${parts[i + 1].t} are swapped.`, join(sw)]); }
    const hit = cands.find(([, s]) => sha256(s) === want);
    out.innerHTML = hit ? `<div class="result-card pop ${hit === cands[0] ? 'good' : ''}"><p><b>${hit === cands[0] ? hit[0] : '🔍 Found it: ' + hit[0]}</b></p>${upper ? '<p>Also: send the hex in lower case.</p>' : ''}</div>`
      : '<div class="result-card pop"><p><b>🕵️ No match among the usual suspects.</b></p><p>Check that your field values match the inputs exactly (no extra spaces), that you use the right formula for this country and method, and that it’s the right secret.</p></div>';
  };
  draw();
};
document.addEventListener('click', e => {
  const b = e.target.closest('.copy-mini'); if (!b) return;
  navigator.clipboard?.writeText(document.getElementById(b.dataset.copy).textContent); b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy', 1200);
});

/* ================= GO LIVE ================= */
GD['go-live'] = () => `<h1>Test & go live</h1>
<p class="lead">There is no merchant sandbox for IGE, so testing happens in production with guard rails: low limits and small amounts.</p>
${tabs([
  ['IGE', steps([
    ['Get a limited live MID', 'PayFuture issues it with low limits; whitelist your IPs.'], ['Fund a small amount', 'A small USDT top-up; confirm with GetBalance.'],
    ['One payout per method', 'To accounts you control.'], ['Verify callback + GetStatus', 'Both must agree before you mark paid.'],
    ['Break it on purpose', 'A wrong hash should give 11031, and your code should handle it.'], ['Ask for limits', 'Once results are signed off.'],
  ])],
  ['CBS', `<p>A merchant sandbox is ${PLANNED}. Ask PayFuture about CBS Demo ${TC}; otherwise test with small production payouts.</p>${steps([
    ['Authenticate', 'Token, then GET /accounts and /accounts/balances.'], ['One small payout', 'To an account you control.'],
    ['Poll to final', 'GET /transactions/ref/{reference}.'], ['Repeat the reference', `Send the same uniqueTransactionReference twice; no second payout should appear ${TC}`],
    ['Break it on purpose', 'A wrong IFSC should return an error body you handle.'],
  ])}`],
])}
${next('#/guide/checklist', 'Open the go-live checklist')}`;

const CHECK = [
  ['Credentials', 'Secrets and API keys live in a secrets manager, never in code or logs'],
  ['Credentials', 'Server IPs whitelisted with PayFuture'],
  ['Payouts', 'A unique reference on every payout'],
  ['Payouts', 'Balance checked before sending'],
  ['Payouts', 'Payouts marked paid only on a final status'],
  ['IGE', 'Request signatures verified in the playground'],
  ['IGE', 'Callback hash verified, then confirmed with GetStatus'],
  ['IGE', 'Callback endpoint replies 200 within a few seconds'],
  ['CBS', 'Token refresh handled before expiry'],
  ['CBS', 'Polling with back-off until final status'],
  ['CBS', 'traceId logged on every error'],
  ['Operations', 'Daily reconciliation against GetTransactionList or CBS statements'],
  ['Operations', 'One payout per method tested end to end'],
  ['Operations', 'Failure paths tested: bad signature, bad beneficiary, low balance'],
];
GD.checklist = () => `<h1>Go-live checklist</h1>
<p class="lead">Tick each item as you finish it. Your progress is saved in this browser only.</p>
<div class="progress"><div id="ckBar"></div></div><p class="muted" id="ckCount"></p>
<div id="ck">${[...new Set(CHECK.map(c => c[0]))].map(g => `<h3>${g}</h3>${CHECK.map((c, i) => c[0] === g ? `<label class="ck"><input type="checkbox" data-i="${i}"><span>${c[1]}</span></label>` : '').join('')}`).join('')}</div>`;
INIT.checklist = () => {
  let done = {}; try { done = JSON.parse(localStorage.getItem('pf-ent-check') || '{}'); } catch (_) {}
  const box = document.getElementById('ck');
  const upd = () => {
    const n = Object.values(done).filter(Boolean).length;
    document.getElementById('ckBar').style.width = `${Math.round(100 * n / CHECK.length)}%`;
    document.getElementById('ckCount').textContent = n === CHECK.length ? '🚀 All done. Ask PayFuture for go-live sign-off!' : `${n} of ${CHECK.length} done`;
  };
  box.querySelectorAll('input').forEach(i => { i.checked = !!done[i.dataset.i]; });
  box.onchange = e => { done[e.target.dataset.i] = e.target.checked; try { localStorage.setItem('pf-ent-check', JSON.stringify(done)); } catch (_) {} upd(); };
  upd();
};

/* ================= HELP ================= */
GD.faq = () => {
  const q = (t, a) => `<details class="faq"><summary>${t}</summary>${a}</details>`;
  return `<h1>FAQ</h1>
${q('Is Enterprise the same as the PayFuture Gateway?', '<p>No. Enterprise is for cross-border collections, remittances and payouts at scale. The Gateway serves gaming, forex, P2P and e-commerce merchants and has its own docs, hosts and credentials.</p>')}
${q('Should I use IGE or CBS?', '<p>Use the <a href="#/guide/find-your-product">product finder</a>. In short: USDT funding or callbacks today → IGE; fiat account with REST and polling for INR → CBS.</p>')}
${q('Is there a sandbox?', `<p>Not for IGE: you test on a limited live MID. For CBS a merchant sandbox is ${PLANNED}.</p>`)}
${q('Why do I get HTTP 403 on IGE?', '<p>Your server IP is not whitelisted.</p>')}
${q('My hash doesn’t match. Help!', '<p>Paste it into the <a href="#/guide/playground">hash detective</a>. Nine times out of ten it is amount format, secret case or field order.</p>')}
${q('Which statuses are final?', '<p>IGE: <code>APPROVED</code>, <code>DECLINED</code>. CBS: <code>COMPLETED</code>, <code>DECLINED</code>, <code>FAILED</code>, <code>CANCELLED</code>.</p>')}
${q('I didn’t receive a callback.', '<p>Check your <code>notificationUrl</code> is public HTTPS and answers 200 quickly, then call GetStatus. Reconcile daily so nothing slips through.</p>')}
${q('Can I fund CBS with USDT?', `<p>Not yet: ${PLANNED}. Use IGE for USDT funding today.</p>`)}`;
};

GD.support = () => `<h1>Support</h1>
<p class="lead">Your PayFuture integration contact is your first stop for credentials, IP whitelisting, funding instructions and limits. ${TC}</p>
<div class="grid2">
  <div class="tile"><span class="tag">Include</span><ul class="tight"><li>Product (IGE or CBS) and your MID or account holder ID</li><li>Your reference and PayFuture’s transaction ID</li><li>Request and response, secrets removed</li><li>CBS: the <code>traceId</code></li></ul></div>
  <div class="tile"><span class="tag">Never send</span><ul class="tight"><li>Your MID secret</li><li>Your CBS API key or tokens</li><li>Full card or ID numbers</li></ul></div>
</div>`;
