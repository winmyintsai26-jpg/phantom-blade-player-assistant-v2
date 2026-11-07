# Phase 1.5 beta verification and acceptance

## Intended UI
Each region guide shows a prominent relevant promotional cover immediately after the title, description and region stats, above the dashboard and content. Covers must have descriptive alt text, a distinct source URL per region, a responsive crop and a visible fallback if the remote image fails. The images are not independently verified to depict their named regions.

## Verification commands
1. `npm install --no-audit --no-fund`
2. `npm run check`
3. `npm run test:build`
4. `npx playwright install --with-deps chromium`
5. `npm run test:browser`

GitHub Actions runs this pipeline on push and pull requests. A passing build is still not an in-game verification.

## SEO release gate
Preview uses `noindex,nofollow` and `robots.txt: Disallow: /`. Canonicals and sitemap are generated for every route. The indexing switch is deliberately double-gated:

- Set `V2_INDEXING_ENABLED=true` **only after approval**.
- Set `V2_EDITORIAL_APPROVED=true` only following gameplay evidence review and content acceptance.
- Set `V2_SITE_ORIGIN=https://<approved-production-domain>`. Indexing refuses to activate on the preview workers.dev hostname.

Never activate on the preview just to make SEO tests pass.

## Gameplay evidence status
**Jing Ye:** Mobalytics' Oct 31, 2026 Hellwalker-tested write-up supports mounted, shield, sword phases; shield thorns; Dread Axe resource planning; dust-cloud grey leap followed by a blue counter. IGN's Nov 2 video publishes chapter markers at 1:50 (on horse), 6:30 (off horse) and 9:07 (reward). This project has not independently played the boss or watched all video frames.

**Sha-Chi Tower:** Mobalytics, PowerPyx, ItemLevel and AllThings.How distinguish the Base Camp Gate Key from Furnace Inspection Crank. Hunter's Chain Sickle permits the Summit-side grapple to the key; the key opens the gate near Creek Valley Plains Entrance. The crank comes from a Shadow Warden reachable by a Waterfall Bridge ladder or the Summit-side descent; it operates two furnace consoles, with Remove after collecting each reward. Correct screenshots are available on the linked source sites, but none are copied or hosted without permission. The exact bashpole/locked house player route has no accepted proof yet.

## External constraints
A local test environment without npm.org DNS/network cannot perform a clean install or run Vite/Playwright, even if Chromium is present. GitHub Actions results must be inspected, not inferred from workflow configuration. Cloudflare Workers deployment must be checked independently using a live network response or Cloudflare logs and exact build SHA. A GitHub commit alone does not show deployment success.
