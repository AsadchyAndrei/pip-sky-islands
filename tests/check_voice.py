"""Pip's own voice (js/voice.js): everyday lines come from the pack in voice/, anything else from the server (faked here);
names never leave the device; the device voice takes over when the server fails, offline, or when a parent picks it."""
import io, json, math, pathlib, struct, wave
from serve import *
c = Check("Pip's voice")
TTS = 'https://us-central1-pip-sky-islands.cloudfunctions.net/tts'
STUB = "window.__said=[];if(window.speechSynthesis){speechSynthesis.speak=u=>__said.push(u.text);speechSynthesis.cancel=()=>{}}"
buf = io.BytesIO(); w = wave.open(buf, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(8000)
w.writeframes(b''.join(struct.pack('<h', int(3000 * math.sin(i / 5))) for i in range(1600))); w.close()
WAV = buf.getvalue()
PACK = json.loads((SITE / 'voice' / 'pack.json').read_text())['lines']
c.ok(all((SITE / 'voice' / f).is_file() for f in PACK.values()), f'every line in the pack has its file ({len(PACK)} lines)')

with sync_playwright() as p:
    b = launch(p)
    ctx, pg, errs = open_page(b, 390, 900)
    asked, mode = [], {'tts': 'ok'}
    def tts(r):
        from urllib.parse import urlparse, parse_qs
        asked.append(parse_qs(urlparse(r.request.url).query).get('t', [''])[0])
        if mode['tts'] == 'ok': r.fulfill(body=WAV, content_type='audio/mpeg', headers={'Access-Control-Allow-Origin': '*'})
        else: r.fulfill(status=503, body='busy', headers={'Access-Control-Allow-Origin': '*'})
    ctx.route(TTS + '*', tts)
    pg.evaluate(STUB)
    pg.evaluate("G.settings.pv=true;save(true)")
    # names out
    t = pg.evaluate("pvText('Great job, Alisa! You did it.')")
    c.ok(t == 'Great job! You did it.', f'the player\'s name is taken out: {t}')
    t = pg.evaluate("S={chal:{n:'Leo'}};const r=pvText(\"Leo's challenge! 6 puzzles. Leo got 5. Let's go, Alisa!\");S=null;r")
    c.ok(t == "your friend's challenge! 6 puzzles. your friend got 5. Let's go!", f'a friend\'s name becomes "your friend": {t}')
    c.ok(pg.evaluate("pvText('Alisa, look! Hi Alisa.')") == 'look! Hi.', 'a name at the start and the end')
    # a question goes to the server, without the name
    pg.evaluate("__said=[];speak('Alisa, a school bus holds <b>49</b> students. How many ride in 9 buses?',{user:true})"); pg.wait_for_timeout(900)
    c.ok(asked[-1:] == ['a school bus holds 49 students. How many ride in 9 buses?'] and not pg.evaluate("__said.length"), f'a question is read by the server voice, no name: {asked[-1:]}')
    c.ok(pg.evaluate("pvBusy()||PV.buf.size>0"), 'the audio is played')
    # a long passage goes in pieces of a few sentences
    n = len(asked); long = ' '.join(f'Sentence number {i} is part of a long reading passage about sea otters.' for i in range(30))
    pg.evaluate(f"stopSpeak();speak({json.dumps(long)},{{user:true}})"); pg.wait_for_timeout(2500)
    parts = asked[n:]
    c.ok(len(parts) >= 2 and all(len(x) <= 500 for x in parts) and parts[0].startswith('Sentence number 0'), f'a long text is read in pieces: {len(parts)} pieces')
    pg.evaluate("stopSpeak()")
    # a line from the pack does not ask the server
    if PACK:
        line = next(iter(PACK)); n = len(asked)
        pg.evaluate(f"stopSpeak();speak({json.dumps(line)},{{user:true}})"); pg.wait_for_timeout(700)
        c.ok(len(asked) == n and not pg.evaluate("__said.length"), f'a pack line plays from the game files: {line}')
        c.ok(pg.evaluate("YES.every(x=>!!PV.pack[pvText(htmlToSpeech(x))])"), 'all the praise lines are in the pack')
    # the server fails: the device voice reads it, and the server is left alone for a minute
    mode['tts'] = 'down'; pg.evaluate("stopSpeak();__said=[];speak('What is 7 times 8?',{user:true})"); pg.wait_for_timeout(900)
    c.ok(pg.evaluate("__said") == ['What is 7 times 8?'], f'server down: the device voice reads it: {pg.evaluate("__said")}')
    n = len(asked); pg.evaluate("__said=[];speak('What is 6 times 8?',{user:true})"); pg.wait_for_timeout(300)
    c.ok(len(asked) == n and pg.evaluate("__said") == ['What is 6 times 8?'], 'and the next one goes straight to the device voice')
    # offline
    mode['tts'] = 'ok'; pg.evaluate("PV.down=0"); ctx.set_offline(True); n = len(asked)
    pg.evaluate("__said=[];speak('What is 9 times 8?',{user:true})"); pg.wait_for_timeout(300)
    c.ok(len(asked) == n and pg.evaluate("__said") == ['What is 9 times 8?'], 'offline: the device voice')
    ctx.set_offline(False)
    # the parent picks a device voice in the settings
    pg.evaluate("CL.unlockUntil=Date.now()+600000;openParent()"); pg.wait_for_timeout(500)
    pg.evaluate("typeof pTabGo==='function'&&pTabGo('set')()"); pg.wait_for_timeout(400)
    has = pg.evaluate("!!document.querySelector('#setVoice option[value=__pip]')&&document.querySelector('#setVoice').value")
    c.ok(has == '__pip', f"Pip's own voice is the first choice in the settings: {has}")
    c.ok(not pg.is_visible('#vstyleRow'), 'the voice style is hidden for Pip\'s own voice')
    pg.select_option('#setVoice', ''); pg.wait_for_timeout(300)
    c.ok(pg.evaluate("G.settings.pv") is False and pg.is_visible('#vstyleRow'), 'a device voice can be picked')
    n = len(asked); pg.evaluate("__said=[];speak('What is 4 times 8?',{user:true})"); pg.wait_for_timeout(300)
    c.ok(len(asked) == n and pg.evaluate("__said") == ['What is 4 times 8?'], 'with a device voice nothing goes to the server')
    c.ok(not errs, f'page errors {errs[:3]}')
    b.close()
c.done()
