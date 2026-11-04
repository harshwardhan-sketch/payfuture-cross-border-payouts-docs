/* "About PayFuture" — the company, its business and the solutions Enterprise is built on.
   Copy and images are from the public site www.payfuture.net (about-us, solutions/*, countries, industries),
   the same material the Legacy docs site uses. Images live in assets/site/. */

const IMG = f => `assets/site/${f}`;
const fig = (f, alt, cls = '') => `<img class="pf-img ${cls}" src="${IMG(f)}" alt="${esc(alt)}" loading="lazy">`;
const banner = (f, title, sub) => `<div class="pf-banner">${fig(f, title)}<div class="pf-banner-text"><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
const media = (f, alt, body, flip = false) => `<div class="pf-media ${flip ? 'flip' : ''}"><div>${body}</div>${fig(f, alt)}</div>`;
const feat = items => `<div class="grid3">${items.map(([t, d, icon]) => `<div class="tile">${icon ? `<img class="pf-icon" src="${IMG(icon)}" alt="" loading="lazy">` : ''}<b>${t}</b><span>${d}</span></div>`).join('')}</div>`;
const WEB = 'https://www.payfuture.net';
const web = (path, label) => src([label, WEB + path]);
const next = (href, label) => `<a class="next-cta" href="${href}">${label} <span>→</span></a>`;

const FLAGS_SITE = [['India', 'india.svg'], ['Pakistan', 'pakistan.svg'], ['Bangladesh', 'bangladesh.svg'], ['Sri Lanka', 'Sri-Lanka-flag-global-reach.svg'], ['Nepal', 'Nepal.svg'],
  ['Philippines', 'Philippines-1.png'], ['Malaysia', 'Malaysia.svg'], ['Egypt', 'egypt.svg'], ['Morocco', 'Morocco-global-reach-flag-1.svg'], ['Nigeria', 'Nigeria-flag.svg'],
  ['Kenya', 'kenya.svg'], ['South Africa', 'sf.svg'], ['Brazil', 'brazil.svg'], ['Argentina', 'argentina.svg'], ['Mexico', 'mexico.svg']];
/* Enterprise corridors (coverage.payfuture.net): Collections in India, Payouts to India and Pakistan */
const ENT_MARKETS = new Set(['India', 'Pakistan']);
const LOGOS = [['Ace Money Transfer', 'Ace-Money-Transfer.svg'], ['APA', 'APA.svg'], ['Faster Payments', 'Faster-Payments.svg'], ['Unigox', 'Unigox.svg'], ['Tamatem', 'Tamatem-1.svg'], ['Profee', 'Profee-1.svg'], ['Pagsmile', 'Pagsmile-1.svg']];
const TEAM = [['Manpreet Haer', 'Co-Founder & Chief Executive Officer', 'Manpreet-haer.png'], ['Jon Bowman', 'Chief Technology Officer', 'Jon-Bowman.png'],
  ['Sid Gautam', 'Chief Revenue Officer', 'Sid-2.webp'], ['Saaly Temirkanov', 'Chief Operating Officer', 'Saaly.webp']];
const SOLUTIONS = [
  ['payouts', 'Payouts', 'Fast, secure, localised payouts to wallets and bank accounts.', 'payouts-banner.webp'],
  ['cross-border', 'Cross-border payments', 'Compliant fund movement, FX and repatriation across complex corridors.', 'crossborder-hero.png'],
  ['stablecoin', 'Stablecoin payments', 'Settle cross-border faster on regulated stablecoin rails.', 'Stablecoin-copy.webp'],
  ['mass-payments', 'Global mass payments', 'Pay thousands of recipients across markets in one run.', 'mass-hero.jpg'],
  ['reporting', 'Reporting & analytics', '24/7 monitoring, real-time dashboards and alerts.', 'real-time-payments-bg.webp'],
];

NAV.about = [
  ['About PayFuture', [['who-we-are', 'Who we are'], ['what-we-do', 'What we do'], ['markets', 'Markets & corridors'], ['industries', 'Industries & partners']]],
  ['Solutions behind Enterprise', SOLUTIONS.map(([id, t]) => [id, t])],
];
const A = PAGES.about;

A['who-we-are'] = () => `${banner('about-hero.jpg', 'The future of payments is now', 'Leading payment solutions for emerging markets')}
<p class="lead">At PayFuture, we’re transforming the landscape of digital payments for online merchants, SMEs, and enterprises across emerging markets. With our innovative technology and deep understanding of local markets, we bridge the gap between global businesses and high-growth economies, enabling seamless, secure, and efficient payment solutions.</p>
<div class="grid3">
  <div class="tile"><span class="stat">250+</span><span>merchants onboarded</span></div>
  <div class="tile"><span class="stat">120+</span><span>employees from over 20 nationalities</span></div>
  <div class="tile"><span class="stat">4+</span><span>locations worldwide, headquartered in London</span></div>
