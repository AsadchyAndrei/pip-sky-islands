"""Changing grade keeps progress safe: grade 4 stars are kept aside when a child moves to grade 3 and come back
when switching back; coins, purchases and the story stay the same. Uses draft packs (pip-dev-packs)."""
import json
from serve import *
c = Check('changing grade')
with sync_playwright() as p:
    b = launch(p)
    ctx, pg, errs = open_page(b, 800, 700)
    pg.evaluate("localStorage.setItem('pip-dev-packs','1')")
    before = pg.evaluate("({pack:PACK.id,stars:starTotal(),coins:G.coins,best:JSON.stringify(G.best),hats:G.hats.length,ch:G.story.ch})")
    c.ok(before['pack'] == 'ca-4' and before['stars'] > 0, f'starts on ca-4 with stars: {before}')
    others = [k for k in pg.evaluate("Object.keys(CONTENT.packs)") if k != 'ca-4']
    if others:
        other = others[0]; st, gr = pg.evaluate(f"[CONTENT.packs['{other}'].state,CONTENT.packs['{other}'].grade]")
        with pg.expect_navigation():
            pg.evaluate(f"setPack('{st}',{gr})")
        pg.wait_for_function("typeof selectKid==='function' && document.querySelector('#kids') && !document.querySelector('#kids').hidden", timeout=30000)
        pg.evaluate("selectKid('a')"); pg.wait_for_timeout(800)
        mid = pg.evaluate("({pack:PACK.id,gpack:G.pack,stars:starTotal(),coins:G.coins,kept:JSON.stringify((G.grades['ca-4']||{}).best),hats:G.hats.length,ch:G.story.ch})")
        c.ok(mid['pack'] == other and mid['gpack'] == other, f'switched to {other}: {mid["pack"]}/{mid["gpack"]}')
        c.ok(mid['stars'] == 0, f'{other} starts fresh: {mid["stars"]} stars')
        c.ok(mid['kept'] == before['best'], 'grade 4 stars kept aside')
        c.ok(mid['coins'] == before['coins'] and mid['hats'] == before['hats'] and mid['ch'] == before['ch'], 'coins, purchases and story unchanged')
        with pg.expect_navigation():
            pg.evaluate("setPack('CA',4)")
        pg.wait_for_function("typeof selectKid==='function' && document.querySelector('#kids') && !document.querySelector('#kids').hidden", timeout=30000)
        pg.evaluate("selectKid('a')"); pg.wait_for_timeout(800)
        after = pg.evaluate("({pack:PACK.id,stars:starTotal(),coins:G.coins,best:JSON.stringify(G.best)})")
        c.ok(after['pack'] == 'ca-4' and after['best'] == before['best'] and after['stars'] == before['stars'], f'back on ca-4 with the same stars: {after["stars"]} vs {before["stars"]}')
        c.ok(after['coins'] == before['coins'], 'coins unchanged after switching back')
    c.ok(not errs, f'page errors: {errs[:3]}')
c.done()
