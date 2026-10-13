"""Classes from start to end with a stand-in cloud (tests/mock_cloud.js): a teacher makes a class, adds students,
prints login cards, turns a device into a classroom device, a student logs in with pictures and plays, the teacher
sends a task and sees progress, a family joins from home with the class code, the teacher removes them."""
import json, pathlib
from serve import *

MOCK = (pathlib.Path(__file__).parent / 'mock_cloud.js').read_text()
c = Check('classes')


def cloud_page(b, user, store, w=1100):
    ctx = b.new_context(viewport={'width': w, 'height': 900}, service_workers='block')
    ctx.route('**/*', router)
    ctx.add_init_script("if(!sessionStorage.getItem('seed')){localStorage.clear();localStorage.setItem('mock-user'," + json.dumps(json.dumps(user))
                        + ");localStorage.setItem('mock-store'," + json.dumps(json.dumps(store)) + ");sessionStorage.setItem('seed','1')}" + MOCK)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)+' '+str(e.stack)[:300]))
    pg.goto(ORIGIN)
    pg.wait_for_function("typeof curScreen!=='undefined' && curScreen==='kids'", timeout=30000)
    return ctx, pg, errs


def until(pg, js, ms=5000):
    pg.wait_for_function(js, timeout=ms)


with sync_playwright() as p:
    b = launch(p)
    T = {'uid': 'T1', 'email': 'teacher@school.test'}
    store = {'users/T1': {'consentAt': '2026-10-01', 'consentVersion': 1, 'role': 'teacher', 'pin': ''}}
    ctx, pg, errs = cloud_page(b, T, store)
    c.ok(pg.locator('#kTeach').is_visible(), 'teacher sees the Teacher desk button')
    pg.click('#kTeach'); until(pg, "curScreen==='teach'")
    pg.fill('#ncName', 'Room 12'); pg.fill('#ncTeacher', 'Ms. Rivera'); pg.select_option('#ncPack', 'ca-4'); pg.click('#ncGo')
    until(pg, "TC.cur && document.querySelector('#addNames')")
    pg.fill('#addNames', 'Maya\nLeo\nMaya'); pg.click('#addGo'); pg.wait_for_timeout(300)
    r = pg.evaluate("rosterOf(TC.cur).map(([id,p])=>[p.name,p.pic.length,p.pack])")
    c.ok(sorted(x[0] for x in r) == ['Leo', 'Maya'] and all(x[1] == 2 and x[2] == 'ca-4' for x in r), f'roster without duplicates: {r}')
    cid, code = pg.evaluate("[TC.cur,curClass().code]")
    c.ok(len(code) == 6, f'class code {code}')
    pg.evaluate("window.print=()=>{window.__printed=document.querySelectorAll('#printArea .lcard').length}")
    pg.click('#cardsGo'); pg.wait_for_timeout(200)
    c.ok(pg.evaluate("window.__printed") == 2, 'login cards: one per student')
    # classroom device (PIN already set)
    pg.evaluate("ROOT.pin='1234'"); pg.click('#devGo'); until(pg, "curScreen==='kids'")
    names = pg.evaluate("[...document.querySelectorAll('#kids [data-kid] b')].map(b=>b.textContent)")
    c.ok(sorted(names) == ['Leo', 'Maya'], f'classroom device shows the class only: {names}')
    maya = pg.evaluate("rosterOf(TC.cur).find(([,p])=>p.name==='Maya')")
    pics = maya[1]['pic']
    pg.click(f'#kids [data-kid="{maya[0]}"]'); until(pg, "!!document.querySelector('[data-pic]')")
    wrong = [i for i in range(12) if i != pics[0]][:2]
    for i in wrong: pg.click(f'[data-pic="{i}"]')
    pg.wait_for_timeout(200)
    c.ok(pg.evaluate("curScreen") == 'kids' and pg.locator('[data-pic]').count() == 12, 'wrong pictures: still on the login')
    for i in pics: pg.click(f'[data-pic="{i}"]')
    until(pg, "curScreen==='map'")
    c.ok(pg.evaluate("G.name") == 'Maya', 'right pictures: Maya plays')
    # teacher sends a task (as if from another device), the student sees it after a check
    pg.evaluate(f"CL.api.updateClass('{cid}',{{tasks:[{{id:'tA',isl:['frac'],due:'2026-12-01',to:[],ts:1}}],now:['frac','mult']}})")
    pg.evaluate("classCheck(true)"); until(pg, "!document.querySelector('#classCard').hidden")
    c.ok('Ms. Rivera' in pg.text_content('#classCard') and pg.locator('#classCard [data-cc="frac"]').count() == 1, 'task card on the map')
    c.ok(pg.evaluate("nowList()") == ['frac', 'mult'], "teacher's topics drive Pip's Pick")
    # play a frac round to the end
    pg.evaluate("()=>{const I=byId('frac');beginRound(I,'island',[0,1,2].map(t=>makeQ(I,t,77+t,2)));for(const q of S.qs){track(q,true,q!==S.qs[0],'9')};S.score=2;S.i=S.qs.length-1;finishRound();classPush(true)}")
    pg.wait_for_timeout(400)
    st = pg.evaluate(f"JSON.parse(localStorage.getItem('mock-store'))")
    mem = st.get(f'classes/{cid}/members/T1_{maya[0]}', {})
    s = json.loads(mem.get('sum') or '{}')
    c.ok(s.get('tasks', {}).get('tA') and s.get('a', 0) >= 3 and s.get('wrong'), f'summary has task, puzzles and mistakes: {list(s)}')
    c.ok(any(w.get('g') == '9' for w in s.get('wrong', [])), 'the wrong answer the child gave is kept')
    # leaving the classroom mode needs the PIN
    pg.evaluate("openKids()"); pg.click('#kTeach'); until(pg, "!!document.querySelector('#pinbox')")
    for k in '1234': pg.click(f'[data-pk="{k}"]')
    until(pg, "!!document.querySelector('#cdOff')"); pg.click('#cdOff'); pg.wait_for_timeout(200)
    c.ok(not pg.evaluate("classDevice()") and pg.locator('#kTeach').is_visible(), 'class mode off after the PIN')
    pg.evaluate("cloudFlush()"); pg.wait_for_timeout(300)
    store = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    c.ok(not errs, f'teacher page errors: {errs[:3]}')
    ctx.close()

    # a family joins from home
    P = {'uid': 'P1', 'email': 'parent@home.test'}
    store['users/P1'] = {'consentAt': '2026-10-01', 'consentVersion': 1, 'pin': ''}
    store['users/P1/kids/kx'] = {'data': json.dumps({'name': 'Ana', 'pack': 'ca-4', 'settings': {'sv': 2}}), 'name': 'Ana', 'ts': 1, 'v': 1}
    ctx, pg, errs = cloud_page(b, P, store, 800)
    until(pg, "!!document.querySelector('[data-kid=\"kx\"]')"); pg.click('[data-kid="kx"]'); until(pg, "curScreen==='map'")
    pg.evaluate("CL.unlockUntil=Date.now()+60000;renderParent()")
    pg.fill('#clsCode', 'zzzzzz'); pg.click('#clsJoin'); pg.wait_for_timeout(300)
    c.ok('No class' in pg.inner_text('#clsNote') or '6 letters' in pg.inner_text('#clsNote'), 'a wrong code is refused')
    pg.fill('#clsCode', code.lower()); pg.click('#clsJoin'); until(pg, "!!document.querySelector('#clsYes')")
    c.ok('Room 12' in pg.inner_text('#ocard'), 'the class is shown before joining')
    pg.click('#clsYes'); pg.wait_for_timeout(500)
    c.ok(pg.evaluate("G.cls&&G.cls.cid") == cid, 'joined')
    st = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    c.ok(f'classes/{cid}/members/P1_kx' in st, 'summary shared with the class')
    pg.evaluate("classPush(true);cloudFlush()"); pg.wait_for_timeout(300)
    c.ok(not errs, f'parent page errors: {errs[:3]}')
    store = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    ctx.close()

    # the teacher sees both, downloads CSV, removes the family
    ctx, pg, errs = cloud_page(b, T, store)
    pg.click('#kTeach'); until(pg, "curScreen==='teach' && !!document.querySelector('[data-cls]')")
    pg.click('[data-cls]'); until(pg, "TC.mem[TC.cur]&&TC.mem[TC.cur].length>=3")
    pg.click('[data-tt="prog"]'); until(pg, "!!document.querySelector('table.heat')")
    rows = pg.evaluate("[...document.querySelectorAll('table.heat tbody th')].map(t=>t.textContent)")
    c.ok(len(rows) == 3 and any('Ana' in r for r in rows), f'heatmap rows: {rows}')
    c.ok(pg.evaluate("document.querySelector('table.heat td.hm[style]')!==null"), 'mastery cells drawn')
    pg.click('[data-drill="frac"]'); until(pg, "!!document.querySelector('table.heat.sk')")
    with pg.expect_download() as d:
        pg.click('#csvStd')
    txt = pathlib.Path(d.value.path()).read_text(encoding='utf-8-sig')
    head = txt.splitlines()[0]
    c.ok(head.startswith('Student,') and '4.NF.1' in head and len(txt.splitlines()) == 4, f'CSV by standard: {head[:80]}')
    with pg.expect_download() as d:
        pg.click('#csvSk')
    c.ok('practicing' in pathlib.Path(d.value.path()).read_text(encoding='utf-8-sig') or 'mastered' in pathlib.Path(d.value.path()).read_text(encoding='utf-8-sig'), 'CSV by skill')
    pg.click('[data-tt="tasks"]'); until(pg, "!!document.querySelector('#tAdd')")
    c.ok('1 of 3 done' in pg.inner_text('.tasks'), f"task progress: {pg.inner_text('.tasks')[:120]}")
    pg.click('[data-tisl="mult"]'); pg.click('#tAdd'); pg.wait_for_timeout(300)
    c.ok(pg.evaluate("curClass().tasks.length") == 2, 'new task saved')
    pg.click('[data-tt="kids"]'); until(pg, "!!document.querySelector('[data-mdel]')")
    pg.click('[data-mdel]'); pg.click('[data-mdel]'); pg.wait_for_timeout(300)
    store = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    c.ok(store[f'classes/{cid}/members/P1_kx'].get('removed') is True, 'family removed from the class')
    c.ok(not errs, f'teacher page errors: {errs[:3]}')
    ctx.close()

    # the family's device lets go of the class
    ctx, pg, errs = cloud_page(b, P, store, 800)
    until(pg, "!!document.querySelector('[data-kid=\"kx\"]')"); pg.click('[data-kid="kx"]'); until(pg, "curScreen==='map'")
    pg.evaluate("classCheck(true)"); pg.wait_for_timeout(400)
    c.ok(not pg.evaluate("G.cls"), 'removed child is no longer in the class')
    # a new school year offer: August/September only, when the grade was chosen before August, once a year
    yo = pg.evaluate("(()=>{G.packSince=new Date(2026,2,1).getTime();const a=yearOffer(new Date(2027,7,15)),b=yearOffer(new Date(2027,10,1));G.yearAsk=2027;const d=yearOffer(new Date(2027,7,20));delete G.yearAsk;G.packSince=new Date(2027,7,5).getTime();const e=yearOffer(new Date(2027,8,1));return [a&&a.next.id,b,d,e]})()")
    c.ok(yo == ['ca-5', None, None, None], f'school year offer: {yo}')
    # the family can join again; while in a class the grade is the class's
    pg.evaluate("CL.unlockUntil=Date.now()+60000;renderParent()")
    pg.fill('#clsCode', code); pg.click('#clsJoin'); until(pg, "!!document.querySelector('#clsYes')"); pg.click('#clsYes'); pg.wait_for_timeout(500)
    c.ok(pg.evaluate("G.cls&&G.cls.cid") == cid, 'joined again after being removed')
    pg.evaluate("renderParent()")
    c.ok(pg.locator('#setGrade').count() == 0 and 'leave the class first' in pg.text_content('#parentBody'), 'grade locked while in a class')
    c.ok('4th' in pg.text_content('#playerBtn'), 'grade shown next to the name')
    pg.evaluate("cloudFlush()"); pg.wait_for_timeout(300)
    store = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    c.ok(not errs, f'parent page errors: {errs[:3]}')
    ctx.close()

    # a new school year: the teacher moves the class to grade 5
    ctx, pg, errs = cloud_page(b, T, store)
    pg.click('#kTeach'); until(pg, "curScreen==='teach' && !!document.querySelector('[data-cls]')")
    pg.click('[data-cls]'); until(pg, "!!document.querySelector('[data-tt=\"set\"]')"); pg.click('[data-tt="set"]')
    until(pg, "!!document.querySelector('#csUp')"); pg.click('#csUp'); pg.click('#csUp'); pg.wait_for_timeout(500)
    r = pg.evaluate("[curClass().pack,rosterOf(TC.cur).map(([,p])=>[p.pack,!!(p.grades&&p.grades['ca-4'])])]")
    c.ok(r[0] == 'ca-5' and all(x == ['ca-5', True] for x in r[1]), f'class and roster moved, last year kept: {r}')
    pg.evaluate("cloudFlush()"); pg.wait_for_timeout(300)
    store = json.loads(pg.evaluate("localStorage.getItem('mock-store')"))
    c.ok(not errs, f'teacher page errors: {errs[:3]}')
    ctx.close()

    # the family's device follows the class to grade 5
    ctx, pg, errs = cloud_page(b, P, store, 800)
    until(pg, "!!document.querySelector('[data-kid=\"kx\"]')"); pg.click('[data-kid="kx"]')
    pg.wait_for_function("localStorage.getItem('pip-pack')==='ca-5'", timeout=8000); pg.wait_for_timeout(2500)
    c.ok(pg.evaluate("PACK.id") == 'ca-5', 'family device switched to the class grade')
    c.ok(not errs, f'parent page errors: {errs[:3]}')
c.done()
