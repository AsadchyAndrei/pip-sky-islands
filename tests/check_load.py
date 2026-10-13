"""The game loads with no JavaScript errors, on a phone and on a laptop."""
from serve import *
c = Check('page loads without errors')
with sync_playwright() as p:
    b = launch(p)
    for w, h in [(390, 844), (1280, 900)]:
        ctx = b.new_context(viewport={'width': w, 'height': h}, service_workers='block'); ctx.route('**/*', router)
        pg = ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.goto(ORIGIN); pg.wait_for_timeout(3000)
        c.ok(not errs, f'{w}px: {errs[:3]}')
        ctx.close()
c.done()
