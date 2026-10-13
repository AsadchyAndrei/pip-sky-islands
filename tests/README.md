# Checks for Pip's Sky Islands

Run all of them before publishing:

```
pip install playwright && python3 -m playwright install chromium
tests/run_all.sh
```

| Script | What it checks |
|---|---|
| `check_load.py` | The game opens on a phone and a laptop with no JavaScript errors |
| `check_questions.py` | ~57,000 generated questions: answer is among the choices, no duplicate or equal-value choices, no `undefined`/`NaN`, every question type belongs to exactly one skill, "tap the sentence" matches exactly one sentence |
| `check_interactions.py` | Plays drag-and-drop, put in order, choose all, Part A/B, tap the sentence, Yes/No, a wrong answer, a practice test and a skill round on laptop and phone widths |

GitHub runs the same checks on every push (`.github/workflows/checks.yml`).
Brand fonts are optional: put `baloo2.ttf`, `lilita.ttf`, `lexend.ttf` in `tests/fonts/` to see screenshots with the real fonts.
