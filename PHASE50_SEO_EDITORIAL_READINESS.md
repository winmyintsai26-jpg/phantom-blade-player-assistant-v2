# Phase 5.0 — Production SEO & Editorial Release Gate

Reviewed: 2026-11-09. Target origin: https://phantombladeplayerguide.com

**Decision: NOT YET APPROVED FOR GOOGLE INDEXING.** This document records a technical/readiness audit, **not owner approval**, independent gameplay verification, AdSense approval or permission to change the production indexing flag.

## Audit baseline and confirmed architecture

- `scripts/prerender.mjs` writes an HTML document for every declared route, one canonical HTTPS URL on the owned domain, unique page title, meta description, robots directive, `WebPage` JSON-LD and breadcrumbs, a sitemap, robots.txt and a build manifest. The homepage additionally emits `WebSite` structured data.
- `V2_INDEXING_ENABLED=true` requires `V2_EDITORIAL_APPROVED=true` and an explicit `V2_SITE_ORIGIN`. Builds reject indexing with an unapproved editorial state or a `workers.dev` origin. Advertising additionally requires its separate approval, publisher ID and site conditions.
- In the unapproved build the generated robots.txt disallows crawlers and pages emit `noindex,nofollow`; the canonical is still the owned production domain. The sitemap enumerates **future eligible** URLs, not confirmation that Google can index them today. `robots.txt` blocking may prevent crawlers from seeing `noindex` on existing indexed URLs; review the migration only during an authorized release.
- `/build-manifest.json` carries the exact build SHA, site origin, route inventory and approval/indexing/ads flags. A successful build or Github green badge does **not** prove deployment; confirm the live manifest SHA equals the requested GitHub commit SHA.
- Access from this assistant's browser/network was not available at the start of this audit, so direct live HTTP headers/canonical markup must be assessed by the existing workflow's domain smoke and SEO jobs. Do not infer a result before those jobs finish.

## Phase 5.0 implemented

1. Prerendered Help Center articles now expose prerequisites, actionable written steps, completion checks, troubleshooting and original source links instead of partial text.
2. Workspace guides expose source-backed full step bodies, checks and evidence links, not only a list of step headings.
3. Region pages expose checkpoint details, category-appropriate internal links to curated objectives and documented bosses, and the original regional source URL.
4. Curated objective pages expose their source links, missable warnings, success checks and evidence limitations.
5. The Problem Solver provides a useful crawler-readable description and links to the Boss Directory and Item Finder.
6. Boss Directory includes the roster-count uncertainty and a source reference; boss profile breadcrumb JSON-LD now points through `/bosses/`.
7. `/progress/` remains accessible to players but is **always `noindex` and excluded from the sitemap**, even in an approved build. This personal browser-storage workspace has no unique public search value.
8. Only the 14 boss records with curated attack-pattern material are eligible for individual boss sitemap inclusion. The other 45 boss profiles stay noindex and are omitted. No new gameplay facts or images were invented.
9. Build tests now enforce sitemap/page-level robots consistency, substantive server-rendered guides, and valid boss breadcrumbs.

## Editorial sign-off checklist

| Requirement | Status | Sign-off evidence required |
| --- | --- | --- |
| Owned HTTPS canonical, prerendered titles/descriptions, route generation | TECHNICALLY PRESENT | Verify production headers and canonicals on final SHA |
| Clean sitemap and exclusion of private/thin boss pages | IMPLEMENTED IN BUILD | Confirm latest CI and live sitemap after deployment |
| Functional desktop/mobile routes, navigation, search and local progress | TESTED IN AUTOMATION | Review latest Playwright and domain smoke reports |
| Useful Help Center and curated objective details | SOURCE-RESEARCHED | Human editorial spot checks of exact gameplay steps and all citations |
| Source attribution across region/guide/objective content | IMPROVED | Human sample-check sources and links for current game patch |
| 14 boss guides with original attack cue → response advice | PARTIAL | Patch-specific review and independent gameplay/player outcome evidence where feasible |
| 45 incomplete boss profiles | NOT READY | Remain noindex; do not certify them as complete |
| Image rights / trademark use | UNRESOLVED | Written portrait permission not yet received; avoid unlicensed media |
| Privacy, About, Contact and correction channel | PRESENT | Owner verifies wording, operator details and third-party services |
| Editorial acceptance and owner authorization | **NOT GIVEN** | Explicit owner approval of reviewed content/scope, saved record with date/version |
| AdSense readiness | OUT OF SCOPE | No advertising activation or publisher changes |

