# Delegating tasks to Codex

Codex implements clearly defined tasks; Claude decides behavior, wording, design and contracts, briefs Codex, and
reviews. Workflow, levels and hard rules: the `codex-delegation` skill. This file holds what is specific to Fineliner.

The maintainer's choice (2026-11-03): `gpt-6.1-sol`, at `xhigh` for drawings and `high` for clearly specified code.
Codex is a good workhorse on defined tasks and weak on taste, so every drawing is reviewed large before it lands.

## Project traps (put these in every brief's setup and action_safety blocks)

- Dependencies in a worktree: `cmd /c mklink /J node_modules C:\CodexApp\naive-indie-line\node_modules`; never install.
- Build: Claude builds and previews. Codex renders drawings with
  `node skills/fineliner-drawings/scripts/render.mjs --module <its file> --ids … --out <file>.png`, which uses sharp and
  no browser; a new collection file renders through `--module` without being registered in `objects/index.ts`.
- Ports: 4790 (prototype), 4791 (dev), 4792 (preview), and 4793–4794 when the browser pane moves a server.
- Line endings: LF everywhere (`.gitattributes`), Prettier formats.
- Engine rules: no `Math.random`, `Date.now`, `**` or `Math.hypot` in `src/fineliner/pen`; files at 300 lines or fewer.
- Parallel runs: one collection file per run; Claude edits `objects/index.ts` and `library.ts` when merging.
- Passing the brief: the `codex:codex-rescue` wrapper sometimes fails to quote a long brief into the shell. If it does,
  create the worktree yourself, write the brief to the scratchpad and run
  `node <plugin>/scripts/codex-companion.mjs task --write --model gpt-6.1-sol --effort xhigh --prompt-file <brief>`
  from inside the worktree in the background.
- Verification policy: no unit tests; lasting tests only in `tests/consumer/`.

## Evidence

| Date       | Task                                                                                                                                                                       | Model, level       | Time                          | Result                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-03 | Wave 1 drawings, four collection files in parallel (post, household, pantry, market)                                                                                       | gpt-6.1-sol, xhigh | 15–25 min a round, 2–4 rounds | All 23 landed after Claude's review rounds. First drafts read as the thing in about half the objects; Codex's own render review missed composition problems (a tent-shaped vine, digits for stripes, a face in an oyster, a door that did not read open). Claude simplified two of its constructions on merge                                                 |
| 2026-11-03 | Collections split into registry items: file moves, entry modules, rooms out of the engine, registry groups, kit and site imports, takes loader, scripts, consumer fixtures | gpt-6.1-sol, xhigh | about 40 min, one question    | Correct and complete against the brief, 178 SVGs byte-identical; it stopped to ask when `table.ts` would have clashed with `ui/table.tsx`, and found four extras the brief had missed. Its review missed that Next.js renders client components from a second copy of the engine; Claude's consumer test caught it and moved the registries onto `globalThis` |

## Refused-command tally

Every command Codex was refused. Approval refusals ("blocked by policy") come from the plugin running Codex with
automatic approval set to never; sandbox errors come from its workspace limits. If refusals keep blocking checks that
matter, decide with the maintainer whether to loosen Codex's permissions or patch the plugin.

| Date | Task (model, level) | Refused command | Kind | Covered by |
| ---- | ------------------- | --------------- | ---- | ---------- |

| 2026-11-03 | collections split (gpt-6.1-sol, xhigh) | `npm run typecheck` | sandbox error: EPERM creating `node_modules/.astro/vite-sync` through the junction | Claude ran it: 0 errors |
| 2026-11-03 | pantry (gpt-6.1-sol, xhigh) | `node skills/fineliner-drawings/scripts/render.mjs …` | sandbox error: EPERM writing `node_modules/.cache/jiti` through the junction | render.mjs now runs jiti without a file cache |

Running total: 0 approval refusals, 2 sandbox errors, in 5 runs (plus 10 resumed rounds).
