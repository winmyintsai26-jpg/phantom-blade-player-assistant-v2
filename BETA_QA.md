# Beta release verification checklist

This project is a **research-based public beta**, not a game-tested complete walkthrough.

## Must pass before inviting users

- [ ] Cloudflare deployment succeeds; homepage and all nine region routes load when opened directly.
- [ ] Desktop and narrow mobile viewport have no clipped navigation, checklist, or feedback button.
- [ ] Item search filters by name/location and phase filter updates counts.
- [ ] Item checkboxes persist after refresh; different regions do not share progress.
- [ ] Feedback form opens a correctly prefilled GitHub issue; confirm GitHub Issues are enabled.
- [ ] All nine research reference links resolve to the intended region.
- [ ] Critical missable instructions are verified against gameplay footage or independent player confirmation.
- [ ] Run npm run check on a clean checkout; inspect GitHub Actions and Cloudflare build logs.

## High-risk gameplay verification

1. Weeping Creek: Outpost informant -> stable grave -> Boulderguard before Crimson Forest final boss.
2. Weeping Creek: Broken-String Bow hand-in before Crimson Forest final boss.
3. Weeping Creek/Crimson Forest: Apprentice Healer before Jing Ye; A Healer's Mercy before Bai Chilian.
4. Crimson Forest: Gentle Thief answers, Honor Among Thieves cutoff, and return-visit bells.
5. Village of Lu: Wounded Thief manual, Stately Monk dialogue, Young Mistress cutoff, dock rewards.

If a step cannot be independently confirmed, keep it labeled Source-researched / not game-tested.

## Screenshot rights

Never copy third-party walkthrough screenshots without a reuse license or explicit permission. Prefer original gameplay captures. Record the author, permission, game location, version and spoiler context for every image. Generated artwork must not be presented as a gameplay screenshot.

## Player feedback

Region pages prepare prefilled GitHub correction issues. Players must sign in to GitHub and submit them. This is not an anonymous inbox. Review and verify reports before changing the guide.