</div>
<h2>Trusted by businesses that move money at scale</h2>
<p>Remittance companies, payment platforms and global brands already move money with PayFuture.</p>
<div class="pf-logos">${LOGOS.map(([n, f]) => `<img src="${IMG(f)}" alt="${n}" title="${n}" loading="lazy">`).join('')}</div>
<p class="src">Logos as shown on payfuture.net. Names of Enterprise reference customers ${TC}</p>
<div class="grid2">
  <div class="tile"><span class="tag">Mission</span><b>Empowering global expansion</b><span>We empower global expansion and exponential growth by offering payment solutions and a comprehensive suite of tools and insights for success in emerging markets. We remove traditional entry barriers for online businesses by providing local pay-ins, payouts, and cross-border settlements.</span></div>
  <div class="tile"><span class="tag">Vision</span><b>Commerce without barriers</b><span>We envision a future where geographical and financial barriers no longer prevent businesses from connecting with consumers worldwide — fostering economic growth, financial inclusion, and connectivity.</span></div>
</div>
<h2>Why emerging markets need a specialist</h2>
${media('emerging-markets.webp', 'Challenges in emerging markets', `<p>PayFuture operates only in emerging markets. Doing business there is rewarding, and hard:</p>
<ul><li>Governments frequently update policies and regulations.</li><li>Local entities often need local directors, shareholders and verified offices.</li><li>Tax filings and local compliance add up quickly.</li><li>Political stability shapes how business gets done.</li></ul>
<p>PayFuture takes that complexity on for you: local payment methods, <b>one API</b>, and end-to-end market entry with local partners.</p>`)}
<h2>A team of innovators</h2>
<p>Industry veterans in fintech, payments and global banking, with decades of experience between them.</p>
<div class="pf-team">${TEAM.map(([n, r, f]) => `<div class="tile">${fig(f, n, 'pf-avatar')}<b>${n}</b><span>${r}</span></div>`).join('')}</div>
${next('#/about/what-we-do', 'Next: what PayFuture does')}
${web('/about-us/', 'payfuture.net/about-us')}`;

A['what-we-do'] = () => `${banner('main-banner0002.webp', 'Reach billions in emerging markets', 'Business and enterprise payment solutions across high-growth markets')}
<p class="lead">PayFuture helps companies accept local payment methods, pay out to local accounts and move money across borders in high-growth markets, all through a single integration.</p>
<p>Our <b>Emerging Market Entry Methodology (EMEM)</b> removes the usual roadblocks of pay-ins, payouts and cross-border fund repatriation, so market entry is faster and simpler.</p>
<h2>Two ways to work with PayFuture</h2>
<div class="grid2">
  <div class="tile"><span class="tag">Gateway</span><b>PayFuture Gateway</b><span>Pay-ins and payouts for gaming, forex, P2P and e-commerce merchants. It has its own developer docs.</span></div>
  <a class="tile hl" href="#/guide/enterprise"><span class="tag">This guide</span><b>PayFuture Enterprise →</b><span>Two products for businesses that move money across borders at scale: Collections (pay-ins) and Payouts (remittance).</span></a>
</div>
<h2>The solutions behind Enterprise</h2>
<div class="pf-cards">${SOLUTIONS.map(([id, t, d, img]) => `<a class="pf-card" href="#/about/${id}">${fig(img, t)}<div><b>${t} →</b><span>${d}</span></div></a>`).join('')}</div>
<h2>One API, every flow</h2>
${feat([
  ['Local experience', 'Reach recipients through the payment methods they know and trust.'],
  ['A single payments API', 'Integrate once for remittance, local payouts and cross-border repatriation across markets.'],
  ['Built for scale', 'Higher success rates, risk management built for enterprise volumes, and a global support team around the clock.'],
])}
${next('#/guide/enterprise', 'Next: meet PayFuture Enterprise')}
${web('/solutions/', 'payfuture.net/solutions')}`;

A.markets = () => `${banner('countries-banner.webp', 'Unlock opportunities in emerging markets with confidence', 'Regions where 85% of the world’s population resides')}
<p class="lead">PayFuture focuses on high-population, underbanked regions where governments are driving financial inclusion and reducing cash dependency.</p>
<div class="grid3" style="grid-template-columns:repeat(4,minmax(0,1fr))">
  <div class="tile"><b>In &amp; out</b><span>On-ramp and off-ramp</span></div>
  <div class="tile"><b>One integration</b><span>Single API, many markets</span></div>
  <div class="tile"><b>Stablecoin optional</b><span>Fiat or stablecoin rails</span></div>
  <div class="tile"><b>Regulated</b><span>Compliant by design</span></div>
