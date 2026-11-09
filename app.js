/* PayFuture Cross-border Payouts developer docs: renderer and router.
   Sections: #/guide/... (Integration guide) and #/api/... (API reference), each with its own side menu,
   plus two full-width tool pages: #/corridors (Corridors) and #/playground (Hash playground).
   Page content lives in guide.js, pages.js, corridors.js and playground.js; the API reference mirrors the live docs
   (api-data.js, rendered by apiref.js).
   Build-free: open index.html directly. Visible text never uses internal names (Enterprise, IGE, CBS, Legacy).
   Scope (Nov 2026): India payouts live; Pakistan coming soon (Confluence PMA 1979875329). */

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function hl(src, lang) {
  let h = esc(src);
  if (lang === 'json') {
    h = h.replace(/("(?:[^"\\]|\\.)*")(\s*:)?/g, (m, str, colon) => colon ? `<span class="k">${str}</span>${colon}` : `<span class="s">${str}</span>`)
         .replace(/\b(true|false|null|-?\d+(?:\.\d+)?)\b(?![^<]*>)/g, '<span class="n">$1</span>');
  }
  return h;
}
function code(src, lang = 'json') {
  return `<pre><span class="lang">${lang}</span><button class="copy">Copy</button><code style="all:unset">${hl(String(src).trim(), lang)}</code></pre>`;
}
function table(head, rows) {
  return `<table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${
    rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function fields(rows) {
  return table(['Field', 'Type', 'Required', 'Description'], rows.map(([f, t, r, d]) => [`<code>${f}</code>`, t,
    r === true ? '<span class="req">Required</span>' : r === false ? '<span class="opt">Optional</span>' : r, d]));
}
const ep = (m, p) => `<div class="endpoint"><span class="method ${m.toLowerCase()}">${m}</span><span>${p}</span></div>`;
const callout = (html, kind = '') => `<div class="callout ${kind}">${html}</div>`;
const steps = items => `<ol class="steps">${items.map(([b, t]) => `<li><b>${b}</b>${t}</li>`).join('')}</ol>`;
const src = (...links) => `<p class="src">Source: ${links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join(' · ')}</p>`;
const API_DOCS = 'https://document.payfuture.net';

/* ---------- sections ---------- */
const SECTIONS = {
  guide: {label: 'Integration guide', sub: 'Cross-border Payouts', tab: 'guide'},
  api: {label: 'API reference', sub: 'Cross-border Payouts', tab: 'api'},
};
const PAGES = {guide: {}, api: {}};
const NAV = {guide: [], api: []};
/* full-width tool pages without a side menu: [title, page()] (filled by corridors.js and playground.js) */
const SOLO = {};
/* per-page hooks for the interactive pages: INIT[pageId](arg) runs after the page is drawn */
const INIT = {};
/* pages that moved or were removed: old links keep working */
const MOVED = {'guide/playground': '#/playground', 'guide/corridors': '#/corridors', 'api/limits': '#/corridors', 'guide/payouts': '#/corridors',
  'guide/collections': '#/corridors', 'guide/enterprise': '#/guide/welcome', 'guide/find-your-product': '#/corridors', 'api/funding': '#/guide/funding',
  'api/testing': '#/guide/go-live', 'api/faq': '#/guide/faq', 'api/status': '#/api/op-get-status', 'api/callbacks': '#/api/payout',
  'api/reconciliation': '#/api/balance'};

/* phones hide the header tabs, so the slide-out menu repeats them at the top */
const mobileTabs = () => `<div class="mtabs">${[...document.querySelectorAll('#switch a')].map(a => `<a href="${a.getAttribute('href')}" data-tab="${a.dataset.tab}">${a.textContent}</a>`).join('')}<a href="https://www.payfuture.net/" target="_blank" rel="noopener">About PayFuture ↗</a></div>`;
const setTab = tab => document.querySelectorAll('#switch a, .mtabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));

/* ---------- router ---------- */
const app = document.getElementById('app');
function render() {
  const [, sec, id, arg] = (location.hash || '#/').split('/');
  document.body.classList.remove('menu');
  if (sec === 'about') { location.replace('#/'); return; }
  if (MOVED[sec + '/' + id]) { location.replace(MOVED[sec + '/' + id]); return; }
  if (SOLO[sec]) {
    app.innerHTML = `<div class="layout solo" data-sec="${sec}"><nav class="side">${mobileTabs()}</nav><main>${SOLO[sec][1]()}</main></div>`;
    setTab(sec); document.title = `${SOLO[sec][0]} · PayFuture Cross-border Payouts`; window.scrollTo(0, 0); afterRender(sec); return;
  }
  if (!SECTIONS[sec]) {
    app.innerHTML = home(); setTab(null);
    document.title = 'PayFuture Cross-border Payouts · Developer Docs'; window.scrollTo(0, 0); afterRender('home'); return;
  }
  const flat = NAV[sec].flatMap(([g, items]) => items.map(i => [...i, g]));
  const cur = flat.find(i => i[0] === id) || flat[0];
  const idx = flat.indexOf(cur), prev = flat[idx - 1], next = flat[idx + 1];
  const S = SECTIONS[sec];
  const pager = `<div class="pager">${prev ? `<a href="#/${sec}/${prev[0]}"><small>Previous</small>${prev[1]}</a>` : '<span></span>'}${next ? `<a href="#/${sec}/${next[0]}" style="text-align:right"><small>Next</small>${next[1]}</a>` : ''}</div>`;
  const main = `<div class="crumb">${S.label} · ${cur[2]}</div>${PAGES[sec][cur[0]](arg)}${pager}`;
  const layout = app.querySelector('.layout');
  if (layout && layout.dataset.sec === sec) {
    layout.querySelector('main').innerHTML = main;
    layout.querySelectorAll('nav.side > a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#/${sec}/${cur[0]}`));
  } else {
    app.innerHTML = `<div class="layout" data-sec="${sec}">
      <nav class="side">${mobileTabs()}<div class="side-product">${S.label} <small>${S.sub}</small></div><input id="navFilter" type="search" placeholder="Filter this menu" aria-label="Filter the menu by page title">
        ${NAV[sec].map(([g, items]) => `<h4>${g}</h4>${items.map(([pid, t]) => `<a href="#/${sec}/${pid}" class="${pid === cur[0] ? 'on' : ''}">${t}</a>`).join('')}`).join('')}
      </nav><main>${main}</main></div>`;
  }
  setTab(S.tab);
  document.title = `${cur[1]} · ${S.label} · PayFuture Cross-border Payouts`;
  window.scrollTo(0, 0);
  afterRender(cur[0], arg);
}
window.addEventListener('hashchange', render);

