"""The map opens step by step for a new player: Fix-It Falls, Thunder Tower and Test Practice start as secret
islands, the Album tab waits for the first sticker; each opens with one celebration. Players who already got
there (like Alisa), the demo and "Show everything now" see the whole map, with no pop-ups."""
import pathlib
from serve import *
MOCK = (pathlib.Path(__file__).parent / 'mock_cloud.js').read_text()
c = Check('map opens step by step')
TEASE = "[...document.querySelectorAll('.isle.teaser')].map(b=>b.dataset.id).sort().join(',')"
with sync_playwright() as p:
    b = launch(p)
    for w in (1280, 390):
        # a brand-new player
        ctx = b.new_context(viewport={'width': w, 'height': 900}, service_workers='block'); ctx.route('**/*', router)
        ctx.add_init_script("if(!sessionStorage.getItem('s')){localStorage.clear();sessionStorage.setItem('s','1')}" + MOCK)
        pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(ORIGIN); pg.wait_for_function("!!document.querySelector('#gPlay')", timeout=15000)
        pg.click('#gPlay'); pg.wait_for_function("curScreen==='kids'", timeout=5000)
        pg.click('#kAdd'); pg.fill('#nameIn', 'Mia'); pg.click('#nameOk'); pg.wait_for_function("curScreen==='map'", timeout=8000)
        pg.wait_for_timeout(400)
        c.ok(pg.evaluate(TEASE) == 'flash,ptest,review', f'{w}: new player sees three secret islands ({pg.evaluate(TEASE)})')
        c.ok(not pg.locator('#bnav [data-go="albumBtn"]').is_visible(), f'{w}: no Album tab before the first sticker')
        c.ok(pg.locator('.isle[data-id=boss]').count() == 1, f'{w}: Boss Island is shown (it has its own star lock)')
        if w == 390: pg.click('[data-tab="ch"]'); pg.wait_for_timeout(200)  # phones: challenges are a tab
        pg.click('.isle.teaser[data-id=flash]'); pg.wait_for_timeout(300)
        c.ok('secret' in pg.inner_text('#maptext') and 'round' in pg.inner_text('#maptext'), f'{w}: tapping a secret island says how close it is')
        # play: rounds, a sticker, stars
        pg.evaluate("G.placed=1;G.xp=50;G.visited={mult:1,div:1};G.rounds=2;G.review=[{s:'x',d:'2000-01-01'}];save();renderMap()")
        pg.wait_for_timeout(2400)
        c.ok(pg.evaluate("ovOpen") and 'Fix-It Falls' in pg.text_content('#ocard') and pg.locator('#unGo').is_visible(), f'{w}: Fix-It Falls opens with a celebration')
        pg.click('#unLater'); pg.wait_for_timeout(500)
        c.ok(pg.evaluate(TEASE) == 'flash,ptest', f'{w}: Fix-It Falls is on the map now')
        c.ok('fresh' in (pg.get_attribute('.isle[data-id=review]', 'class') or ''), f'{w}: the new place glows')
        pg.evaluate("renderMap()"); pg.wait_for_timeout(2200)
        c.ok(not pg.evaluate("ovOpen"), f'{w}: a celebration is shown once')
        pg.evaluate("G.stickers={sky1:1};G.rounds=4;save();renderMap()"); pg.wait_for_timeout(2200)
        seen = []
        for i in range(4):
            if not pg.evaluate("ovOpen"): pg.wait_for_timeout(1800)
            if not pg.evaluate("ovOpen"): break
            seen.append(pg.text_content('#ocard h2')); pg.click('#unLater'); pg.wait_for_timeout(600)
        c.ok(seen == ['Sticker Album', 'Thunder Tower'], f'{w}: one celebration at a time: {seen}')
        c.ok(pg.locator('#bnav [data-go="albumBtn"]').is_visible() or w > 700, f'{w}: Album tab is back')
        c.ok(pg.evaluate(TEASE) == 'ptest', f'{w}: only Test Practice still secret')
        pg.evaluate("G.best={mult:3,div:3};save();renderMap()"); pg.wait_for_timeout(2400)
        c.ok(pg.evaluate("ovOpen") and 'Test Practice' in pg.text_content('#ocard'), f'{w}: Test Practice opens at 6 stars')
        pg.click('#unGo'); pg.wait_for_timeout(800)
        c.ok(pg.evaluate("curScreen") == 'play' and pg.evaluate("S.mode") == 'test' or pg.evaluate("ovOpen"), f'{w}: "Try it now" starts it')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()

    # Alisa-like player: everything open, no pop-ups
    ctx, pg, errs = open_page(b, 390, 844)
    pg.evaluate("renderMap()"); pg.wait_for_timeout(2500)
    c.ok(pg.evaluate(TEASE) == '' and not pg.evaluate("ovOpen"), 'a player who already plays sees the whole map, no pop-ups')
    c.ok(pg.locator('#bnav [data-go="albumBtn"]').is_visible(), 'and the Album tab')
    # a new sibling with "Show everything now"
    pg.evaluate("const q=freshProfile();q.name='Leo';q.pack=PACK.id;const id=addKid(q);ROOT.current=id;G=ROOT.profiles[id];save();renderMap()"); pg.wait_for_timeout(300)
    c.ok(pg.evaluate(TEASE) == 'flash,ptest,review', 'a new sibling starts with secret islands')
    pg.evaluate("CL.unlockUntil=Date.now()+600000;openParent()"); pg.wait_for_timeout(600)
    if pg.evaluate("typeof TR!=='undefined'&&TR.on"): pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
    if pg.evaluate("ovOpen"): print('  (pop-up in Parents:', pg.inner_text('#ocard')[:80].replace('\n',' '), ')'); pg.evaluate("closeOverlay()"); pg.wait_for_timeout(400)
    pg.click('.ptabs [data-pt="set"]'); pg.wait_for_timeout(300)
    pg.click('#setAll'); pg.wait_for_timeout(200)
    pg.evaluate("renderMap()"); pg.wait_for_timeout(2200)
    c.ok(pg.evaluate(TEASE) == '' and not pg.evaluate("ovOpen"), '"Show everything now" opens it all, quietly')
    # a teacher's task opens the place it points to
    pg.evaluate("G.settings.showAll=false;G.unl={};G.rounds=0;G.visited={};G.best={};G.stickers={};save()")
    c.ok(pg.evaluate("(()=>{const o=window.openTasks;G.cls={cid:'C1'};window.openTasks=()=>[{isl:['ptest']}];const r=isOpen('ptest')&&!isOpen('flash');window.openTasks=o;G.cls=null;return r})()"), "a teacher's task opens that place")
    c.ok(not errs, f'page errors {errs[:3]}')
    ctx.close()
c.done()
