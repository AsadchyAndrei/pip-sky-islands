# Content: standards, skills and packs

The islands and skills a child sees are data, not code. Everything here is plain JSON; the game reads it from
`js/content.js`, which `tools/build_content.py` builds from these files.

```
content/
  standards/ca-4.json    standards of one state and grade: code, subject, plain-English summary
  skills/math.json       the skill library, shared by every state (also ela, science, social)
  packs/ca-4.json        what a California 4th grader sees: islands in map order and the skills on each
  reports/ca-4-coverage.md   built: which standards the pack covers and which it does not
```

## How the pieces fit

- A **standard** is what the state expects by the end of the year (`4.NF.3`, `RL.4.2`, `4-PS4-1`, `HSS.4.3`).
  `app: false` marks standards a game cannot check on its own (group discussion, presentations); `review: true`
  marks standards from another grade practiced for review. Neither counts toward coverage.
- A **skill** is one thing a child practices (`math.frac.adding-and-subtracting-fractions`). It lists the standards
  it practices (`std`) and where its questions come from (`src`): a question generator (`gen`, the same name as the
  island) plus either its question `types`, or a selector (`sel`) for islands whose questions come from a bank.
  A skill id never changes: children's progress is saved under it. `legacy` is the old key progress was saved under.
- A **pack** is one state and grade. Its islands keep the look of the map (name, color, landmark) and list skills
  from the library. Special islands (daily challenge, test practice, boss) have no skills.

## Adding or changing content

1. Edit the JSON.
2. Run `python3 tools/build_content.py`. It checks the data (unknown standards, missing skills, a skill on two islands,
   ids used twice), rebuilds `js/content.js` and the coverage report.
3. Run `tests/run_all.sh`, then commit the JSON together with the rebuilt files. The checks on GitHub fail if the
   built files are out of date.

## Adding a state

1. Add `standards/<state>-<grade>.json` from the state's official standards (keep the source link in `sets`).
2. Add `packs/<state>-<grade>.json`: reuse library skills where the standard is the same, add new skills where it is not.
3. Read the coverage report and close the gaps before the pack goes live.
