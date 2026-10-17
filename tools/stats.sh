#!/usr/bin/env bash
# Anonymous usage counts (stats/{day} in Firestore, written by the stat function): the last 21 days as a table.
# Run by .github/workflows/stats.yml with the deployer's Google credentials.
set -euo pipefail
TOK=$(gcloud auth print-access-token)
curl -sS -H "Authorization: Bearer $TOK" "https://firestore.googleapis.com/v1/projects/pip-sky-islands/databases/(default)/documents/stats?pageSize=60" > /tmp/stats.json
python3 - <<'PY'
import json
d=json.load(open('/tmp/stats.json')).get('documents',[])
rows=[]
for doc in d:
    day=doc['name'].rsplit('/',1)[1]
    for g,v in doc.get('fields',{}).items():
        f={k:int(x.get('integerValue',0)) for k,x in v.get('mapValue',{}).get('fields',{}).items()}
        rows.append((day,g,f))
rows.sort(reverse=True)
out=['day        grade players back rounds done  qs  first% missions golden% wonders mastered voice']
for day,g,f in rows[:60]:
    G=lambda k:f.get(k,0)
    out.append(f"{day} {g:5} {G('players'):7} {G('returning'):4} {G('rounds'):6} {G('finished'):4} {G('qs'):4} {round(100*G('first')/max(1,G('qs'))):6}% {G('missions'):8} {round(100*G('golds')/max(1,G('missions')*6)):6}% {G('wonders'):7} {G('mastered'):8} {G('voice'):5}")
print('\n'.join(out))
print('::notice title=usage::'+'%0A'.join(out[:25]))
PY
