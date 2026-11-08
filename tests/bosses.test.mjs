import test from "node:test";
import assert from "node:assert/strict";
import {bosses,bossBySlug,searchBosses,bossAdvice,bossCounts,combatProblems} from "../src/bosses.js";
import {externalBossGuides} from "../src/boss-external-guides.js";
import {problemCandidates} from "../src/problem-solver.js";
import {regions} from "../src/regions.js";
import {readManualStatus,saveManualStatus} from "../src/progress-status.js";
import {makeProgressBackup,restoreProgressBackup} from "../src/progress.js";
import {readBossTried,writeBossTried} from "../src/boss-progress.js";
const store=initial=>{const map=new Map(Object.entries(initial||{}));return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v)),dump:()=>Object.fromEntries(map)}};
test("all documented grouped fight records have unique stable slugs and sources",()=>{
 assert.equal(bosses.length,59);
 assert.equal(new Set(bosses.map(x=>x.slug)).size,bosses.length);
 assert.equal(new Set(bosses.map(x=>x.name.toLowerCase()+"|"+x.region)).size,bosses.length);
 for(const boss of bosses){
  assert.match(boss.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(bossBySlug(boss.slug),boss);
  assert.ok(boss.name&&boss.family&&boss.regionName);
  assert.ok(boss.region==="Prologue"||regions.some(r=>r.id===boss.region),boss.name+" region");
  assert.ok(boss.sources.length>=2);
  for(const source of boss.sources)assert.match(source.url,/^https:\/\//);
  assert.ok(["main","optional","undetermined"].includes(boss.category));
  assert.equal(boss.verification.includes("gameplay-tested"),true);
 }
 const x=bossCounts();
 assert.equal(x.total,bosses.length);
 assert.equal(x.located,bosses.length);
 assert.ok(x.strategies>0&&x.strategies<bosses.length);
});
test("external sources are URL-validated and separately counted from V2 strategies",()=>{
 assert.equal(Object.keys(externalBossGuides).length,48);
 assert.equal(bossCounts().externalStrategyLinks,47);
 for(const [slug,g] of Object.entries(externalBossGuides)){
  const b=bossBySlug(slug);assert.ok(b,"External source has no boss: "+slug);
  assert.equal(b.externalGuide?.url,g.url);
  assert.match(g.url,/^https:\/\/allthings\.how\/phantom-blade-zero-/);
  assert.ok(["strategy","location"].includes(g.kind));
 }
 const bossesInSolver=problemCandidates("boss").filter(x=>x.kind==="boss");
 assert.equal(bossesInSolver.length,bosses.length);
 assert.ok(bossBySlug("bai-chilian-lady-of-the-twin-serpents").phases.length>1);
 assert.ok(bossBySlug("jing-ye-the-outlaw").phaseNote.includes("sources"));
});
test("search recognizes alternate health-bar titles, case and regional categories",()=>{
 assert.equal(searchBosses({query:"jInG yE"}).some(x=>x.name.includes("Jing Ye")),true);
 assert.equal(searchBosses({query:"frost yucong"}).length,1);
 assert.equal(searchBosses({query:"phosphor consciousness"}).length,1);
 assert.ok(searchBosses({region:"meigu-lake"}).length>0);
 assert.ok(searchBosses({region:"meigu-lake"}).every(x=>x.region==="meigu-lake"));
 assert.ok(searchBosses({category:"optional"}).every(x=>x.category==="optional"));
 assert.deepEqual(searchBosses({query:"no boss by this name"}),[]);
});
test("phase and issue selection shows only supported fight evidence, not fabricated advice",()=>{
 const combat=bossAdvice("jing-ye-the-outlaw","Shield phase","damage");
 assert.equal(combat.kind,"documented");
 assert.ok(combat.steps.length>0);
 const missing=bossAdvice("peng-meng-the-axemaster","", "parry");
 assert.equal(missing.kind,"missing");
 assert.equal(missing.generalHref,"/guides/combat-diagnostics/");
 const unrelated=bossAdvice("jing-ye-the-outlaw","Shield phase","healing");
 assert.equal(unrelated.kind,"missing");
 assert.equal(bossAdvice("unknown-boss"),null);
 assert.ok(combatProblems.some(x=>x.id==="preparation"));
});
test("manual boss statuses and strategies tried persist locally and in v4 backups",()=>{
 const one=store(),two=store();
 assert.equal(readManualStatus(one,"boss:jing-ye-the-outlaw"),"not-started");
 assert.equal(saveManualStatus(one,"boss:jing-ye-the-outlaw","in-progress"),true);
 assert.equal(writeBossTried(one,"jing-ye-the-outlaw",["parry","dodge"]),true);
 assert.deepEqual(readBossTried(one,"jing-ye-the-outlaw"),["parry","dodge"]);
 assert.equal(writeBossTried(one,"jing-ye-the-outlaw",["invalid"]),false);
 assert.equal(saveManualStatus(one,"boss:bogus","completed"),false);
 const copy=makeProgressBackup(one);
 assert.equal(copy.version,4);
 assert.deepEqual(copy.bossAttempts["jing-ye-the-outlaw"],["parry","dodge"]);
 saveManualStatus(two,"boss:jing-ye-the-outlaw","completed");
 restoreProgressBackup(two,copy);
 assert.equal(readManualStatus(two,"boss:jing-ye-the-outlaw"),"completed");
 assert.deepEqual(readBossTried(two,"jing-ye-the-outlaw"),["parry","dodge"]);
 const bad=structuredClone(copy);bad.bossAttempts["bogus"]=["parry"];
 const clean=store();
 assert.throws(()=>restoreProgressBackup(clean,bad),/Invalid boss attempts/);
 assert.deepEqual(clean.dump(),{});
});
test("version-three backups still import without losing existing completion",()=>{
 const orig=store();saveManualStatus(orig,"boss:jing-ye-the-outlaw","completed");
 const other=store();const copy=makeProgressBackup(other);
 const v3={app:copy.app,version:3,progress:copy.progress,objectives:copy.objectives,statuses:Object.fromEntries(Object.entries(copy.statuses).filter(([id])=>!id.startsWith("boss:"))),settings:copy.settings};
 restoreProgressBackup(orig,v3);
 assert.equal(readManualStatus(orig,"boss:jing-ye-the-outlaw"),"completed");
});
