"""Game balance rules (2026-10-21):
- a skill is mastered at 8 of the last 10 right on the first try, after at least 8 tries, with right answers on 2 days;
  skills mastered under the older 5-try rule stay mastered (marked when the profile loads);
- mastering a skill gives 2 resources (was 5);
- an island with every skill mastered pays half the coins per answer;
- the weekly challenge target is the average of the last 3 weeks played."""
import datetime, json
from serve import *
c = Check('balance')
with sync_playwright() as p:
    b = launch(p)
    ctx, pg, errs = open_page(b, 1280, 900, pack='ca-4')
    k = pg.evaluate("skillsOf('mult')[0].k")
    # legacy: a profile saved with 5 right answers keeps its mastery after loading
    c.ok(pg.evaluate("normalizeProfile({sk:{'%s':'11111'}}).skQ['%s']===1" % (k, k)), 'old mastery is kept on load')
    pg.evaluate("G.sk={};G.skQ={};G.skD={}")
    for i in range(8): pg.evaluate("skAdd('mult',skillsOf('mult')[0].ts[0],true)")
    st = pg.evaluate("skStat('%s').st" % k)
    c.ok(st == 1, f'8 right answers on one day are not yet mastery (st={st})')
    res0 = pg.evaluate("resHave(resOf('mult'))")
    pg.clock.set_fixed_time(datetime.datetime(2030, 1, 2, 10))
    pg.evaluate("S={mode:'island'};skAdd('mult',skillsOf('mult')[0].ts[0],true)")
    c.ok(pg.evaluate("skStat('%s').st" % k) == 2, 'a right answer on a second day masters it')
    c.ok(pg.evaluate("resHave(resOf('mult'))") - res0 == 2, 'mastering gives 2 resources')
    c.ok(pg.evaluate("G.skQ['%s']" % k) == 1, 'qualified once, it only needs to stay at 80%')
    pg.evaluate("G.sk['%s']='0000011111';G.sk['%s']='1111111111'" % (k, k))
    # coins on a mastered island
    pg.evaluate("skillsOf('mult').forEach(s=>{G.sk[s.k]='1111111111';G.skQ[s.k]=1})")
    c.ok(pg.evaluate("islKnown('mult')") and not pg.evaluate("islKnown('div')"), 'a fully mastered island is known')
    pg.evaluate("S=null;show('map');start(byId('mult'))"); pg.wait_for_timeout(400)
    pg.evaluate("S.streak=0;S.coins=0;G.goalDone='';judge(true,null)"); pg.wait_for_timeout(200)
    got = pg.evaluate("S.coins")
    c.ok(got == 2, f'half coins per answer on a known island: +{got}')
    pg.evaluate("stopTimers();show('map');openIsland(byId('mult'))"); pg.wait_for_timeout(300)
    c.ok('half' in pg.text_content('.isrew'), 'the island card says coins are half')
    pg.evaluate("closeOverlay()")
    # weekly challenge: average of the last 3 weeks
    pg.evaluate("G.weeks={};const w=n=>{const d=new Date();d.setDate(d.getDate()-7*n);return weekKey(d)};G.weeks[w(1)]={c:300,th:0};G.weeks[w(2)]={c:100,th:0};G.weeks[w(3)]={c:200,th:0}")
    c.ok(pg.evaluate("weekTarget()") == 200, f'weekly target is the 3-week average: {pg.evaluate("weekTarget()")}')
    c.ok(not errs, f'page errors {errs[:3]}')
    ctx.close(); b.close()
c.done()
