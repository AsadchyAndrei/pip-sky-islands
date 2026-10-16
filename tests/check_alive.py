"""A livelier round: the balloon rides the progress dots, streaks glow, and the mini-events (wind, star bird,
treasure bubble) give a bonus and never take anything away. No events in tests, lessons or the first rounds."""
from serve import *
c = Check('livelier rounds and mini-events')
with sync_playwright() as p:
    b = launch(p)
    for w in (1280, 390):
        ctx, pg, errs = open_page(b, w, 820)
        pg.evaluate("G.rounds=5;start(byId('mult'))"); pg.wait_for_timeout(900)
        if pg.evaluate("typeof TR!=='undefined'&&TR.on"): pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
        c.ok(pg.locator('#dots .dotpip').count() == 1 and pg.locator('#dots .dotflag').count() == 1 and pg.locator('#dots .dot').count() == 6, f'{w}: balloon and flag on the dots')
        x0 = pg.evaluate("parseFloat(document.querySelector('.dotpip').style.left)")
        pg.evaluate("judge(true,null)"); pg.click('#next'); pg.wait_for_timeout(800)
        c.ok(pg.evaluate("parseFloat(document.querySelector('.dotpip').style.left)") > x0, f'{w}: the balloon moves to the next dot')
        pg.evaluate("S.streak=2;judge(true,null)"); pg.wait_for_timeout(200)
        c.ok(pg.evaluate("document.body.classList.contains('al-s3')"), f'{w}: 3 in a row glows')
        pg.click('#next'); pg.wait_for_timeout(500)
        pg.evaluate("judge(false,null)"); pg.wait_for_timeout(300)
        c.ok(not pg.evaluate("document.body.classList.contains('al-s3')") and pg.locator('.sky .alcloud').count() == 1, f'{w}: a miss: glow off, a cloud passes')
        # each mini-event, forced on the next puzzle
        for kind in ('wind', 'bird', 'bubble'):
            pg.evaluate(f"start(byId('mult'));S.ev={{at:1,kind:'{kind}',on:false,done:false}}"); pg.wait_for_timeout(600)
            pg.evaluate("judge(true,null)"); pg.click('#next'); pg.wait_for_timeout(600)
            coins = pg.evaluate("G.coins")
            if kind == 'wind':
                c.ok(pg.evaluate("document.body.classList.contains('ev-wind')") and 'wind' in pg.inner_text('#say'), f'{w}: wind starts')
                pg.evaluate("judge(true,null)"); pg.wait_for_timeout(300)
                c.ok(not pg.evaluate("document.body.classList.contains('ev-wind')") and pg.evaluate("G.coins") >= coins + 10 + 4 - 6, f'{w}: a right answer catches the balloon (+bonus)')
            if kind == 'bird':
                c.ok(pg.locator('.evbird').count() == 1, f'{w}: the star bird flies')
                pg.evaluate("judge(false,null)"); pg.wait_for_timeout(200)
                c.ok(pg.evaluate("G.coins") == coins, f'{w}: a miss costs nothing')
                pg.evaluate("judge(true,null)"); pg.wait_for_timeout(200)
                pg.click('#next'); pg.wait_for_timeout(500)
                c.ok(pg.locator('.evbird').count() == 0, f'{w}: the bird is gone on the next puzzle')
            if kind == 'bubble':
                c.ok(pg.locator('.evbubble').count() == 1, f'{w}: a treasure bubble floats up')
                pg.click('.evbubble', force=True); pg.wait_for_timeout(300)
                c.ok(pg.locator('.evbubble').count() == 0 and pg.evaluate("G.coins") >= coins + 5, f'{w}: tapping it gives bonus coins')
        pg.evaluate("renderMap()"); pg.wait_for_timeout(300)
        c.ok(pg.locator('.evbird,.evbubble,.evgust').count() == 0 and not pg.evaluate("document.body.classList.contains('ev-wind')"), f'{w}: leaving the round ends an event')
        # never in test practice, never for a brand-new player
        c.ok(pg.evaluate("(()=>{let n=0;for(let k=0;k<60;k++){S=freshState(byId('mult'),'test');S.qs=[1,2,3,4,5,6];aliveEventPlan();if(S.ev)n++}return n})()") == 0, f'{w}: no events in Test Practice')
        c.ok(pg.evaluate("(()=>{G.rounds=0;let n=0;for(let k=0;k<60;k++){S=freshState(byId('mult'),'island');S.qs=[1,2,3,4,5,6];aliveEventPlan();if(S.ev)n++}G.rounds=5;return n})()") == 0, f'{w}: no events in the first rounds')
        c.ok(pg.evaluate("(()=>{let n=0;for(let k=0;k<200;k++){S=freshState(byId('mult'),'island');S.qs=[1,2,3,4,5,6];aliveEventPlan();if(S.ev){n++;if(S.ev.at<2||S.ev.at>4)return -1}}return n})()") in range(40, 130), f'{w}: about 4 rounds in 10 have one, on puzzle 3 to 5')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()
c.done()
