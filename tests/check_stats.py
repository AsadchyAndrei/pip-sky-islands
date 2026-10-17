"""Anonymous usage counts: rounds, first-try answers, missions... are counted on the device per day and grade and sent
as plain totals (no name, no id); never on test sites or in the demo; a parent sees missions in the week card."""
import json
from serve import *
c = Check('anonymous usage counts')
with sync_playwright() as p:
    b = launch(p)
    ctx, pg, errs = open_page(b, 1280, 900, pack='ca-4')
    sent = []
    ctx.route('https://us-central1-pip-sky-islands.cloudfunctions.net/stat', lambda r: (sent.append(r.request.post_data), r.fulfill(status=204, body='')))
    pg.evaluate("stat('rounds')"); c.ok(pg.evaluate("statLoad()") is None, 'nothing is counted on a test site')
    pg.evaluate("statOff=()=>false;G.statDay='';G.rounds=5;window.__tourTest=0;start(byId('place'))"); pg.wait_for_timeout(600)
    if pg.evaluate("typeof TR!=='undefined'&&TR.on"): pg.keyboard.press('Escape')
    pg.evaluate("judge(true,null)"); pg.wait_for_timeout(200)
    o = pg.evaluate("statLoad()")
    c.ok(o and o['g'] == 'ca-4' and o['c'].get('rounds') == 1 and o['c'].get('players') == 1 and o['c'].get('first') == 1 and o['c'].get('qs') == 1, f'counted on the device: {o}')
    pg.evaluate("statFlush()"); pg.wait_for_timeout(600)
    body = json.loads(sent[-1]) if sent else {}
    c.ok(set(body) == {'d', 'g', 'c'} and 'Alisa' not in json.dumps(body), f'only day, grade and totals are sent: {body}')
    c.ok(pg.evaluate("Object.keys(statLoad().c).length") == 0, 'the batch empties after sending')
    pg.evaluate("for(let i=0;i<S.qs.length;i++){S.i=i;missionAnswer('gold')}"); pg.wait_for_timeout(1500)
    pg.evaluate("ovOpen&&closeOverlay();show('map');CL.unlockUntil=Date.now()+600000;G.wrongLog=G.wrongLog||[];openParent()"); pg.wait_for_timeout(600)
    t = pg.text_content('#parent') or ''
    c.ok('Missions:' in t or (pg.evaluate("(G.msLog||[]).length") == 1), f'the mission is in the log for the parent card')
    c.ok(not errs, f'page errors {errs[:3]}')
    b.close()
c.done()
