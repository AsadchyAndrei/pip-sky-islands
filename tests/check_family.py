"""Parents: family goal shows on the map, teacher note and tasks show in Parents, tips and weekly report."""
from serve import *
c = Check('family goal and grown-ups extras')
with sync_playwright() as p:
    b = launch(p)
    for w in (1280, 390):
        ctx, pg, errs = open_page(b, w, 900)
        pg.evaluate("""for(let i=0;i<20;i++){G.days[addDays(-i)]={sec:600,q:20,c:15}};
          G.cls={cid:'C1',teacher:'Ms. Lee'};localStorage.setItem('pip-class-C1',JSON.stringify({name:'Room 12',teacher:'Ms. Lee',_at:Date.now(),
            tasks:[{id:'t1',isl:['frac'],due:addDays(-2),to:[],ts:1},{id:'note',kind:'note',text:'We are learning fractions.',ts:Date.now()}]}));
          CL.unlockUntil=Date.now()+600000;renderParent()""")
        pg.wait_for_timeout(500)
        t = pg.inner_text('#parentBody')
        c.ok('From Ms. Lee' in t and 'We are learning fractions.' in t and 'Overdue' in t, f'{w}: teacher note and overdue task in Parents')
        c.ok('overdue' in t, f'{w}: overdue reminder in the notes')
        c.ok(pg.evaluate("realTasks(classDoc()).length") == 1, f'{w}: the note is not a task')
        pg.select_option('#fgKind', 'min'); pg.select_option('#fgN', '60'); pg.fill('#fgRew', 'Park trip'); pg.click('#fgGo'); pg.wait_for_timeout(400)
        g = pg.evaluate("G.fgoal")
        c.ok(g and g['k'] == 'min' and g['n'] == 60 and g['reward'] == 'Park trip', f'{w}: goal saved {g}')
        c.ok('10 of 60 minutes' in pg.inner_text('#parentBody'), f'{w}: today counts toward the goal')
        pg.evaluate("window.print=()=>{}"); pg.click('#wkPrint'); pg.wait_for_timeout(200)
        c.ok(pg.locator('#printArea .rpt').count() == 1 and 'Last 8 weeks' in pg.inner_text('#printArea'), f'{w}: weekly report built')
        pg.evaluate("document.body.classList.remove('printing');show('map');renderMap()"); pg.wait_for_timeout(500)
        c.ok(pg.evaluate("!document.querySelector('#fgoalCard').hidden") and 'Park trip' in pg.inner_text('#fgoalCard'), f'{w}: goal on the map')
        pg.evaluate("G.days[dayKey()].sec=4000;weekCard()"); pg.wait_for_timeout(1200)
        c.ok('Family goal reached' in pg.inner_text('#fgoalCard') and pg.evaluate("!!G.fgoal.cele"), f'{w}: goal reached and celebrated once')
        pg.evaluate("G.fgoal.start=addDays(-10);G.fgoal.cele=0;G.days[addDays(-10)]={sec:0,q:0,c:0};delete G.fgoal.cele;Object.keys(G.days).forEach(k=>{if(k>=addDays(-10)&&k<=addDays(-4))G.days[k].sec=0});weekCard()")
        c.ok(pg.evaluate("document.querySelector('#fgoalCard').hidden"), f'{w}: an expired goal leaves the map')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()
c.done()
