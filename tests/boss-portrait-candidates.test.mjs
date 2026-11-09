import test from "node:test";
import assert from "node:assert/strict";
import {bosses} from "../src/bosses.js";
import {portraitCandidates,portraitCandidateStats} from "../src/boss-portrait-candidates.js";
import {bossImageManifest,bossImageCounts} from "../src/boss-images.js";
import {bossImageHtml} from "../src/boss-image-ui.js";

test("each documented fight has a matched, exact research-page candidate record",()=>{
 assert.equal(bosses.length,59);
 assert.equal(Object.keys(portraitCandidates).length,59);
 assert.deepEqual(portraitCandidateStats(),{researched:59,labeledReferenceImages:59,noPortraitFound:0,approvedForDisplay:0});
 assert.equal(new Set(Object.keys(portraitCandidates)).size,59);
 for(const boss of bosses){
  const c=portraitCandidates[boss.slug];
  assert.equal(c?.bossId,boss.slug);
  assert.match(c.sourcePageUrl,/^https:\/\/(?:pbz\.gg\/bosses\/|wikily\.gg\/phantom-blade-zero\/bosses\/)[a-z0-9-]+\/?$/);
  assert.equal(c.permissionStatus,"not-authorized-for-republication");
  assert.equal(c.mayHost,false);
  assert.equal(c.mayEmbed,false);
  assert.match(c.imageReferenceStatus,/^(source-alt-labeled; visual verification pending|no-portrait-on-researched-page)$/);
  assert.equal(bossImageManifest[boss.slug].researchPageUrl,c.sourcePageUrl);
  assert.equal(bossImageManifest[boss.slug].researchPortraitUrl,c.candidateImageUrl);
 }
});
test("no false portrait references or accidental duplicate image assignments",()=>{
 const found=Object.values(portraitCandidates).filter(c=>c.candidateImageUrl);
 assert.equal(found.length,59);
 assert.equal(new Set(found.map(c=>c.candidateImageUrl)).size,59);
 for(const c of found){
  assert.match(c.candidateImageUrl,/^https:\/\/(?:pbz\.gg\/_ipx\/|wikily\.gg\/api\/media\/)/);
  assert.match(c.candidateImageUrl,/\.webp(?:\?.*)?$/);
 }
 const missing=Object.values(portraitCandidates).filter(c=>!c.candidateImageUrl);
 assert.deepEqual(missing.map(c=>c.bossId).sort(),[]);
 assert.equal(bossImageCounts().approved,0);
});
test("research reference links stay external and never load unlicensed candidate media",()=>{
 for(const boss of bosses){
  const html=bossImageHtml(boss,{profile:true});
  const candidate=portraitCandidates[boss.slug];
  assert.match(html,/data-image-status="fallback"/);
  assert.ok(!html.includes('src="'+candidate.candidateImageUrl+'"'));
  if(candidate.candidateImageUrl){
   assert.ok(html.includes('href="'+candidate.sourcePageUrl+'"'));
   assert.ok(html.includes("not licensed for reuse"));
   assert.ok(html.includes('rel="noopener noreferrer"'));
  }else{
   assert.ok(!html.includes("View the third-party labeled boss portrait"));
  }
  const card=bossImageHtml(boss);
  assert.ok(!card.includes(candidate.sourcePageUrl),"no nested anchor inside clickable boss directory card");
 }
});
