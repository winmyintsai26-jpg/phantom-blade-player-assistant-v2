# Phase 2 — Database-to-Solution Coverage Audit

Date: 2026-11-07
Status: **Partial implementation — not release approved**

## Scope and evidence

The public pbz.gg reference has indexes for 218 inventory items, 66 accessories, 27 main weapons, 24 Phantom Edges, bosses and map Bells. These category counts are **not V2 coverage counts** and are not an authorization to copy its proprietary dataset or media. Reference: https://pbz.gg/ .

V2 has **162** selected source-indexed collectible/landmark entries across nine existing regions. Those entries include Bells, tales, equipment, materials and challenges; comparing 162 directly with the 218 inventory items is invalid. V2 has seven pre-existing problem guides (including Jing Ye, Sha-Chi Tower Base, Red + Seven-Stars and Drunken Sword) and four homepage workspaces.

### Phase 2 coverage, this implementation

| Dimension | Already present | Added in Phase 2 | Remaining gap |
| --- | --- | --- | --- |
| Regional index | 9 region pages and 162 selected source entries | Links into objective solver | No complete independent game inventory or Bell coverage audit |
| Item/landmark details | Regional text rows, some sourced image URLs | 9 curated objective detail pages with stable IDs and cross-links | Remaining 153 source rows lack curated detail pages; intentional |
| Starting Bell | Area/landmark text in source rows | Explicit starting Bell / landmark for nine curated records | Many entries lack corroborated nearest Bell |
| Prerequisites | Scattered inside route descriptions and problem guides | Explicit prerequisite arrays on nine records | Missing dependency verification, especially story cutoffs |
| Acquisition | Paraphrased one-line regional directions | Ordered steps, checkpoints and confirmation for nine | Unverified wrong-turn detail and missing player-tested navigation |
| Problem resolution | 7 pre-existing problem guides | Item-to-problem links and player feedback for curated pages | Need more game-version-specific evidence |
| Attribution | Per-region PowerPyx source links and per-image links | Sources and verification labels per curated objective | Rights to display third-party images in commercial use are unconfirmed |
| Search/SEO | Homepage guide search, help search, prerendered pages | Searchable objective index and prerendered canonical routes | Need production browser and CI checks |

## Public reference cross-checks

- **Jing Ye:** pbz.gg's boss record places Jing Ye in Crimson Forest, nearest Outlaw Trap Bell, and lists Outlaw Warblade as the reward: https://pbz.gg/bosses/jing-ye/ . V2 already has `/help/jing-ye-dismounted/` and a Crimson Forest collectible row for the reward. Treat boss mechanics in V2 as source-researched, not game-tested.
- **Hua Qianxiao:** pbz.gg puts this boss near Pangzhen Bridge Overlook and lists The Fanatic's Broken Blade as reward: https://pbz.gg/bosses/hua-qianxiao/ . V2's Crimson Forest row #7 and new objective #7 align.
- **Drunken Sword:** pbz.gg distinguishes The Fanatic's Broken Blade from its Soul Tempering result, The Fanatic's Drunken Sword: https://pbz.gg/weapons/fanatics-broken-blade/ . Do not conflate original boss reward with upgraded weapon.
- **Bashpole:** pbz.gg associates acquisition with Wan Jun in Mandate Encampment, near Main Encampment Gate: https://pbz.gg/weapons/bashpole/ . The existing V2 problem research discusses Bashpole as a traversal ability; acquisition prerequisites and route dependencies still need cross-checking before a detailed page.
- **Red + Seven-Stars:** V2 has `/help/red-seven-sword/`; we have not independently verified mission cutoff, irreversibility, or the combined-boss trigger. Do not turn player reports into certainties.
- **Sha-Chi Tower and Outlaw Trap:** V2 source-based routes are now accessible as curated Bell objectives. The exact turns, underground entrance and ability requirements still require walkthrough or gameplay confirmation.

## Priority queue, not a bulk-import target

1. Strengthen Sha-Chi Tower Base with verified entrance screenshots / landmarks; support players stuck between 1st Floor, Summit and Base.
2. Validate Outlaw Trap approach and Jing Ye's pre-fight missable quest state.
3. Establish Bashpole ability unlock and blocked-path route dependencies without guessing.
4. Verify the Red + Seven-Stars encounter branch and recovery guidance.
5. Distinguish Drunken Sword acquisition, upgrade and build recommendations.
6. Re-check Yu'er's deadlines and Broken-String Bow hand-in, recording game/version evidence.
7. Expand the high-confidence item inventory one objective at a time based on player reports.

## Release gate / outstanding reliability work

- External image scraping has been removed from the automatic production build. `npm run sync:images` is optional, separate research tooling; it is **not** a permission grant for commercial embedding.
- Every curated page marks its information as source-supported and not gameplay-tested. Completion is a user-controlled local checkbox, not game-save verification.
- Tests were added for data integrity and prerender route coverage. Full `npm run check`, `npm run test:build`, `npm run test:browser` and live mobile checks must still be run in an environment with Node dependencies and Playwright browsers.
- Confirm GitHub Actions status and Cloudflare deployment separately. Do not treat a repository commit as deployment.
- No release approval or advertising activation is implied.

## Editorial rules

Never present a source excerpt as original independent testing. Do not scrape and publish the full pbz.gg database or image library. Only publish an actionable route when it has a starting point, explicit prerequisites, steps, expected outcome, uncertainty disclosure, reference links and a feedback path.
