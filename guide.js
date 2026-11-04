/* Enterprise guide — learn the products, build, go live. Modelled on the guide-first docs of Airwallex and Razorpay.
   Enterprise is one platform with two products: Collections (pay-ins) and Payouts (remittance).
   coverage.payfuture.net is the source of truth for products, corridors, funding and limits; the API comes from document.payfuture.net.
   Only Live features are shown. Unconfirmed values carry TO CONFIRM (see REVIEW.md). */

const GD = PAGES.guide;
NAV.guide = [
  ['Start here', [['welcome', 'Welcome'], ['enterprise', 'What is Enterprise?'], ['find-your-product', 'Find your product']]],
  ['Products', [['collections', 'Collections (pay-ins)'], ['payouts', 'Payouts (remittance)']]],
  ['Understand', [['funding', 'Funding & FX'], ['how-payouts-work', 'How a payout works'], ['corridors', 'Corridors & limits'], ['glossary', 'Glossary']]],
  ['Build', [['journey', 'Integration journey'], ['quickstart', 'Quickstart: your first payout'], ['playground', 'Signature playground']]],
  ['Go live', [['go-live', 'Test & go live'], ['checklist', 'Go-live checklist']]],
  ['Help', [['faq', 'FAQ'], ['support', 'Support']]],
];

const spec = rows => `<dl class="spec">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
const ramp = nodes => `<div class="ramp">${nodes.map(([t, s], i) => `${i ? '<span class="ramp-arrow" aria-hidden="true">→</span>' : ''}<div class="ramp-node${s === 'hub' ? ' hub' : ''}"><b>${t}</b>${s && s !== 'hub' ? `<span>${s}</span>` : ''}</div>`).join('')}</div>`;
const FLAG = {IN: `<img class="flag" src="${IMG('india.svg')}" alt="">`, PK: `<img class="flag" src="${IMG('pakistan.svg')}" alt="">`};

/* ================= HOME (#/) ================= */
function home() {
  return `<section class="ent-hero">
  <div class="ent-hero-in">
    <span class="kicker">PayFuture Enterprise · Developer guide</span>
    <h1>Collect and pay out in emerging markets, <em>at enterprise scale.</em></h1>
    <p>Collect INR from businesses in India and settle it in USDT, USD or EUR. Or fund in USDT or fiat and pay out to bank accounts and wallets in India and Pakistan. Everything you need to understand, build and launch is in this guide.</p>
    <div class="hero-ctas"><a class="btn btn-yellow" href="#/guide/find-your-product">Find your product</a><a class="btn btn-ghost" href="#/guide/welcome">Start the guide</a></div>
  </div>
  <div class="ent-hero-art" aria-hidden="true">
    <div class="coin c1">USDT</div><div class="coin c2">USD</div><div class="coin c3">EUR</div>
    <div class="beam"></div>
    <div class="dest d1">₹ INR</div><div class="dest d2">₨ PKR</div>
  </div>
</section>
<div class="home-ent">
  <div class="grid3 path">
    <a class="tile" href="#/about/who-we-are"><span class="tag">1 · Meet us</span><b>Who is PayFuture?</b><span>A payments specialist for emerging markets, trusted by 250+ merchants.</span></a>
    <a class="tile" href="#/guide/enterprise"><span class="tag">2 · Understand</span><b>What is Enterprise?</b><span>Two products on one platform: Collections and Payouts.</span></a>
    <a class="tile" href="#/guide/quickstart"><span class="tag">3 · Build</span><b>Send your first payout</b><span>Five steps from balance check to a confirmed payout.</span></a>
  </div>
  <h2>Two products, one platform</h2>
  <div class="cards inline">
    <a class="card enterprise" href="#/guide/collections"><span class="pill">Pay-ins</span><h2>Collections</h2><p>Get an INR account in India, collect from your customers and partners, and settle in USDT, USD or EUR.</p><div class="go">Explore Collections →</div></a>
    <a class="card enterprise" href="#/guide/payouts"><span class="pill">Remittance</span><h2>Payouts</h2><p>Fund in USDT, USD or EUR and pay out to bank accounts and wallets in India and Pakistan through one API.</p><div class="go">Explore Payouts →</div></a>
  </div>
  <h2>Trusted by businesses that move money at scale</h2>
  <div class="pf-logos">${LOGOS.map(([n, f]) => `<img src="${IMG(f)}" alt="${n}" title="${n}" loading="lazy">`).join('')}</div>
  <div class="grid3 stats-row">
    <div class="tile"><span class="stat">3–5 min</span><span>typical IMPS payout in India</span></div>
    <div class="tile"><span class="stat">1,500 TPS</span><span>Pakistan payout throughput</span></div>
    <div class="tile"><span class="stat">24x7</span><span>real-time IMPS payouts in India</span></div>
  </div>
</div>`;
}

/* ================= START HERE ================= */
GD.welcome = () => `<div class="pf-banner">${fig('Global-businesses.webp', 'Welcome')}<div class="pf-banner-text"><h1>Welcome to PayFuture Enterprise</h1><p>Collections and payouts for businesses that move money across borders.</p></div></div>
<p class="lead">This guide takes you from “what is this?” to your first live payout. Read it in order, or jump to what you need.</p>
<div class="grid2">
  <a class="tile" href="#/guide/enterprise"><span class="tag">New here</span><b>Understand Enterprise</b><span>One platform, two products: Collections (pay-ins) and Payouts (remittance).</span></a>
  <a class="tile" href="#/guide/find-your-product"><span class="tag">1 minute</span><b>Find your product</b><span>Tell us what you want to do, with which money, and where. We'll show you the flow.</span></a>
  <a class="tile" href="#/guide/collections"><span class="tag">Pay-ins</span><b>Collections</b><span>Collect INR into your own account in India and settle in USDT, USD or EUR.</span></a>
  <a class="tile" href="#/guide/quickstart"><span class="tag">Developers</span><b>Quickstart: your first payout</b><span>Check your balance, sign, send, receive the callback, confirm.</span></a>
