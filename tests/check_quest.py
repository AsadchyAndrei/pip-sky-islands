"""Class quest: the teacher starts a 7-day goal for the whole class; every student sees the class total and their
own share on the map (no names, no ranking) and a celebration once when the class gets there."""
from serve import *
from check_classes_helpers import cloud_page, until
c = Check('class quest')
with sync_playwright() as p:
    b = launch(p)
    for w in (1280, 390):
        ctx, pg, errs = open_page(b, w, 900)
        pg.evaluate("""G.days={};G.days[dayKey()]={sec:600,q:20,c:15};G.cls={cid:'C1',teacher:'Ms. Lee'};
          localStorage.setItem('pip-class-C1',JSON.stringify({name:'Room 12',teacher:'Ms. Lee',_at:Date.now(),tasks:[],
            goal:{kind:'right',need:500,reward:'Pajama day',start:addDays(-2),end:addDays(4),ts:1},goalHave:120}));save();renderMap()""")
        pg.wait_for_timeout(500)
        t = pg.inner_text('#classCard')
        c.ok(pg.is_visible('#classCard') and 'Class quest' in t and '120 of 500' in t and 'Pajama day' in t and 'You added 15' in t, f'{w}: the class quest on the map: {t[:160]}')
        c.ok(not pg.evaluate("ovOpen"), f'{w}: no celebration before the goal')
        pg.evaluate("const k=JSON.parse(localStorage.getItem('pip-class-C1'));k.goalHave=505;k._at=Date.now();localStorage.setItem('pip-class-C1',JSON.stringify(k));renderMap()")
        pg.wait_for_timeout(2600)
        c.ok(pg.evaluate("ovOpen") and 'Your class did it!' in pg.text_content('#ocard') and 'Pajama day' in pg.text_content('#ocard'), f'{w}: a celebration when the class gets there')
        pg.evaluate("closeOverlay();renderMap()"); pg.wait_for_timeout(2400)
        c.ok(not pg.evaluate("ovOpen") and 'Class quest complete!' in pg.inner_text('#classCard'), f'{w}: the celebration comes once')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()

    # the teacher starts and stops a quest
    today = None
    store = {'users/T1': {'consentAt': '2026-10-01', 'consentVersion': 1, 'role': 'teacher', 'teacherName': 'Ms. Lee', 'pin': '', 'tours': {'desk': 1, 'class': 1}},
             'classes/C1': {'owner': 'T1', 'name': 'Room 12', 'teacher': 'Ms. Lee', 'pack': 'ca-4', 'code': 'ABC234', 'ts': 1, 'now': [], 'tasks': [], 'v': 1}}
    ctx, pg, errs = cloud_page(b, {'uid': 'T1', 'email': 'lee@school.test'}, store)
    pg.evaluate("""(()=>{const s=JSON.parse(localStorage.getItem('mock-store')),d=dayKey();
      s['classes/C1/members/P1_k1']={owner:'P1',kid:'k1',name:'Maya',pack:'ca-4',code:'ABC234',ts:Date.now(),sum:JSON.stringify({dd:{[d]:[10,20,14]}})};
      s['classes/C1/members/P2_k1']={owner:'P2',kid:'k1',name:'Leo',pack:'ca-4',code:'ABC234',ts:Date.now(),sum:JSON.stringify({dd:{[d]:[5,9,6]}})};
      localStorage.setItem('mock-store',JSON.stringify(s))})();renderTeach()""")
    until(pg, "!!document.querySelector('[data-tt=\"tasks\"],[data-cls=\"C1\"]')", 8000)
    if pg.locator('[data-cls="C1"]').count(): pg.click('[data-cls="C1"]'); pg.wait_for_timeout(600)
    pg.click('[data-tt="tasks"]'); pg.wait_for_timeout(1200)
    c.ok(pg.locator('.tquest #qGo').count() == 1, 'the teacher sees "Start the quest"')
    pg.fill('#qReward', 'Extra recess'); pg.click('#qGo'); pg.wait_for_timeout(1200)
    st = pg.evaluate("JSON.parse(localStorage.getItem('mock-store'))['classes/C1']")
    g = st.get('goal') or {}
    c.ok(g.get('kind') == 'right' and g.get('need', 0) > 0 and g.get('reward') == 'Extra recess' and g.get('start') and g.get('end') > g.get('start'), f'the quest is saved in the class: {g}')
    t = pg.inner_text('.tquest')
    c.ok('20 of' in t and '2 of 2 students added' in t, f"the teacher sees the class total from the students' summaries: {t[:200]}")
    c.ok(pg.evaluate("JSON.parse(localStorage.getItem('mock-store'))['classes/C1'].goalHave") == 20, 'the teacher view keeps the shared total fresh')
    pg.click('#qStop'); pg.wait_for_timeout(800)
    c.ok(pg.locator('#qNew').count() == 1 and 'Ended at' in pg.inner_text('.tquest'), 'stopping ends the quest')
    pg.click('#qNew'); pg.wait_for_timeout(800)
    c.ok(pg.locator('#qGo').count() == 1, 'and a new one can start')
    c.ok(not errs, f'teacher page errors {errs[:3]}')
    ctx.close()
c.done()
