# Phase 4.1 — Boss roster evidence and player-release audit

Updated: 2026-11-08. **Not independently gameplay-verified.**

## Counting rule and source disagreement

The directory uses **one record per grouped fight encounter**, rather than equating a character, health-bar title, separate phase, or enemy in a group with one distinct fight.

- [pbz.gg bosses](https://pbz.gg/bosses/) presents **75 boss titles/entries in 59 fights**. Its 59 grouped encounters are the primary **coverage inventory**, not proof of an official total.
- [AllThings.How](https://allthings.how/phantom-blade-zero-bosses/) lists **74 health-bar/title rows**; alternate stages can be counted separately.
- [GameSky's 61-fight list](https://gamesky.timberwolvesmobile.com/articles/17707) lists **61 fights**, including repeat appearances. Other guides disagree about grouping.
- [PowerPyx trophy roadmap](https://www.powerpyx.com/phantom-blade-zero-trophy-guide-roadmap/) supplies selective required/optional classification evidence. We leave classifications **undetermined** unless supported.
- First-party reference: [S-GAME 2025 Seven Stars demonstration](https://pbz.s-game.com/en-US/news/year-of-the-snake-trailer/) explicitly describes a coordinated sword formation and String Puppet sequence; it is not a final-game route proof.
- First-party versioning: [S-GAME patch 1.0302256](https://pbz.s-game.com/en-US/news/patch-notes-2026-11-03/) changes Hua, Deadly Betrothed's grab frequency on Wayfarer/Pathbreaker; strategies may need revision.
- [S-GAME main site](https://pbz.s-game.com/en-US/) is a first-party presentation source, not a 59-fight verification.
  
These counts are **not interchangeable**. A 59-record catalog is not proof that there are exactly 59 distinct characters, or that every encounter is game-tested.

## Current database inventory

| Metric | Current value | Interpretation |
| --- | ---: | --- |
| Fight-level catalog records | **59** | Complete relative to the 59-group pbz.gg index checked on 2026-11-08 |
| Records with region/prologue attribution | **59** | Published-source region reference, not exact verified path |
| Entries with a recorded specific Bell/arena landmark | **8** | Source-based location detail; most specific approaches are still missing |
| Bosses with existing internal V2 problem help | **3** | Jing Ye, Red, Seven-Stars Chief Disciple |
| External individual reference URLs checked | **48** | **47** moveset/tips guides, **1** location-only guide |
| Profiles still missing complete V2 boss strategies | **56** | The external articles are linked, not copied into unsupported V2 instructions |
| Total eligible individual boss pages in sitemap | **3** | Others are browsable through directory but keep page-level noindex to avoid thin SEO |
| Boss portraits/screenshot rights verified | **0** | No third-party combat images imported or imitated |

The complete name/variant and evidence schema is in `src/bosses.js`; the exact hand-checked external guide URLs are in `src/boss-external-guides.js`. Every catalog record cites the regional roster and alternate roster; some have individual external tips or official source references. No record is marked independently gameplay-verified.

## How aliases and conflicts are handled

- Separate Zuo Shang prologue sparring, prologue Shadow Sovereign, and the Mount Soulrend rematch have separate slugs.
- The Hunt's prologue encounter and later Sixfold Scythe rematch are distinct.
- You Loong's Pangzhen fight and Meigu Lake return are distinct.
- Alternate health bars or encounter components such as Steel/Frost/Chaos Yucong and the Mu Xiaokui guardians appear as aliases/participants of the published grouped fight, **not falsely identified as one individual boss**.
- Jing Ye: the existing Help Center separates mounted, shield, and final sword situations for troubleshooting. A separate moveset publisher groups this as **mounted plus on-foot shield**; this discrepancy is surfaced.
- The 2025 Seven Stars String Puppet presentation is recorded as historical official preview evidence, not treated as guaranteed post-launch phase timing.

## Product and player safeguards

- `/bosses/` supports search by name/alias, region and only-source-supported encounter category.
- `/bosses/:slug/` exists for all 59 indexed fights and links out to original moveset guides where available.
- Within each boss page, selecting a phase and combat problem returns existing specifically relevant V2 guidance only where sourced; otherwise it labels the evidence gap and offers an **external original walkthrough**, or **clearly generic** combat practice.
- `/solver/` Boss Fight now includes all 59 roster selections and routes the player to the relevant boss-specific assistant.
- Every page offers manual Not started/In progress/Defeated states, tactics-practiced checkboxes, and a **draft-only** issue report. This is browser data, not information from game saves.
- JSON backup **v4** preserves boss states, tried tactics, older objective/checkpoint progress and previous v1/v2/v3 imports. Imported completion cannot overwrite existing completed states.
- No gameplay image is used without established rights. No new account or tracking service was added.
- Site-wide `V2_EDITORIAL_APPROVED`, `V2_INDEXING_ENABLED` and AdSense controls are unchanged. Incomplete boss pages do not join the sitemap automatically even after approval.

## Remaining verification gaps

The majority of bosses still lack precise starting Bell routes, independently checked fight videos, frame-accurate cue/timing corroboration, boss-by-boss damage and healing plans, and exact version-sensitive clear conditions. Source URLs should be revisited when patches change enemy behavior. External source pages can be outdated or incorrect, so readers must distinguish them from first-party and in-game-tested evidence. Publish no player-specific claim as verified merely because it appears in a catalog.
