# Phase 4.2 — All-fight evidence triage and release readiness

Date: 2026-11-08. **These are published-source findings, not independent in-game verification.**

## Scope and method

- Preserve 59 grouped fight records in `src/bosses.js`. This is a fight-level coverage model, not a claim that there are 59 distinct boss characters or that an external publisher is infallible.
- Reviewed original published fight details in accessible AllThings.How articles for a focused set of 14 encounters, and cross-checked Jing Ye with Mobalytics and Hua against the official S-GAME patch. No new gameplay video was independently watched; no footage timestamps are claimed.
- All 59 records underwent a **structured coverage triage**: existing roster references, individual external-guide availability, precise route evidence, curated combat instructions, and remaining gaps. A coverage-triage pass is not the same as reviewing 59 complete moveset articles.
- The 48 existing linked external boss references remain discovery resources; an external link alone is not a V2 strategy. Known source disagreements (Jing Ye's two versus three operational phases; count differences across rosters) remain explicit.
- Every original combat response in `src/boss-strategies.js` carries a cue, player action, common mistake and evidence ID. Source URLs and review date are attached at strategy level; official patch metadata is separate.

## Coverage (source-backed but not gameplay-tested)

| Metric | Count |
|---|---:|
| Bosses triaged from published regional rosters | **59** |
| New original V2 strategy records with specific attack responses | **14** |
| Records with documented boss phase groups in new strategies | **7** |
| Records with supported starting Bell | **14** |
| Records with source-based approach/checkpoint steps | **13** |
| Records missing sufficient evidence for an original V2 strategy | **45** |
| Existing independent V2 Help Center boss guides | **3** |
| Prior external links to individual moveset guides | **47**, plus 1 location article |
| Independently tested in game by this project | **0** |

## Sources

- [AllThings.How boss roster](https://allthings.how/phantom-blade-zero-bosses/) — fight/health-bar distinctions.
- [pbz.gg grouped fight index](https://pbz.gg/bosses/) — the primary 59-group source inventory.
- [Mobalytics Jing Ye boss guide](https://mobalytics.gg/gamebase/guides/phantom-blade-zero-jing-ye-the-outlaw) — alternate three-phase model and shield-breaking advice.
- [Official S-GAME patch 1.0302256](https://pbz.s-game.com/en-US/news/patch-notes-2026-11-03/) — Hua grab-frequency change limited to Wayfarer and Pathbreaker.
- Individual guide URL and claim metadata: `src/boss-strategies.js` and `src/boss-external-guides.js`.

## Individual fight coverage

| Fight | Region | Curated attack guidance | Starting Bell | Route | External reference |
|---|---|---|---|---|---|
| Zuo Shang | Prologue | No — evidence gap | — | Unverified | No individual guide |
| Zuo Shang, the Order's Shadow Sovereign | Prologue | No — evidence gap | — | Unverified | No individual guide |
| The Hunt, Hunter of the Order | Prologue | No — evidence gap | — | Unverified | No individual guide |
| Aberrant Three-faced Puppet | Weeping Creek Valley | No — evidence gap | — | Unverified | No individual guide |
| Jagged Steel, the Frenzied Brute | Weeping Creek Valley | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-jagged-steel-boss/) |
| Peng Meng, the Axemaster | Weeping Creek Valley | Yes — guide-supported | Outpost | Source route | [Original guide](https://allthings.how/phantom-blade-zero-peng-meng-boss-fight/) |
| Hua, Deadly Betrothed | Weeping Creek Valley | Yes — guide-supported | Valley Sha-Chi Tower Base | Source route | [Original guide](https://allthings.how/phantom-blade-zero-hua-deadly-betrothed-boss-fight/) |
| The Hunt, Sixfold Scythe | Weeping Creek Valley | Yes — guide-supported | Great Waterfall | Source route | [Original guide](https://allthings.how/phantom-blade-zero-the-hunt-boss-fight/) |
| The Gold-Masked One | Weeping Creek Valley | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-how-to-beat-the-gold-masked-one/) |
| Acolyte Hansui | Weeping Creek Valley | No — evidence gap | — | Unverified | No individual guide |
| Mó Yuan, Leader of the Bastion of Mó | Weeping Creek Valley | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-mo-yuan-boss-fight/) |
| The Puppet Scavenger | Weeping Creek Valley | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-puppet-scavenger-boss-fight/) |
| Hua Qianxiao, the Sword Fanatic | Crimson Forest | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-hua-qianxiao-sword-fanatic/) |
| Stone Hand Iron Fever | Crimson Forest | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-iron-fever-boss-fight/) |
| Jing Ye, the Outlaw | Crimson Forest | Yes — guide-supported | Outlaw Trap | Source route | [Original guide](https://allthings.how/phantom-blade-zero-jing-ye-boss-fight/) |
| Bai Chilian, Lady of the Twin Serpents | Crimson Forest | Yes — guide-supported | Threadbound Great Tree | Bell only | [Original guide](https://allthings.how/phantom-blade-zero-bai-chilian-boss-fight/) |
| Yucong, No. 34 Twisted Puppet | Crimson Forest | No — evidence gap | — | Unverified | No individual guide |
| Zhuo Bi, the Gatekeeper | Village of Lu | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-zhuo-bi-boss-fight/) |
| Master Bi Yuan of the Tianxuan Sect | Village of Lu | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-master-bi-yuan-boss-fight/) |
| Master Bi Hai of Kuye Temple | Village of Lu | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-master-bi-hai-boss-fight/) |
| Yuzan, No. 3 Musician Puppet | Village of Lu | Yes — guide-supported | Beneath the Well | Source route | [Original guide](https://allthings.how/phantom-blade-zero-yuzan-boss-fight/) |
| Acolyte Yanru | Village of Lu | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-acolyte-yanru-boss-fight/) |
| Mu Xiaokui, Young Mistress of the Order | Village of Lu | Yes — guide-supported | Lakeside | Source route | [Original guide](https://allthings.how/phantom-blade-zero-mu-xiaokui-boss-fight/) |
| Dusk, the Puppeteer | Village of Lu | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-dusk-boss-fight/) |
| Blaze, Shadow Warden Captain | Pangzhen | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-blaze-boss-fight/) |
| Cavalrybane, Elite Shadow Warden | Pangzhen | No — evidence gap | — | Unverified | No individual guide |
| Wu Xuan, the Fallen General | Pangzhen | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-wu-xuan-boss-fight/) |
| Gu Wanyue, the Wailing Wraith | Pangzhen | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-gu-wanyue-boss-fight/) |
| Xie Qiudong, the Divine Healer | Pangzhen | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-xie-qiudong-boss-fight/) |
| You Loong, Leader of the Blackwater Crew | Pangzhen | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-you-loong-boss-fight/) |
| Chang Hong, the Thunder Spear | Pangzhen | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-chang-hong-boss-fight/) |
| Acolyte Lei Ting | Pangzhen | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-acolyte-lei-ting-boss-fight/) |
| Flame, the Mask-Bound Lion Dance Grandmaster | Pangzhen | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-lion-dance-grandmaster-boss-fight/) |
| Soulclaimer, Elite Shadow Warden | Pangzhen | No — evidence gap | — | Unverified | No individual guide |
| Zhu Yuan, the Searing Blade | Pangzhen | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-zhu-yuan-boss-fight/) |
| Corpse-Eating Xue | Mandate Encampment | No — evidence gap | — | Unverified | No individual guide |
| Wan Jun, the Coppermaul | Mandate Encampment | Yes — guide-supported | Beneath the Watchtower | Source route | [Original guide](https://allthings.how/phantom-blade-zero-wan-jun-boss-fight/) |
| Red, the Mysterious Swordswoman | Mandate Encampment | Yes — guide-supported | Dovecote | Source route | [Original guide](https://allthings.how/phantom-blade-zero-red-mysterious-swordswoman-boss-fight/) |
| Chief Disciple of the Seven-Stars Formation | Mandate Encampment | Yes — guide-supported | Road to the Training Grounds | Source route | [Original guide](https://allthings.how/phantom-blade-zero-chief-disciple-seven-stars-formation-boss-fight/) |
| Wu Lengshuang, the Soft Sword | Mandate Encampment | No — evidence gap | — | Unverified | No individual guide |
| Yubi, No. 21 Swordfighter Puppet | Mandate Encampment | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-yubi-boss-fight/) |
| Acolyte Guhe | Meigu Lake | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-acolyte-guhe-boss-fight/) |
| You Loong, the Frenzied Blackwater Crew Leader | Meigu Lake | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-frenzied-you-loong-boss-fight/) |
| Yan Qiansui, the Zither Maiden | Meigu Lake | Yes — guide-supported | Meigu Songhouse Dock | Source route | [Original guide](https://allthings.how/phantom-blade-zero-yan-qiansui-boss-fight/) |
| One-Eyed Archer | Meigu Lake | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-one-eyed-archer-boss-fight/) |
| Blizzard Blademaster | Meigu Lake | Yes — guide-supported | Whiteshadow’s Fall | Source route | [Original guide](https://allthings.how/phantom-blade-zero-blizzard-blademaster-boss-fight/) |
| Heartpiercer, Elite Shadow Warden | Meigu Lake | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-heartpiercer-boss-fight/) |
| Grief-Stricken Jin | Meigu Lake | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-grief-stricken-jin-boss-fight/) |
| Iron Butcher, the Frenzied Brute | Mountain of Imprisonment | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-iron-butcher-boss-fight/) |
| Bi Feng, Giant Saber Commander | Mountain of Imprisonment | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-bi-feng-boss-fight/) |
| Kui Yanyan, the Deranged | Mountain of Imprisonment | No — evidence gap | — | Unverified | No individual guide |
| Jade-Face | Mountain of Imprisonment | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-jade-face-boss-fight/) |
| Huangxing, the Kunlun Renegade | Mountain of Imprisonment | Yes — guide-supported | The Lady’s Shrine | Source route | [Original guide](https://allthings.how/phantom-blade-zero-huangxing-boss-fight/) |
| Yuding, No.12, Crescent Blade Puppet | Mirage Estate | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-yuding-boss-fight/) |
| Qiu Feng, the Crimson Boneblade | Mirage Estate | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-qiu-feng-boss-fight/) |
| Lei Dang, the Tiger Cannon | Mirage Estate | Yes — guide-supported | Perfect Vessel Pond | Source route | [Original guide](https://allthings.how/phantom-blade-zero-lei-dang-boss-fight/) |
| The Crusher and the Saw | Mount Soulrend | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-crusher-and-the-saw-boss-fight/) |
| Meng Hua, The Merciful Lady of the Blossom Veil | Mount Soulrend | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-meng-hua-boss-fight/) |
| Zuo Shang, the True Lóng | Mount Soulrend | No — evidence gap | — | Unverified | [Original guide](https://allthings.how/phantom-blade-zero-zuo-shang-final-boss-fight/) |

## Required editorial follow-up

1. Perform in-game or video-timestamp verification for each supported Bell path and combat cue, especially branching or missable fights.
2. Update Hua's timing and grab-frequency assumptions for patch 1.0302256 before claiming current-game precision.
3. Confirm boss reward and end-state against the current game build. A publisher's reward assertion is not a verified in-game result.
4. Revisit inaccessible, redirected or outdated external links. Do not bulk import third-party images or descriptions.
5. Keep 45 unsupported boss profiles visibly incomplete and excluded from the sitemap until meaningful, reviewed content exists.
6. `V2_EDITORIAL_APPROVED`, `V2_INDEXING_ENABLED`, `V2_ADS_ENABLED` remain unchanged; Phase 4.2 does not approve publishing ads or indexing.

## Validation

The evidence schema has unique boss IDs, legal evidence-class labels, source URL checks, phase checks, claim-required fields, and no orphan records. The automated tests cover matcher order, claim provenance, missing-evidence fallback, responsive boss pages and backup compatibility. Full CI and live revision results must be recorded **from the actual final commit**, never inferred from a previous run.
