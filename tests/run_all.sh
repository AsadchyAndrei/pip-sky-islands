#!/usr/bin/env bash
# Runs every check. Exit code is not 0 if anything fails. Needs: pip install playwright && playwright install chromium
set -e
cd "$(dirname "$0")"
python3 ../tools/build_content.py --check
python3 check_load.py
python3 check_questions.py
python3 check_interactions.py
echo "All checks passed."
