#!/usr/bin/env python3
"""Build the game's content from content/ (the source of truth):

  content/standards/<id>.json   the standards of one state and grade (codes + plain-English summaries)
  content/skills/<subject>.json the skill library, shared by every state; each skill names its standards and
                                where its questions come from (a generator and its question types)
  content/packs/<state>-<grade>.json  the islands a child of that state and grade sees, in map order

Writes:
  js/content.js                       everything above as one script the game loads (do not edit by hand)
  content/reports/<pack>-coverage.md  which standards each pack covers, and which it does not

  python3 tools/build_content.py           build
  python3 tools/build_content.py --check   fail if the data is invalid or the built files are out of date (CI)
"""
import json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
C = ROOT / 'content'
OUT_JS = ROOT / 'js' / 'content.js'
SUBJECTS = {'math': 'Math', 'ela': 'English language arts', 'science': 'Science', 'social': 'History–social science'}
SELECTORS = {'reading.short', 'reading.long', 'reading.struct', 'reading.media', 'tag', 'r3.short', 'r3.long', 'r3.feat', 'r3.media', 'r5.short', 'r5.long', 'r5.feat', 'r5.media', 'all', 'bank', 'mod', 'gram.cat'}

errors = []
def err(msg): errors.append(msg)

def load(folder):
    return {p.stem: json.loads(p.read_text()) for p in sorted((C / folder).glob('*.json'))}

def base(code):
    """'L.4.1f' and 'RF.4.3a' count toward 'L.4.1' and 'RF.4.3'"""
    m = re.match(r'^(.*\d)[a-z]$', code)
    return m.group(1) if m else code

standards = load('standards')
skill_files = load('skills')
packs = load('packs')

skills = {}
legacy = {}
for subj, f in skill_files.items():
    if subj not in SUBJECTS: err(f'skills/{subj}.json: unknown subject')
    for s in f['skills']:
        sid = s.get('id', '')
        if not re.fullmatch(r'[a-z]+\.[a-z0-9]+\.[a-z0-9-]+', sid): err(f'skill id "{sid}": use subject.area.name in lowercase')
        if sid in skills: err(f'skill id "{sid}" is used twice')
        if not sid.startswith(subj + '.'): err(f'skill "{sid}" is in skills/{subj}.json but its id starts with another subject')
        for k in ('name', 'grade', 'std', 'src'):
            if k not in s: err(f'skill "{sid}": missing "{k}"')
        src = s.get('src', {})
        if 'gen' not in src: err(f'skill "{sid}": src needs "gen"')
        if ('types' in src) == ('sel' in src): err(f'skill "{sid}": src needs either "types" or "sel"')
        if 'sel' in src and src['sel'] not in SELECTORS: err(f'skill "{sid}": unknown selector "{src["sel"]}"')
        if s.get('legacy'):
            if s['legacy'] in legacy: err(f'legacy key "{s["legacy"]}" is used twice')
            legacy[s['legacy']] = sid
        s['subject'] = subj
        skills[sid] = s

std_codes = {}
for sid_, f in standards.items():
    codes = {}
    for st in f['standards']:
        if st['code'] in codes: err(f'standards/{sid_}.json: code {st["code"]} is listed twice')
        if st['subject'] not in SUBJECTS: err(f'standards/{sid_}.json: {st["code"]} has unknown subject')
        codes[st['code']] = st
    std_codes[sid_] = codes

reports = {}
for pid, p in packs.items():
    if p.get('id') != pid: err(f'packs/{pid}.json: "id" must be "{pid}"')
    if p.get('standards') not in standards: err(f'pack {pid}: standards "{p.get("standards")}" not found'); continue
    codes = std_codes[p['standards']]
    ids = [i['id'] for i in p['islands']]
    if len(set(ids)) != len(ids): err(f'pack {pid}: an island id is used twice')
    used = {}
    for isl in p['islands']:
        for sid in isl.get('skills', []):
            if sid not in skills: err(f'pack {pid}, island {isl["id"]}: skill "{sid}" is not in the library'); continue
            if sid in used: err(f'pack {pid}: skill "{sid}" is on two islands ({used[sid]} and {isl["id"]})')
            used[sid] = isl['id']
            g = isl.get('gen', isl['id'])
            if skills[sid]['src']['gen'] != g: err(f'pack {pid}: skill "{sid}" makes questions with "{skills[sid]["src"]["gen"]}" but island "{isl["id"]}" uses generator "{g}"')
            for c in skills[sid]['std']:
                if c not in codes and base(c) not in codes: err(f'pack {pid}: skill "{sid}" names standard {c}, which is not in standards/{p["standards"]}.json')
    # coverage
    by_std = {}
    for sid, iid in used.items():
        for c in skills[sid]['std']:
            by_std.setdefault(base(c) if base(c) in codes else c, []).append((iid, skills[sid]['name']))
    reports[pid] = (p, codes, by_std)

