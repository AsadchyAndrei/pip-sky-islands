"""Question banks and passages are clean: no repeated questions, no answer among the wrong choices,
three different wrong choices, and no passage title used in two grades."""
from serve import *
c = Check('question banks')
JS = r"""() => {
  const out = {dup: [], bad: [], titles: []};
  const strip = s => String(s).replace(/<[^>]+>/g, '').trim();
  const check = (where, q, a, w) => {
    if (!Array.isArray(w)) return;
    const ws = w.map(strip);
    if (ws.includes(strip(a))) out.bad.push(where + ': answer is also a wrong choice: ' + strip(q).slice(0, 60));
    if (new Set(ws).size !== ws.length) out.bad.push(where + ': repeated wrong choice: ' + strip(q).slice(0, 60));
    if (ws.length < 2) out.bad.push(where + ': fewer than 2 wrong choices: ' + strip(q).slice(0, 60));
  };
  const seen = {};
  for (const k of Object.keys(BANK3)) {
    const g = k.slice(-1);
    BANK3[k].forEach(it => {
      check(k, it[1], it[2], it[3]);
      const key = g + '|' + strip(it[1]) + '|' + strip(it[2]);
      if (seen[key]) out.dup.push(k + ' repeats ' + seen[key] + ': ' + strip(it[1]).slice(0, 60)); else seen[key] = k;
    });
  }
  const grades = {3: ['PASS3', 'LONG3', 'LISTEN3'], 5: ['PASS5', 'LONG5', 'LISTEN5']};
  const titleAt = {};
  for (const [g, names] of Object.entries(grades)) for (const n of names) {
    const A = window[n] || eval('typeof ' + n + '!=="undefined"?' + n + ':null');
    if (!A) { out.bad.push('missing ' + n); continue; }
    A.forEach(P => {
      const t = strip(P.t);
      if (titleAt[t] && titleAt[t] !== g) out.titles.push(P.t + ' is in grades ' + titleAt[t] + ' and ' + g);
      titleAt[t] = g;
      (P.q || []).forEach(q => {
        if (!Array.isArray(q)) return;
        if (['mc', 'ab'].includes(q[0])) check(n, q[1], q[2], q[3]);
        else if (typeof q[0] === 'string' && q.length >= 5 && !['two', 'hl'].includes(q[0])) check(n, q[0], q[1], q[2]);
      });
    });
  }
  return out;
}"""
with sync_playwright() as p:
    b = launch(p)
    ctx = b.new_context(service_workers='block'); ctx.route('**/*', router)
    pg = ctx.new_page(); pg.goto(ORIGIN); pg.wait_for_timeout(2500)
    r = pg.evaluate(JS)
    c.ok(not r['dup'], f"repeated questions: {r['dup'][:5]}")
    c.ok(not r['bad'], f"bad choices: {r['bad'][:5]}")
    c.ok(not r['titles'], f"passage titles shared across grades: {r['titles'][:5]}")
    ctx.close()
c.done()