/* ---------- after every render ---------- */
function afterRender(pageId, arg) {
  /* soft fade-in for the new page content */
  const m = document.querySelector('#app main') || app;
  m.classList.remove('enter'); void m.offsetWidth; m.classList.add('enter');
  /* wrap tables so they scroll sideways on small screens */
  document.querySelectorAll('#app table').forEach(t => { if (!t.parentElement.classList.contains('tw')) { const w = document.createElement('div'); w.className = 'tw'; t.replaceWith(w); w.appendChild(t); } });
  if (INIT[pageId]) INIT[pageId](arg ? decodeURIComponent(arg) : '');
  document.dispatchEvent(new CustomEvent('pf:rendered', {detail: {pageId, arg}}));
}

/* ---------- UI events ---------- */
document.addEventListener('click', e => {
  const c = e.target.closest('.copy');
  if (c) { navigator.clipboard?.writeText(c.parentElement.querySelector('code').innerText).catch(() => {}); c.textContent = 'Copied'; setTimeout(() => c.textContent = 'Copy', 1200); }
  const tb = e.target.closest('.tabs button');
  if (tb) {
    const id = tb.parentElement.dataset.tabs, i = tb.dataset.i;
    tb.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === tb));
    document.querySelectorAll(`[data-pane^="${id}-"]`).forEach(p => p.classList.toggle('on', p.dataset.pane === `${id}-${i}`));
  }
  const ds = e.target.closest('[data-search]');
  if (ds) { e.preventDefault(); window.openSearch?.(ds.dataset.search); }
  const b = e.target.closest('.copy-mini');
  if (b) { navigator.clipboard?.writeText(document.getElementById(b.dataset.copy).textContent).catch(() => {}); b.textContent = 'Copied ✓'; b.classList.add('done'); setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('done'); }, 1200); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'navFilter') {
    const q = e.target.value.toLowerCase().trim(), side = e.target.closest('nav.side'); let any = 0;
    side.querySelectorAll('h4').forEach(h => {
      let n = h.nextElementSibling, shown = 0;
      while (n && n.tagName === 'A') { const ok = n.textContent.toLowerCase().includes(q); n.style.display = ok ? '' : 'none'; shown += ok; n = n.nextElementSibling; }
      h.style.display = shown ? '' : 'none'; any += shown;
    });
    let none = side.querySelector('.nav-none');
    if (!none) { none = document.createElement('p'); none.className = 'nav-none'; side.appendChild(none); }
    none.innerHTML = any ? '' : `No page titles match. <a href="#" data-search="${esc(e.target.value)}">Search all the docs for “${esc(e.target.value)}” →</a>`;
  }
});
document.getElementById('menuBtn').onclick = () => document.body.classList.toggle('menu');
document.getElementById('themeBtn').onclick = () => {
  const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  /* switch colours instantly: no element should animate its colours on a theme change */
  r.classList.add('theme-switching'); r.dataset.theme = dark ? 'light' : 'dark'; void r.offsetWidth;
  setTimeout(() => r.classList.remove('theme-switching'), 0);
  try { localStorage.setItem('pf-theme', r.dataset.theme); } catch (_) {}
};
try { const t = localStorage.getItem('pf-theme'); if (t) document.documentElement.dataset.theme = t; } catch (_) {}