</div>
<h2>Popular tasks</h2>
<ul class="tasks">
  <li><a href="#/guide/playground">Generate or debug a request signature</a></li>
  <li><a href="#/guide/how-payouts-work">Watch a payout travel from request to bank account</a></li>
  <li><a href="#/guide/corridors">Check limits, cut-offs and speed by corridor</a></li>
  <li><a href="#/guide/checklist">Tick off the go-live checklist</a></li>
</ul>
<h2>About this guide</h2>
<p>Everything described here is live today. Values still being confirmed by PayFuture are marked ${TC}.</p>`;

GD.enterprise = () => `<h1>What is PayFuture Enterprise?</h1>
<p class="lead">Enterprise is PayFuture's platform for businesses that move money across borders at scale: remittance companies, payout platforms, PSPs, fintechs and import/export businesses. It has two products. <b>Collections</b> brings money in. <b>Payouts</b> sends it out.</p>
<div class="cards inline">
  <a class="card enterprise" href="#/guide/collections"><span class="pill">Pay-ins</span><h2>Collections</h2><p>PayFuture gives you an INR bank account in India. Your customers and business partners pay into it, and you convert and settle the money in USDT, USD or EUR.</p><div class="go">How Collections works →</div></a>
  <a class="card enterprise" href="#/guide/payouts"><span class="pill">Remittance</span><h2>Payouts</h2><p>You fund your balance in USDT, USD or EUR. PayFuture converts it, and you pay individuals and businesses in India and Pakistan through the API.</p><div class="go">How Payouts works →</div></a>
</div>
<h2>Platform capabilities</h2>
${feat([
  ['Stablecoin', 'Fund and settle in USDT alongside local fiat rails, through regulated, licensed infrastructure.'],
  ['Wallet & accounts', 'Hold funds in a dedicated or pooled account in-market, ahead of payout or settlement.'],
  ['FX', 'Convert local currencies into your settlement currency at transparent rates, on every flow.'],
])}
<p>Currencies: <span class="ccy">USD</span> <span class="ccy">EUR</span> <span class="ccy">USDT</span> <span class="ccy">INR</span> <span class="ccy">PKR</span></p>
<h2>How money moves</h2>
${flowSvg()}
<h2>What you can do today</h2>
${table(['Product', 'Corridor', 'You start with', 'You end with'], [
  ['Collections', `${FLAG.IN} India`, 'INR paid in by RTGS or NEFT', 'USDT, USD or EUR'],
  ['Payouts', `${FLAG.IN} India`, 'USDT (TRC-20), USD or EUR', 'INR in a bank account (IMPS, NEFT)'],
  ['Payouts', `${FLAG.PK} Pakistan`, 'USDT (TRC-20)', 'PKR in a bank account or Easypaisa / JazzCash wallet'],
])}
${next('#/guide/find-your-product', 'Next: find your product')}
${src(['coverage.payfuture.net', COVERAGE])}`;

function flowSvg() {
  const box = (x, y, t, a, b, main) => `<rect class="${main ? 'main' : 'box'}" x="${x}" y="${y}" width="164" height="72" rx="8"/>
  <text class="t" x="${x + 82}" y="${y + 24}" text-anchor="middle">${t}</text><text class="s" x="${x + 82}" y="${y + 44}" text-anchor="middle">${a}</text><text class="s" x="${x + 82}" y="${y + 60}" text-anchor="middle">${b}</text>`;
  return `<svg class="flow" viewBox="0 0 760 262" role="img" aria-label="How money moves in Enterprise Collections and Payouts">
  <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="arrhead"/></marker></defs>
  <text class="lane" x="22" y="26">COLLECTIONS · PAY-INS</text>
  ${[['Customer / business', 'pays you in India', 'by RTGS or NEFT', 0], ['INR collection account', 'your own account', 'in India', 1], ['Funds collected', 'credited once the bank', 'confirms receipt', 0], ['You settle', 'in USDT, USD or EUR', 'or hold the balance', 0]].map(([t, a, b, m], i) => box(22 + i * 184, 38, t, a, b, m)).join('')}
  <text class="lane" x="22" y="150">PAYOUTS · REMITTANCE</text>
  ${[['You fund', 'USDT, USD or EUR', '(Pakistan: USDT only)', 0], ['Off-ramp', 'converted at the', 'rate of the day', 0], ['PAYOUT via API', 'from your INR or', 'PKR balance', 1], ['Beneficiary paid', 'bank or wallet;', 'callback to you', 0]].map(([t, a, b, m], i) => box(22 + i * 184, 162, t, a, b, m)).join('')}
  ${[0, 1, 2].map(i => `<path class="ln" d="M${186 + i * 184} 74H${206 + i * 184}" marker-end="url(#arr)"/><path class="ln" d="M${186 + i * 184} 198H${206 + i * 184}" marker-end="url(#arr)"/>`).join('')}
  <text class="s" x="22" y="254">Highlighted = where you integrate</text></svg>`;
}

/* ---------- product finder: routes on product, funds flow and corridor ---------- */
GD['find-your-product'] = () => `<h1>Find your product</h1>
<p class="lead">Three questions: what you want to do, which money you start or end with, and where. We'll show you the product, the money flow and what to do next.</p>
<div class="quiz" id="quiz">
  ${quizQ('product', '1 · What do you want to do?', [['collect', '💰 Collect money (pay-ins)'], ['payout', '📤 Send money (payouts)']])}
  <div id="qFlow">${flowQ('')}</div>
  ${quizQ('corridor', '3 · Which corridor?', [['IN', '🇮🇳 India'], ['PK', '🇵🇰 Pakistan']])}
  <div class="quiz-result" id="quizResult"><p class="muted">Pick an answer to each question.</p></div>
