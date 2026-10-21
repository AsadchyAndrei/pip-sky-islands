"""Homeschool: homeschool.html shows a 36-week plan for every ready grade that lists every skill once; the learning
record in Parents' Corner prints days, hours, a month table and the skills mastered in the period (G.mastLog)."""
from serve import *
c = Check('homeschool')
with sync_playwright() as p:
    b = launch(p)
    for w in (390, 1280):
        ctx = b.new_context(viewport={'width': w, 'height': 900}, service_workers='block'); ctx.route('**/*', router)
        pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(ORIGIN + 'homeschool.html?pack=ca-3#plan'); pg.wait_for_timeout(700)
        c.ok(pg.evaluate("document.querySelector('.gpick [aria-pressed=true]').dataset.p") == 'ca-3', f'{w}: the plan opens on the grade from the link')
        for pk in ('ca-3', 'ca-4', 'ca-5'):
            pg.click(f'.gpick [data-p="{pk}"]'); pg.wait_for_timeout(150)
            r = pg.evaluate("""pk=>{const rows=document.querySelectorAll('#planTable tbody tr').length;const txt=document.querySelector('#planTable').textContent;
              const P=CONTENT.packs[pk],miss=[];P.islands.forEach(I=>(I.skills||[]).forEach(k=>{const S=CONTENT.skills[k];if(S&&!S.retired&&!txt.includes(S.name))miss.push(S.name)}));return [rows,miss]}""", pk)
            c.ok(r[0] == 36 and not r[1], f'{w}: {pk}: 36 weeks, every skill in the plan (missing {r[1][:3]})')
        c.ok(pg.evaluate("document.documentElement.scrollWidth<=innerWidth"), f'{w}: no sideways page scroll')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()
    ctx, pg, errs = open_page(b, 1280, 900, pack='ca-4')
    pg.evaluate("G.days={'2026-09-02':{sec:1200,q:30,c:24},'2026-09-03':{sec:900,q:20,c:15},'2026-10-01':{sec:600,q:12,c:12}};G.mastLog=[{d:'2026-09-03',k:'math.place.value-of-a-digit'}];save(true)")
    r = pg.evaluate("recData('2026-09-01','2026-10-31')")
    c.ok(len(r['days']) == 3 and r['sum'][0] == 2700 and len(r['mast']) == 1, f'record data: {len(r["days"])} days, {r["sum"][0]} s, {len(r["mast"])} skill')
    pg.evaluate("window.print=()=>{};printRecord('2026-09-01','2026-10-31')"); pg.wait_for_timeout(200)
    t = pg.text_content('#printArea')
    c.ok('Learning record' in t and 'September 2026' in t and 'October 2026' in t and 'days of learning' in t and 'signature' in t, 'the printed record has the month table and a signature line')
    c.ok(pg.evaluate("CONTENT.skills['math.place.value-of-a-digit'].name") in t, 'the mastered skill is listed with its standard')
    pg.evaluate("CL.unlockUntil=Date.now()+600000;openParent()"); pg.wait_for_timeout(500)
    c.ok(pg.locator('#recCard').count() == 1 and pg.locator('#recCard a[href*="homeschool.html?pack=ca-4"]').count() == 1, "Parents' Corner has the learning record and a link to the year plan")
    pg.select_option('#recKind', 'custom'); c.ok(pg.is_visible('#recFrom'), 'custom dates appear')
    before = pg.evaluate("(G.mastLog||[]).length")
    pg.evaluate("ovOpen&&closeOverlay();start(byId('place'));const s=skillsOf('place')[0];G.sk=Object.assign({},G.sk||{});G.sk[s.k]='0000000000';G.skD=Object.assign({},G.skD,{[s.k]:['2000-01-01']});for(let i=0;i<10;i++)skAdd('place',s.ts[0],true)"); pg.wait_for_timeout(300)
    c.ok(pg.evaluate("(G.mastLog||[]).length") == before + 1, 'a new mastery is written to the log with its date')
    c.ok(not errs, f'page errors {errs[:3]}')
    b.close()
c.done()
