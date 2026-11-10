/* API reference pages in one layout (left: explanation; right: sticky code), for every operation:
   Payout, Payin, Refund, Get Balance and the utility calls (Get Status, quotes, verifications, Get Transaction List).
   - left: title, endpoint bar, a country + method picker (requests with several methods),
     one parameter card with Request / Response buttons; nested objects fold under their parent,
     paymMethodFields follows the picked method, hash shows the picked recipe;
   - right: Request panel (cURL, Node.js, Python, PHP, JSON) and Response panel (success / error), with line numbers.
   Hash recipes and callbacks are not repeated per operation: they have their own pages (Hash generation, Callbacks),
   placed before the requests in the menu because a request needs both.
   Content comes only from the live API docs (api-data.js). A picked method is kept in the URL (#/api/payout/<method>).
   Uses helpers from app.js and apiref.js (esc, hl, norm, strip, pretty, page, fixLinks, renderBlocks, steps). */
const API2 = (() => {
  const STOP = new Set(['for', 'and', 'seamless', 'hosted', 'the', 'object']);
  const toks = s => new Set(norm(s).split(' ').filter(w => w && !STOP.has(w)));
  const overlap = (a, b) => [...toks(a)].filter(w => toks(b).has(w)).length;
  const countryOf = t => (strip(t).match(/\(([^)]+)\)\s*$/) || [])[1] || '';
  const nameOf = t => strip(t).replace(/^\s*(for|seamless|hosted)\s+/i, '').replace(/\s*\([^)]*\)\s*$/, '').trim();
  const slug = s => norm(s).replace(/ /g, '-');
  const FLAG = {India: '🇮🇳', Pakistan: '🇵🇰', Egypt: '🇪🇬', Nigeria: '🇳🇬', Philippines: '🇵🇭', Morocco: '🇲🇦', Bangladesh: '🇧🇩'};
  const STATUS_TXT = {live: 'Live', soon: 'API ready · testing', doc: 'In the docs · ask your contact'};
  const json = raw => { try { return JSON.parse(raw); } catch (_) { return null; } };
  const dataOf = raw => { const r = json(raw) || {}; return r.data || r.Data || {}; };
  const sec = (d, id) => d.sections.find(s => s.id === id);
  const LABEL = {payout: 'Payout', payin: 'Payin', refund: 'Refund'};
  const pageKey = {payout: 'payout', payin: 'index', refund: 'refund'};

  /* ---------- reading the imported docs ---------- */
  const rowOf = (b, r) => {
    const H = b.head.map(h => h.toLowerCase()), at = re => H.findIndex(h => re.test(h));
    const [ti, li, mi, di] = [at(/type/), at(/length/), at(/mandatory|required/), at(/description/)];
    const m = strip(r[mi] || '').trim();
    return {name: strip(r[0]).trim(), type: strip(r[ti] || ''), len: strip(r[li] || ''), req: /^yes/i.test(m) ? 'yes' : /^conditional/i.test(m) ? 'cond' : 'no',
      cond: /^conditional/i.test(m) ? m.replace(/^conditional\s*/i, '') : '', desc: fixLinks(r[di] || '')};
  };
  function tablesIn(blocks) {
    const out = []; let title = '';
    (blocks || []).forEach(b => {
      if (b.kind === 'h3' || b.kind === 'h4') title = strip(b.html);
      if (b.kind === 'table') out.push({title, rows: b.rows.map(r => rowOf(b, r))});
    });
    return out;
  }
  const tablesOf = s => tablesIn(s ? s.blocks : []);
  function recipesIn(blocks) {
    const out = []; let h = '', group = '';
    (blocks || []).forEach(b => {
      if (b.kind === 'h3') { group = strip(b.html); h = ''; }
      if (b.kind === 'h4') h = strip(b.html);
      if (b.kind === 'pre' && /^SHA256/i.test(strip(b.html).trim())) out.push({group, title: h || group, formula: strip(b.html).trim()});
    });
    return out;
  }
  const recipesOf = d => recipesIn((sec(d, 'hash-generation') || {}).blocks);
  /* a utility section ("Others" page) split into its phases: intro, request, response, hash */
  function splitOp(s) {
    const ph = {intro: [], req: [], res: [], hash: []}; let p = 'intro';
    s.blocks.forEach(b => {
      const t = b.kind === 'h3' ? norm(b.html) : '';
      if (t === 'request body') { p = 'req'; return; }
      if (t === 'response body') { p = 'res'; return; }
      if (t === 'hash generation') { p = 'hash'; return; }
      ph[p].push(b);
    });
    return ph;
  }

  /* ---------- operation specs ---------- */
  function exampleOptions(d, examples) {
    const pm = tablesOf(sec(d, 'payment-methods'));
    const recipes = recipesOf(d).filter(r => /request/i.test(r.group));
    const best = (list, name, country) => list.filter(t => !countryOf(t.title) || countryOf(t.title) === country)
      .map(t => [overlap(t.title, name) + (countryOf(t.title) ? 0.5 : 0), t]).filter(([s]) => s >= 1).sort((a, b) => b[0] - a[0]).map(x => x[1])[0];
    return examples.map(e => {
      const country = countryOf(e.title), hosted = /^\s*hosted/i.test(e.title), name = nameOf(e.title), dd = dataOf(e.request);
      return {id: slug(e.title), title: strip(e.title), country, hosted, name, ex: e,
        fields: hosted ? null : best(pm, name, country) || null,
        recipe: hosted ? recipes.find(r => /hosted/i.test(r.title)) : best(recipes.filter(r => !/hosted/i.test(r.title)), name, country) || (recipes.length === 1 ? recipes[0] : null),
        method: dd.paymentMethod || dd.PaymentMethod || '', ccy: dd.currency || dd.Currency || '', cc: dd.country || dd.Country || ''};
    });
  }
  function specFromPage(flow, key) {
    const [p, title, path] = API_PAGES[key], d = page(flow, p);
    const req = tablesOf(sec(d, 'request-body')), res = tablesOf(sec(d, 'response-body'));
    const intro = sec(d, 'introduction'), ex = d.examples || [];
    return {key, title, d, source: path === './' ? '' : path,
      lead: intro ? strip(intro.blocks.map(b => b.html || '').join(' ')) : '',
      req: req[0], reqNested: req.slice(1).concat(tablesOf(sec(d, 'nested-objects'))),
      res: res[0], resNested: res.slice(1),
      opts: exampleOptions(d, ex), picker: ex.length > 1 && ex.some(e => countryOf(e.title)),
      notes: [], recipe: recipesOf(d).find(r => /request/i.test(r.group)) || null};
  }
  function specFromOp(flow, opId) {
    const d = page(flow, 'other'), s = sec(d, opId), ph = splitOp(s);
    const common = {req: tablesOf(sec(d, 'request-body')), res: tablesOf(sec(d, 'response-body'))};
    const ex = (d.examples || []).filter(e => norm(e.title).startsWith(norm(s.title)));
    const recipe = recipesIn(ph.hash).find(r => /request/i.test(r.group)) || recipesIn(ph.hash)[0] || null;
    const ps = ph.intro.filter(b => b.kind === 'p').map(b => strip(b.html)).filter(t => !/^Request, Response and Callback structure/i.test(t));
    const notes = [...ph.req, ...ph.res].filter(b => b.kind === 'p' || b.kind === 'ul').concat(ph.hash.filter(b => b.kind === 'ul'));
    return {key: 'op-' + opId, title: s.title, d, source: 'other.shtml', lead: ps.join(' ') || `The ${s.title} request.`,
      req: common.req[0], reqNested: tablesIn(ph.req).concat(common.req.slice(1)),
      res: common.res[0], resNested: tablesIn(ph.res).concat(common.res.slice(1)),
      opts: ex.map(e => ({id: slug(e.title), title: strip(e.title), ex: e, recipe})), picker: false, notes, recipe};
  }

  /* ---------- parameters ---------- */
  const EXTRA = {
    notificationUrl: ' <a class="prm-link" href="#/api/callbacks">What we send to this URL →</a>',
    hash: ' <span class="hashSlot"></span>',
    signature: ' <span class="hashSlot"></span>', /* Get Transaction List signs with a "signature" field */
  };
  const baseName = t => norm(t).replace(/^nested object /, '').replace(/ object( parameters| structure)?$/, '').replace(/ .*$/, '');
  function prm(r, kids = '', open = false, idp = '', extra = false) {
    const meta = [r.type, r.len && !/^(-|n\/a)$/i.test(r.len) ? r.len : ''].filter(Boolean);
    const star = r.req === 'yes' ? '<span class="prm-star" title="Required">*</span>' : '';
    const tag = r.req === 'yes' ? '<span class="prm-req yes">Required</span>' : r.req === 'cond' ? '<span class="prm-req cond">Conditional</span>' : '<span class="prm-req no">Optional</span>';
    return `<div class="prm"${idp ? ` id="${idp}${slug(r.name)}"` : ''}><div class="prm-h"><code class="prm-n">${esc(r.name)}</code>${star}${meta.map(m => `<span class="prm-t">${esc(m)}</span>`).join('')}${tag}</div>
      <div class="prm-d">${r.desc || ''}${extra && EXTRA[r.name] ? EXTRA[r.name] : ''}${r.cond ? `<span class="prm-cond">${esc(r.cond)}</span>` : ''}</div>${kids ? `<details class="prm-kids"${open ? ' open' : ''}><summary>Child parameters</summary>${kids}</details>` : ''}</div>`;
  }
  function prmList(rows, nested, opts = {}) {
    return rows.map(r => {
      if (opts.pmf && /^paymMethodFields$/i.test(r.name)) return prm(r, '<div class="pmfKids"></div>', true, opts.idp, opts.extra);
      /* every nested table for this parameter; several (e.g. txdata per transaction type) get their own sub-heading */
      const ts = nested.filter(n => baseName(n.title) === norm(r.name));
      const rest = nested.filter(n => !ts.includes(n));
      const kids = ts.length > 1 ? ts.map(t => `<p class="prm-sub">${esc(t.title.replace(/^Nested object\s*/i, ''))}</p>${prmList(t.rows, rest, opts)}`).join('') : ts.length ? prmList(ts[0].rows, rest, opts) : '';
      return prm(r, kids, !!ts.length && /^data$/i.test(r.name), opts.idp, opts.extra);
    }).join('');
  }
  const list = (main, nested, opts) => main ? `<div class="prm-list">${prmList(main.rows, nested, opts)}</div>` : '';

  /* ---------- code panels ---------- */
  /* one block per line (for the line numbers); copying the pane still gives one line per row */
  const lines = txt => hl(txt, 'json').split('\n').map(l => `<span class="ln">${l || ' '}</span>`).join('');
  const SNIP = {
    'cURL': body => `curl -X POST '${API_URL}' \\\n  -H 'Content-Type: application/json' \\\n  -H 'api-version: 2.0' \\\n  -d '${pretty(body).text.replace(/'/g, "'\\''")}'`,
    'Node.js': body => `const body = ${pretty(body).text};\n\nconst res = await fetch('${API_URL}', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json', 'api-version': '2.0' },\n  body: JSON.stringify(body),\n});\nconst result = await res.json(); // always HTTP 200: check result.success and result.error`,
    'Python': body => `import requests\n\nbody = ${pretty(body).text.replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False').replace(/\bnull\b/g, 'None')}\n\nres = requests.post(\n    "${API_URL}",\n    json=body,\n    headers={"api-version": "2.0"},\n)\nresult = res.json()  # always HTTP 200: check result["success"] and result["error"]`,
    'PHP': body => `<?php\n$body = '${pretty(body).text.replace(/'/g, "\\'")}';\n\n$ch = curl_init('${API_URL}');\ncurl_setopt_array($ch, [\n    CURLOPT_POST => true,\n    CURLOPT_POSTFIELDS => $body,\n    CURLOPT_RETURNTRANSFER => true,\n    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'api-version: 2.0'],\n]);\n$result = json_decode(curl_exec($ch), true); // always HTTP 200: check success and error`,
    'JSON': body => pretty(body).text,
  };
  let LANG = (() => { try { return localStorage.getItem('pf-lang') || 'cURL'; } catch (_) { return 'cURL'; } })();
  function panel(title, panes, kind) {
    const on = Math.max(0, panes.findIndex(([t]) => t === LANG));
    return `<div class="snip" data-snip="${kind}">
      <div class="snip-bar"><b>${title}</b>${panes.length > 1 ? `<div class="snip-tabs" role="tablist" aria-label="${title} format">${panes.map(([t], i) => `<button type="button" role="tab" class="${i === on ? 'on' : ''}" aria-selected="${i === on}" data-snip-tab="${i}">${t}</button>`).join('')}</div>` : `<span class="snip-one">${panes[0][0]}</span>`}<button type="button" class="snip-copy" data-snip-copy aria-label="Copy ${title.toLowerCase()}">Copy</button></div>
      ${panes.map(([, txt], i) => `<pre class="snip-pane${i === on ? ' on' : ''}" data-snip-pane="${i}"><code>${lines(txt)}</code></pre>`).join('')}
    </div>`;
  }
  function codeBox(o, all) {
    const e = o.ex;
    const head = all && all.length > 1 && !all.some(x => x.country)
      ? `<select class="snip-ex" aria-label="Choose example">${all.map(x => `<option value="${x.id}"${x === o ? ' selected' : ''}>${esc(x.title)}</option>`).join('')}</select>`
      : `<span>${esc(o.title)}</span>`;
    return `<div class="snip-head"><span class="snip-dots" aria-hidden="true"><i></i><i></i><i></i></span>${head}</div>
      ${panel('Request', Object.entries(SNIP).map(([t, f]) => [t, f(e.request)]), 'req')}
      ${panel('Response', [['Success', pretty(e.response).text], ...(e.failResponse ? [['Error', pretty(e.failResponse).text]] : [])], 'res')}
      ${e.notes ? `<div class="snip-note">${esc(e.notes.replace(/^\(Notes:\s*|\)$/g, ''))}</div>` : ''}
      <p class="snip-foot">Example from the live API docs. Use your own MID, values and hash.</p>`;
  }

  /* ---------- picker: what to send for the picked method ---------- */
  function sendCard(S, o) {
    const data = S.reqNested.find(t => baseName(t.title) === 'data');
    const applies = r => {
      const c = r.cond.toLowerCase(), cs = Object.keys(FLAG).filter(k => c.includes(k.toLowerCase()));
      if (cs.length) return cs.includes(o.country);
      if (/seamless|'s'|"s"/.test(c)) return !o.hosted;
      if (/hosted|pg_h/.test(c)) return o.hosted;
      return false;
    };
    const link = n => `<a href="#" data-jump="p-${slug(n)}"><code>${esc(n)}</code></a>`;
    const always = data ? data.rows.filter(r => r.req === 'yes').map(r => r.name) : [];
    const extra = data ? data.rows.filter(r => r.req === 'cond' && applies(r) && !/^(paymMethodFields|paymentMethod)$/i.test(r.name)).map(r => r.name) : [];
    const pmf = o.fields ? o.fields.rows : [];
    const status = S.statusFn(S.key, o.country);
    const rows = [
      o.cc || o.ccy ? ['Country · currency', [o.cc, o.ccy].filter(Boolean).map(v => `<code>${esc(v)}</code>`).join(' · ')] : null,
      ['integrationType', o.hosted ? '<code>"PG_H"</code> hosted: the customer pays on our page' : '<code>"S"</code> seamless: you send the details'],
      o.method ? ['paymentMethod', `<code>"${esc(o.method)}"</code>`] : null,
      ['Always send', always.map(link).join(' ')],
      extra.length ? ['Also send', extra.map(link).join(' ')] : null,
      pmf.length ? ['paymMethodFields', pmf.map(r => `<span class="pmf-i"><code>${esc(r.name)}</code>${r.req === 'yes' ? '' : '<small>optional</small>'}</span>`).join(' ')] : o.hosted ? ['paymMethodFields', 'Not needed'] : null,
    ].filter(Boolean);
    return `<div class="send-card"><div class="send-h"><b>${FLAG[o.country] || ''} ${esc(o.hosted ? 'Hosted' : 'Seamless')} · ${esc(o.name)}</b>${status ? `<span class="pk-st ${status}">${STATUS_TXT[status]}</span>` : ''}</div>
      <dl class="send-spec">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`;
  }
  function pmfKids(o) {
    if (!o.fields) return `<p class="prm-empty">${o.hosted ? 'Not needed for hosted checkout.' : 'No extra fields for this method.'}</p>`;
    return `<p class="prm-for">Fields for <b>${esc(o.name)}${o.country ? ` (${esc(o.country)})` : ''}</b>. Pick another method above to see its fields.</p>` + o.fields.rows.map(r => prm(r, '', false, 'p-')).join('');
  }
  const hashLink = S => `#/api/hashes/${/^op-|^balance$/.test(S.key) ? 'utilities' : S.key}`;
  const hashSlot = (S, o) => {
    const r = (o && o.recipe) || S.recipe;
    return r ? `<span class="hash-for">Recipe${S.picker ? ' for this method' : ''}: <code class="hash-f">${esc(r.formula)}</code> <a class="prm-link" href="${hashLink(S)}">All hash recipes →</a></span>` : `<a class="prm-link" href="${hashLink(S)}">How to build it →</a>`;
  };

  /* ---------- the operation page ---------- */
  const STATE = {};
  const defaultPick = (S, arg) => S.opts.find(o => o.id === arg) || S.opts.find(o => S.statusFn(S.key, o.country) === 'live') || S.opts.find(o => S.statusFn(S.key, o.country) === 'soon') || S.opts[0];
  function renderSpec(flow, S, arg, statusFn = () => '') {
    S.flow = flow; S.statusFn = statusFn; STATE[S.key] = S;
    const pick = defaultPick(S, arg);
    const countries = [...new Set(S.opts.map(o => o.country))];
    const toc = [['endpoint', 'Endpoint'], ...(S.picker ? [['pick', 'Country & method']] : []), ['params', 'Parameters'], ...(S.notes.length ? [['notes', 'Notes']] : [])];
    return `<div class="api2" data-api2="${S.key}">
      <div class="api2-left">
        <div class="api2-head">
          <h1>${esc(S.title)}</h1>${S.lead ? `<p class="lead">${esc(S.lead)}</p>` : ''}
          <nav class="toc" aria-label="On this page">${toc.map(([id, t]) => `<a href="#" data-jump="${id}">${t}</a>`).join('')}</nav>
          <div class="ep2" id="endpoint"><span class="method post">POST</span><code>${esc(API_URL)}</code><button type="button" class="ep2-copy" data-copy-text="${esc(API_URL)}" aria-label="Copy endpoint">Copy</button></div>
          <div class="ep2-h"><span>Headers</span> <code>Content-Type: application/json</code> <code>api-version: 2.0</code> <span>· signed with a body <a href="${hashLink(S)}">hash</a> or the <a href="#/api/signing/hmac">signature header</a></span></div>
          ${S.picker ? `<section id="pick"><h2>Country and method</h2>
            <p class="pick-help">Each method needs different fields. Pick one to see what to send and its example.</p>
            <div class="pk-c" role="group" aria-label="Country">${countries.map(c => { const s = statusFn(S.key, c); return `<button type="button" class="chip" data-pk-c="${esc(c)}">${FLAG[c] || ''} ${esc(c || 'All')}${s ? `<span class="pk-dot ${s}" title="${STATUS_TXT[s]}"></span>` : ''}</button>`; }).join('')}</div>
            <div class="pk-m" role="group" aria-label="Method"></div>
            <div class="sendCard"></div>
          </section>` : ''}
        </div>
        <aside class="api2-code" aria-label="Code examples"><div class="api2-sticky codeBox">${pick ? codeBox(pick, S.opts) : '<p class="snip-foot">No example in the live API docs for this request.</p>'}</div></aside>
        <div class="api2-body">
          <section class="pcard" id="params">
            <div class="pcard-top"><h2>Parameters</h2><div class="ptabs" role="tablist"><button type="button" role="tab" class="on" aria-selected="true" data-ptab="req">Request</button><button type="button" role="tab" aria-selected="false" data-ptab="res">Response</button></div></div>
            <div class="ppane on" data-ppane="req"><p class="pnote">A JSON body with <code>requestType</code> and a <code>data</code> object. Fields marked <span class="prm-star">*</span> are required.</p>${list(S.req, S.reqNested, {pmf: S.picker, idp: 'p-', extra: true})}</div>
            <div class="ppane" data-ppane="res"><p class="pnote">Every response is HTTP 200: check <code>success</code> and <code>error[]</code>.${S.picker ? ' The final result arrives in the <a href="#/api/callbacks">callback</a>.' : ''}</p>${list(S.res, S.resNested, {idp: 'r-'})}</div>
          </section>
          ${S.notes.length ? `<section id="notes" class="op-notes"><h2>Notes</h2>${renderBlocks(flow, S.notes)}</section>` : ''}
          ${sourceLink(flow, S.source)}
        </div>
      </div>
    </div>`;
  }
  function select(key, id, push = true) {
    const S = STATE[key]; if (!S) return;
    const o = S.opts.find(x => x.id === id) || S.opts[0];
    const root = document.querySelector(`[data-api2="${key}"]`); if (!root) return;
    const q = c => root.querySelector(c);
    if (o) {
      root.querySelectorAll('[data-pk-c]').forEach(b => b.classList.toggle('on', b.dataset.pkC === o.country));
      if (q('.pk-m')) q('.pk-m').innerHTML = S.opts.filter(x => x.country === o.country).map(x => `<button type="button" class="chip${x === o ? ' on' : ''}" data-pk-m="${x.id}">${esc(x.hosted ? 'Hosted' : 'Seamless')} · ${esc(x.name)}</button>`).join('');
      if (q('.sendCard')) q('.sendCard').innerHTML = sendCard(S, o);
      if (q('.pmfKids')) q('.pmfKids').innerHTML = pmfKids(o);
      if (q('.codeBox')) q('.codeBox').innerHTML = codeBox(o, S.opts);
    }
    root.querySelectorAll('.hashSlot').forEach(h => h.innerHTML = hashSlot(S, o));
    if (push && o && S.opts.length > 1) history.replaceState(null, '', `#/api/${key}/${o.id}`);
  }
  const init = (key, arg) => { const S = STATE[key]; if (S) select(key, (defaultPick(S, arg) || {}).id, false); };
  const render = (flow, key, arg, statusFn) => renderSpec(flow, specFromPage(flow, key), arg, statusFn);
  const renderOp = (flow, opId, arg) => renderSpec(flow, specFromOp(flow, opId), arg);

  /* ---------- side code for the reference pages ---------- */
  const HASH_CODE = {
    'Node.js': `const crypto = require('crypto');

// Join the values in the recipe's order with "~" and hash them.
// Put your MID secret (lower case) where the recipe says midsecret.
function pfHash(values, sep = '~') {
  return crypto.createHash('sha256').update(values.join(sep), 'utf8').digest('hex');
}

// Payout · Seamless Net Banking (India)
// SHA256(midcode~amount~currency~bank_name~midsecret)
const hash = pfHash([
  data.midCode, data.amount, data.currency,
  data.paymMethodFields.bank_name,
  process.env.PF_MID_SECRET.toLowerCase(),
]);

// Callback hashes use no separator: pfHash([...], '')`,
    'Python': `import hashlib, os

# Join the values in the recipe's order with "~" and hash them.
# Put your MID secret (lower case) where the recipe says midsecret.
def pf_hash(values, sep="~"):
    return hashlib.sha256(sep.join(str(v) for v in values).encode("utf-8")).hexdigest()

# Payout · Seamless Net Banking (India)
# SHA256(midcode~amount~currency~bank_name~midsecret)
hash_ = pf_hash([
    data["midCode"], data["amount"], data["currency"],
    data["paymMethodFields"]["bank_name"],
    os.environ["PF_MID_SECRET"].lower(),
])

# Callback hashes use no separator: pf_hash([...], sep="")`,
    'PHP': `<?php
// Join the values in the recipe's order with "~" and hash them.
// Put your MID secret (lower case) where the recipe says midsecret.
function pf_hash(array $values, string $sep = '~'): string {
    return hash('sha256', implode($sep, $values));
}

// Payout · Seamless Net Banking (India)
// SHA256(midcode~amount~currency~bank_name~midsecret)
$hash = pf_hash([
    $data['midCode'], $data['amount'], $data['currency'],
    $data['paymMethodFields']['bank_name'],
    strtolower(getenv('PF_MID_SECRET')),
]);

// Callback hashes use no separator: pf_hash([...], '')`,
  };
  const sideCode = (title, panes, note) => `<aside class="api2-code" aria-label="Code example"><div class="api2-sticky">
    <div class="snip-head"><span class="snip-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${esc(title)}</span></div>
    ${panel('Code', panes, 'side')}${note ? `<p class="snip-foot">${note}</p>` : ''}</div></aside>`;
  const twoCol = (head, body, aside) => `<div class="api2"><div class="api2-left"><div class="api2-head">${head}</div>${aside}<div class="api2-body">${body}</div></div></div>`;

  /* ---------- Hash generation page ---------- */
  function hashesPage(flow) {
    const keys = ['payout', 'payin', 'refund'];
    const row = (title, f) => { const idx = D[flow].recipes.findIndex(x => x.formula === f);
      return `<div class="hrow"><span class="hrow-t">${esc(title)}</span><div class="formula"><span>${esc(f)}</span>${idx >= 0 ? `<a href="#/api/signing/${idx}">Try it →</a>` : ''}</div></div>`; };
    const block = key => {
      const d = page(flow, pageKey[key]), hs = (sec(d, 'hash-generation') || {blocks: []}).blocks, rs = recipesOf(d), groups = [...new Set(rs.map(r => r.group))];
      /* the "not required with the signature header" note is said once at the top of the page, not per request */
      const paras = hs.filter(b => b.kind === 'p' && !/^Not required when the request is signed/i.test(strip(b.html))).map(b => `<p>${fixLinks(b.html)}</p>`).join('');
      const ul = hs.filter(b => b.kind === 'ul').map(b => `<ul>${b.items.map(i => `<li>${fixLinks(i)}</li>`).join('')}</ul>`).join('');
      return `<section id="h-${key}" class="hsec"><h2>${LABEL[key]}</h2>${paras}${groups.map(g => `<h3>${esc(g)}</h3>${rs.filter(r => r.group === g).map(r => row(r.title === g ? 'All requests' : r.title, r.formula)).join('')}`).join('')}${ul}</section>`;
    };
    const u = D[flow].recipes.filter(r => r.page === 'balance' || r.page === 'other');
    const ops = [...new Set(u.map(r => r.label.split(' · ')[0]))];
    const util = u.length ? `<section id="h-utilities" class="hsec"><h2>Utilities</h2>${ops.map(op => `<h3>${esc(op)}</h3>${u.filter(r => r.label.startsWith(op + ' · ')).map(r => row(r.label.split(' · ').slice(1).join(' · '), r.formula)).join('')}`).join('')}</section>` : '';
    const rs = sec(page(flow, 'index'), 'request-signature');
    const sig = rs ? `<section id="request-signature" class="hsec"><h2>Request Signature (signature header)</h2><p>Instead of the body <code>hash</code>, you can sign the whole request body and send the signature in a header. See also <a href="#/api/signing/hmac">Signing &amp; hash calculator</a>.</p>${renderBlocks(flow, rs.blocks)}</section>` : '';
    const head = `<h1>Hash generation</h1>
      <p class="lead">Every request carries a SHA-256 <code>hash</code> built from its fields and your MID secret, and every response and callback carries one you should check. Build it before you send the request.</p>
      <nav class="toc" aria-label="On this page">${keys.map(k => `<a href="#" data-jump="h-${k}">${LABEL[k]}</a>`).join('')}<a href="#" data-jump="h-utilities">Utilities</a><a href="#" data-jump="request-signature">Signature header</a></nav>
      ${steps([
        ['Take the fields in the recipe\'s order', 'Use the values exactly as you send them: same amount format, same case.'],
        ['Join them with ~', 'Callback hashes join the values with no separator.'],
        ['Add your MID secret in lower case', 'Where the recipe says <code>midsecret</code>.'],
        ['SHA-256, hex', 'Send the 64-character hex digest in <code>hash</code>. Or sign the whole body with the <a href="#/api/signing/hmac">signature header</a> instead.'],
      ])}
      <p class="pick-help">Request hashes are not required when the request is signed with the <code>X-Callback-Signature</code> header; see <a href="#" data-jump="request-signature">Request Signature</a>. Check a value with the <a href="#/api/signing">hash calculator</a>, or find out why one doesn't match in the <a href="#/playground">Hash playground</a>.</p>`;
    return twoCol(head, keys.map(block).join('') + util + sig, sideCode('Build a request hash', Object.entries(HASH_CODE), 'Build hashes on your server: never put the MID secret in an app or browser.'));
  }

  /* ---------- Callbacks page ---------- */
  function callbacksPage(flow) {
    const keys = ['payout', 'payin', 'refund'];
    const cbs = keys.map(key => { const d = page(flow, pageKey[key]), s = sec(d, 'callback-body'); return s ? {key, s, t: tablesOf(s)[0], cb: recipesOf(d).find(r => /callback/i.test(r.group))} : null; }).filter(Boolean);
    const block = ({key, s, t, cb}) => {
      const ul = s.blocks.filter(b => b.kind === 'ul').map(b => `<ul>${b.items.map(i => `<li>${fixLinks(i)}</li>`).join('')}</ul>`).join('');
      return `<section id="cb-${key}" class="hsec"><h2>${LABEL[key]} callback</h2>
        <section class="pcard"><div class="pcard-top"><h3>Callback parameters</h3><span class="pcard-sub">form-encoded POST to your <code>notificationUrl</code></span></div>${t ? `<div class="prm-list">${prmList(t.rows, tablesOf(s).slice(1), {})}</div>` : ''}</section>
        ${cb ? `<h3>Callback hash</h3><div class="formula"><span>${esc(cb.formula)}</span></div>` : ''}
        ${ul ? `<h3>Instructions</h3>${ul}` : ''}</section>`;
    };
    /* the callback body as your server receives it: field names from the live docs, values left as placeholders */
    const body = ({t}) => t ? t.rows.map(r => `${r.name}=<${r.name}>`).join('&\n') : '';
    const head = `<h1>Callbacks</h1>
      <p class="lead">When a transaction reaches a final status, we send its result to the <code>merchantUrl.notificationUrl</code> you gave in the request. Set up this URL before you send your first request.</p>
      <nav class="toc" aria-label="On this page">${cbs.map(c => `<a href="#" data-jump="cb-${c.key}">${LABEL[c.key]}</a>`).join('')}<a href="#/api/op-get-status">Get Status</a></nav>
      ${steps([
        ['Give us a public HTTPS URL', 'Send it in <code>merchantUrl.notificationUrl</code> on every request.'],
        ['Check the callback hash', 'Rebuild it from the callback fields and your MID secret, and compare. Ignore the callback if it does not match.'],
        ['Reply HTTP 200', 'Then update your order. The callback is the final result; use Get Status if one is late.'],
      ])}`;
    return twoCol(head, cbs.map(block).join(''), sideCode('What your server receives', cbs.map(c => [LABEL[c.key], `POST /your/notification/url\nContent-Type: application/x-www-form-urlencoded\n\n${body(c)}`]), 'Field names from the live API docs; values are placeholders.'));
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const tb = e.target.closest('[data-ptab]');
    if (tb) { const card = tb.closest('.pcard'); card.querySelectorAll('[data-ptab]').forEach(b => { b.classList.toggle('on', b === tb); b.setAttribute('aria-selected', b === tb); });
      card.querySelectorAll('[data-ppane]').forEach(p => p.classList.toggle('on', p.dataset.ppane === tb.dataset.ptab)); return; }
    const st = e.target.closest('[data-snip-tab]');
    if (st) {
      const snip = st.closest('[data-snip]'), i = st.dataset.snipTab;
      snip.querySelectorAll('[data-snip-tab]').forEach(b => { const on = b.dataset.snipTab === i; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      snip.querySelectorAll('[data-snip-pane]').forEach(p => p.classList.toggle('on', p.dataset.snipPane === i));
      if (snip.dataset.snip === 'req' && SNIP[st.textContent]) { LANG = st.textContent; try { localStorage.setItem('pf-lang', LANG); } catch (_) { /* ignore */ } }
      return;
    }
    const cp = e.target.closest('[data-snip-copy]');
    if (cp) { const pane = cp.closest('[data-snip]').querySelector('.snip-pane.on code'); navigator.clipboard?.writeText(pane.innerText.replace(/\u00a0/g, ' ')).catch(() => {}); cp.textContent = 'Copied ✓'; setTimeout(() => cp.textContent = 'Copy', 1300); return; }
    const ct = e.target.closest('[data-copy-text]');
    if (ct) { navigator.clipboard?.writeText(ct.dataset.copyText).catch(() => {}); ct.textContent = 'Copied ✓'; setTimeout(() => ct.textContent = 'Copy', 1300); return; }
    const root = e.target.closest('[data-api2]'); if (!root || !STATE[root.dataset.api2]) return;
    const key = root.dataset.api2, S = STATE[key];
    const c = e.target.closest('[data-pk-c]');
    if (c) { select(key, S.opts.find(x => x.country === c.dataset.pkC).id); return; }
    const m = e.target.closest('[data-pk-m]'); if (m) select(key, m.dataset.pkM);
  });
  document.addEventListener('change', e => {
    const s = e.target.closest('.snip-ex'); if (!s) return;
    const root = s.closest('[data-api2]'); if (root) select(root.dataset.api2, s.value);
  });
  /* for other pages (home, corridors): the same terminal panels */
  const requestPanel = (body, title = 'Request') => panel(title, Object.entries(SNIP).map(([t, f]) => [t, f(body)]), 'req');
  const jsonPanel = (title, panes) => panel(title, panes, 'side');
  return {render, renderOp, init, options: d => exampleOptions(d, d.examples || []), hashesPage, callbacksPage, requestPanel, jsonPanel};
})();