</div>
${callout('<p>Need both? Many import/export and remittance businesses collect <b>and</b> pay out. Run the finder once for each.</p>')}`;
const quizQ = (k, q, opts) => `<fieldset class="quiz-q"><legend>${q}</legend>${opts.map(([v, l]) => `<label><input type="radio" name="${k}" value="${v}"><span>${l}</span></label>`).join('')}</fieldset>`;
const flowQ = p => p === 'collect'
  ? quizQ('flow', '2 · What do you want to settle in?', [['usdt', '🪙 USDT (stablecoin)'], ['fiat', '💵 USD or EUR']])
  : quizQ('flow', p === 'payout' ? '2 · What will you fund your payouts with?' : '2 · Which money do you start or end with?', [['usdt', '🪙 USDT (stablecoin)'], ['fiat', '💵 USD or EUR']]);
const FINDER = {
  'payout-IN': (fund) => ({
    title: `Payouts · ${fund === 'usdt' ? 'USDT' : 'USD / EUR'} → INR`, ok: true,
    flow: [[fund === 'usdt' ? 'USDT' : 'USD / EUR', 'you fund'], ['Off-ramp', 'hub'], ['INR balance', 'held for you'], ['Beneficiary', 'Indian bank account']],
    why: ['Fund or convert between 11 AM and 3 PM IST and it completes in 2–3 hours, at a fixed rate of the day.', 'Pay individuals and businesses over IMPS (24x7, usually 3–5 minutes) or NEFT.', 'You get a UTR (bank reference) in the callback as proof of payment.'],
    cta: ['#/guide/quickstart', 'Send your first payout'], more: ['#/guide/payouts', 'Read about Payouts'],
  }),
  'payout-PK': (fund) => fund === 'usdt' ? ({
    title: 'Payouts · USDT → PKR', ok: true,
    flow: [['USDT', 'TRON / TRC-20'], ['Off-ramp via bank', 'hub'], ['PKR balance', 'held for you'], ['Beneficiary', 'bank or Easypaisa / JazzCash']],
    why: ['Send USDT to PayFuture by 2:30 PM GST; PKR is ready 30–60 minutes after the bank receives it, Monday to Saturday.', 'Each beneficiary is validated before any money moves.', 'Up to 1,500 payouts a second.'],
    cta: ['#/guide/quickstart', 'Send your first payout'], more: ['#/guide/payouts', 'Read about Payouts'],
  }) : ({
    title: 'Pakistan payouts are funded in USDT', ok: false,
    why: ['Pakistan payouts are funded in USDT on TRON (TRC-20) only.', 'Other currencies need PayFuture Finance approval before onboarding. Ask your PayFuture contact.', 'Switch question 2 to USDT to see the flow.'],
    more: ['#/guide/funding', 'How funding works'],
  }),
  'collect-IN': (settle) => ({
    title: `Collections · INR → ${settle === 'usdt' ? 'USDT' : 'USD / EUR'}`, ok: true,
    flow: [['Customer / business', 'pays by RTGS or NEFT'], ['INR collection account', 'hub'], ['Funds collected', 'once the bank confirms'], [settle === 'usdt' ? 'USDT' : 'USD / EUR', 'settled to you']],
    why: ['PayFuture gives you a unique INR virtual account; you can have more than one. An account in your own name takes 1–2 weeks.', 'B2B collections over RTGS and NEFT, with no transaction limit.', 'Rates are available between 12:00 and 3:30 PM IST (last trade cut-off).'],
    cta: ['#/guide/collections', 'Read about Collections'], more: ['#/guide/journey', 'How onboarding works'],
  }),
  'collect-PK': () => ({
    title: 'Collections are in India today', ok: false,
    why: ['Enterprise Collections is live in India (INR).', 'In Pakistan, Enterprise offers Payouts. Switch question 1 to “Send money” to see it.'],
    more: ['#/guide/collections', 'Read about Collections'],
  }),
};
INIT['find-your-product'] = () => {
  const box = document.getElementById('quiz');
  box.onchange = e => {
    if (e.target.name === 'product') {
      const keep = box.querySelector('input[name=flow]:checked')?.value;
      document.getElementById('qFlow').innerHTML = flowQ(e.target.value);
      if (keep) box.querySelector(`input[name=flow][value=${keep}]`).checked = true;
    }
    const a = Object.fromEntries([...box.querySelectorAll('input:checked')].map(i => [i.name, i.value]));
    const out = document.getElementById('quizResult'), left = 3 - Object.keys(a).length;
    if (left > 0) { out.innerHTML = `<p class="muted">${left} more to go…</p>`; return; }
    const r = FINDER[`${a.product}-${a.corridor}`](a.flow);
    out.innerHTML = `<div class="result-card pop ${r.ok ? 'good' : ''}"><span class="kicker">${r.ok ? 'Your product' : 'Not available yet'}</span><h3>${r.title}</h3>
      ${r.flow ? ramp(r.flow) : ''}<ul>${r.why.map(w => `<li>${w}</li>`).join('')}</ul>
      ${r.cta ? `<a class="btn btn-navy" href="${r.cta[0]}">${r.cta[1]} →</a> ` : ''}<a class="btn btn-ghost-dark" href="${r.more[0]}">${r.more[1]}</a></div>`;
  };
};

/* ================= PRODUCTS ================= */
GD.collections = () => `<h1>Collections (pay-ins)</h1>
<p class="lead">Collect payments in INR directly into your own account in India. PayFuture gives you an INR bank account; your customers and business partners pay into it, and you convert and settle in USDT, USD or EUR.</p>
${ramp([['Customer / business', 'pays by RTGS or NEFT'], ['INR collection account', 'hub'], ['Funds collected', 'once the bank confirms'], ['USDT / USD / EUR', 'settled to you']])}
<div class="grid3">
  <div class="tile"><b>🏦 Your own INR account</b><span>A unique virtual account, with more than one per customer if you need it.</span></div>
  <div class="tile"><b>🔁 Convert and hold</b><span>Convert to USDT, USD or EUR, or hold in your preferred currency.</span></div>
  <div class="tile"><b>📦 Built for trade</b><span>Ideal for import and export businesses collecting from Indian buyers.</span></div>
