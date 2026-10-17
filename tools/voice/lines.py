"""Collects Pip's everyday lines (the ones that come with the game as MP3s, see js/voice.js) into voice/lines.txt.
The text of each line is exactly what the game would send for it (same cleaning, names removed), so it matches.
Then run the "voice" workflow with voices=pack to make the MP3s. Run: python3 tools/voice/lines.py"""
import pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / 'tests'))
from serve import *

ROOT_DIR = pathlib.Path(__file__).resolve().parents[2]
# Pip's lines written straight into say(...) calls: plain strings, or templates whose only fill-in is the name
SRC = ['js/play.js', 'js/progress.js', 'js/islands.js', 'js/math.js', 'js/alive.js', 'js/challenge.js']
lit = []
for f in SRC:
    s = (ROOT_DIR / f).read_text()
    for m in re.finditer(r"say\(\$\('#say'\),\s*(`[^`]*`|'(?:[^'\\]|\\.)*')", s):
        t = m.group(1)[1:-1].replace("\\'", "'")
        t = t.replace('${nm()}', '')
        if '${' not in t: lit.append(t)
    for m in re.finditer(r"pick\(\[([^\]]*)\]\)", s):
        lit += [x.replace("\\'", "'") for x in re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1)) if '${' not in x and x.strip()[-1:] in '.!?']

JS = """(lit)=>{const L=[...YES,...SECOND,...TRY,...NUDGE,...Object.values(COMBO_MSG),...lit];
  ['map','play'].forEach(k=>TOURS[k].steps.forEach(s=>L.push(s.t+'. '+s.x)));
  G.name='';const out=new Set();L.forEach(h=>{const t=pvText(htmlToSpeech(h));if(t&&/[a-z]/i.test(t))out.add(t)});return [...out]}"""
with sync_playwright() as p:
    b = launch(p)
    ctx, pg, errs = open_page(b)
    lines = pg.evaluate(JS, lit)
    b.close()
lines = sorted(set(lines))
(ROOT_DIR / 'voice').mkdir(exist_ok=True)
(ROOT_DIR / 'voice' / 'lines.txt').write_text('\n'.join(lines) + '\n')
print(len(lines), 'lines,', sum(map(len, lines)), 'characters')
