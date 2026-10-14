"""Shared helpers for checks that use the stand-in cloud (tests/mock_cloud.js)."""
import json, pathlib
from serve import router, ORIGIN

MOCK = (pathlib.Path(__file__).parent / 'mock_cloud.js').read_text()


def cloud_page(b, user, store, w=1100):
    ctx = b.new_context(viewport={'width': w, 'height': 900}, service_workers='block')
    ctx.route('**/*', router)
    ctx.add_init_script("if(!sessionStorage.getItem('seed')){localStorage.clear();localStorage.setItem('mock-user'," + json.dumps(json.dumps(user))
                        + ");localStorage.setItem('mock-store'," + json.dumps(json.dumps(store)) + ");sessionStorage.setItem('seed','1')}" + MOCK)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e) + ' ' + str(e.stack)[:300]))
    pg.goto(ORIGIN)
    pg.wait_for_function("typeof curScreen!=='undefined' && (curScreen==='kids'||curScreen==='teach'||!!document.querySelector('#pinbox'))", timeout=30000)
    return ctx, pg, errs


def until(pg, js, ms=5000):
    pg.wait_for_function(js, timeout=ms)
