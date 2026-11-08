import test from "node:test";
import assert from "node:assert/strict";
import {bosses} from "../src/bosses.js";
import {bossStrategies,bossEvidenceAudit,getBossStrategy,strategyCoverage,validateStrategies} from "../src/boss-strategies.js";
import {answerBossIssue,bossPhaseChoices,bossIssueCategories} from "../src/boss-troubleshooting.js";
test("all 59 encounter records have explicit independent evidence gap audit",()=>{
 assert.equal(bosses.length,59);
 assert.equal(bossEvidenceAudit.length,59);
 assert.equal(new Set(bossEvidenceAudit.map(x=>x.bossId)).size,59);
 assert.deepEqual(validateStrategies(),[]);
 assert.equal(strategyCoverage().authored,14);
 assert.equal(strategyCoverage().withBell,14);
 assert.equal(strategyCoverage().withRoute,13);
 assert.equal(strategyCoverage().missing,45);
 for(const entry of bossEvidenceAudit){
  assert.ok(entry.reviewedAt&&entry.strategyStatus&&entry.outstanding.length);
  assert.ok(entry.rosterSources.length>=2);
  assert.ok(bosses.some(x=>x.slug===entry.bossId));
 }
});
test("claim evidence supports every practical attack, route and phase",()=>{
 for(const s of Object.values(bossStrategies)){
  assert.equal(getBossStrategy(s.bossId),s);
  const allowed=new Set(s.sources.map(x=>x.id));
  for(const attack of s.attacks){
   assert.ok(attack.cue&&attack.response&&attack.avoid&&attack.problems.length);
   assert.ok(attack.evidence.every(x=>allowed.has(x)));
   assert.ok(!attack.phase||bossPhaseChoices(s.bossId).includes(attack.phase));
  }
  for(const checkpoint of s.route||[]){
   assert.ok(checkpoint.instruction&&checkpoint.check);
   assert.ok(checkpoint.evidence.every(x=>allowed.has(x)));
  }
 }
 assert.equal(getBossStrategy("acolyte-hansui"),null);
});
test("exact boss issue matches source cue and will not substitute unrelated attack",()=>{
 const shield=answerBossIssue("jing-ye-the-outlaw","Shield phase","damage-taken");
 assert.equal(shield.kind,"attack");
 assert.ok(shield.matched.some(x=>x.id==="shield-thorns"));
 assert.ok(shield.sources.some(x=>x.url.startsWith("https://")));
 const arena=answerBossIssue("jing-ye-the-outlaw","","arena");
 assert.equal(arena.kind,"route");assert.equal(arena.matched.length,3);
 assert.ok(arena.matched.every(x=>x.check));
 const prior=answerBossIssue("peng-meng-the-axemaster","","parry");
 assert.equal(prior.kind,"attack");
 assert.ok(prior.matched.some(x=>x.id==="multi-sweep"));
 const absent=answerBossIssue("acolyte-hansui","","parry");
 assert.equal(absent.kind,"missing");assert.equal(absent.matched.length,0);
 const unrelated=answerBossIssue("jing-ye-the-outlaw","Mounted phase","parry");
 assert.notEqual(unrelated.kind,"attack");
 assert.equal(answerBossIssue("jing-ye-the-outlaw","unknown phase","parry").kind,"invalid");
 assert.equal(answerBossIssue("jing-ye-the-outlaw","","unknown problem").kind,"invalid");
});
test("ten combat problems remain supported, with version-specific review metadata",()=>{
 assert.equal(new Set(bossIssueCategories.map(x=>x.id)).size,10);
 for(const p of bossIssueCategories)assert.ok(p.label);
 const hua=getBossStrategy("hua-deadly-betrothed");
 assert.equal(hua.patchReview.status,"requires-editorial-review");
 assert.equal(hua.gameVersion.includes("1.0302256"),true);
 assert.ok(hua.sources.some(x=>x.classification==="officially-documented"));
 const bai=bossPhaseChoices("bai-chilian-lady-of-the-twin-serpents");
 assert.ok(bai.includes("Sacrificial Serpent"));
 const red=answerBossIssue("red-the-mysterious-swordswoman","","arena");
 assert.equal(red.kind,"route");
});
