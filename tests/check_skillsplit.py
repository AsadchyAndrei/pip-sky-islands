"""A skill split into smaller ones keeps the child's record: grade 4 history became six era skills, and a child who had
mastered "California history" keeps the mastery (and the island's 3rd star) on every new skill."""
from serve import *
c = Check('split skills keep progress')
with sync_playwright() as p:
    b = launch(p)
    ctx, pg, errs = open_page(b, 1280, 900, pack='ca-4')
    r = pg.evaluate("""()=>{G.sk={'social.history.california-history':'1111111111'};G.best.history=3;G.star3={};G.skMig=2;skillsOf.c={};
      const L=skillsOf('history');return {n:L.length,st:L.map(s=>skStat(s.k).st),star:starFor('history')}}""")
    c.ok(r['n'] == 6 and all(x == 2 for x in r['st']), f'all six era skills start mastered: {r}')
    c.ok(r['star'] == 3, 'the 3rd star stays')
    r = pg.evaluate("""()=>{const s=skillsOf('history')[0];skAdd('history',s.ts[0],false);return [G.sk[s.k],skStat(skillsOf('history')[1].k).st]}""")
    c.ok(r[0] == '1111111110' and r[1] == 2, f'a new answer continues the old record, the other skills keep theirs: {r}')
    r = pg.evaluate("""()=>{G.sk={};skillsOf.c={};return skillsOf('history').map(s=>[s.name,s.ts.length])}""")
    c.ok(all(n >= 20 for _, n in r), f'every era has 20 or more questions: {r}')
    c.ok(not errs, f'page errors {errs[:3]}')
    b.close()
c.done()
