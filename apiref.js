/* API reference engine: renders the pages imported from the live API docs (document.payfuture.net)
   in api-data.js (made by tools/refresh.sh). Same engine as the Gateway docs site.
   The data's flow key "ige" is internal only and never shown. */
const D = window.PF_DATA.flows;
const F = 'ige';
const strip = s => String(s || '').replace(/<[^>]+>/g, '');
const norm = s => strip(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
function pretty(raw) {
  try { return {text: JSON.stringify(JSON.parse(raw), null, 2), lang: 'json'}; }
  catch (_) { return {text: raw, lang: 'json'}; }
}
const page = (flow, p) => D[flow].pages[p];
const SKIP_OTHER = new Set(['introduction', 'endpoint', 'request-body', 'response-body']);
const otherOps = flow => page(flow, 'other').sections.filter(s => !SKIP_OTHER.has(s.id));

function endpointInfo(flow, p) {
  const sec = page(flow, p).sections.find(s => s.id === 'endpoint');
  const info = {};
  (sec ? sec.blocks : []).forEach(b => {
    const m = strip(b.html).match(/^\s*([^:]+):\s*(.*)$/);
    if (m) info[m[1].trim().toLowerCase()] = m[2].trim();
  });
  return info;
}
const prodUrl = flow => endpointInfo(flow, 'index')['production url'];
const sourceLink = (flow, path = '') => `<p class="src">Source: <a href="https://${D[flow].source}/${path}" target="_blank" rel="noopener">${D[flow].source}/${path}</a></p>`;

/* ---------- generic block rendering ---------- */
function mandatoryCell(v) {
  const t = strip(v).trim();
  if (/^yes$/i.test(t)) return '<span class="badge yes">Yes</span>';
  if (/^no$/i.test(t)) return '<span class="badge no">No</span>';
  if (/^conditional/i.test(t)) return `<span class="badge cond">Conditional</span><span class="cond-note">${v.replace(/^\s*Conditional\s*/i, '')}</span>`;
  return v || '—';
}
function renderTable(b) {
  const mi = b.head.findIndex(h => /mandatory|required/i.test(h));
  return `<table><thead><tr>${b.head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${
    b.rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 0 && !/<code>/.test(c) && b.head[0] === 'Parameter' ? `<code>${c}</code>` : i === mi ? mandatoryCell(c) : c}</td>`).join('')}</tr>`).join('')
  }</tbody></table>`;
}
const fixLinks = h => String(h)
  .replace(/href="(?:index\.shtml)?#request-signature"/g, 'href="#/api/signing/hmac"')
  .replace(/href="(payout|refund|balance|other|error-code)\.shtml[^"]*"/g, (m, p) => `href="#/api/${{payout: 'payout', refund: 'refund', balance: 'balance', other: 'op-get-status', 'error-code': 'errors'}[p]}"`);
