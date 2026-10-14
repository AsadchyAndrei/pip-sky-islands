"""Guided tours: they start on their own once, can be skipped, are not shown again, can be replayed from
"How Pip works", and walk through every step; also the public guide page."""
import json
from serve import *
from check_classes_helpers import cloud_page, until

c = Check('guided tours')
with sync_playwright() as p:
    b = launch(p)
    for w in (1280, 390):
        ctx, pg, errs = open_page(b, w, 820)
        pg.evaluate("window.__tourTest=1;renderMap()")
        until(pg, "TR.on && TR.id==='map'", 6000)
        c.ok('Quick tour' in pg.text_content('#tbS') and pg.inner_text('#tbSkip') == 'Not now', f'{w}: the map tour asks first')
        pg.click('#tbSkip'); until(pg, "!TR.on")
        c.ok(pg.evaluate("tourSeen('map')"), f'{w}: a skipped tour is remembered')
        pg.evaluate("renderMap()"); pg.wait_for_timeout(1500)
        c.ok(not pg.evaluate("TR.on"), f'{w}: it does not start again')
        # replay from the help menu and walk through it
        pg.evaluate("openHelp()"); until(pg, "!!document.querySelector('[data-replay=map]')")
        pg.click('[data-replay=map]'); until(pg, "TR.on && TR.id==='map'", 4000)
        seen = []
        for i in range(14):
            if not pg.evaluate("TR.on"): break
            pg.wait_for_timeout(900)
            seen.append(pg.inner_text('#tbT'))
            if i > 0 and i < 13 and not pg.evaluate("TR.steps[TR.i].intro||TR.steps[TR.i].end"):
                c.ok(pg.evaluate("(()=>{const s=document.querySelector('.tspot').getBoundingClientRect(),b=document.querySelector('.tbub').getBoundingClientRect();return s.width>10&&b.top>=0&&b.bottom<=innerHeight+1&&b.left>=0&&b.right<=innerWidth+1})()"), f'{w}: step "{seen[-1]}" is lit and its bubble is on screen')
            pg.click('#tbNext'); pg.wait_for_timeout(250)
        c.ok(seen[0] == "Hi, I'm Pip!" and seen[-1] == "You're ready to fly!" and len(seen) >= 8, f'{w}: map tour steps {seen}')
        # Parents' Corner: starts on its own the first time
        pg.evaluate("CL.unlockUntil=Date.now()+600000;openParent()")
        until(pg, "TR.on && TR.id==='parent'", 6000)
        pg.click('#tbNext'); pg.wait_for_timeout(300)
        pg.keyboard.press('Escape'); until(pg, "!TR.on")
        c.ok(pg.evaluate("tourSeen('parent')"), f'{w}: Escape leaves the tour')
        c.ok(pg.locator('#pHelp').is_visible(), f'{w}: help button in Parents')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()

    # teacher desk and a class
    store = {'users/T1': {'consentAt': '2026-10-01', 'consentVersion': 1, 'role': 'teacher', 'teacherName': 'Ms. Lee', 'pin': ''},
             'classes/C1': {'owner': 'T1', 'name': 'Room 12', 'teacher': 'Ms. Lee', 'pack': 'ca-4', 'code': 'ABC234', 'ts': 1, 'now': [], 'tasks': [], 'v': 1},
             'classes/C2': {'owner': 'T1', 'name': 'Room 14', 'teacher': 'Ms. Lee', 'pack': 'ca-4', 'code': 'ABC235', 'ts': 1, 'now': [], 'tasks': [], 'v': 1}}
    ctx, pg, errs = cloud_page(b, {'uid': 'T1', 'email': 'lee@school.test'}, store)
    pg.evaluate("window.__tourTest=1;renderTeach()")
    until(pg, "TR.on && TR.id==='desk'", 8000)
    steps = []
    for i in range(10):
        if not pg.evaluate("TR.on"): break
        steps.append(pg.inner_text('#tbT')); pg.click('#tbNext'); pg.wait_for_timeout(250)
    c.ok('Make a class' in steps and 'Co-teaching' in steps and steps[-1] == 'Ready!', f'desk tour: {steps}')
    st = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    c.ok(st['users/T1'].get('tours', {}).get('desk') == 1, 'a finished tour is saved in the account')
    pg.click('[data-cls="C1"]'); until(pg, "TR.on && TR.id==='class'", 6000)
    c.ok(pg.inner_text('#tbT') == 'Your class', 'the class tour starts when a class opens')
    pg.click('#tbSkip'); until(pg, "!TR.on")
    c.ok(not errs, f'teacher page errors: {errs[:3]}')
    ctx.close()

    # the public guide page
    ctx = b.new_context(viewport={'width': 390, 'height': 800}, service_workers='block'); ctx.route('**/*', router)
    pg = ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(ORIGIN + 'guide.html'); pg.wait_for_timeout(800)
    c.ok(pg.locator('.gditem').count() >= 5, 'guide page lists answers')
    pg.click('[data-gd=teachers]'); pg.wait_for_timeout(200)
    c.ok('Co-teachers' in pg.inner_text('#gdBox'), 'guide page: teacher section')
    c.ok(not errs and pg.evaluate("document.documentElement.scrollWidth<=innerWidth"), f'guide page fits the phone, errors {errs[:2]}')
    ctx.close()
c.done()
