"""The app side of the server features, with the stand-in cloud: co-teachers (invite, join, limits, leave),
Google Classroom import and share links, the weekly class email switch, and for families the weekly email
question, Emails and notifications settings, and the small summary saved for the weekly email."""
import json
from serve import *
from check_classes_helpers import cloud_page, until

c = Check('server features in the app')
CLS = {'owner': 'T1', 'name': 'Room 12', 'teacher': 'Ms. Lee', 'pack': 'ca-4', 'code': 'ABC234', 'ts': 1, 'now': [], 'tasks': [], 'v': 1}
store = {
    'users/T1': {'consentAt': '2026-10-01', 'consentVersion': 1, 'role': 'teacher', 'teacherName': 'Ms. Lee', 'pin': ''},
    'users/T2': {'consentAt': '2026-10-01', 'consentVersion': 1, 'role': 'teacher', 'teacherName': 'Mr. Kim', 'pin': ''},
    'users/P1': {'consentAt': '2026-10-01', 'consentVersion': 1, 'role': 'parent', 'pin': ''},
    'classes/C1': CLS, 'codes/ABC234': {'cid': 'C1', 'owner': 'T1'},
    'classes/C1/members/P1_k1': {'owner': 'P1', 'kid': 'k1', 'name': 'Maya', 'pack': 'ca-4', 'code': 'ABC234', 'ts': 1,
                                 'sum': json.dumps({'v': 1, 'sk': {}, 'isl': {}, 'a': 30, 'c': 20, 'w': [20, 30, 20], 'last': '2026-10-13', 'tasks': {}})},
}
COURSES = {'courses': [{'id': '111', 'name': '4th grade math', 'section': 'Period 2'}]}
STUDENTS = {'students': [{'profile': {'name': {'givenName': 'Lena', 'familyName': 'Park'}}}, {'profile': {'name': {'givenName': 'Omar', 'familyName': 'Diaz'}}}]}


def classroom(route):
    u = route.request.url
    route.fulfill(status=200, content_type='application/json', body=json.dumps(STUDENTS if '/students' in u else COURSES))


