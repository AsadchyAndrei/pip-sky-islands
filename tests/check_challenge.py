"""Challenge a friend: after a round the same puzzles go to a friend (a link) or to a brother or sister on this
device; the friend plays exactly the same puzzles and sees both scores; a broken or other-grade link is handled."""
import pathlib
from serve import *
MOCK = (pathlib.Path(__file__).parent / 'mock_cloud.js').read_text()
c = Check('challenge a friend')

def finish(pg, miss=()):
    for k in range(20):
        if pg.evaluate("curScreen") != 'play': break
        if pg.evaluate("ovOpen"): pg.evaluate("closeOverlay()"); pg.wait_for_timeout(200)
        if pg.evaluate("!S.locked"):
            if pg.evaluate("S.i") in miss: pg.evaluate("judge(false,null)")
            pg.evaluate("judge(true,null)")
        pg.wait_for_timeout(150)
        if pg.is_visible('#next'): pg.click('#next')
        pg.wait_for_timeout(250)
    pg.wait_for_timeout(600)

with sync_playwright() as p:
    b = launch(p)
    for w in (1280, 390):
        ctx, pg, errs = open_page(b, w, 900)
        pg.evaluate("G.rounds=5;window.__tourTest=0;start(byId('mult'))"); pg.wait_for_timeout(700)
        if pg.evaluate("typeof TR!=='undefined'&&TR.on"): pg.keyboard.press('Escape')
        prompts = pg.evaluate("S.qs.map(q=>q.prompt)")
        finish(pg, miss=(1,))
        pg.evaluate("closeOverlay&&ovOpen&&closeOverlay()"); pg.wait_for_timeout(300)
        c.ok(pg.evaluate("curScreen") == 'done' and pg.is_visible('#chalBtn'), f'{w}: "Challenge a friend" after a round')
        code = pg.evaluate("chEncode(chFromRound())")
        back = pg.evaluate(f"chDecode('{code}')")
        c.ok(back and back['sc'] == 5 and len(back['q']) == 6 and back['n'] == 'Alisa' and back['g'] == 'ca-4', f'{w}: the link carries the puzzles and the score: {back and back["sc"]}')
        pg.click('#chalBtn'); pg.wait_for_timeout(400)
        c.ok('Can they beat 5 of 6?' in pg.text_content('#ocard'), f'{w}: the challenge pop-up')
        pg.uncheck('#chName'); pg.click('#chShare'); pg.wait_for_timeout(500)
        link = pg.evaluate("(document.querySelector('.chlink')||{}).value||''")
        c.ok('?ch=' in link and pg.evaluate(f"chDecode('{link.split('?ch=')[1]}').n") == '', f'{w}: the link without the name: {link[:60]}')
        pg.evaluate("closeOverlay()")

        # a friend opens the link on another device
        ctx2 = b.new_context(viewport={'width': w, 'height': 900}, service_workers='block'); ctx2.route('**/*', router)
        ctx2.add_init_script("if(!sessionStorage.getItem('s')){localStorage.clear();sessionStorage.setItem('s','1')}" + MOCK)
        pg2 = ctx2.new_page(); e2 = []; pg2.on('pageerror', lambda e: e2.append(str(e)))
        pg2.goto(ORIGIN + '?ch=' + code); pg2.wait_for_function("!!document.querySelector('#gPlay')", timeout=15000)
        c.ok('ch=' not in pg2.evaluate("location.search"), f'{w}: the address is cleaned up')
        pg2.click('#gPlay'); pg2.wait_for_timeout(600); pg2.click('#kAdd'); pg2.fill('#nameIn', 'Leo'); pg2.click('#nameOk')
        pg2.wait_for_function("ovOpen && /challenges you/.test(document.querySelector('#ocard').textContent)", timeout=9000)
        c.ok('Alisa challenges you!' in pg2.text_content('#ocard') and '5 of 6' in pg2.text_content('#ocard'), f'{w}: the friend is invited')
        pg2.click('#chGo'); pg2.wait_for_timeout(800)
        c.ok(pg2.evaluate("S.qs.map(q=>q.prompt)") == prompts, f'{w}: exactly the same puzzles')
        finish(pg2)
        pg2.evaluate("ovOpen&&closeOverlay()"); pg2.wait_for_timeout(200)
        t = pg2.inner_text('#dmsg')
        c.ok('You: 6 of 6' in t and 'Alisa: 5 of 6' in t and 'You won' in t and pg2.inner_text('#dtitle') == 'Challenge won!', f'{w}: both scores at the end: {t[:90]}')
        c.ok(not pg2.is_visible('#chalBtn'), f'{w}: no challenge button on a challenge round')
        pg2.evaluate("G.settings.showAll=true;unlockQueue=[];renderMap()"); pg2.wait_for_timeout(3000)
        c.ok(not pg2.evaluate("ovOpen"), f'{w}: the challenge is not offered again '+(pg2.evaluate("ovOpen") and pg2.text_content('#ocard')[:60] or ''))
        # a link for another grade, and a broken one
        pg2.evaluate("""localStorage.setItem('pip-ch-link',chEncode({v:1,g:'ca-3',i:'mult',n:'Zoe',sc:3,q:[['mult',0,5,2]]}));renderMap()""")
        pg2.wait_for_timeout(3000)
        c.ok(pg2.evaluate("ovOpen") and 'would not fit' in pg2.text_content('#ocard'), f'{w}: a challenge from another grade is explained')
        pg2.evaluate("closeOverlay();localStorage.setItem('pip-ch-link','bm90IGpzb24');renderMap()"); pg2.wait_for_timeout(3000)
        c.ok(not pg2.evaluate("ovOpen"), f'{w}: a broken link is ignored')
        c.ok(not e2, f'{w}: friend page errors {e2[:3]}')
        ctx2.close()

        # a brother on this device
        pg.evaluate("const q=freshProfile();q.name='Max';q.pack=PACK.id;q.unl={review:1,albumBtn:1,flash:1,ptest:1};addKid(q);save()")
        pg.evaluate("renderMap();G.rounds=5;start(byId('div'))"); pg.wait_for_timeout(600)
        finish(pg)
        pg.evaluate("ovOpen&&closeOverlay()"); pg.click('#chalBtn'); pg.wait_for_timeout(300)
        c.ok(pg.locator('[data-chsib]').count() == 1, f'{w}: a brother on this device can be challenged')
        pg.click('[data-chsib]'); pg.wait_for_timeout(300)
        mx = pg.evaluate("Object.keys(ROOT.profiles).find(id=>ROOT.profiles[id].name==='Max')")
        al = pg.evaluate("ROOT.current")
        pg.evaluate(f"selectKid('{mx}')"); pg.wait_for_timeout(500); pg.evaluate("renderMap()")
        pg.wait_for_function("ovOpen && /challenges you/.test(document.querySelector('#ocard').textContent)", timeout=9000)
        pg.click('#chGo'); pg.wait_for_timeout(600); finish(pg, miss=(0, 1, 2))
        pg.evaluate("ovOpen&&closeOverlay()")
        pg.evaluate(f"selectKid('{al}')"); pg.wait_for_timeout(500); pg.evaluate("renderMap()")
        pg.wait_for_function("ovOpen && /Challenge result/i.test(document.querySelector('#ocard').textContent)", timeout=9000)
        c.ok('Max' in pg.text_content('#ocard') and '3 of 6' in pg.text_content('#ocard'), f'{w}: the result comes back to the sender: {pg.text_content("#ocard")[:90]}')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()
c.done()
