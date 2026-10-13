"""Shared Playwright setup for the checks: serves the game from this repo on a fake origin, in guest mode,
with a seeded test profile. Fonts: if tests/fonts/ has the brand fonts they are used, otherwise the browser's own."""
import json, mimetypes, pathlib, sys
from playwright.sync_api import sync_playwright

SITE = pathlib.Path(__file__).resolve().parent.parent
FONTS = pathlib.Path(__file__).resolve().parent / 'fonts'
ORIGIN = 'https://pip.test/'
PROFILE = {'name': 'Alisa', 'coins': 7089, 'xp': 0, 'placed': 1, 'greeted': '', 'dstreak': 6,
           'story': {'ch': 4, 'seen': {}}, 'settings': {'goal': 'min20', 'sv': 2}}
FONT_CSS = """
@font-face{font-family:'Baloo 2';font-weight:400 800;src:url(https://fonts.local/baloo2.ttf)}
@font-face{font-family:'Lilita One';src:url(https://fonts.local/lilita.ttf)}
@font-face{font-family:'Lexend';font-weight:100 900;src:url(https://fonts.local/lexend.ttf)}"""


def router(r):
    u = r.request.url
    if u.startswith(ORIGIN):
        p = u[len(ORIGIN):].split('?')[0] or 'index.html'
        if p == 'firebase-config.js':
            return r.fulfill(body="window.PIP_FIREBASE_CONFIG={apiKey:'PASTE_KEY'};", content_type='text/javascript')
        f = SITE / p
        if f.is_file():
            return r.fulfill(body=f.read_bytes(), content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')
        return r.fulfill(status=404, body='')
    if 'fonts.googleapis.com' in u:
        return r.fulfill(body=FONT_CSS if FONTS.is_dir() else '', content_type='text/css')
    if u.startswith('https://fonts.local/') and FONTS.is_dir():
        f = FONTS / u.rsplit('/', 1)[1]
        if f.is_file():
            return r.fulfill(body=f.read_bytes(), content_type='font/ttf')
    return r.abort()


def launch(p):
    return p.chromium.launch(args=['--font-render-hinting=none'])


def open_page(browser, w=1280, h=900, big=False):
    """A page with Alisa's test profile (level 12, 48 stars), already on the map."""
    ctx = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1, is_mobile=w < 700, has_touch=True,
                              service_workers='block')
    ctx.route('**/*', router)
    prof = dict(PROFILE); prof['settings'] = dict(prof['settings'], big=big)
    root = {'profiles': {'a': prof}, 'current': 'a', 'pin': '', 'ts': 1}
    ctx.add_init_script(f"try{{if(!sessionStorage.getItem('seeded')){{localStorage.setItem('pip-sky-islands-v3',{json.dumps(json.dumps(root))});"
                        f"sessionStorage.setItem('seeded','1')}}}}catch(e){{}}"
                        "Math.random=(()=>{let s=12345;return()=>{s=(s*16807)%2147483647;return (s-1)/2147483646}})();")
    page = ctx.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(ORIGIN)
    page.wait_for_function("typeof selectKid==='function' && document.querySelector('#kids') && !document.querySelector('#kids').hidden", timeout=30000)
    page.evaluate("""()=>{selectKid('a');
      G.xp=LV[11]+40;const ids=STAR_ISLANDS.filter(i=>i.gen).map(i=>i.id);let n=0;for(const id of ids){if(n>=48)break;const s=Math.min(3,48-n);G.best[id]=s;n+=s}
      G.lastDaily='';G.greeted=dayKey();save(true);renderMap();window.scrollTo(0,0)}""")
    page.wait_for_timeout(300)
    return ctx, page, errors


class Check:
    """Collects failures; exit code 1 if any."""
    def __init__(self, name):
        self.name, self.fails = name, []
    def ok(self, cond, msg):
        if not cond:
            self.fails.append(msg)
        return cond
    def done(self):
        if self.fails:
            print(f'FAIL {self.name}: {len(self.fails)} problem(s)')
            for f in self.fails[:40]:
                print('  -', f)
            sys.exit(1)
        print(f'OK   {self.name}')