**Key content limitation:** Structured written references may still be wrong or outdated, including potential missable-story consequences and difficulty-dependent boss timing. Current playable success has not been independently established for every procedure. Source-backed does not mean gameplay-verified.

## Reversible indexing activation — operator procedure (DO NOT RUN WITHOUT APPROVAL)

**Preparation:** The owner performs and documents editorial review, accepts any remaining limitations, determines the list of launch-eligible pages, confirms the final build SHA and authorizes *indexing specifically*. Approval must not be inferred from CI or from this document.

1. Capture the current production `/build-manifest.json`, `/robots.txt`, `/sitemap.xml`, a homepage `<meta name="robots">` and canonical, and the currently deployed Cloudflare revision. Preserve a backup/rollback target.
2. Confirm the approved source code has not changed since review, and confirm every sitemap URL is an appropriate crawlable page: pages excluded by `eligibleForSitemap:false` must remain `noindex`; the personal progress page and 45 incomplete bosses must remain excluded.
3. Perform a **test build**, not a deployment, with `V2_SITE_ORIGIN=https://phantombladeplayerguide.com`, `V2_EDITORIAL_APPROVED=true`, `V2_INDEXING_ENABLED=true`, and `V2_ADS_ENABLED=false`. Verify `robots.txt` allows crawling, index-eligible pages render `index,follow`, the sitemap has only eligible canonicals, page-level exclusions remain `noindex`, and `npm run check`, `npm run test:build`, `npm run test:browser` pass. Don't use any AdSense approval values for this test.
4. With **separate explicit owner release authorization** and deployment credentials, build the exact reviewed SHA with the approved settings and deploy through the normal Cloudflare release process. Avoid enabling the same flags on a preview/staging or `workers.dev` host.
5. Verify live `build-manifest.json` revision and `indexingEnabled/editorialApproved`, `robots.txt`, the homepage's canonical/meta-robots and several sample pages including `/progress/` and an incomplete boss. Verify the sitemap URLs match the approved set exactly and pages return 200. If any verification fails, **rollback immediately**.
6. After successful deployment, submit the canonical sitemap in Google Search Console and request inspection/indexing of select priority pages. Google controls indexing and rankings; none is guaranteed.

### Immediate rollback procedure

- Restore the previous known-good Cloudflare deployment **or** rebuild the reviewed release with `V2_INDEXING_ENABLED=false` and `V2_EDITORIAL_APPROVED=false` (keeping `V2_ADS_ENABLED=false`), then redeploy.
- Confirm live `build-manifest.json` flags are false, `robots.txt` disallows crawling, eligible pages now emit `noindex,nofollow`, and the SHA matches the rollback target. Recheck indexable pages in Search Console when appropriate.
- A robots.txt `Disallow` alone is not a reliable emergency deindexing strategy for URLs already in Google because Google may not fetch their `noindex` tag while blocked. Consult Google's removal and noindex guidance if urgent removal is required.

## Never bypass

Never set `V2_EDITORIAL_APPROVED=true` or `V2_INDEXING_ENABLED=true` without an owner sign-off; never enable `V2_ADS_ENABLED`, inject ads, or treat rights-holder outreach as permission to use portraits. The 45 thin boss profiles and personal progress page remain excluded regardless of launch state.