</div>
<h2>How it works</h2>
${steps([
  ['Onboard', 'PayFuture allocates your INR collection account. An account in your own name takes 1–2 weeks.'],
  ['Share your account details', 'Give them to the customers and partners who pay you.'],
  ['They pay by RTGS or NEFT', 'From any Indian bank.'],
  ['Funds are credited', 'Once the bank confirms the funds are receivable.'],
  ['Convert and settle', 'Into USDT, USD or EUR. Rates are available between 12:00 and 3:30 PM IST.'],
])}
<h2>Collection specifications</h2>
${spec([
  ['Sender location', 'India'], ['Rails', 'RTGS and NEFT bank transfers'], ['Transaction type', 'B2B'], ['Transaction limits', 'No limit'],
  ['Credit confirmation', 'Subject to bank notification and confirmation that funds are receivable'],
  ['Virtual account', 'Unique virtual account; multiple accounts per customer supported'],
  ['Named account', 'Takes 1–2 weeks to allocate'], ['Account holder name', 'Merchant, per request'],
  ['Rate availability window', '12:00 PM – 3:30 PM IST (last trade cut-off)'],
])}
${callout('<p><b>No API integration needed.</b> Collections work through your collection account. Payouts are where you build against the API.</p>', 'ok')}
${next('#/guide/payouts', 'Next: Payouts')}
${src(['coverage.payfuture.net · Collections', COVERAGE])}`;

GD.payouts = () => `<h1>Payouts (remittance)</h1>
<p class="lead">Send funds to individuals and businesses in India and Pakistan. You fund your PayFuture balance once, PayFuture converts it into local currency, and you pay out from that balance, payout by payout, through the API.</p>
<div class="grid3">
  <div class="tile"><span class="num">1</span><b>Fund</b><span>Top up your balance in USDT, USD or EUR.</span></div>
  <div class="tile"><span class="num">2</span><b>Convert</b><span>PayFuture off-ramps it into an INR or PKR balance.</span></div>
  <div class="tile"><span class="num">3</span><b>Pay out</b><span>You call the payout API; the beneficiary's bank or wallet is credited.</span></div>
