"""Plays the interactive question kinds with mouse and taps, on a laptop and a phone width:
drag into groups, label a picture, put in order, choose all, Part A/B, tap the sentence, Yes/No,
a practice test from start to report, and a skill practice round."""
import json
from serve import *


def start(pg, isl, t, seed):
    pg.evaluate("([id,t,seed])=>{const q=makeQ(byId(id),t,seed,2);beginRound(byId(id),'island',[q,makeQ(byId(id),t,seed+1,2)])}", [isl, t, seed])
    pg.wait_for_timeout(400)


def drag(pg, src, dst):
    a, b = src.bounding_box(), dst.bounding_box()
    ax, ay, bx, by = a['x'] + a['width'] / 2, a['y'] + a['height'] / 2, b['x'] + b['width'] / 2, b['y'] + b['height'] / 2
    pg.mouse.move(ax, ay); pg.mouse.down()
    for i in range(1, 9):
        pg.mouse.move(ax + (bx - ax) * i / 8, ay + (by - ay) * i / 8)
    pg.mouse.up(); pg.wait_for_timeout(80)


def solved(pg):
    return pg.evaluate('[S.locked,S.tries]') == [True, 0]


c = Check('interactions')
with sync_playwright() as p:
    b = launch(p)
    for w in (1280, 390):
        ctx, pg, errs = open_page(b, w, 900)
        base = pg.evaluate('PASSAGES.length*3')
        # sort by dragging
        for name, isl, t in [('triangles', 'shape', 7), ('prime/composite', 'pattern', 9), ('plant labels', 'science', 75), ('energy', 'science', 74)]:
            start(pg, isl, t, 5); q = pg.evaluate('S.qs[S.i]')
            for it in q['items']:
                drag(pg, pg.locator(f'.schip[data-id="{it["id"]}"]'), pg.locator(f'.sbin[data-bin="{it["bin"]}"]'))
            pg.click('#check'); pg.wait_for_timeout(200)
            c.ok(solved(pg), f'{w}px sort {name}')
        # put in order by dragging
        for name, isl, t in [('fractions', 'frac', 14), ('decimals', 'dec', 7), ('numbers', 'place', 7)]:
            start(pg, isl, t, 7); q = pg.evaluate('S.qs[S.i]')
            for k, oid in enumerate(q['order']):
                src = pg.locator(f'.rcard[data-id="{oid}"]')
                if src.evaluate('e=>[...e.parentNode.children].indexOf(e)') != k:
                    tb, a = pg.locator('.rank .rcard').nth(k).bounding_box(), src.bounding_box()
                    pg.mouse.move(a['x'] + a['width'] / 2, a['y'] + a['height'] / 2); pg.mouse.down()
                    for i in range(1, 11):
                        pg.mouse.move(a['x'] + a['width'] / 2 + (tb['x'] + 5 - a['x'] - a['width'] / 2) * i / 10, a['y'] + a['height'] / 2 + (tb['y'] + tb['height'] / 2 - a['y'] - a['height'] / 2) * i / 10)
                    pg.mouse.up(); pg.wait_for_timeout(60)
            pg.click('#check'); pg.wait_for_timeout(200)
            c.ok(solved(pg), f'{w}px order {name}')
        # choose all
        for name, isl, t in [('factors', 'pattern', 8), ('equal to 1/2', 'frac', 12), ('acute angles', 'angle', 6)]:
            start(pg, isl, t, 9); q = pg.evaluate('S.qs[S.i]')
            for k in q['correct']:
                pg.locator(f'.tile[data-id="{k}"]').click()
            pg.click('#check'); pg.wait_for_timeout(200)
            c.ok(solved(pg), f'{w}px choose-all {name}')
        # long passage: every kind of question in the first passage
        for qi, kind in enumerate(pg.evaluate('LONGP[0].q.map(x=>x[0])')):
            start(pg, 'reading', base + qi, 3); q = pg.evaluate('S.qs[S.i]')
            if kind == 'ab':
                pg.evaluate("q=>{for(const k of ['a','b']){const P=q[k];[...document.querySelectorAll(`.abopt[data-part='${k}']`)].find(x=>x.dataset.v===P.answer).click()}}", q)
            elif kind == 'hl':
                pg.locator(f'.sent[data-s="{q["hl"][0]}"]').click()
            elif kind == 'two':
                for k in q['correct']:
                    pg.locator(f'.tile[data-id="{k}"]').click()
            else:
                pg.evaluate("a=>[...document.querySelectorAll('#choices .choice')].find(b=>b.dataset.v===a).click()", q['answer'])
            if pg.locator('#check').count() and pg.locator('#check').is_visible():
                pg.click('#check')
            pg.wait_for_timeout(200)
            c.ok(solved(pg), f'{w}px reading {kind}')
        # yes / no
        start(pg, 'frac', 15, 4); q = pg.evaluate('S.qs[S.i]')
        for i, r in enumerate(q['rows']):
            pg.locator(f'.ynb[data-r="{i}"][data-v="{1 if r["yes"] else 0}"]').click()
        pg.click('#check'); pg.wait_for_timeout(200)
        c.ok(solved(pg), f'{w}px yes/no')
        # a wrong sort goes back to the tray and gives a second try
        start(pg, 'pattern', 9, 5)
        pg.evaluate("()=>{const bin=document.querySelector('.sbin[data-bin=\"p\"] .sbin-in');document.querySelectorAll('.schip').forEach(c=>bin.appendChild(c))}")
        pg.evaluate("document.querySelector('#check').disabled=false"); pg.click('#check'); pg.wait_for_timeout(1100)
        c.ok(pg.evaluate('[S.tries,S.locked,document.querySelectorAll(".stray .schip").length>0]') == [1, False, True], f'{w}px wrong sort returns cards')
        # practice test: 12 questions, one try, a report
        pg.evaluate("closeOverlay&&closeOverlay();start(byId('ptest'))"); pg.wait_for_timeout(300)
        pg.click('[data-sec="math"]'); pg.wait_for_timeout(300)
        for i in range(12):
            pg.evaluate(f'judge({str(i % 2 == 0).lower()},null)'); pg.wait_for_timeout(60)
            pg.evaluate("document.querySelector('#next').click()"); pg.wait_for_timeout(200)
        pg.wait_for_timeout(500)
        c.ok(pg.evaluate('(G.tests||[]).length>0&&G.tests[0].n===12'), f'{w}px practice test saved a report')
        # practice one skill
        pg.evaluate("closeOverlay&&closeOverlay();startSkill(byId('frac'),skillsOf('frac')[6])"); pg.wait_for_timeout(300)
        c.ok(pg.evaluate("S.qs.every(q=>skillOf('frac',q.meta.t).i===6)"), f'{w}px skill round only has that skill')
        c.ok(not errs, f'{w}px page errors: {errs[:3]}')
        ctx.close()
c.done()