</div>
<h2>Our global reach</h2>
<div class="pf-flags">${FLAGS_SITE.map(([n, f]) => `<div class="pf-flag">${fig(f, n)}<span>${n}</span>${ENT_MARKETS.has(n) ? '<em>Enterprise</em>' : ''}</div>`).join('')}</div>
<p class="src">“Enterprise” marks the corridors where Enterprise Collections or Payouts are live. See <a href="#/guide/corridors">Corridors</a>.</p>
<h2>Live corridors</h2>
<div class="grid2">
  <div class="tile"><div class="pf-corridor">${fig('Chinese-flag-1.png', 'China')}<span>→</span>${fig('India-flag.png', 'India')}</div><b>China → India</b><span>Supplier settlements, treasury transfers and B2B payments.</span></div>
  <div class="tile"><div class="pf-corridor">${fig('USA-flag.png', 'USA')}<span>→</span>${fig('India-flag.png', 'India')}</div><b>USA → India</b><span>Vendor, supplier and treasury payments.</span></div>
</div>
<h2>Market spotlight: India</h2>
${media('payment-netbanking.svg', 'Net banking', `<p>One of the world’s fastest-growing digital economies. Enterprise pays out to any Indian bank account over <b>IMPS</b> (real time, 24x7) and <b>NEFT</b> (same day), with a UTR bank reference on every successful payout.</p>`)}
${web('/countries/', 'payfuture.net/countries')}`;

A.industries = () => `<h1>Industries &amp; partners</h1>
<p class="lead">PayFuture supports businesses that need reliable cross-border and local payments in emerging markets.</p>
<div class="pf-cards">${[
  ['Remittance.png', 'Remittance providers'], ['Financial-services.webp', 'Financial services'], ['Platform-businesses.webp', 'Platforms & marketplaces'],
  ['Travel.png', 'Travel'], ['video-gaming.png', 'Video gaming'], ['em-img01.png', 'E-learning'],
].map(([f, t]) => `<div class="pf-card">${fig(f, t)}<div><b>${t}</b></div></div>`).join('')}</div>
<h2>Channel partners</h2>
<div class="grid3" style="grid-template-columns:repeat(4,minmax(0,1fr))">${[
  ['ic__001.svg', 'Payment gateways'], ['ic__002.svg', 'Licensed payment processors'], ['ic__003.svg', 'Acquirers'], ['ic__004.svg', 'Referral partners and agents'],
].map(([f, t]) => `<div class="tile"><img class="pf-icon" src="${IMG(f)}" alt="" loading="lazy"><b>${t}</b></div>`).join('')}</div>
${web('/industries/', 'payfuture.net/industries')}`;

A.payouts = () => `${banner('payouts-banner.webp', 'Effortless global payouts for your business')}
<p class="lead">Fast, secure and localised payouts designed for businesses operating in emerging markets.</p>
${media('Businesses-Expanding.webp', 'Payouts made for emerging markets', `<h2>Payouts made for emerging markets</h2><p>PayFuture simplifies global disbursements, so you can pay customers, sellers, partners and vendors on time and expand faster.</p>`)}
${feat([
  ['Local payout options', 'Bank transfers and mobile wallets people actually use.'],
  ['Fraud prevention', 'KYC procedures and fraud monitoring keep payouts secure and compliant.'],
  ['Flexible settlement', 'Pay out in local currencies while you fund in USD, EUR or USDT.'],
  ['Fast, reliable transfers', 'Funds go straight to beneficiaries’ bank accounts or wallets.'],
  ['Reconciliation', 'Track every payout with references, statements and reports.'],
  ['Grows with you', 'Add new corridors as you enter new markets.'],
])}
${next('#/guide/how-payouts-work', 'See how an Enterprise payout works')}
${web('/solutions/payouts/', 'payfuture.net/solutions/payouts')}`;

A['cross-border'] = () => `${banner('crossborder-hero.png', 'Cross-border payment solutions for global businesses')}
<p class="lead">Enter and scale in emerging markets with compliant cross-border fund movement into and out of local markets.</p>
${media('Smarter-way.webp', 'A smarter way to move money across borders', `<h2>A smarter way to move money across borders</h2><p>Whether it is your first new market or your tenth, PayFuture supports every stage of cross-border fund movement: regulatory requirements, compliant international transfers, currency conversion and repatriation.</p>`)}
<h2>How it works</h2>
${steps([['Talk to our specialists', 'Share your target markets and settlement needs.'], ['Get a bespoke proposal', 'Pricing built on your volumes, markets and model.'], ['Go live', 'Move money into and out of markets without juggling providers.']])}
<h2>Who it’s for</h2>
<div class="pf-cards">${[
  ['Financial-services.webp', 'Financial services', 'Banks, remittance companies, PSPs and digital-first institutions.'],
  ['Global-businesses.webp', 'Global enterprises', 'Cross-border operations and settlement with FX and liquidity under control.'],
  ['Global-merchants.webp', 'Global merchants', 'Bring revenue home from international markets efficiently and compliantly.'],
].map(([f, t, d]) => `<div class="pf-card">${fig(f, t)}<div><b>${t}</b><span>${d}</span></div></div>`).join('')}</div>
${web('/solutions/cross-border-payments/', 'payfuture.net/solutions/cross-border-payments')}`;

A.stablecoin = () => `${banner('Stablecoin-copy.webp', 'Stablecoin cross-border payments. At scale.')}
<p class="lead">Enterprise lets you fund payouts in <b>USDT</b>: settle across borders in hours instead of days, without rebuilding your operations.</p>
<p>Traditional cross-border payments rely on correspondent banks, multiple intermediaries and settlement windows of two to five business days. In emerging markets that is not a delay, it is a deal-breaker.</p>
<h2>Four steps, in and out of emerging markets</h2>
${steps([['On-ramp', 'Fiat converts into stablecoin through compliant, regulated infrastructure.'], ['Move', 'Funds travel on stablecoin rails alongside banking infrastructure.'], ['Off-ramp', 'Stablecoin converts into local currency at the destination, backed by local liquidity.'], ['Deliver', 'Funds reach the recipient fast, with on-chain visibility.']])}
${table(['Without regulated stablecoin infrastructure', 'With PayFuture'], [
  ['Opaque fees and unpredictable FX', 'Transparent pricing, consistent FX'],
  ['Settlement in 2–5 business days', 'Near-instant stablecoin settlement'],
  ['Dependence on correspondent banks', 'Direct rails, fewer intermediaries'],
  ['No visibility into fund movement', 'On-chain confirmation'],
])}
${next('#/guide/funding', 'How funding works in Enterprise')}
${web('/solutions/stablecoin-cross-border-payments/', 'payfuture.net/solutions/stablecoin-cross-border-payments')}`;

A['mass-payments'] = () => `${banner('mass-hero.jpg', 'Global mass payments for high-volume disbursements')}
<p class="lead">Pay thousands of recipients across markets in a single execution: compliantly, efficiently and without operational friction.</p>
${feat([
  ['Marketplaces & platforms', 'Settle sellers and vendors across markets at once.'],
  ['Gig & on-demand', 'Pay contractors and freelancers globally.'],
  ['Affiliate networks', 'Monthly commissions across regions.'],
  ['E-commerce & retail', 'Supplier and logistics settlements.'],
  ['Financial services', 'High-volume client disbursements and treasury flows.'],
  ['SaaS & B2B', 'Revenue share, rebates and platform payouts.'],
])}
<p>With Enterprise you send each payout through the API, and Pakistan payouts handle up to <b>1,500 transactions per second</b>.</p>
${web('/solutions/global-mass-payments/', 'payfuture.net/solutions/global-mass-payments')}`;

A.reporting = () => `${banner('real-time-payments-bg.webp', 'Smarter payment decisions with real-time insights')}
<p class="lead">Full visibility into payment performance, so you can act faster and reconcile with confidence.</p>
${media('eporting-and-analytics-img.webp', '24/7 transaction monitoring', `<h2>24/7 transaction monitoring</h2><p>PayFuture’s monitoring team watches transaction traffic in real time, every day of the year, and responds quickly to any issue.</p>`)}
${feat([
  ['Transaction analytics', 'Spot trends across your payouts.'],
  ['Settlement & reconciliation', 'Transactions, payouts and balances in one place.'],
  ['Alerts', 'Notifications for failures, delays or unusual activity.'],
])}
<div class="callout"><p><b>From the API:</b> <a href="#/api/reconciliation">GetBalance and GetTransactionList</a>.</p></div>
${web('/solutions/reporting-and-analytics/', 'payfuture.net/solutions/reporting-and-analytics')}`;
