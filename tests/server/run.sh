#!/usr/bin/env bash
# Server tests: email logic in plain Node, then rules and functions against the Firebase emulators.
set -e
cd "$(dirname "$0")/../.."
node tests/server/lib_test.js
(cd functions && npm install --no-audit --no-fund --silent)
(cd tests/server && npm install --no-audit --no-fund --silent)
npx --yes firebase-tools@14 emulators:exec --only firestore,auth --project pip-sky-islands "node tests/server/run.js"
