"""Spanish help for English learners (js/eshelp.js, js/esdata.js, es-review.html):
- every Spanish line keeps the numbers and names of its English line (placeholders match);
- nearly every hint the math, science and riddle islands make (new seeds, every grade) has a full Spanish version;
- in a round: the "Pista en español" button only with the setting on and only in math/science, the Spanish hint,
  dotted key words with their Spanish meaning, the Spanish line under the English hint after a miss;
- reading and grammar islands never show it; the teacher's class switch turns it on;
- Parents' Corner has the switch; the review page lists every line and copies corrections.
Run: python3 tests/check_eshelp.py"""
import json, re
from serve import *
c = Check('spanish help')
D = json.loads((SITE / 'content' / 'es' / 'hints.json').read_text())
GL = json.loads((SITE / 'content' / 'es' / 'glossary.json').read_text())
bad = []
for en, es in D.items():
    n = en.count('#')
    if re.search(r'\{\d+\}', es):
        if '#' in es or max(int(x) for x in re.findall(r'\{(\d+)\}', es)) >= n: bad.append(en)
    elif es.count('#') != n: bad.append(en)
    if es.count('@') != en.count('@') or re.findall(r'<[^>]+>', en) != re.findall(r'<[^>]+>', es): bad.append(en)
    if not es.strip(): bad.append(en)
c.ok(not bad, f'{len(D)} hint lines keep their numbers, names and tags: {bad[:5]}')
c.ok(len(GL) > 200 and all(v.strip() for v in GL.values()), f'{len(GL)} key words, none empty')

