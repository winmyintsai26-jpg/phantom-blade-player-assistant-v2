# Phantom Blade Zero Player Assistant — V2

An independent, player-first guide workspace designed around actionable steps, observable checkpoints, and troubleshooting. **Not affiliated with S-GAME.**

## Deploy on Cloudflare Workers

1. In Cloudflare Workers & Pages, create a **new** Worker project and connect this GitHub repository (`winmyintsai26-jpg/phantom-blade-player-assistant-v2`).
2. Set **Build command** to `npm run build`.
3. Set **Deploy command** to `npx wrangler deploy`.
4. Leave **Root directory** as `/`.
5. This project deploys from `dist/` via the `assets` setting in `wrangler.jsonc`. The Worker name is `phantom-blade-player-assistant-v2`.
6. Keep the new `workers.dev` preview URL separate from the existing Netlify and Cloudflare sites.

Run locally:

```bash
npm install
npm run check
npm run test:build
npx playwright install chromium
npm run test:browser
npm run dev
```

The independent **Phase 3 live production audit** workflow can be started manually after Cloudflare deploys the newest commit. It compares `build-manifest.json` with the workflow revision and checks desktop/mobile routes, search, filters and feedback without submitting player data. A successful build is not proof that the same revision is deployed.

## Current content and verification status

- Nine region guides, eight player-problem guides, nine curated objective detail pages and four original workspaces are present. Weeping Creek has 61 numbered source-index entries.
- All routes include confidence labels. These source-researched directions are **not independently gameplay-tested**.
- Each region guide uses an externally hosted promotional image and a fallback. Promotional art must not be confused with an item-location screenshot. Confirm rights and attribution before commercial monetization.
- Progress checks and spoiler settings use browser localStorage, not the game save.
- About and Privacy pages document site ownership and data handling.
- The Workers preview remains noindex and advertising is disabled until approval.

## Deployment and AdSense

The verified GitHub Actions workflow has a **deploy** job following CI. Configure the two Cloudflare repository secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) to authorize deployment. If these secrets are absent, the deployment job logs a skip rather than claiming a successful publication.

For custom domain, AdSense account verification, privacy, indexing, `ads.txt`, consent requirements, publisher ID settings, and the separate ad-serving activation gate, see [MONETIZATION_RELEASE.md](MONETIZATION_RELEASE.md).

**Never publish ads before Google approves the site and any required consent mechanism is in place.**

## Project structure

- `src/guides.js` — evidence-labeled guide content and pure search helpers
- `src/app.js` — pages, search, filters, progress and troubleshooting
- `src/styles.css` — responsive design system
- `tests/guides.test.mjs` — automated content and helper checks
- `wrangler.jsonc` — independent Cloudflare Worker preview configuration
