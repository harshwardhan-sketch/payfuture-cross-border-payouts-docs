/* PayFuture Enterprise developer docs — renderer and router.
   Sections: #/about/… (the company), #/guide/… (the Enterprise guide: Collections and Payouts) and #/api/… (the Enterprise API reference).
   Page content lives in about.js, guide.js and pages.js; error-code data in data.js. Build-free: open index.html directly.
   Only Live features are shown. Unconfirmed values carry TO CONFIRM (see REVIEW.md). */

const TC = '<span class="tc">TO CONFIRM</span>';
const LIVE = '<span class="st live">Live</span>';

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
const COVERAGE = 'https://coverage.payfuture.net';

/* ---------- sections ---------- */
const SECTIONS = {
  about: {label: 'About PayFuture', sub: 'Company & solutions', tab: 'about'},
  guide: {label: 'Enterprise guide', sub: 'Learn, build, go live', tab: 'guide'},
  api: {label: 'API reference', sub: 'Enterprise API', tab: 'api'},
};
const PAGES = {about: {}, guide: {}, api: {}};
const NAV = {about: [], guide: [], api: []};
/* per-page hooks for the interactive pages: INIT[pageId] runs after the page is drawn */
const INIT = {};

/* ---------- router ---------- */
const app = document.getElementById('app');
function render() {
  const [, sec, id] = (location.hash || '#/').split('/');
  document.body.classList.remove('menu');
  document.querySelectorAll('#switch a').forEach(a => a.classList.toggle('on', SECTIONS[sec] && a.dataset.tab === SECTIONS[sec].tab));
  if (!SECTIONS[sec]) {
    app.innerHTML = home();
    document.title = 'PayFuture Enterprise Developer Docs'; window.scrollTo(0, 0); return;
  }
  const flat = NAV[sec].flatMap(([g, items]) => items.map(i => [...i, g]));
  const cur = flat.find(i => i[0] === id) || flat[0];
  const idx = flat.indexOf(cur), prev = flat[idx - 1], next = flat[idx + 1];
  const S = SECTIONS[sec];
  const pager = `<div class="pager">${prev ? `<a href="#/${sec}/${prev[0]}"><small>Previous</small>${prev[1]}</a>` : '<span></span>'}${next ? `<a href="#/${sec}/${next[0]}" style="text-align:right"><small>Next</small>${next[1]}</a>` : ''}</div>`;
  const main = `<div class="crumb">${S.label === cur[2] ? S.label : `${S.label} · ${cur[2]}`}</div>${PAGES[sec][cur[0]]()}${pager}`;
  const layout = app.querySelector('.layout');
  if (layout && layout.dataset.sec === sec) {
    layout.querySelector('main').innerHTML = main;
    layout.querySelectorAll('nav.side a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#/${sec}/${cur[0]}`));
  } else {
    app.innerHTML = `<div class="layout" data-sec="${sec}">
      <nav class="side"><div class="side-product">${S.label} <small>${S.sub}</small></div><input id="navFilter" placeholder="Filter pages…" aria-label="Filter pages">
        ${NAV[sec].map(([g, items]) => `<h4>${g}</h4>${items.map(([pid, t]) => `<a href="#/${sec}/${pid}" class="${pid === cur[0] ? 'on' : ''}">${t}</a>`).join('')}`).join('')}
      </nav><main>${main}</main></div>`;
  }
  document.title = `${cur[1]} · ${S.label} · PayFuture Enterprise Docs`;
  window.scrollTo(0, 0);
  if (INIT[cur[0]]) INIT[cur[0]]();
}
window.addEventListener('hashchange', render);

/* ---------- UI events ---------- */
document.addEventListener('click', e => {
  const c = e.target.closest('.copy');
  if (c) { navigator.clipboard?.writeText(c.parentElement.querySelector('code').innerText); c.textContent = 'Copied'; setTimeout(() => c.textContent = 'Copy', 1200); }
  const tb = e.target.closest('.tabs button');
  if (tb) {
    const id = tb.parentElement.dataset.tabs, i = tb.dataset.i;
    tb.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === tb));
    document.querySelectorAll(`[data-pane^="${id}-"]`).forEach(p => p.classList.toggle('on', p.dataset.pane === `${id}-${i}`));
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'navFilter') {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.side a').forEach(a => a.style.display = a.textContent.toLowerCase().includes(q) ? '' : 'none');
  }
  if (e.target.id === 'errSearch') {
    const q = e.target.value.toLowerCase(); let n = 0;
    document.querySelectorAll('#errTable tbody tr').forEach(tr => { const show = tr.textContent.toLowerCase().includes(q); tr.style.display = show ? '' : 'none'; n += show; });
    document.getElementById('errCount').textContent = `${n} codes`;
  }
});
document.getElementById('menuBtn').onclick = () => document.body.classList.toggle('menu');
document.getElementById('themeBtn').onclick = () => {
  const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark'; try { localStorage.setItem('pf-ent-theme', r.dataset.theme); } catch (_) {}
};
try { const t = localStorage.getItem('pf-ent-theme'); if (t) document.documentElement.dataset.theme = t; } catch (_) {}

/* ---------- tabs ---------- */
let tabSeq = 0;
function tabs(items) {
  const id = 't' + (++tabSeq);
  return `<div class="tabs" data-tabs="${id}">${items.map((t, i) => `<button class="${i ? '' : 'on'}" data-i="${i}">${t[0]}</button>`).join('')}</div>` +
    items.map((t, i) => `<div class="tabpane ${i ? '' : 'on'}" data-pane="${id}-${i}">${t[1]}</div>`).join('');
}


/* ---------- SHA-256 (pure JS, copied from the Legacy docs site: works offline and on file://) ---------- */
const sha256 = (() => {
  const primes = []; for (let n = 2; primes.length < 64; n++) { let p = true; for (let d = 2; d * d <= n; d++) if (n % d === 0) { p = false; break; } if (p) primes.push(n); }
  const frac = x => ((x - Math.floor(x)) * 4294967296) >>> 0;
  const K = primes.map(p => frac(Math.cbrt(p))), H0 = primes.slice(0, 8).map(p => frac(Math.sqrt(p)));
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  return str => {
    const bytes = new TextEncoder().encode(str), l = bytes.length;
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
    return H.map(x => x.toString(16).padStart(8, '0')).join('');
  };
})();