COV = r"""()=>{const ok=i=>i.gen&&!i.retired&&(i.group==='math'||i.group==='time'||i.id==='science'||i.id==='riddle');let n=0,miss={};
for(const isl of ISLANDS.filter(ok)){const M=isl.types>40?2:25;
 for(let t=0;t<isl.types;t++)for(let d=1;d<=3;d++)for(let s=0;s<M;s++){let q;try{q=makeQ(isl,t,31e5+s*53+t*17+d,d)}catch(e){continue}
  if(!q||!q.hint)continue;n++;if(esText(q.hint)==null){const k=esMissing(q.hint)[0];miss[k]=(miss[k]||0)+1}}}
for(const L of LESSONS.filter(L=>{const i=byId(L.isl);return i&&ok(i)&&ISLANDS.some(x=>x.genKey===(L.gen||L.isl))}))for(let k=0;k<6;k++){let it;try{it=L.build()}catch(e){break}
 it.forEach(q=>{if(!q.hint)return;n++;if(esText(q.hint)==null){const k=esMissing(q.hint)[0];miss[k]=(miss[k]||0)+1}})}
return JSON.stringify({n,miss})}"""
with sync_playwright() as p:
    b = launch(p)
    for pack in ('ca-3', 'ca-4', 'ca-5', 'us-4'):
        ctx, pg, errs = open_page(b, 800, 600, pack=pack)
        r = json.loads(pg.evaluate(COV))
        m = sum(r['miss'].values())
        print(f"     {pack}: {r['n']} hints, {m} without Spanish")
        c.ok(r['n'] > 1000 and m <= r['n'] * 0.003, f"{pack}: {m} of {r['n']} hints have no Spanish yet: {list(r['miss'])[:6]}")
        ctx.close()

    # a round with Spanish help
    for w in (390, 1280):
        ctx, pg, errs = open_page(b, w, 900, pack='ca-4')
        pg.evaluate("G.settings.es=false;start(byId('mult'))"); pg.wait_for_timeout(500)
        c.ok(pg.evaluate("document.getElementById('esBtn').hidden"), f'{w}: no Spanish button with the setting off')
        pg.evaluate("stopTimers();show('map');G.settings.es=true;start(byId('mult'))"); pg.wait_for_timeout(500)
        q = pg.evaluate("S.qs[S.i].hint")
        c.ok(pg.is_visible('#esBtn'), f'{w}: the Spanish button shows in math')
        pg.click('#esBtn'); pg.wait_for_timeout(200)
        box = pg.text_content('#esBox')
        c.ok(pg.is_visible('#esBox') and 'Pista:' in box and 'todavía' not in box, f'{w}: a Spanish hint: {box[:90]} (EN: {re.sub("<[^>]+>","",q)[:60]})')
        pg.click('#esBtn'); pg.wait_for_timeout(100)
        c.ok(pg.evaluate("document.getElementById('esBox').hidden"), f'{w}: the button hides it again')
        # key words: a question about a fraction
        pg.evaluate("document.getElementById('prompt').innerHTML='What is the <b>perimeter</b> of the rectangle? Use the fractions.';esGloss(document.getElementById('prompt'))")
        ws = pg.evaluate("[...document.querySelectorAll('#prompt .esw')].map(e=>e.textContent+'='+e.dataset.es)")
        c.ok('perimeter=perímetro' in ws and 'rectangle=rectángulo' in ws and 'fractions=fracción' in ws, f'{w}: key words are dotted: {ws}')
        pg.click('#prompt .esw'); pg.wait_for_timeout(100)
        c.ok(pg.locator('.estip').count() == 1 and 'perímetro' in pg.text_content('.estip'), f'{w}: tapping shows the Spanish word')
        # science: a wrong answer shows the Spanish line under the English hint
        pg.evaluate("stopTimers();show('map');start(byId('science'))"); pg.wait_for_timeout(500)
        if pg.evaluate("!S.qs[S.i].kind&&Array.isArray(S.qs[S.i].choices)"):
            pg.evaluate("{const q=S.qs[S.i];const b=[...document.querySelectorAll('#choices .choice')].find(x=>x.dataset.v!==String(q.answer));b.click()}"); pg.wait_for_timeout(300)
            c.ok(pg.locator('#hint .eshint').count() == 1, f'{w}: Spanish under the English hint after a miss: {pg.text_content("#hint")[:120]}')
        # reading: never
        pg.evaluate("stopTimers();show('map');start(byId('reading'))"); pg.wait_for_timeout(500)
        c.ok(pg.evaluate("document.getElementById('esBtn').hidden") and pg.locator('#prompt .esw').count() == 0, f'{w}: no Spanish help in reading')
        # the teacher's class switch
        pg.evaluate("stopTimers();show('map');G.settings.es=false;G.cls={cid:'c1',name:'Room 5'};localStorage.setItem('pip-class-c1',JSON.stringify({name:'Room 5',es:true,_at:Date.now()}))")
        c.ok(pg.evaluate("esOn()"), f'{w}: on when the class has it on')
        pg.evaluate("localStorage.setItem('pip-class-c1',JSON.stringify({name:'Room 5',_at:Date.now()}))")
        c.ok(not pg.evaluate("esOn()"), f'{w}: off when neither has it')
        pg.evaluate("delete G.cls;CL.unlockUntil=Date.now()+600000;openParent()"); pg.wait_for_timeout(500)
        pg.evaluate("typeof pTabGo==='function'&&pTabGo('set')()"); pg.wait_for_timeout(300)
        c.ok(pg.locator('#setEs').count() == 1, f"{w}: the switch is in Parents' Corner")
        pg.click('#setEs'); pg.wait_for_timeout(100)
        c.ok(pg.evaluate("G.settings.es===true"), f'{w}: the switch turns it on')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()

    # the review page
    ctx = b.new_context(viewport={'width': 390, 'height': 900}, service_workers='block')
    ctx.route('**/*', router); pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(ORIGIN + 'es-review.html'); pg.wait_for_timeout(600)
    c.ok(pg.locator('#rows li').count() == 150 and str(len(D)) in pg.text_content('#prog'), f'review: lists the hints ({pg.text_content("#prog")})')
    pg.fill('#q', 'denominador'); pg.wait_for_timeout(200)
    n = pg.locator('#rows li').count()
    c.ok(0 < n < 30, f'review: search finds {n} lines')
    pg.click('#rows li:first-child .f'); pg.fill('#rows li:first-child textarea', 'Mi versión corregida'); pg.wait_for_timeout(100)
    pg.click('#rows li:nth-child(2) .o')
    c.ok('2 de' in pg.text_content('#prog'), f'review: progress counts: {pg.text_content("#prog")}')
    pg.click('[data-tab="g"]'); pg.wait_for_timeout(200)
    c.ok(str(len(GL)) in pg.text_content('#prog'), 'review: the key words tab')
    pg.fill('#who', 'Ms. Prueba'); pg.click('#copy'); pg.wait_for_timeout(300)
    out = pg.input_value('#out')
    c.ok('Mi versión corregida' in out and 'Ms. Prueba' in out and 'Correcciones: 1' in out, f'review: corrections are copied: {out[:160]}')
    pg.reload(); pg.wait_for_timeout(500)
    c.ok('2 de' in pg.text_content('#prog'), 'review: the work is kept in the browser')
    c.ok(pg.evaluate("document.documentElement.scrollWidth<=window.innerWidth+1"), 'review: no sideways scroll on a phone')
    c.ok(not errs, f'review: page errors {errs[:3]}')
    ctx.close(); b.close()
c.done()
