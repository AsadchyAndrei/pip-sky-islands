"""The day streak: days in a row with at least one finished round anywhere (not only the Daily Challenge).
Old days (before rounds were counted) count if any puzzle was answered, so a running streak carries over;
an answered puzzle without a finished round does not count from now on; a gap resets it; 3 and 7 days give the badges."""
import datetime
from serve import *
c = Check('day streak')
with sync_playwright() as p:
    b = launch(p)
    ctx, pg, errs = open_page(b, 1280, 900, pack='ca-4')
    pill = lambda: pg.evaluate("updateStats();+document.querySelector('#streakPill span').textContent")
    # a running streak from before the change: answered puzzles on the 3 days before 2026-10-21
    pg.evaluate("G.days={};G.badges=(G.badges||[]).filter(x=>x!=='daily3'&&x!=='daily7');['2026-10-18','2026-10-19','2026-10-20'].forEach(k=>G.days[k]={sec:300,q:12,c:10})")
    pg.clock.set_fixed_time(datetime.datetime(2026, 10, 21, 10))
    c.ok(pill() == 3, f'old days carry over: {pill()}')
    pg.evaluate("today().q=4")
    c.ok(pill() == 3, 'answering a few puzzles without finishing a round does not add today')
    pg.evaluate("start(byId('mult'));finishRound()"); pg.wait_for_timeout(400)
    c.ok(pill() == 4, f'a finished island round adds today: {pill()}')
    c.ok(pg.evaluate("G.days[dayKey()].r") == 1, 'the round is counted once')
    c.ok(pg.evaluate("(G.badges||[]).includes('daily3')") or pg.evaluate("JSON.stringify(G).includes('daily3')"), '3 days in a row gives the badge')
    # one rest day a week keeps the streak; rest days are not counted; two days off break it
    pg.evaluate("G.days={};['2026-10-15','2026-10-17','2026-10-18','2026-10-20'].forEach(k=>G.days[k]={sec:300,q:12,c:10});G.days['2026-10-21']={sec:300,q:6,c:5,r:1}")
    c.ok(pill() == 5, f'a rest day in each week keeps it going: {pill()}')
    pg.evaluate("delete G.days['2026-10-17']")
    c.ok(pill() == 3, f'two days off in a row end it: {pill()}')
    pg.evaluate("G.days['2026-10-17']={sec:300,q:12,c:10};delete G.days['2026-10-20']")
    c.ok(pill() == 1, f'a second rest day in the same week ends it: {pill()}')
    pg.evaluate("G.days['2026-10-20']={sec:300,q:12,c:10};delete G.days['2026-10-19'];delete G.days['2026-10-18']")
    # tomorrow, before playing: still shows the run up to yesterday
    pg.clock.set_fixed_time(datetime.datetime(2026, 10, 22, 10))
    c.ok(pg.evaluate("dayKey()") == '2026-10-22', 'the clock moved to the next day')
    c.ok(pill() == 2, f'next morning it still shows the streak until a round is finished: {pill()}')
    # the morning after a rest day the streak is still shown (one rest day this week is still free)
    pg.clock.set_fixed_time(datetime.datetime(2026, 10, 24, 10))
    c.ok(pill() == 0, f'two days off: gone ({pill()})')
    pg.clock.set_fixed_time(datetime.datetime(2026, 10, 23, 10))
    c.ok(pill() == 2, f'one day off: still there before playing ({pill()})')
    c.ok(not errs, f'page errors {errs[:3]}')
    ctx.close(); b.close()
c.done()