with sync_playwright() as p:
    b = launch(p)
    # ---- the class owner ----
    ctx, pg, errs = cloud_page(b, {'uid': 'T1', 'email': 'lee@school.test'}, store)
    ctx.route('https://classroom.googleapis.com/**', classroom)
    until(pg, "curScreen==='teach' && !!TC.cur && !!document.querySelector('[data-tt]')", 15000)
    pg.click('[data-tt="set"]'); until(pg, "!!document.querySelector('#coInv')")
    pg.click('#coInv'); until(pg, "!!document.querySelector('#coInvOut .ccode')")
    st = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    inv = [k.split('/')[1] for k in st if k.startswith('tinv/')]
    c.ok(len(inv) == 1 and pg.inner_text('#coInvOut .ccode') == inv[0], f'co-teacher invite made: {inv}')
    pg.click('[data-tt="kids"]'); until(pg, "!!document.querySelector('#gcImp')")
    c.ok('classroom.google.com/share' in pg.get_attribute('.gcshare', 'href') and 'ABC234' in pg.get_attribute('.gcshare', 'href'), 'share the class code in Google Classroom')
    pg.click('#gcImp'); until(pg, "!!document.querySelector('[data-gc]')")
    pg.click('[data-gc]'); until(pg, "/Lena/.test(document.querySelector('#addNames').value)")
    c.ok(pg.input_value('#addNames') == 'Lena P.\nOmar D.', f"Classroom names fill the box: {pg.input_value('#addNames')!r}")
    pg.click('[data-tt="tasks"]'); until(pg, "!!document.querySelector('#tAdd')")
    pg.click('[data-tisl="frac"]'); pg.click('#tAdd'); until(pg, "!!document.querySelector('.tasks .gcshare')")
    t = pg.evaluate("realTasks(curClass())[0]")
    c.ok(t.get('nm') == 'Pie Peak', f'a task has a readable name for notifications: {t.get("nm")}')
    c.ok('Pie%20Peak' in pg.get_attribute('.tasks .gcshare', 'href'), 'post a task to Google Classroom')
    pg.click('#tBack'); until(pg, "!!document.querySelector('#tnWeekly')")
    pg.click('#tnWeekly'); pg.wait_for_timeout(300)
    n = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))['users/T1'].get('notify', {})
    c.ok(n.get('weekly') is True and isinstance(n.get('h'), int) and n.get('tz'), f'weekly class email switched on: {n}')
    c.ok(not errs, f'owner page errors: {errs[:3]}')
    store = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    ctx.close()

    # ---- a colleague joins as co-teacher ----
    ctx, pg, errs = cloud_page(b, {'uid': 'T2', 'email': 'kim@school.test'}, store)
    until(pg, "curScreen==='teach' && !!document.querySelector('#coJoin')", 15000)
    pg.fill('#coCode', 'WRONG1'); pg.click('#coJoin'); until(pg, "/does not work/.test(document.querySelector('#coJNote').textContent)")
    c.ok(True, 'a wrong invite code is refused')
    pg.fill('#coCode', inv[0].lower()); pg.click('#coJoin'); until(pg, "TC.cur==='C1' && !!document.querySelector('[data-tt]')")
    tabs = pg.evaluate("[...document.querySelectorAll('[data-tt]')].map(b=>b.dataset.tt)")
    c.ok(tabs == ['prog', 'tasks', 'set'], f'a co-teacher sees Progress, Tasks and Settings: {tabs}')
    until(pg, "classRows(curClass()).some(r=>r.name==='Maya')")
    c.ok(True, "a co-teacher sees the students' progress")
    pg.click('[data-tt="tasks"]'); until(pg, "!!document.querySelector('#tAdd')")
    pg.click('[data-tisl="mult"]'); pg.click('#tAdd'); pg.wait_for_timeout(400)
    st = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    c.ok(len([x for x in st['classes/C1']['tasks'] if not x.get('kind')]) == 2, 'a co-teacher sends a task')
    pg.click('[data-tt="set"]'); until(pg, "!!document.querySelector('#coLeave')")
    c.ok(pg.locator('#csDel').count() == 0 and pg.locator('#csCode').count() == 0, 'a co-teacher cannot delete the class or change its code')
    pg.click('#coLeave'); pg.click('#coLeave'); until(pg, "!TC.cur")
    st = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    c.ok('T2' not in st['classes/C1'].get('co', []), 'a co-teacher can leave')
    c.ok(not errs, f'co-teacher page errors: {errs[:3]}')
    ctx.close()

    # ---- a family: weekly email question, settings, the summary saved for the email ----
    ctx, pg, errs = cloud_page(b, {'uid': 'P1', 'email': 'mom@home.test'}, store, 390)
    pg.evaluate("const p=freshProfile();p.name='Mia';p.pack=PACK.id;const id=addKid(p);ROOT.current=id;G=ROOT.profiles[id];G.days[dayKey()]={sec:600,q:12,c:9};save();CL.unlockUntil=Date.now()+600000;openParent()")
    until(pg, "!!document.querySelector('#naYes')", 10000)
    pg.click('#naYes'); pg.wait_for_timeout(400)
    n = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))['users/P1'].get('notify', {})
    c.ok(n.get('weekly') is True and n.get('remind') is True and isinstance(n.get('h'), int), f'"Yes, send it" turns on the weekly email: {n}')
    c.ok(pg.locator('#naYes').count() == 0, 'the question is asked only once')
    pg.click('.ptabs [data-pt="acct"]'); until(pg, "!!document.querySelector('#nWeekly') && !document.querySelector('#nWeekly').closest('.pcard').hidden")
    c.ok(pg.get_attribute('#nWeekly', 'aria-checked') == 'true', 'settings show the weekly email as on')
    pg.click('#nPush'); until(pg, "document.querySelector('#nPush').getAttribute('aria-checked')==='true'")
    c.ok('users/P1/push/dev1' in json.loads(pg.evaluate("localStorage.getItem('mock-store')")), 'notifications on for this device')
    pg.click('#nTest'); until(pg, "/Sent to/.test(document.querySelector('#nNote').textContent)")
    c.ok('sendTestEmail' in pg.evaluate("window.__calls||[]"), 'test email requested')
    pg.evaluate("cloudFlush()"); pg.wait_for_timeout(800)
    st = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    kd = [v for k, v in st.items() if k.startswith('users/P1/kids/') and v.get('mail')]
    dg = json.loads(kd[0]['mail']) if kd else {}
    c.ok(dg.get('name') == 'Mia' and dg.get('tot', 0) > 50 and dg.get('dd'), f"the weekly email summary is saved with the player: {list(dg)[:8]}")
    c.ok(not errs, f'family page errors: {errs[:3]}')
    ctx.close()
c.done()
