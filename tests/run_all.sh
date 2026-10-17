#!/usr/bin/env bash
# Runs every check. Exit code is not 0 if anything fails. Needs: pip install playwright && playwright install chromium
set -e
cd "$(dirname "$0")"
python3 ../tools/build_content.py --check
python3 check_load.py
python3 check_questions.py
python3 check_interactions.py
python3 check_packs.py
python3 check_classes.py
python3 check_tests.py
python3 check_banks.py
python3 check_newplayer.py
python3 check_roles.py
python3 check_family.py
python3 check_server_ui.py
python3 check_tour.py
python3 check_demo.py
python3 check_guest.py
python3 check_unlock.py
python3 check_alive.py
python3 check_quest.py
python3 check_challenge.py
python3 check_es.py
python3 check_audio.py
echo "All checks passed."
