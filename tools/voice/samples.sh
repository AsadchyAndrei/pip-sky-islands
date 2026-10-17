#!/usr/bin/env bash
# Voice samples for choosing Pip's voice (Google Cloud Text-to-Speech, Chirp 3 HD voices).
# Run by .github/workflows/voice.yml with the deployer's Google credentials; the MP3s go to the voice-samples branch.
set -euo pipefail
P=pip-sky-islands
gcloud services enable texttospeech.googleapis.com --project "$P" --quiet
TOK=$(gcloud auth print-access-token)
H=(-H "Authorization: Bearer $TOK" -H "x-goog-user-project: $P" -H "Content-Type: application/json")
mkdir -p out
curl -sS "${H[@]}" "https://texttospeech.googleapis.com/v1/voices?languageCode=en-US" | python3 -c "import json,sys;v=json.load(sys.stdin).get('voices',[]);print('\n'.join(sorted(x['name']+' '+x['ssmlGender'] for x in v if 'Chirp3-HD' in x['name'])))" > out/chirp3_voices.txt
cat out/chirp3_voices.txt
TEXT="Hi Alisa! I'm Pip, a balloon-flying fox! Let's solve some puzzles together. ... Woo-hoo! Nailed it! ... Hmm, not quite. Peek at the hint! ... Whoosh! A gust of wind pushed my balloon away! ... A school bus holds 49 students. How many students ride in 9 full buses?"
for V in ${VOICES:-Puck Fenrir Leda Zephyr}; do
  NAME="en-US-Chirp3-HD-$V"
  grep -q "^$NAME " out/chirp3_voices.txt || { echo "::warning::no voice $NAME"; continue; }
  python3 - "$NAME" "$TEXT" > "$RUNNER_TEMP/body.json" <<'PY'
import json,sys
print(json.dumps({"input":{"text":sys.argv[2]},"voice":{"languageCode":"en-US","name":sys.argv[1]},"audioConfig":{"audioEncoding":"MP3","speakingRate":1.0}}))
PY
  curl -sS "${H[@]}" -X POST -d @"$RUNNER_TEMP/body.json" "https://texttospeech.googleapis.com/v1/text:synthesize" | python3 -c "import json,sys,base64;d=json.load(sys.stdin);
assert 'audioContent' in d, d
open('out/pip_voice_'+sys.argv[1]+'.mp3','wb').write(base64.b64decode(d['audioContent']))" "$V"
  echo "made $V"
done
ls -la out
