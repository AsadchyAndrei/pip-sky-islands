"""Missions: on Digit Cliffs each answer adds a plank to a bridge, on Bookworm Bay each answer lights a lantern.
First try = golden, second try = wooden/warm, a miss = rope/candle; the mission always finishes; other islands
and other modes have no mission."""
from serve import *
c = Check('missions')

def play(pg, miss=(), second=()):
    for k in range(20):
        if pg.evaluate("curScreen") != 'play': break
        if pg.evaluate("ovOpen"): pg.evaluate("closeOverlay()"); pg.wait_for_timeout(150)
        i = pg.evaluate("S.i")
        if pg.evaluate("!S.locked"):
            if i in miss: pg.evaluate("judge(false,null);judge(false,null)")
            elif i in second: pg.evaluate("judge(false,null);judge(true,null)")
            else: pg.evaluate("judge(true,null)")
        pg.wait_for_timeout(120)
        if pg.evaluate("S.i===S.qs.length-1"): pg.wait_for_timeout(1500); return
        if pg.is_visible('#next'): pg.click('#next')
        pg.wait_for_timeout(200)

with sync_playwright() as p:
    b = launch(p)
    for w in (390, 1280):
        ctx, pg, errs = open_page(b, w, 900, pack='ca-4')
        pg.evaluate("G.rounds=5;window.__tourTest=0;start(byId('place'))"); pg.wait_for_timeout(700)
        if pg.evaluate("typeof TR!=='undefined'&&TR.on"): pg.keyboard.press('Escape')
        c.ok(pg.is_visible('#mission .bridge') and pg.evaluate("document.querySelectorAll('#mission .msslot').length===S.qs.length"), f'{w}: a bridge with one plank slot per puzzle')
        play(pg, miss=(2,), second=(4,))
        got = pg.evaluate("MS.got")
        c.ok(got[0] == 'gold' and got[2] == 'miss' and got[4] == 'ok' and all(got), f'{w}: golden, rope and wooden planks: {got}')
        c.ok(pg.evaluate("document.getElementById('mission').classList.contains('msdone')"), f'{w}: the bridge is finished even with a miss')
        c.ok('328' in (pg.evaluate("document.querySelector('#mission .mspip').style.transform") or ''), f'{w}: Pip flies across to the flag')
        c.ok(pg.evaluate("document.querySelector('#mission .msrope')!==null") and pg.evaluate("document.querySelectorAll('#mission .msplank rect').length")==len([x for x in got if x!='miss']), f'{w}: planks drawn')
        pg.evaluate("ovOpen&&closeOverlay();renderMap();start(byId('reading'))"); pg.wait_for_timeout(700)
        c.ok(pg.is_visible('#mission .lanterns'), f'{w}: lanterns on Bookworm Bay')
        o1 = float(pg.evaluate("document.querySelector('#mission .msroom').getAttribute('opacity')"))
        pg.evaluate("judge(true,null)"); pg.wait_for_timeout(300)
        o2 = float(pg.evaluate("document.querySelector('#mission .msroom').getAttribute('opacity')"))
        c.ok(o2 > o1 and pg.evaluate("document.querySelectorAll('#mission .mslamp.lit').length") == 1, f'{w}: a lantern lights and the room brightens ({o1} → {o2})')
        pg.evaluate("show('map');renderMap();start(byId('mult'))"); pg.wait_for_timeout(600)
        c.ok(not pg.is_visible('#mission') and not pg.evaluate("document.body.classList.contains('has-mission')"), f'{w}: no mission on other islands (yet)')
        pg.evaluate("show('map');renderMap();start(byId('daily'))"); pg.wait_for_timeout(600)
        c.ok(not pg.is_visible('#mission'), f'{w}: no mission in the daily challenge')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()
    b.close()
c.done()