def report_md(p, codes, by_std):
    L = [f'# Standards coverage: {p["stateName"]}, grade {p["grade"]}' + (' (draft: not offered to players yet)' if p.get('status') == 'draft' else ''), '',
         f'Built by `tools/build_content.py` from `content/`. Do not edit by hand.', '',
         'A standard counts as covered when at least one skill on this pack\'s islands practices it. '
         'Standards a game cannot check on its own (group discussion, presentations, long writing projects) are listed but not counted.', '',
         '| Subject | Covered | Total | Coverage |', '| --- | --- | --- | --- |']
    total = [0, 0]
    rows = []
    for subj, title in SUBJECTS.items():
        S = [s for s in codes.values() if s['subject'] == subj and not s.get('review') and s.get('app', True)]
        cov = [s for s in S if s['code'] in by_std]
        total[0] += len(cov); total[1] += len(S)
        if S: rows.append(f'| {title} | {len(cov)} | {len(S)} | {round(100 * len(cov) / len(S))}% |')
    L += rows + [f'| **All** | **{total[0]}** | **{total[1]}** | **{round(100 * total[0] / max(1, total[1]))}%** |', '']
    for subj, title in SUBJECTS.items():
        S = [s for s in codes.values() if s['subject'] == subj]
        if not S: continue
        L += [f'## {title}', '', '| Standard | What it means | Status | Skills (island: skill) |', '| --- | --- | --- | --- |']
        for s in S:
            hits = by_std.get(s['code'], [])
            if s.get('review'): status = 'review from grade %s' % s.get('grade', '?')
            elif not s.get('app', True): status = 'not checked in the game'
            else: status = 'covered' if hits else '**not covered**'
            sk = '; '.join(f'{i}: {n}' for i, n in hits) or '—'
            L.append(f'| {s["code"]} | {s["summary"]} | {status} | {sk} |')
        L.append('')
    return '\n'.join(L), total

if errors:
    print('Content errors:'); [print(' -', e) for e in errors]; sys.exit(1)

def js_value(x): return json.dumps(x, ensure_ascii=False, separators=(',', ':'))
lib = {sid: {k: v for k, v in s.items()} for sid, s in skills.items()}
js = ('/* Generated by tools/build_content.py from content/. Do not edit: change the JSON in content/ and rebuild. */\n'
      'const CONTENT={\n'
      f'standards:{js_value({k: {"state": v["state"], "grade": v["grade"], "codes": {c: {"subject": s["subject"], "summary": s["summary"]} for c, s in std_codes[k].items()}} for k, v in standards.items()})},\n'
      f'skills:{js_value(lib)},\n'
      f'packs:{js_value(packs)}\n'
      '};\n')
outputs = {OUT_JS: js}
summary = []
for pid, (p, codes, by_std) in reports.items():
    md, total = report_md(p, codes, by_std)
    outputs[C / 'reports' / f'{pid}-coverage.md'] = md + '\n'
    summary.append(f'{pid}: {total[0]} of {total[1]} standards covered ({round(100 * total[0] / max(1, total[1]))}%)')

if '--check' in sys.argv:
    stale = [str(f.relative_to(ROOT)) for f, t in outputs.items() if not f.exists() or f.read_text() != t]
    if stale:
        print('Built files are out of date; run python3 tools/build_content.py and commit:', ', '.join(stale)); sys.exit(1)
    print('content ok;', '; '.join(summary))
else:
    for f, t in outputs.items():
        f.parent.mkdir(parents=True, exist_ok=True); f.write_text(t)
    print(f'{len(skills)} skills, {len(packs)} pack(s);', '; '.join(summary))
