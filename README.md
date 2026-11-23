# Genesis Triad — Triad Audit wireframe

A clickable wireframe of the Triad Audit product for Genesis Triad Consulting: the brand-facing audit site
(free Triad Snapshot → paid Alignment Diagnostic → monitoring) and the principal's review console, as one
ordinary Angular 18 app. All brand and audit data is illustrative.

The story around it (steps, narration, actors, device frame) is not in this repo: it is told on
wireframes.jemimo.ai, which builds this repo and frames its pages. `story-seed.json` is the initial story for
the portal to import.

## Screens

| Path | Screen |
|---|---|
| `/` | Landing: run a free snapshot |
| `/start` | A few questions, no sign-up (whose brand: mine / a competitor / a client's) |
| `/collect` | Evidence collection, then freeze · `?state=hit` = already scanned (cached snapshot) |
| `/r/SNP-2611-0417` | Free Triad Snapshot · `?state=apart` (default) `almost` `aligned` `over` |
| `/r/SNP-2611-0417/f1` | A finding's receipts |
| `/method` | Same evidence, same score |
| `/upgrade` | Snapshot → Alignment Diagnostic |
| `/diagnostic/evidence` | Inside evidence and leaders' intent |
| `/console/queue` | Felix's review queue |
| `/console/review/freshbox` | Signal review (band calls carry to the report) |
| `/diagnostic/freshbox` | Signed report |
| `/monitor/freshbox` | Monitoring |

Controls the story replays by click carry stable ids: `#whose-<mine|competitor|client>`, `#run-again`,
`#band-<signal>-<0..3>`.

## Build rules (from the portal's builder)

The portal installs at the repo root with `npm ci --ignore-scripts`, runs `npm run build` **without network**,
and serves `dist/*/browser` under base href `/`. So: keep the app at the root, keep `<base href="/">`, and do not
add anything fetched at build time (Google Fonts inlining is switched off in `angular.json`).

## Run locally

Command Centre owns host ports: the container publishes on `CC_JEMIMO_CONSULTING_GENESIS_TRIAD_WEB_PORT` from
`/workspace/.cc/sandbox.env` (container port 4920). Never hard-code a host port. From a shell inside
claude-sandbox:

```bash
set -a; . /workspace/.cc/sandbox.env; set +a
BUILDX_BUILDER=sandbox-builder docker compose up -d --build
echo "$CC_JEMIMO_CONSULTING_GENESIS_TRIAD_WEB_URL"
```

For development: `npm install && npx ng serve --host 0.0.0.0 --port "$CC_JEMIMO_CONSULTING_GENESIS_TRIAD_WEB_PORT"`
(stop the container first so the port is free).

Brand tokens (from genesistriad.com): red `#e32323`, deep `#8f1d1d`, ink `#191919`, light `#f3f3f1`,
teal `#176b63`, sand `#d8c7a3`; Georgia headings with italic emphasis, Arial body.
