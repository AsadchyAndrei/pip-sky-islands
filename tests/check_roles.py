"""The first sign-in asks who the grown-up is. A parent goes to "Who's playing?", a teacher to the teacher desk.
Old accounts only pick a role (no second consent). The role can be switched in Grown-ups."""
import json, pathlib
from serve import *

MOCK = (pathlib.Path(__file__).parent / 'mock_cloud.js').read_text()
c = Check('parent or teacher')


def page(b, user, store, w=900):
    ctx = b.new_context(viewport={'width': w, 'height': 900}, service_workers='block'); ctx.route('**/*', router)
    ctx.add_init_script("if(!sessionStorage.getItem('seed')){localStorage.clear();localStorage.setItem('mock-user'," + json.dumps(json.dumps(user))
                        + ");localStorage.setItem('mock-store'," + json.dumps(json.dumps(store)) + ");sessionStorage.setItem('seed','1')}" + MOCK)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(ORIGIN)
    return ctx, pg, errs


def until(pg, js, ms=15000): pg.wait_for_function(js, timeout=ms)


def stored(pg, key): return pg.evaluate(f"JSON.parse(localStorage.getItem('mock-store'))['{key}']")


with sync_playwright() as p:
    b = launch(p)
    # a brand-new parent
    ctx, pg, errs = page(b, {'uid': 'N1', 'email': 'new@home.test'}, {}, 390)
    until(pg, "!!document.querySelector('.rolebtn')")
    c.ok(pg.locator('#cGo').is_disabled(), 'Continue waits for a role')
    pg.click('[data-role=parent]'); c.ok(pg.locator('#cGo').is_disabled(), 'parent must agree first')
    pg.check('#cOk'); pg.click('#cGo'); until(pg, "curScreen==='kids'")
    d = stored(pg, 'users/N1') or {}
    c.ok(d.get('role') == 'parent' and d.get('consentAt'), f'parent saved: {d}')
    c.ok(not errs, f'errors: {errs[:3]}'); ctx.close()

    # a brand-new teacher
    ctx, pg, errs = page(b, {'uid': 'N2', 'email': 'new@school.test'}, {})
    until(pg, "!!document.querySelector('.rolebtn')")
    pg.click('[data-role=teacher]'); pg.check('#cOk'); c.ok(pg.locator('#cGo').is_disabled(), 'teacher must give a name for students')
    pg.fill('#cName', 'Ms. Lee'); pg.click('#cGo'); until(pg, "curScreen==='teach'")
    d = stored(pg, 'users/N2') or {}
    c.ok(d.get('role') == 'teacher' and d.get('teacherName') == 'Ms. Lee' and d.get('teacherAt') and d.get('consentAt'), f'teacher saved: {d}')
    c.ok(pg.locator('.tsteps').is_visible() and pg.input_value('#ncTeacher') == 'Ms. Lee', 'empty desk shows the first steps and knows the name')
    pg.click('#tBack'); until(pg, "curScreen==='kids'")
    c.ok(True, 'My own kids opens the players screen')
    # switch to parent in Grown-ups
    pg.evaluate("CL.unlockUntil=Date.now()+60000;renderParent()"); pg.click('[data-pt=acct]')
    pg.click('#tOff'); pg.click('#toGo'); until(pg, "!!document.querySelector('#tOn')")
    c.ok((stored(pg, 'users/N2') or {}).get('role') == 'parent', 'switched to a parent account')
    c.ok(not errs, f'errors: {errs[:3]}'); ctx.close()

    # an account from before roles existed: just pick a role, no second consent
    ctx, pg, errs = page(b, {'uid': 'O1', 'email': 'old@home.test'}, {'users/O1': {'consentAt': '2026-10-01', 'consentVersion': 1, 'pin': ''}})
    until(pg, "!!document.querySelector('.rolebtn')")
    pg.click('[data-role=parent]'); c.ok(pg.locator('#cOk').count() == 0 and not pg.locator('#cGo').is_disabled(), 'no second consent for an old account')
    pg.click('#cGo'); until(pg, "curScreen==='kids'")
    d = stored(pg, 'users/O1') or {}
    c.ok(d.get('role') == 'parent' and d.get('consentAt') == '2026-10-01', f'old consent kept: {d}')
    c.ok(not errs, f'errors: {errs[:3]}'); ctx.close()
c.done()