</div>
${tabs([
  [`${FLAG.IN} India`, `
<h2>India: USDT, USD or EUR to INR</h2>
${ramp([['USDT / USD / EUR', 'you fund'], ['Off-ramp', 'hub'], ['INR balance', 'held for you'], ['Beneficiary', 'bank account']])}
<div class="grid2">
  <div class="tile"><b>⏱ Fixed rate of the day</b><span>The FX rate is fixed for the day, giving you transparency and certainty. ${TC}</span></div>
  <div class="tile"><b>⚡ 11 AM – 3 PM IST window</b><span>Fund or convert inside this window and it completes in 2–3 hours.</span></div>
</div>
<h3>Step by step</h3>
${steps([
  ['Check the rate', 'The rate of the day, before you fund.'],
  ['Fund your account', 'In USDT (TRON / TRC-20), USD or EUR.'],
  ['PayFuture off-ramps to INR', 'Your INR balance goes up at the rate of the day.'],
  ['You initiate a payout', 'One API call per beneficiary.'],
  ['The beneficiary is paid', 'Instantly, usually within 3–5 minutes over IMPS. A UTR (bank reference) comes back in the callback.'],
])}
${spec([
  ['Who you can pay', 'Individuals and businesses: B2B, B2C, C2B, C2C'],
  ['What the beneficiary sees', 'Customised descriptors are supported. The IMPS narrative varies by transaction; NEFT shows the sending bank\'s name.'],
  ['Business payouts', 'Invoice and GST number required'],
  ['Limits and speed', '<a href="#/guide/corridors">Corridors & limits →</a>'],
])}`],
  [`${FLAG.PK} Pakistan`, `
<h2>Pakistan: USDT to PKR</h2>
${ramp([['USDT', 'TRON / TRC-20'], ['Off-ramp via bank', 'hub'], ['PKR balance', 'held for you'], ['Beneficiary', 'bank or wallet']])}
<div class="grid2">
  <div class="tile"><b>🪙 USDT on TRC-20 only</b><span>Other networks or currencies need PayFuture Finance approval before onboarding.</span></div>
  <div class="tile"><b>⚡ Same-day settlement</b><span>PKR is available 30–60 minutes after the bank receives your USDT, Monday to Saturday.</span></div>
</div>
<h3>Step by step</h3>
${steps([
  ['Prefund in USDT', 'By 2:30 PM GST to PayFuture (the bank cut-off is 4:00 PM PKT / 3:00 PM GST).'],
  ['The beneficiary is validated', 'The account title is checked first. No money moves yet.'],
  ['The payout starts', 'Once validated, the amount is blocked on your balance and sent.'],
  ['Final status by callback', 'You get the final status asynchronously; a status check is the fallback.'],
])}
${spec([
  ['Pay out to', 'Bank accounts, Easypaisa and JazzCash wallets'],
  ['Throughput', 'Up to 1,500 TPS'],
  ['No liquidity on', 'Sundays'],
  ['Limits and speed', '<a href="#/guide/corridors">Corridors & limits →</a>'],
])}`],
])}
${next('#/guide/how-payouts-work', 'Next: watch a payout travel')}
${src(['coverage.payfuture.net · Remittances', COVERAGE])}`;

/* ================= UNDERSTAND ================= */
GD.funding = () => `<h1>Funding & FX</h1>
<p class="lead">Payouts are prefunded: money lands in your PayFuture balance first, then each payout draws from it. Collections work the other way: INR comes in and you settle it out.</p>
${tabs([
  [`${FLAG.IN} India payouts`, `${steps([
    ['Fund in USDT, USD or EUR', 'USDT on TRON (TRC-20), or USD / EUR by bank transfer, to the details PayFuture Finance gives you. Never send to details you found anywhere else.'],
    ['PayFuture converts to INR', 'At a fixed rate of the day. Fund or convert between 11 AM and 3 PM IST and it completes in 2–3 hours.'],
    ['Check your balance', 'Call <code>GetBalance</code> before you send payouts.'],
  ])}`],
  [`${FLAG.PK} Pakistan payouts`, `${steps([
    ['Fund in USDT on TRON (TRC-20)', 'Other networks or currencies need PayFuture Finance approval before onboarding.'],
    ['Meet the cut-off', '2:30 PM GST to PayFuture. The bank cut-off is 4:00 PM PKT (3:00 PM GST).'],
    ['PKR is ready', '30–60 minutes after the bank receives the USDT, Monday to Saturday. Not on Sundays.'],
  ])}`],
  [`${FLAG.IN} India collections`, `<p>INR collected into your account can be converted and settled in <b>USDT, USD or EUR</b>, or held. Rates are available between <b>12:00 and 3:30 PM IST</b> (last trade cut-off).</p>`],
])}
${callout(`<p><b>About the INR rate.</b> PayFuture's coverage page describes the India payout rate both as a fixed rate of the day and as live interbank-based rates available 24x7. Confirm which applies to your account at onboarding. ${TC}</p>`, 'warn')}
${src(['coverage.payfuture.net', COVERAGE])}`;

GD['how-payouts-work'] = () => `<h1>How a payout works</h1>
<p class="lead">A payout is asynchronous: your request is <b>accepted</b> in milliseconds, and the money <b>arrives</b> minutes later. Pick a corridor and an outcome, then press play.</p>
<div class="sim" id="sim">
  <div class="sim-controls">
    <div class="seg" data-k="corridor"><button class="on" data-v="IN">🇮🇳 India</button><button data-v="PK">🇵🇰 Pakistan</button></div>
    <div class="seg" data-k="outcome"><button class="on" data-v="ok">Paid</button><button data-v="fail">Declined</button></div>
    <button class="btn btn-yellow" id="simRun">▶ Send a payout</button>
  </div>
  <ol class="sim-track" id="simTrack"><li class="muted">Pick a corridor and an outcome, then press play.</li></ol>
