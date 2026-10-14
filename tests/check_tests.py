"""Test Practice: every skill named in the grade 3 and 5 blueprints exists, and a math and an English test
can be built for every grade with every claim filled."""
from serve import *
c = Check('test practice')
with sync_playwright() as p:
    b = launch(p)
    for pk in ['ca-3', 'ca-4', 'ca-5']:
        ctx, pg, errs = open_page(b, 900, 800, pack=pk)
        r = pg.evaluate("""()=>{const B=TEST_BP[PACK.grade],bad=B?[...B.math.flatMap(x=>x[1]),...B.write,...B.lang].filter(k=>!bpQ(k,'x')):[];
          let ok=true,claims=new Set();for(let i=0;i<5;i++)for(const sec of ['math','ela']){const qs=testQs(sec);if(qs.length<10||qs.some(q=>!q||!q.claim))ok=false;qs.forEach(q=>claims.add(q.claim))}
          return {bad,ok,claims:claims.size}}""")
        c.ok(not r['bad'], f'{pk}: blueprint skills not found: {r["bad"]}')
        c.ok(r['ok'] and r['claims'] >= 8, f'{pk}: tests built with all claims: {r}')
        c.ok(not errs, f'{pk}: page errors {errs[:3]}')
        ctx.close()
c.done()