function renderBlocks(flow, blocks) {
  return blocks.map(b => {
    switch (b.kind) {
      case 'h3': return `<h3>${b.html}</h3>`;
      case 'h4': case 'h5': return `<h4>${b.html}</h4>`;
      case 'p': return `<p>${fixLinks(b.html)}</p>`;
      case 'ul': return `<ul>${b.items.map(i => `<li>${fixLinks(i)}</li>`).join('')}</ul>`;
      case 'table': return renderTable(b);
      case 'pre': {
        const f = strip(b.html).trim();
        if (/^X-Callback-Signature:/i.test(f)) return `<div class="formula"><span>${esc(f)}</span><a href="#/api/signing/hmac">Try it →</a></div>`;
        if (/^SHA256\(/i.test(f)) {
          const idx = D[flow].recipes.findIndex(r => r.formula === f);
          return `<div class="formula"><span>${esc(f)}</span>${idx >= 0 ? `<a href="#/api/signing/${idx}">Try it →</a>` : ''}</div>`;
        }
        return code(strip(b.html), 'text');
      }
    }
    return '';
  }).join('');
}
function renderSection(flow, s, level = 'h2') {
  if (s.id === 'introduction') return `<p class="lead">${s.blocks.map(b => strip(b.html || '')).join(' ')}</p>`;
  if (s.id === 'endpoint') return renderEndpoint(flow, s);
  return `<section id="${s.id}"><${level}>${s.title}</${level}>${renderBlocks(flow, s.blocks)}</section>`;
}
function renderEndpoint(flow, s) {
  const info = {};
  s.blocks.forEach(b => { const m = strip(b.html).match(/^\s*([^:]+):\s*(.*)$/); if (m) info[m[1].trim().toLowerCase()] = m[2].trim(); });
  /* the live docs leave the production URL blank; use the known production endpoint (see REVIEW.md) */
  const url = info['production url'] || info['url'] || API_URL;
  const label = info['production url'] !== undefined ? 'Production' : 'Sandbox';
  return `<section id="endpoint"><h2>Endpoint</h2>
    ${ep(info['http method'] || 'POST', url ? esc(url) : `&lt;${label.toLowerCase()} URL&gt;`)}
    ${info['content-type'] ? table(['Header', 'Value'], [['<code>Content-Type</code>', `<code>${esc(info['content-type'])}</code>`],
      ...(info['header'] ? [[`<code>${esc(info['header'].split(':')[0].trim())}</code>`, `<code>${esc(info['header'].split(':').slice(1).join(':').trim())}</code>`]] : [])]) : ''}
    </section>`;
}
function examplesBox(list, heading = 'Examples') {
  if (!list || !list.length) return '';
  const id = 'ex' + (++tabSeq);
  return `<section id="examples"><h2>${heading}</h2><div class="ex" data-ex="${id}">
    ${list.length > 1 ? `<select aria-label="Choose example">${list.map((e, i) => `<option value="${i}">${esc(e.title)}</option>`).join('')}</select>` : `<b>${esc(list[0].title)}</b>`}
    ${list.map((e, i) => `<div class="expane" data-i="${i}" style="${i ? 'display:none' : ''}">
      ${e.notes ? `<div class="note">${esc(e.notes.replace(/^\(Notes:\s*|\)$/g, ''))}</div>` : ''}
      ${tabs([['Request', code(pretty(e.request).text)], ['Response — success', code(pretty(e.response).text)],
              ...(e.failResponse ? [['Response — fail', code(pretty(e.failResponse).text)]] : [])])}
    </div>`).join('')}
  </div></section>`;
}
function toc(secs, extra = []) {
  const items = secs.filter(s => s.title && s.id !== 'introduction').map(s => [s.id, s.id === 'endpoint' ? 'Endpoint' : s.title]).concat(extra);
  return `<nav class="toc">${items.map(([id, t]) => `<a href="#" data-jump="${id}">${t}</a>`).join('')}</nav>`;
}

/* ---------- API pages from source ---------- */
const API_PAGES = {payin: ['index', 'Payin', './'], payout: ['payout', 'Payout', 'payout.shtml'], refund: ['refund', 'Refund', 'refund.shtml'], balance: ['balance', 'Get Balance', 'balance.shtml']};
function apiPage(flow, key) {
  const [p, title, path] = API_PAGES[key];
  const d = page(flow, p);
  const intro = d.sections.filter(s => s.id === 'introduction'), rest = d.sections.filter(s => s.id !== 'introduction');
  return `<h1>${title}</h1>${intro.map(s => renderSection(flow, s)).join('')}
    ${toc(rest, d.examples && d.examples.length ? [['examples', 'Examples']] : [])}
    ${rest.map(s => renderSection(flow, s)).join('')}
    ${examplesBox(d.examples)}
    ${sourceLink(flow, path === './' ? '' : path)}`;
}
function opPage(flow, opId) {
  const d = page(flow, 'other');
  const s = d.sections.find(x => x.id === opId);
  const ex = (d.examples || []).filter(e => norm(e.title).startsWith(norm(s.title)));
  const common = d.sections.filter(x => SKIP_OTHER.has(x.id) && x.id !== 'introduction');
  return `<h1>${s.title}</h1>${sourceLink(flow, 'other.shtml')}
    ${renderBlocks(flow, s.blocks)}
    ${examplesBox(ex)}
    <h2>Common to all “Others” requests</h2>
    ${common.map(x => renderSection(flow, x, 'h3')).join('')}`;
}

/* ---------- error codes ---------- */
function errorsPage(flow, q = '') {
  const list = D[flow].errors;
  return `<h1>Error codes</h1>${sourceLink(flow, 'error-code.shtml')}
  <p class="lead">Errors are returned with HTTP 200 in the response <code>error[]</code> array as <code>{ errorCode, errorMessage }</code>. This is the full list from the live API docs.</p>
  <input class="errsearch" id="errSearch" type="search" placeholder="Search by code or message, e.g. 11031 or hash" aria-label="Search error codes" value="${esc(q)}">
  <p class="count" id="errCount">${list.length} codes</p>
  <table id="errTable"><thead><tr><th>Code</th><th>Message</th></tr></thead><tbody>${
    list.map(e => `<tr><td><code>${esc(e.ErrorCode)}</code></td><td>${esc(e.ErrorMessage || '')}</td></tr>`).join('')
  }</tbody></table>`;
}
function filterErrors() {
  const box = document.getElementById('errSearch'); if (!box) return;
  const words = box.value.toLowerCase().split(/\s+/).filter(Boolean); let n = 0;
  document.querySelectorAll('#errTable tbody tr').forEach(tr => {
    const t = tr.textContent.toLowerCase(), show = words.every(w => t.includes(w));
    tr.style.display = show ? '' : 'none'; n += show;
  });
  const total = document.querySelectorAll('#errTable tbody tr').length;
  document.getElementById('errCount').textContent = n === total ? `${total} codes` : n ? `${n} of ${total} codes` : 'No codes match. Try a code number or one word from the message.';
}

/* recipe "SHA256(a~b~midsecret~c)" -> {tokens, sep}; callback recipes are space-listed and joined without separator */
function parseRecipe(formula) {
  const inner = formula.replace(/^SHA256\(/i, '').replace(/\)\s*$/, '');
  return inner.includes('~') ? {tokens: inner.split('~').map(s => s.trim()), sep: '~'} : {tokens: inner.split(/\s+/), sep: ''};
}
const isSecret = t => /^(midsecret|rcode)$/i.test(t);
/* ---------- signing page with both calculators ---------- */
const P = {};
P.signing = f => {
  const R = D[f].recipes;
  const byPage = {};
  R.forEach((r, i) => (byPage[r.label.split(' · ')[0]] ||= []).push([r, i]));
  const sampleBody = '{"requestType":"GetBalance","data":{"midCode":"MID123"}}';
  return `<h1>Signing &amp; hash calculator</h1>
  <p class="lead">Every request must prove it comes from you. You can sign it in one of two ways. Both use the MID secret you get at onboarding, in lower case.</p>
  <div class="grid2">
    <a class="tile" href="#" data-jump="hmac"><span class="tag">One method for all requests</span><b>Option A · Signature header</b><span>Sign the whole request body with HMAC-SHA256 and send it in the <code>X-Callback-Signature</code> header. The same code works for every request type.</span></a>
    <a class="tile" href="#" data-jump="body-hash"><span class="tag">Per request type</span><b>Option B · Body hash</b><span>Join specific fields with <code>~</code>, add your secret and send the SHA-256 in the <code>hash</code> field. Each request type has its own field order.</span></a>
  </div>
  <div class="callout ok"><p><b><a href="#/playground">Hash playground</a>.</b> Build a hash piece by piece, sign a body with HMAC, and let the hash detective tell you why yours doesn't match.</p></div>
  <div class="callout"><p><b>Callbacks carry a body hash.</b> When PayFuture calls your <code>notificationUrl</code>, check its <a href="#" data-jump="callback-recipes">callback hash</a>, whichever option you use to sign your requests.</p></div>

  <section id="hmac"><h2>Option A · Signature header (HMAC)</h2>
  <div class="formula"><span>X-Callback-Signature: sha256=HEX( HMAC-SHA256( key = midsecret, message = raw request body bytes ) )</span></div>
  <ul>
  <li>Serialise the JSON body first, then sign <b>exactly the bytes you send</b> (UTF-8). Changing spaces or key order after signing breaks the signature.</li>
  <li>The MID secret is used in <b>lower case</b>. The hex digest can be lower or upper case. The <code>sha256=</code> prefix is recommended.</li>
  <li>When the header is valid, the <code>hash</code> field in the body is not needed and is ignored.</li>
  <li>When the header is sent but wrong, the request fails with <a href="#/api/errors/11031"><code>11031</code> hash does not match</a>, even if the body <code>hash</code> is right.</li>
  <li>When you don't send the header, the body hash (Option B) is checked as before.</li>
  </ul>
  <h3>Try it</h3>
  <div class="calc" id="hmacCalc">
    <label for="hmacBody">Request body, exactly as you send it</label>
    <textarea id="hmacBody" rows="4" spellcheck="false">${esc(sampleBody)}</textarea>
    <label for="hmacSecret">MID secret</label>
    <input id="hmacSecret" type="password" placeholder="paste a TEST secret only" autocomplete="off">
    <div class="out" id="hmacOut"></div>
  </div>
  ${tabs([
    ['Node.js', code(`const crypto = require('crypto');

const body = JSON.stringify(request);               // serialise once
const signature = crypto.createHmac('sha256', process.env.PF_MID_SECRET.toLowerCase())
  .update(body, 'utf8').digest('hex');

await fetch(url, { method: 'POST', body,             // send the same string
  headers: { 'Content-Type': 'application/json', 'api-version': '2.0',
             'X-Callback-Signature': \`sha256=\${signature}\` } });`, 'js')],
    ['Python', code(`import hmac, hashlib, json, os, requests

body = json.dumps(request, separators=(",", ":")).encode("utf-8")
sig = hmac.new(os.environ["PF_MID_SECRET"].lower().encode(), body, hashlib.sha256).hexdigest()
requests.post(url, data=body, headers={"Content-Type": "application/json", "api-version": "2.0",
                                       "X-Callback-Signature": f"sha256={sig}"})`, 'python')],
    ['PHP', code(`<?php
$body = json_encode($request);
$sig  = hash_hmac('sha256', $body, strtolower($secret));
// send $body unchanged with header  X-Callback-Signature: sha256=$sig`, 'php')],
    ['C#', code(`var body = JsonSerializer.Serialize(request);
var bodyBytes = Encoding.UTF8.GetBytes(body);
var signature = Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes(midsecret.ToLowerInvariant()), bodyBytes)).ToLowerInvariant();
var content = new ByteArrayContent(bodyBytes);
content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
content.Headers.Add("X-Callback-Signature", "sha256=" + signature);`, 'csharp')],
  ])}
  </section>

  <section id="body-hash"><h2>Option B · Body hash</h2>
  <ul>
  <li>Join the values with <code>~</code> in the documented order and take the SHA-256 hex digest.</li>
  <li><b>Callback hashes</b> join the values <b>without any separator</b>.</li>
  <li>Amounts are written with 2 decimals, e.g. <code>10.00</code> or <code>15.99</code>.</li>
  <li>The MID secret is used in <b>lower case</b>.</li>
  <li>The order differs per request type and payment method. Always use the recipe for your exact case.</li>
  </ul>
  <h3>Try it</h3>
  <p>Pick a recipe, fill in your values and compare the result with your code. Everything runs in your browser; nothing is sent.</p>
  <div class="calc">
    <label for="calcRecipe">Recipe</label>
    <select id="calcRecipe">${Object.entries(byPage).map(([g, rs]) => `<optgroup label="${esc(g)}">${rs.map(([r, i]) => `<option value="${i}">${esc(r.label.split(' · ').slice(1).join(' · ') || r.label)} — ${esc(r.formula)}</option>`).join('')}</optgroup>`).join('')}</select>
    <div class="grid" id="calcFields"></div>
    <label for="calcSecret">MID secret</label>
    <input id="calcSecret" type="password" placeholder="paste a TEST secret only" autocomplete="off">
    <div class="out" id="calcOut"></div>
  </div>
  <h3>Sample code</h3>
  ${tabs([
    ['Node.js', code(`const crypto = require('crypto');

// values in the documented order, secret last (lower case)
function pfHash(values, secret, sep = '~') {
  return crypto.createHash('sha256').update([...values, secret.toLowerCase()].join(sep), 'utf8').digest('hex');
}

pfHash(['MID123', 'ORD-0001', '100.00', 'PKR'], process.env.PF_MID_SECRET);       // request
pfHash([mid, txid, amount], process.env.PF_MID_SECRET, '');                      // callback`, 'js')],
    ['Python', code(`import hashlib, os

def pf_hash(values, secret, sep="~"):
    return hashlib.sha256(sep.join([*values, secret.lower()]).encode()).hexdigest()

pf_hash(["MID123", "ORD-0001", "100.00", "PKR"], os.environ["PF_MID_SECRET"])`, 'python')],
    ['PHP', code(`<?php
function pf_hash(array $values, string $secret, string $sep = '~'): string {
    $values[] = strtolower($secret);
    return hash('sha256', implode($sep, $values));
}`, 'php')],
    ['Java', code(`String input = String.join("~", "MID123", "ORD-0001", "100.00", "PKR", secret.toLowerCase());
byte[] d = MessageDigest.getInstance("SHA-256").digest(input.getBytes(StandardCharsets.UTF_8));
String hash = HexFormat.of().formatHex(d); // Java 17+`, 'java')],
  ])}
  </section>
  <h2>All body-hash recipes</h2>
  ${Object.entries(byPage).map(([g, rs]) => `<h3>${esc(g)}</h3>${rs.map(([r, i]) => `<h4>${esc(r.label.split(' · ').slice(1).join(' · '))}</h4><div class="formula"${/Callback/.test(r.label) ? ` data-cb` : ''}><span>${esc(r.formula)}</span><a href="#/api/signing/${i}">Try it →</a></div>`).join('')}`).join('')}`
    .replace('<div class="formula" data-cb>', '<div class="formula" id="callback-recipes">');
};

const SAMPLE = {midcode: 'MID123', merchantrefno: 'PO-000123', merchantref: 'PO-000123', merchant_ref_no: 'PO-000123', amount: '1500.00', currency: 'INR', country: 'IN',
  transactionid: 'INV78I1757502089824', transaction_id: 'INV78I1757502089824', txnstatus: 'APPROVED', transaction_type: 'payout', bank_name: 'Example Bank'};
function initCalc(flow, preset) {
  const sel = document.getElementById('calcRecipe'); if (!sel) return;
  const box = document.getElementById('calcFields'), sec = document.getElementById('calcSecret'), out = document.getElementById('calcOut');
  if (preset === 'hmac') document.getElementById('hmac')?.scrollIntoView({block: 'start'});
  else if (preset && D[flow].recipes[preset]) { sel.value = preset; sel.closest('.calc').scrollIntoView({block: 'center'}); }
  const hb = document.getElementById('hmacBody'), hs = document.getElementById('hmacSecret'), ho = document.getElementById('hmacOut');
  const hcalc = () => {
    const secret = hs.value.toLowerCase(), body = hb.value;
    let note = '';
    try { JSON.parse(body); } catch (_) { note = '<div class="warnline"><span>check:</span> this is not valid JSON</div>'; }
    ho.innerHTML = `<div><span>bytes signed:</span> ${new TextEncoder().encode(body).length}</div><div><span>header:</span> ${secret ? 'X-Callback-Signature: sha256=' + hmacSha256(secret, body) : 'enter a test secret'}</div>${note}`;
  };
  if (hb) { hb.oninput = hcalc; hs.oninput = hcalc; hcalc(); }
  const recipe = () => parseRecipe(D[flow].recipes[sel.value].formula);
  const draw = () => {
    box.innerHTML = recipe().tokens.filter(t => !isSecret(t)).map(t => `<div><label>${esc(t)}</label><input data-k="${esc(t)}" value="${esc(SAMPLE[t.toLowerCase()] || '')}"></div>`).join('');
    calc();
  };
  const calc = () => {
    const r = recipe(), inputs = [...box.querySelectorAll('input')]; let k = 0;
    const secret = sec.value.toLowerCase();
    const vals = r.tokens.map(t => isSecret(t) ? secret : (inputs[k++]?.value ?? ''));
    const shown = r.tokens.map((t, i) => isSecret(t) ? (secret ? '•'.repeat(Math.min(secret.length, 8)) : '<midsecret>') : vals[i]).join(r.sep);
    out.innerHTML = `<div><span>string to sign:</span> ${esc(shown)}</div><div><span>sha256:</span> ${secret ? sha256(vals.join(r.sep)) : 'enter a test secret'}</div>${r.sep ? '' : '<div><span>note:</span> callback hash — values joined without separator</div>'}`;
  };
  sel.onchange = draw; box.oninput = calc; sec.oninput = calc; draw();
}

