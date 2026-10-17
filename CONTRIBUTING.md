# Contributing to FORMA

Thanks for helping. FORMA is generated from one source, so most changes touch a source file and are then rebuilt.

## Setup

```bash
npm ci
npx playwright install chromium   # once, for the browser tests
npm run build                     # → dist/, site/, AI files
npm test                          # contrast · lint · MCP · keyboard · RTL · forced colors · axe · React
npm run test:types                # TypeScript declarations
npm run test:visual               # every theme × mode against tests/visual/*.png
```

## Where things live

| Change | Edit |
|---|---|
| A component's CSS | `src/components/<group>.css` |
| Its docs, examples, a11y notes, v5 migration | `src/components/<group>.meta.js` |
| Behaviour (keyboard, ARIA) | `src/js/*.js` + `types/forma.d.ts` |
| A theme | `themes/themes.json` (palette parameters, fonts, shape) |
| Spacing, type, radius, motion | `tokens/primitives.tokens.json` |

Never edit `dist/`, `site/`, `llms*.txt`, `forma-spec.json` or `AGENTS.md` by hand; commit them as the build writes them. CI fails if they are out of date.

## Rules a change must keep

- **Contrast is proven, not eyeballed.** If a theme change fails a contrast check, adjust its parameters; never lower a target.
- **Native first.** `<dialog>`, `[popover]`, `<details>` and real inputs before custom widgets.
- **State in ARIA**, not classes (`aria-selected`, `aria-pressed`, `aria-current`, `aria-invalid`).
- **Logical properties only** (`inline-start`, not `left`), so RTL keeps working.
- **No user text as HTML** in JS.
- **One focus rule.** Components don't style `:focus-visible` themselves.
- A new interactive pattern gets a keyboard test in `scripts/test-interaction.mjs`.

## Visual baselines

`npm run test:visual` writes `tests/visual/<theme>-<mode>.actual.png` when something differs. If the change is intended, run `npm run test:visual -- --update` and mention it in the pull request.

## Versioning

FORMA follows [semantic versioning](https://semver.org):

- **Patch** (6.0.x): fixes that don't change markup or the JS API.
- **Minor** (6.x.0): new components, themes, classes, options. Existing markup keeps working.
- **Major**: removed or renamed classes, tokens or API. Each rename is recorded in the component's `v5`-style migration map so `forma lint --fix` can apply it.

## Releasing

1. Bump `version` in `package.json`, add the CHANGELOG entry, `npm run build`, commit.
2. Create a GitHub Release named `vX.Y.Z`. The Release workflow tests and publishes to npm with provenance (needs the `NPM_TOKEN` secret).