</div>
<h2>Statuses at a glance</h2>
${table(['Still moving', 'Final: paid', 'Final: not paid'], [
  ['<code>PENDING</code>, <code>IN-PROCESS</code>', '<code>APPROVED</code>', '<code>DECLINED</code>'],
])}
${callout('<p><b>Golden rule:</b> never mark a payout as paid on the first response. Wait for the callback, and confirm it with GetStatus before you act on it.</p>', 'ok')}`;
const SIM = {
  IN: {
    ok: [['You', 'POST PAYOUT to an Indian bank account, signed with your MID secret', 'req'], ['PayFuture', 'HTTP 200 · status PENDING · transaction_id INV78I…', 'res'], ['PayFuture', 'Debits your INR balance and sends it over IMPS · IN-PROCESS', 'mid'], ['Bank', 'Credits the beneficiary, usually in 3–5 minutes · UTR issued', 'bank'], ['PayFuture', 'Callback to your notificationUrl · APPROVED + utrnumber', 'cb'], ['You', 'GetStatus confirms APPROVED → mark as paid 🎉', 'done']],
    fail: [['You', 'POST PAYOUT to an Indian bank account', 'req'], ['PayFuture', 'HTTP 200 · status PENDING', 'res'], ['PayFuture', 'Sends it over IMPS · IN-PROCESS', 'mid'], ['Bank', 'Rejects it: rejected by beneficiary bank (11349)', 'bank'], ['PayFuture', 'Callback · DECLINED · errorcode 11349', 'cb'], ['You', 'GetStatus confirms DECLINED → the money stays in your balance', 'fail']],
  },
  PK: {
    ok: [['You', 'POST PAYOUT to a JazzCash wallet, signed with your MID secret', 'req'], ['PayFuture', 'HTTP 200 · status PENDING', 'res'], ['PayFuture', 'Validates the account title · no money moved yet', 'mid'], ['PayFuture', 'Blocks the amount on your PKR balance and sends it · IN-PROCESS', 'mid'], ['Wallet', 'Credits the beneficiary', 'bank'], ['PayFuture', 'Callback to your notificationUrl · APPROVED', 'cb'], ['You', 'GetStatus confirms APPROVED → mark as paid 🎉', 'done']],
    fail: [['You', 'POST PAYOUT to a JazzCash wallet', 'req'], ['PayFuture', 'HTTP 200 · status PENDING', 'res'], ['PayFuture', 'Validates the account title · it doesn\'t match', 'mid'], ['PayFuture', 'Nothing is sent · no money moved', 'mid'], ['PayFuture', 'Callback · DECLINED · errorcode set', 'cb'], ['You', 'GetStatus confirms DECLINED → check the details with your customer', 'fail']],
  },
};
INIT['how-payouts-work'] = () => {
  const sim = document.getElementById('sim'), st = {corridor: 'IN', outcome: 'ok'};
  let timers = [];
  sim.querySelectorAll('.seg').forEach(seg => seg.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); st[seg.dataset.k] = b.dataset.v;
  });
  document.getElementById('simRun').onclick = () => {
    timers.forEach(clearTimeout); timers = [];
    const track = document.getElementById('simTrack'); track.innerHTML = '';
    SIM[st.corridor][st.outcome].forEach(([who, what, kind], i) => timers.push(setTimeout(() => {
      track.insertAdjacentHTML('beforeend', `<li class="ev ${kind}"><span class="who">${who}</span><span>${what}</span></li>`);
    }, 650 * i)));
  };
};

GD.corridors = () => `<h1>Corridors & limits</h1>
<p class="lead">Where Enterprise works, how fast, and how much. Your contracted limits may differ; PayFuture confirms them at onboarding.</p>
${tabs([
  [`${FLAG.IN} India`, `<h2>Payouts</h2>${spec([
    ['Currency', 'INR'], ['Fund with', 'USDT (TRC-20), USD or EUR'], ['Modes', 'B2B, B2C, C2B, C2C'], ['Channels', 'IMPS and NEFT'],
    ['IMPS', 'Real time, 24x7, usually 3–5 minutes · INR 1,000 – 400,000 per payout (all banks)'], ['NEFT', 'Same day, about 45 minutes, in Indian banking hours · from INR 200,000, no maximum'],
    ['You send', 'Payout type, account number, account name, IFSC, bank name'], ['Business payouts', 'Invoice and GST number required'],
    ['Beneficiary statement', 'IMPS narrative varies by transaction; NEFT shows the sending bank\'s name'],
    ['Proof of payment', 'UTR on every successful payout, sent in the callback'],
  ])}<h2>Collections</h2>${spec([
    ['Rails', 'RTGS and NEFT'], ['Type', 'B2B'], ['Limits', 'No limit'], ['Settle in', 'USDT, USD or EUR'], ['Rate window', '12:00 PM – 3:30 PM IST'],
  ])}`],
  [`${FLAG.PK} Pakistan`, `<h2>Payouts</h2>${spec([
    ['Currency', 'PKR'], ['Fund with', 'USDT on TRON (TRC-20) only'], ['Methods', 'Bank transfer, Easypaisa, JazzCash'],
    ['Throughput', 'Up to 1,500 TPS'], ['Cut-offs', '2:30 PM GST to PayFuture · 4:00 PM PKT (3:00 PM GST) to the bank'],
    ['Settlement', 'PKR available 30–60 minutes after the bank receives the USDT'],
    ['Liquidity', 'Monday–Saturday; not on Sundays'], ['Payee check', 'Account title verified before any money moves'],
    ['Proof of payment', 'Final status by callback; a status check is the fallback'],
  ])}`],
])}
${src(['coverage.payfuture.net', COVERAGE])}`;

GD.glossary = () => `<h1>Glossary</h1>
<p class="lead">The words you'll meet in this guide, in plain English.</p>
<dl class="glossary">${[
  ['Callback', 'The POST PayFuture sends to your <code>notificationUrl</code> when a payout is final.'],
  ['CNIC', 'Pakistan\'s 13-digit national identity number, sent as <code>document_id</code> for wallet payouts.'],
  ['Collection account', 'The INR bank account in India that PayFuture gives you for Collections. Also called a virtual account.'],
  ['Cut-off', 'The time after which funding or payouts move to the next window.'],
  ['HMAC', 'A signature over the raw request body made with your secret, sent in <code>X-Callback-Signature</code>.'],
  ['IBAN', 'International bank account number. Pakistan bank payouts use a 24-character IBAN.'],
  ['Idempotency', 'Sending the same request twice has the effect of sending it once. Use a unique <code>merchantRefNo</code> per payout.'],
  ['IFSC', 'Indian Financial System Code: identifies an Indian bank branch.'],
  ['IMPS / NEFT / RTGS', 'Indian bank transfer rails: IMPS is real time 24x7; NEFT is batch, same day; RTGS is for large-value transfers.'],
  ['MID / MID secret', 'Your merchant ID and the secret used to sign requests and verify callbacks.'],
  ['Off-ramp', 'Converting USDT or fiat into the local currency you pay out in.'],
  ['Prefunding', 'Putting money in your PayFuture balance before you send payouts.'],
  ['Rate of the day', 'The FX rate PayFuture fixes for the day, used to convert your funding.'],
  ['TRC-20', 'The token standard on the TRON blockchain. Enterprise USDT funding uses USDT on TRC-20.'],
  ['USDT', 'Tether, a USD-pegged stablecoin.'],
  ['UTR', 'Unique Transaction Reference: the Indian bank\'s proof that a payout was made.'],
].map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`;

/* ================= BUILD ================= */
GD.journey = () => `<h1>Integration journey</h1>
<p class="lead">Five stages from first conversation to live. For Payouts, most of the work is in stage 3. Collections need no build at all.</p>
<div class="journey">${[
  ['Talk to us', 'Share which products you need (Collections, Payouts or both), your corridors, volumes and funding currency. PayFuture sends a proposal.'],
  ['Onboard', 'Complete KYB. For Payouts you receive your MID and secret and whitelist your server IPs. For Collections, PayFuture allocates your INR collection account (1–2 weeks for an account in your name).'],
  ['Build', 'Payouts: follow the quickstart. Sign requests, send payouts, handle callbacks, reconcile daily.'],
  ['Test', 'A limited live MID with a small top-up. There is no sandbox.'],
  ['Go live', 'Tick the checklist, get sign-off, and PayFuture raises your limits.'],
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
<li><b>Receive the callback</b>PayFuture posts a form-encoded callback to your <code>notificationUrl</code>. Verify it, reply 200 fast.
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
<li><b>Confirm with GetStatus</b>The callback hash doesn't cover <code>status</code>, so confirm before you act:
${code(`{ "requestType": "GetStatus", "data": { "midcode": "MID123", "transaction_id": "INV78I1757502089824", "transaction_type": "payout", "hash": "<SHA256(midcode~transaction_id~transaction_type~midsecret)>" } }`)}
<p><code>APPROVED</code>? Mark it paid and store the <code>utrnumber</code>. 🎉</p></li>
</ol>
${next('#/api/payout', 'Full payout reference, India and Pakistan')}`;

/* ---------- signature playground ---------- */
const SAMPLE = {midcode: 'MID123', amount: '1500', currency: 'INR', bank_name: 'Example Bank', merchantrefno: 'PO-000123', wallet_number: '03001234567', document_id: '4210112345671',
  account_name: 'Asha Rao', account_number: '000123456789', bank_code: 'BANK01', transactionid: 'INV78I1757502089824', transaction_id: 'INV78I1757502089824', txnstatus: 'APPROVED', transaction_type: 'payout'};
const RECIPES = [
  ['in_nb', '🇮🇳 India payout', ['midcode', 'amount', 'currency', 'bank_name', 'midsecret'], {currency: 'INR'}],
  ['pk_wallet', '🇵🇰 Pakistan wallet', ['midcode', 'merchantrefno', 'wallet_number', 'document_id', 'amount', 'currency', 'midsecret'], {currency: 'PKR'}],
  ['pk_bt', '🇵🇰 Pakistan bank', ['midcode', 'account_name', 'account_number', 'bank_code', 'amount', 'currency', 'midsecret'], {currency: 'PKR'}],
  ['getstatus', '🔎 GetStatus', ['midcode', 'transaction_id', 'transaction_type', 'midsecret'], {}],
  ['getbalance', '💰 GetBalance', ['midcode', 'midsecret'], {}],
  ['resp', '✅ Payout response', ['midcode', 'transactionid', 'merchantrefno', 'txnstatus', 'amount', 'midsecret'], {}],
  ['callback', '📨 Callback', ['midcode', 'transactionid', 'amount', 'midsecret'], {}, ''],
];
GD.playground = () => `<h1>Signature playground</h1>
<p class="lead">Build a request signature piece by piece, watch it change as you type, and let the hash detective find out why yours doesn’t match. Everything runs in your browser; nothing is sent anywhere.</p>
${callout('<p>Use a <b>test</b> secret only. The demo secret below is fake.</p>', 'warn')}
<div class="pg">
${tabs([
  ['🧩 Body hash', `<div class="chips" id="pgRecipes">${RECIPES.map(([k, l], i) => `<button class="chip ${i ? '' : 'on'}" data-k="${k}">${l}</button>`).join('')}</div>
    <div class="pg-grid"><div id="pgFields" class="pg-fields"></div>
      <div><label class="pg-l" for="pgSecret">MID secret</label><input id="pgSecret" value="Demo_Secret_42" autocomplete="off"></div></div>
    <div class="pg-l">The string that gets hashed</div><div class="pg-string" id="pgString"></div>
    <div class="pg-fixes" id="pgFixes"></div>
    <div class="pg-l">SHA-256</div><div class="pg-out"><code id="pgHash"></code><button class="copy-mini" data-copy="pgHash">Copy</button></div>`],
  ['🔐 HMAC header', `<p>The API also accepts an HMAC of the <b>raw body</b>. One extra space changes the signature completely. Try the buttons.</p>
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
<p>All formulas: <a href="#/api/signing">Authentication & signing reference</a>.</p>`;

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
<p class="lead">There is no sandbox, so testing happens in production with guard rails: low limits and small amounts.</p>
<h2>Payouts</h2>
${steps([
  ['Get a limited live MID', 'PayFuture issues it with low limits; whitelist your IPs.'], ['Fund a small amount', 'A small top-up; confirm with GetBalance.'],
  ['One payout per method', 'To accounts you control, in each corridor you will use.'], ['Verify callback + GetStatus', 'Both must agree before you mark paid.'],
  ['Break it on purpose', 'A wrong hash should give 11031, and your code should handle it.'], ['Ask for limits', 'Once results are signed off.'],
])}
<h2>Collections</h2>
<p>Ask a partner to make a small RTGS or NEFT payment into your collection account, and check it is credited and settles in the currency you chose.</p>
${next('#/guide/checklist', 'Open the go-live checklist')}`;

const CHECK = [
  ['Credentials', 'MID secret lives in a secrets manager, never in code or logs'],
  ['Credentials', 'Server IPs whitelisted with PayFuture'],
  ['Payouts', 'A unique merchantRefNo on every payout'],
  ['Payouts', 'Balance checked before sending'],
  ['Payouts', 'Payouts marked paid only on a final status'],
  ['Signing & callbacks', 'Request signatures verified in the playground'],
  ['Signing & callbacks', 'Callback hash verified, then confirmed with GetStatus'],
  ['Signing & callbacks', 'Callback endpoint replies 200 within a few seconds'],
  ['Operations', 'Daily reconciliation against GetTransactionList'],
  ['Operations', 'One payout per method tested end to end'],
  ['Operations', 'Failure paths tested: bad signature, bad beneficiary, low balance'],
  ['Collections', 'Collection account details shared with your payers'],
  ['Collections', 'A test payment received and settled'],
];
GD.checklist = () => `<h1>Go-live checklist</h1>
<p class="lead">Tick each item as you finish it. Your progress is saved in this browser only.</p>
<div class="progress"><div id="ckBar"></div></div><p class="muted" id="ckCount"></p>
<div id="ck">${[...new Set(CHECK.map(c => c[0]))].map(g => `<h3>${g}</h3>${CHECK.map((c, i) => c[0] === g ? `<label class="ck"><input type="checkbox" data-i="${i}"><span>${c[1]}</span></label>` : '').join('')}`).join('')}</div>`;
INIT.checklist = () => {
  let done = {}; try { done = JSON.parse(localStorage.getItem('pf-ent-check2') || '{}'); } catch (_) {}
  const box = document.getElementById('ck');
  const upd = () => {
    const n = Object.values(done).filter(Boolean).length;
    document.getElementById('ckBar').style.width = `${Math.round(100 * n / CHECK.length)}%`;
    document.getElementById('ckCount').textContent = n === CHECK.length ? '🚀 All done. Ask PayFuture for go-live sign-off!' : `${n} of ${CHECK.length} done`;
  };
  box.querySelectorAll('input').forEach(i => { i.checked = !!done[i.dataset.i]; });
  box.onchange = e => { done[e.target.dataset.i] = e.target.checked; try { localStorage.setItem('pf-ent-check2', JSON.stringify(done)); } catch (_) {} upd(); };
  upd();
};

/* ================= HELP ================= */
GD.faq = () => {
  const q = (t, a) => `<details class="faq"><summary>${t}</summary>${a}</details>`;
  return `<h1>FAQ</h1>
${q('Is Enterprise the same as the PayFuture Gateway?', '<p>No. Enterprise is for businesses that collect and pay out across borders at scale. The Gateway serves gaming, forex, P2P and e-commerce merchants and has its own docs, hosts and credentials.</p>')}
${q('What is the difference between Collections and Payouts?', '<p><b>Collections</b> brings money in: you get an INR account in India and settle what you collect in USDT, USD or EUR. <b>Payouts</b> sends money out: you fund in USDT, USD or EUR and pay beneficiaries in India and Pakistan.</p>')}
${q('Which product do I need?', '<p>Use the <a href="#/guide/find-your-product">product finder</a>. It asks what you want to do, which money you start or end with, and where.</p>')}
${q('Do Collections need an API integration?', '<p>No. Collections work through your collection account. You build against the API for Payouts.</p>')}
${q('Can I fund Pakistan payouts in USD?', '<p>Pakistan payouts are funded in USDT on TRON (TRC-20). Other currencies need PayFuture Finance approval before onboarding.</p>')}
${q('Is there a sandbox?', '<p>No. You test on a limited live MID with low limits and a small top-up.</p>')}
${q('Why do I get HTTP 403?', '<p>Your server IP is not whitelisted.</p>')}
${q('My hash doesn\'t match. Help!', '<p>Paste it into the <a href="#/guide/playground">hash detective</a>. Nine times out of ten it is amount format, secret case or field order.</p>')}
${q('Which statuses are final?', '<p><code>APPROVED</code> and <code>DECLINED</code>.</p>')}
${q('I didn\'t receive a callback.', '<p>Check your <code>notificationUrl</code> is public HTTPS and answers 200 quickly, then call GetStatus. Reconcile daily so nothing slips through.</p>')}`;
};

GD.support = () => `<h1>Support</h1>
<p class="lead">Your PayFuture integration contact is your first stop for credentials, IP whitelisting, collection accounts, funding instructions and limits. ${TC}</p>
<div class="grid2">
  <div class="tile"><span class="tag">Include</span><ul class="tight"><li>The product (Collections or Payouts) and your MID</li><li>Your merchantRefNo and PayFuture's transaction ID</li><li>Request and response, secrets removed</li></ul></div>
  <div class="tile"><span class="tag">Never send</span><ul class="tight"><li>Your MID secret</li><li>Full card or ID numbers</li></ul></div>
</div>`;
