#!/usr/bin/env bash
# Makes Pip's everyday lines (voice/lines.txt, from tools/voice/lines.py) as MP3s in Pip's voice, plus voice/pack.json.
# Run by .github/workflows/voice.yml (voices=pack); the files go to the voice-samples branch, then into voice/ in the repo.
set -euo pipefail
P=pip-sky-islands
VOICE=${PIP_VOICE:-en-US-Chirp3-HD-Puck}
gcloud services enable texttospeech.googleapis.com --project "$P" --quiet
export TOK=$(gcloud auth print-access-token) VOICE
mkdir -p out
python3 - <<'PY'
import base64, hashlib, json, os, urllib.request
voice, tok = os.environ['VOICE'], os.environ['TOK']
lines = [l for l in open('voice/lines.txt', encoding='utf-8').read().split('\n') if l.strip()]
pack = {}
for t in lines:
    f = hashlib.sha256(f'{voice}|1.0|{t}'.encode()).hexdigest()[:16] + '.mp3'
    body = json.dumps({'input': {'text': t}, 'voice': {'languageCode': 'en-US', 'name': voice}, 'audioConfig': {'audioEncoding': 'MP3', 'speakingRate': 1.0}}).encode()
    req = urllib.request.Request('https://texttospeech.googleapis.com/v1/text:synthesize', body, {'Authorization': 'Bearer ' + tok, 'x-goog-user-project': 'pip-sky-islands', 'Content-Type': 'application/json'})
    open('out/' + f, 'wb').write(base64.b64decode(json.load(urllib.request.urlopen(req))['audioContent']))
    pack[t] = f
json.dump({'voice': voice, 'lines': pack}, open('out/pack.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True)
print(len(pack), 'lines made')
PY
