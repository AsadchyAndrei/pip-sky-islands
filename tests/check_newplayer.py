"""Adding a player asks for the state and grade; the new player starts in that grade's islands, no second "Who's playing?"."""
from serve import *
c = Check('new player picks a grade')
with sync_playwright() as p:
    b = launch(p)
    ctx, pg, errs = open_page(b, 390, 900)
    pg.evaluate("newPlayer(id=>selectKid(id))"); pg.wait_for_timeout(500)
    c.ok(pg.evaluate("document.getElementById('npState').value==='CA'&&document.getElementById('npGrade').value==='4'"), 'defaults to California, grade 4')
    c.ok(pg.evaluate("[...document.querySelectorAll('#npGrade option')].filter(o=>!o.disabled).map(o=>o.value).join()==='3,4,5'"), 'only ready grades can be picked')
    pg.fill('#nameIn', 'Tess'); pg.select_option('#npGrade', '3'); pg.click('#nameOk'); pg.wait_for_timeout(3500)
    r = pg.evaluate("[G.name,G.pack,PACK.id,document.body.dataset.screen]")
    c.ok(r == ['Tess', 'ca-3', 'ca-3', 'map'], f'after adding: {r}')
    c.ok(not errs, f'errors: {errs[:3]}')
    ctx.close()
c.done()
