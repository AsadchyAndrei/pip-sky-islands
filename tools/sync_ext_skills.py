"""Adds the extra question types from js/math3x.js / js/math5x.js (X3.<gen> / X5.<gen> lists) to the skills in
content/skills/math.json. Each entry's sk names an existing skill, or 'id|Name|CODE CODE' for a new one.
The type number of an entry is the generator's own count (extGen(gen, N, ...) in js/islands.js) plus its position.
Run it after changing those lists, then tools/build_content.py."""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
isl = (ROOT / 'js/islands.js').read_text()
path = ROOT / 'content/skills/math.json'
data = json.loads(path.read_text())
L = data['skills']
skills = {s['id']: s for s in L}
for fn, var in [('js/math3x.js', 'X3'), ('js/math5x.js', 'X5')]:
    f = ROOT / fn
    if not f.exists():
        continue
    src = f.read_text()
    starts = [(m.start(), m.group(1)) for m in re.finditer(r'^' + var + r'\.(\w+)=\[', src, re.M)]
    for k, (pos, gen) in enumerate(starts):
        body = src[pos:starts[k + 1][0] if k + 1 < len(starts) else len(src)]
        n = int(re.search(gen + r':\{gen:extGen\(\w+,(\d+),' + var, isl).group(1))
        sks = re.findall(r"\{sk:'([^']+)'", body)
        # drop old extension types of this generator, then add them again
        for s in skills.values():
            if s['src'].get('gen') == gen and 'types' in s['src']:
                s['src']['types'] = [t for t in s['src']['types'] if t < n]
        for i, sk in enumerate(sks):
            sid, *rest = sk.split('|')
            if sid not in skills:
                name, codes = rest
                grade = int(gen[-1])
                skills[sid] = {'id': sid, 'name': name, 'grade': grade, 'std': codes.split(), 'src': {'gen': gen, 'types': []}}
                last = max(i for i, s in enumerate(L) if s['src'].get('gen') == gen)
                L.insert(last + 1, skills[sid])
            skills[sid]['src']['types'].append(n + i)
        for s in skills.values():
            if s['src'].get('gen') == gen and 'types' in s['src']:
                s['src']['types'] = sorted(set(s['src']['types']))
out = '{"subject": ' + json.dumps(data['subject']) + ',\n "skills": [\n' + ',\n'.join('  ' + json.dumps(x, ensure_ascii=False) for x in L) + '\n ]\n}\n'
path.write_text(out)
print('ok')
# every pack island that uses one of these generators lists all of its skills
gens = {s['src'].get('gen') for s in L}
for pf in sorted((ROOT / 'content/packs').glob('*.json')):
    txt = pf.read_text(); pk = json.loads(txt); changed = False
    for il in pk['islands']:
        g = il.get('gen')
        if not g or 'skills' not in il:
            continue
        want = [s['id'] for s in L if s['src'].get('gen') == g]
        extra = [x for x in want if x not in il['skills']]
        if extra:
            il['skills'] += extra; changed = True
            txt = re.sub(r'("skills":\s*\[)([^\]]*)(\],\s*"gen":\s*"' + g + '")', lambda m: m.group(1) + ', '.join(json.dumps(x) for x in il['skills']) + m.group(3), txt)
    if changed:
        pf.write_text(txt); print('pack', pf.name)
