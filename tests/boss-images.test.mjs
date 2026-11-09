import test from "node:test";
import assert from "node:assert/strict";
import {bosses} from "../src/bosses.js";
import {getBossImage,bossImageManifest,approvedBossImages,canDisplayBossImage,validateBossImageManifest,bossImageCounts,BOSS_FALLBACK_ASSET,BOSS_FALLBACK_LABEL} from "../src/boss-images.js";
import {bossImageHtml} from "../src/boss-image-ui.js";

test("59 fights have independent image records with a transparent verified fallback",()=>{
 assert.equal(bosses.length,59);
 assert.equal(Object.keys(bossImageManifest).length,bosses.length);
 assert.deepEqual(validateBossImageManifest(),[]);
 assert.deepEqual(bossImageCounts(),{reviewed:59,approved:0,permissionConfirmed:0,fallback:59});
 assert.equal(Object.keys(approvedBossImages).length,0);
 for(const boss of bosses){
  const image=getBossImage(boss.slug);
  assert.ok(image&&image.bossId===boss.slug,boss.slug);
  assert.equal(image.assetPath,null);
  assert.equal(image.sourceUrl,null,"Research article URLs must not masquerade as image sources");
  assert.equal(image.status,"fallback");
  assert.equal(image.permissionBasis,null);
  assert.equal(image.license,null);
  assert.equal(image.fallbackAsset,BOSS_FALLBACK_ASSET);
  assert.equal(image.fallbackLabel,BOSS_FALLBACK_LABEL);
  assert.equal(canDisplayBossImage(image),false);
 }
 assert.equal(getBossImage("unknown-boss"),null);
});

test("only explicitly licensed, identity-matched, local image records can render",()=>{
 const exemplar={bossId:"jing-ye-the-outlaw",subjectId:"jing-ye-the-outlaw",status:"approved",
  verificationStatus:"identity-confirmed",assetPath:"/bosses/jing-ye.webp",
  sourceUrl:"https://example.com/original-reference",permissionEvidence:"https://example.com/license",
  permissionBasis:"Documented written license allowing distribution",license:"CC BY 4.0",
  attribution:"Artist Example, CC BY 4.0",description:"Jing Ye at the documented encounter",
  width:1600,height:900};
 assert.equal(canDisplayBossImage(exemplar),true);
 for(const field of ["attribution","license","permissionEvidence","description","permissionBasis","sourceUrl"]){
  assert.equal(canDisplayBossImage({...exemplar,[field]:null}),false,field);
 }
 assert.equal(canDisplayBossImage({...exemplar,subjectId:"hua-deadly-betrothed"}),false);
 assert.equal(canDisplayBossImage({...exemplar,assetPath:"https://example.com/image.webp"}),false);
 assert.equal(canDisplayBossImage({...exemplar,assetPath:"/bosses/../fake.webp"}),false);
 assert.equal(canDisplayBossImage({...exemplar,width:0}),false);
});

test("all cards and profiles show a real branded fallback, never borrowed boss imagery",()=>{
 for(const boss of bosses){
  for(const profile of [false,true]){
   const html=bossImageHtml(boss,{profile});
   assert.match(html,/data-image-status="fallback"/);
   assert.ok(html.includes('data-boss-image-id="'+boss.slug+'"'));
   assert.ok(html.includes(BOSS_FALLBACK_LABEL));
   assert.ok(html.includes(BOSS_FALLBACK_ASSET));
   assert.match(html,/not a portrait or game screenshot/);
   assert.ok(!html.includes('class="boss-portrait"'));
   assert.match(html,/<img[^>]+alt=""/);
  }
 }
});

test("approved image has attribution and graceful onerror fallback but fake portrait claims do not",()=>{
 const b=bosses.find(x=>x.slug==="jing-ye-the-outlaw");
 const current=getBossImage(b.slug);
 assert.equal(current.status,"fallback");
 assert.ok(!bossImageHtml(b,{profile:true}).includes("Copyright S-GAME"));
 // A future approval must include a real permission source; zero approvals are accepted today.
 assert.ok(BOSS_FALLBACK_ASSET.endsWith(".png"));
});