/* ---------- tabs ---------- */
let tabSeq = 0;
function tabs(items) {
  const id = 't' + (++tabSeq);
  return `<div class="tabs" data-tabs="${id}">${items.map((t, i) => `<button class="${i ? '' : 'on'}" data-i="${i}">${t[0]}</button>`).join('')}</div>` +
    items.map((t, i) => `<div class="tabpane ${i ? '' : 'on'}" data-pane="${id}-${i}">${t[1]}</div>`).join('');
}


/* ---------- SHA-256 (pure JS: works offline and on file://) ---------- */
const sha256 = (() => {
  const primes = []; for (let n = 2; primes.length < 64; n++) { let p = true; for (let d = 2; d * d <= n; d++) if (n % d === 0) { p = false; break; } if (p) primes.push(n); }
  const frac = x => ((x - Math.floor(x)) * 4294967296) >>> 0;
  const K = primes.map(p => frac(Math.cbrt(p))), H0 = primes.slice(0, 8).map(p => frac(Math.sqrt(p)));
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  return input => {
    const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input, l = bytes.length;
    const buf = new Uint8Array(((l + 9 + 63) >> 6) << 6); buf.set(bytes); buf[l] = 0x80;
    const dv = new DataView(buf.buffer); dv.setUint32(buf.length - 4, (l * 8) >>> 0); dv.setUint32(buf.length - 8, Math.floor(l / 536870912));
    const H = H0.slice(), W = new Uint32Array(64);
    for (let i = 0; i < buf.length; i += 64) {
      for (let t = 0; t < 16; t++) W[t] = dv.getUint32(i + t * 4);
      for (let t = 16; t < 64; t++) { const a = W[t - 15], b = W[t - 2]; W[t] = (W[t - 16] + (rotr(a, 7) ^ rotr(a, 18) ^ (a >>> 3)) + W[t - 7] + (rotr(b, 17) ^ rotr(b, 19) ^ (b >>> 10))) >>> 0; }
      let [a, b, c, d, e, f, g, h] = H;
      for (let t = 0; t < 64; t++) {
        const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + W[t]) >>> 0;
        const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      [a, b, c, d, e, f, g, h].forEach((v, j) => H[j] = (H[j] + v) >>> 0);
    }
    const out = new Uint8Array(32); H.forEach((x, j) => new DataView(out.buffer).setUint32(j * 4, x));
    return typeof input === 'string' || !sha256.raw ? [...out].map(b => b.toString(16).padStart(2, '0')).join('') : out;
  };
})();
/* raw-bytes digest, used by HMAC */
const sha256raw = bytes => { sha256.raw = true; try { return sha256(bytes); } finally { sha256.raw = false; } };
/* HMAC-SHA256(key, message) -> hex, both UTF-8 strings */
function hmacSha256(key, msg) {
  const enc = new TextEncoder(); let k = enc.encode(key);
  if (k.length > 64) k = sha256raw(k);
  const pad = v => { const b = new Uint8Array(64); b.set(k); return b.map(x => x ^ v); };
  const cat = (a, b) => { const c = new Uint8Array(a.length + b.length); c.set(a); c.set(b, a.length); return c; };
  const inner = sha256raw(cat(pad(0x36), enc.encode(msg)));
  return [...sha256raw(cat(pad(0x5c), inner))].map(b => b.toString(16).padStart(2, '0')).join('');
}

