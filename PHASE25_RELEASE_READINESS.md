# Phase 2.5 — Release and Gameplay Evidence Register

Updated: 2026-11-07
Baseline: `94ff20f`
Release status: **NOT CONFIRMED DEPLOYED**

## Confirmed CI baseline

GitHub Actions run [42430087121](https://github.com/winmyintsai26-jpg/phantom-blade-player-assistant-v2/actions/runs/42430087121):
- Verify job: completed successfully, including npm installation, npm run check, npm run test:build, Chromium installation, and browser tests.
- Deploy job: secret gate ran, then build/deploy/live-SHA verification steps were all **skipped**.
- Neither this successful verify job nor the deploy job's green overall conclusion proves a Cloudflare release.

## Configuration and secret gate

- `wrangler.jsonc` declares Worker `phantom-blade-player-assistant-v2`, assets directory `./dist`, and SPA fallback.
- GitHub Actions deployment requires repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` before the build/deploy steps can run.
- Do **not** commit tokens or log them. The Actions secret values are not readable through the repository's normal file API.
- Retain `V2_EDITORIAL_APPROVED`, `V2_INDEXING_ENABLED`, `V2_SITE_ORIGIN`, and AdSense approval conditions in `scripts/prerender.mjs`.
- After an authorized deploy, inspect the live `/build-manifest.json` and compare its `commitSha` to the exact deployment run's GitHub SHA, then run live and browser smoke tests.
- Live routes are not certified in this report.

## Priority gameplay research

Source-supported is **not gameplay-verified**. No fresh gameplay footage was independently watched, and no frame-accurate timestamps were validated in this phase. Do not fabricate timestamps or claim the in-game UI was tested.

| Objective | New evidence / action | Remaining evidence gap |
| --- | --- | --- |
| Sha-Chi Tower Base | Hunter's Chain Sickle from The Hunt → key at Summit → locked gate by Creek Valley Plains Entrance → lower tower. The key and Furnace Inspection Crank are different. References: [PowerPyx](https://www.powerpyx.com/phantom-blade-zero-weeping-creek-valley-collectible-locations/), [Mobalytics](https://mobalytics.gg/gamebase/guides/phantom-blade-zero-weeping-creek-valley-collectibles), [AllThings.How](https://allthings.how/phantom-blade-zero-keys/) | Exact turns to Base Bell and crank console in a specific game version, independently timed gameplay video |
| Outlaw Trap Bell | From Quick Hand Zhang, follow cliff face past cave, cross bridge; Bell lies left beyond the large enemy. Reference: [PowerPyx](https://www.powerpyx.com/phantom-blade-zero-crimson-forest-collectible-locations/) | Start-Bell-to-cage turn-by-turn footage and any exact story unlock state |
| Bashpole | Reward from Wan Jun, the Coppermaul during Hero or Heretic in Mandate Encampment; pbz.gg identifies Main Encampment Gate as closest Bell. Reference: [pbz.gg Bashpole](https://pbz.gg/weapons/bashpole/) | Exact Bell-to-arena route, any specific locked-door prerequisites, gameplay video timestamps |
| Red + Seven-Stars | Initial Red encounter on Dovecote tower; source recommends leaving via hanging chain if player wants later paired encounter near Tower Rear Exit. Reference: [Mobalytics](https://mobalytics.gg/gamebase/guides/phantom-blade-zero-chief-disciple-of-the-seven-stars-formation) | Recoverability and rewards need another independent source/game-version validation; no video timestamp |
| Drunken Sword | Hua Qianxiao drops Fanatic's Broken Blade. Fragments from Gu Wanyue and Yan Qiansui combine to Fanatic's Obsession; Soul Temper at Myst, Pangzhen, for 5,000 Remnant Dust. References: [AllThings.How](https://allthings.how/phantom-blade-zero-fanatics-obsession/), [KeenGamer](https://www.keengamer.com/articles/guides/phantom-blade-zero-how-to-use-the-fanatics-drunken-sword/) | Quest trigger details and independently confirmed video timestamps |

## Nine curated relationship audit

| Objective | Appropriate link | Relationship decision |
| --- | --- | --- |
| Broken-String Bow | Feather Bow regional entry | Quest/reward hand-in, not an unrelated combat guide |
| Boulderguard | Region Outpost and Holding Cell references | No unrelated links |
| Medicine Case | Healer's Legacy quest guide | Replaces irrelevant Jing Ye combat link |
| Reflex Device | Tower Base Bell and related tower navigation | Objective-specific troubleshooting |
| Scarlet Wraithblade | Sha-Chi tower route and Tower Base navigation | Shared landmark, not a claim that both pickups use the same tunnel |
| Sha-Chi Tower Base Bell | Reflex Device and Sha-Chi Tower Base help | Key route and item relationship |
| Outlaw Trap Bell | Relevant Crimson Forest next boss, Jing Ye | Clearly labeled **next encounter**, not the Bell's navigation solution |
| Fanatic's Broken Blade | Drunken Sword help | Item evolution and upgrade relationship |
| Wedding Candles | Village of Lu region | No unrelated guide attached |

## Feedback, separate from saved checklist

The objective page keeps `localStorage` progress markers independent of issue drafting. The new report captures completion/blocked/missing/different, failed step, missing location/prerequisite, platform, game version and an optional description. GitHub login is needed to actually submit; the website only opens a prefilled draft.

## Remaining release gates

- Rerun unit, build-validation, Playwright browser tests for **the newest Phase 2.5 commit**; a successful earlier run does not prove later changes.
- Confirm secrets available through the authorized GitHub Actions deployment context without revealing values.
- Deploy through an authorized runner with secrets, then check exact SHA.
- Live test `/`, `/help/`, `/objectives/`, and all nine `/regions/{id}/` routes, plus deep links and feedback controls.
- Verify permission for each third-party image before advertising.
- Maintain preview noindex and no ads until editorial and approval gates are satisfied.
