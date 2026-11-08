# Cloudflare release & Google AdSense readiness (November 2026)

## Current status
- The existing Cloudflare Workers **preview** is at `https://phantom-blade-player-assistant-v2.winmyintsai26.workers.dev`.
- Preview uses `noindex,nofollow` and `robots.txt: Disallow: /`; no paid ads are activated.
- V2 can build and deploy through GitHub Actions, but the deploy step **requires your Cloudflare credentials as GitHub repository secrets**. A green `verify` job is not proof of deployment. The deploy job's **live SHA check** is the required evidence.
- Public [About](/about/) and [Privacy](/privacy/) pages explain ownership, user progress, external content and prospective Google ads. Review this language before launch.

## Step 1 — Deploy the verified V2 build
1. On Cloudflare, get your **account ID** and create a scoped **Edit Cloudflare Workers** API token.
2. In GitHub repository **Settings → Secrets and variables → Actions → Secrets**, create:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
3. Re-run the **V2 quality checks** workflow on `main` (Actions → V2 quality checks → Run workflow). The `deploy` job only runs after the `verify` job passes.
4. Inspect the deploy job and check `/build-manifest.json` on the live site. The `commitSha` must match the workflow's GitHub SHA. Use `scripts/live-smoke.mjs` and `scripts/live-browser-smoke.mjs` to verify functionality. **Do not assert deployment success if the SHA is missing or wrong.**

**If Cloudflare Workers Builds is already connected to `main`:** it may redeploy on new commits without the Actions secrets. The same live revision verification still applies.

## Step 2 — Establish a production domain
A custom registered apex domain is recommended for AdSense. Google's site URL guidance generally rejects ordinary subdomains as new sites; Cloudflare's `workers.dev` hostname is intended for testing rather than a commercial production identity.

Add the domain to Cloudflare, route the Worker to that hostname, and confirm HTTPS. Do not disable `workers.dev` unless you intentionally want to remove the preview.

Set the GitHub repository variable `V2_SITE_ORIGIN=https://your-actual-owned-domain.tld` **after** the domain is live. Do not include a trailing path. The build will use that origin for canonical links, sitemap entries and the feedback URL once the domain is approved.

## Step 3 — Editorial acceptance and indexing
Google expects a functioning, original and useful site, not just pages of copied guide summaries. Before public indexing and AdSense review:
- Audit the seven Help Center guides and high-risk region paths against current gameplay; correct steps with evidence.
- Make sure every image is either permitted promotional material, original, or licensed for this use. Do not assume third-party hotlinking confers commercial reuse rights.
- Verify all Help Center and region routes on mobile and desktop.
- Review the About and Privacy text, source attribution, and feedback channel.
- Set GitHub repository variables `V2_EDITORIAL_APPROVED=true` and `V2_INDEXING_ENABLED=true` **only after the editorial approval decision and with a custom `V2_SITE_ORIGIN`**.

Do not switch indexing on simply to obtain AdSense approval before completing the editorial audit.

## Step 4 — Start Google AdSense site verification
1. Sign in to [AdSense](https://www.google.com/adsense/start/) and use **Sites → Add site**. Add the actual owned production domain, not the Workers preview.
2. Follow AdSense's account and payment setup. Review the site's entire content against its [program policies](https://support.google.com/adsense/answer/9724).
3. Find your publisher ID under **Account → Settings → Account information**. It looks like `ca-pub-` followed by 16 digits. **Never invent or copy someone else's publisher ID.**
4. Add GitHub Actions **repository variable** `V2_ADSENSE_PUBLISHER_ID=ca-pub-...16digits...`. During the next production-domain build, V2 emits a `google-adsense-account` meta tag for ownership verification and a root `ads.txt` entry matching that ID.
5. Verify `https://your-domain/ads.txt`, metadata in page source, and request AdSense site review. An AdSense site must show **Ready** before ads can serve.

## Step 5 — Ads only after site approval
Google's requirements include a certified TCF consent management platform for personalized ads in the EEA, UK and Switzerland. Configure Google's **Privacy & messaging** solution or another approved CMP, review privacy notices and obtain consent as required. Do not simulate consent with a plain homegrown toggle.

**Only after AdSense shows Ready and consent is correctly configured**, set:
- `V2_ADSENSE_SITE_APPROVED=true`
- `V2_ADS_ENABLED=true`

The build deliberately refuses to load the AdSense script unless the publisher ID, site approval, editorial approval and indexing conditions are all satisfied.

## Things this repository cannot do automatically
It cannot buy a domain, configure your Cloudflare account without a token, access your AdSense account, complete Google's identity/payment verification, request review, guarantee approval, or grant image reuse rights. Do not paste API tokens or payment information into public GitHub files, chat messages, or website feedback.

## Official references
- [Cloudflare GitHub Actions deployment](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Google AdSense site signup](https://support.google.com/adsense/answer/2784438)
- [AdSense site verification](https://support.google.com/adsense/answer/12169212)
- [AdSense site eligibility](https://support.google.com/adsense/answer/9724)
- [Ads.txt setup](https://support.google.com/adsense/answer/12171612)
- [Google AdSense consent management](https://support.google.com/adsense/answer/13554116)
