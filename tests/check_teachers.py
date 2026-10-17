"""teachers.html: the 2-minute setup, a letter for families that fills in the teacher's name and class code (from the
link the teacher desk opens, or typed), in English, Spanish or both, and the 'what you will see' part."""
from serve import *
c = Check('teacher materials')
with sync_playwright() as p:
    b = launch(p)
    for w in (390, 1280):
        ctx = b.new_context(viewport={'width': w, 'height': 900}, service_workers='block'); ctx.route('**/*', router); pg = ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(ORIGIN + 'teachers.html?code=abc234&t=Ms.%20Rivera#letter'); pg.wait_for_timeout(600)
        t = pg.text_content('#letterBox')
        c.ok('ABC234' in t and t.rstrip().endswith('Ms. Rivera') and 'pipskyislands.com' in t, f'{w}: the letter is filled from the link')
        c.ok(pg.locator('#setup ol.steps li').count() == 4, f'{w}: four setup steps')
        pg.click('[data-l="es"]'); t = pg.text_content('#letterBox')
        c.ok('Estimadas familias' in t and 'ABC234' in t, f'{w}: Spanish letter')
        pg.click('[data-l="both"]'); t = pg.text_content('#letterBox')
        c.ok('Dear families' in t and 'Estimadas familias' in t, f'{w}: both languages')
        pg.fill('#fC', 'xyz789'); c.ok('XYZ789' in pg.text_content('#letterBox') and '<' not in pg.inner_html('#letterBox').replace('<span class="code">', '').replace('</span>', ''), f'{w}: typing a code updates the letter')
        pg.fill('#fT', '<b>Mr. K</b>'); c.ok('bMr. K/b' in pg.text_content('#letterBox'), f'{w}: names are cleaned')
        sw = pg.evaluate("document.documentElement.scrollWidth<=innerWidth")
        c.ok(sw, f'{w}: no sideways scroll')
        c.ok(not errs, f'{w}: page errors {errs[:3]}')
        ctx.close()
    b.close()
c.done()
