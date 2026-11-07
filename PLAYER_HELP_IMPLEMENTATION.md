# Player needs implementation — Phase 1 (2026-11-07)

## Shipped in source (awaiting automated production verification)

- **Player Help Center**: `/help/`, six categories, free-text search, category filter, seven structured problem pages with direct links.
- **Jing Ye**: mounted / shield / sword troubleshooting, tailored response based on four common player failures and direct IGN phase video links.
- **Sha-Chi Tower Base**: distinguishes the Base Camp Gate Key from Furnace Inspection Crank, explains both consoles and provides five location-specific branches. Caveat: bashpole, house and Outlaws Trap routes lack sufficiently verified exact paths.
- **Red + Seven-Stars**: documents published warning about defeating Red at Dovecote and the later paired encounter, while avoiding invented kill-order tactics.
- **Combat fundamentals**: parry, dodge, guard, Sha-Chi and attack/defense practice.
- **Quest/NG+**: Pipa reported issue documented without falsely declaring a verified bug or a fake fix.
- **Weapons**: Drunken Sword acquisition and state mechanics with an explicit note that source reports conflict on restoring the weapon.
- **Beginner**: spoiler-light story orientation using Bells, Tales and journal.
- **Feedback**: three outcomes (solved / not solved / situation different), optional player details and a reviewable GitHub issue draft.
- **Static HTML**: Player Help Center pages included in prerender scripts.
- **QA**: unit data assertions and Playwright interactions for search, diagnosis, feedback and mobile screens.

## Editorial confidence and outstanding evidence

These problem reports originate from Reddit and Discord, but the original author links, game versions and session details are not attached. They establish **what to investigate**, not **what works**.

Specific guides are cross-referenced to Mobalytics, IGN, PowerPyx, published combat guides, and other written sources. Only source-supported directions are published; none is described as independently playtested by this project.

No screenshots or annotated maps were fabricated. We still need appropriate gameplay captures for Sha-Chi Tower's underground route, bashpole and locked house, a tested NG+ Pipa reproduction, the Drunken Masked Boss identity/attack set, verified Red + Seven-Stars fight footage, and device/version-specific input tests.

## Acceptance not yet met

- Run `npm run check` and `npm run test:browser` on the latest commit.
- Verify the exact Cloudflare live deployment, images and external video availability.
- Test instructions against the current gameplay build.
- Add actual player success/failure reports and identify recurring failures.
- Confirm rights to any gameplay imagery before embedding or rehosting.
- Publish full SEO sitemap and indexable pages **after** content meets gameplay quality gates. Existing V2 robots noindex preview setting remains intentional until then.

This is a practical, source-documented beta Help Center. It is **not** a complete or independently gameplay-verified player knowledge base.
