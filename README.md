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
npm run dev
```

## Content and media integrity

- **Healer's Legacy and selected regional preflight checkpoints are source-researched**; it is not independently tested in-game.
- Nine region indexes are available; item-by-item walkthroughs are not yet imported. Other workspaces are intentionally labeled as research/planning tools, not completed walkthroughs.
- All artwork in the app is original abstract CSS illustration, not game screenshots. There are **no externally hotlinked game images**. Add screenshots only after rights and in-game location are verified.
- Checkboxes represent progress on this device, not the actual game state.
- Preview is deliberately `noindex,nofollow` and is not ready for public search indexing.
- No Google Search Console, AdSense, canonical domain or sitemap migration has been performed.

## Release gate

Before public launch: verify every quest step in-game, confirm source links and version-specific deadlines, secure relevant screenshot rights, run desktop/mobile browser checks, and confirm accessibility, routes, and Cloudflare deployment. Do not claim a 9/10 quality score without these checks.

## Project structure

- `src/guides.js` — evidence-labeled guide content and pure search helpers
- `src/app.js` — pages, search, filters, progress and troubleshooting
- `src/styles.css` — responsive design system
- `tests/guides.test.mjs` — automated content and helper checks
- `wrangler.jsonc` — independent Cloudflare Worker preview configuration
