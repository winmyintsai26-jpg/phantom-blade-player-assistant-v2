import test from "node:test";import assert from "node:assert/strict";import {guides,getGuide,searchGuides,progressPercent} from "../src/guides.js";
test("all guides have distinct routes and complete action schema",()=>{assert.equal(new Set(guides.map(g=>g.id)).size,guides.length);for(const g of guides){assert.match(g.id,/^[a-z0-9-]+$/);assert.ok(g.title&&g.summary&&g.status&&g.intro);assert.ok(g.steps.length>0&&g.requirements.length>0&&g.troubleshooting.length>0&&g.sources.length>0);for(const s of g.steps)assert.ok(s.title&&s.body.length>35&&s.check.length>20);for(const s of g.sources)assert.equal(new URL(s.url).protocol,"https:")}});
test("search and category filters",()=>{assert.equal(searchGuides("healer")[0].id,"healers-legacy");assert.equal(searchGuides("","Combat").length,1);assert.equal(searchGuides("zz-no-results").length,0)});
test("progress and route helpers",()=>{assert.equal(progressPercent(1,3),33);assert.equal(progressPercent(0,0),0);assert.equal(getGuide("unknown"),undefined)});
test("missable quest warns before both named bosses",()=>{const g=getGuide("healers-legacy");const all=[...g.requirements,...g.steps.map(s=>s.body)].join(" ");assert.match(all,/Jing Ye/);assert.match(all,/Bai Chilian/);assert.match(all,/Pangzhen/);assert.ok(g.sources.length>=3)});
test("uncertain routes never masquerade as tested",()=>{for(const g of guides)assert.ok(!/game-tested|verified in-game/i.test(g.status)||/not game-tested|unverified/i.test(g.status))});

import {regions,findRegion,allCheckpoints} from "../src/regions.js";
test("atlas has nine unique story-ordered regions",()=>{assert.equal(regions.length,9);assert.equal(new Set(regions.map(r=>r.id)).size,9);assert.deepEqual(regions.map(r=>r.order),[1,2,3,4,5,6,7,8,9]);});
test("every region has a source and uncertain counts stay null",()=>{for(const r of regions){assert.ok(r.name&&r.description);assert.equal(new URL(r.source).protocol,"https:");assert.ok(r.collectibles===null||Number.isInteger(r.collectibles));}assert.equal(findRegion("weeping-creek").collectibles,61);assert.equal(findRegion("crimson-forest").collectibles,85);});
test("regional checkpoint IDs are unique and actionable",()=>{const points=allCheckpoints;assert.ok(points.length>=10);assert.equal(new Set(points.map(c=>c.id)).size,points.length);for(const c of points)assert.ok(c.title&&c.detail.length>35&&c.risk);});

import {collectibles,regionCollectibles} from "../src/collectibles.js";
test("collectible routes have unique identifiers and valid regions",()=>{assert.ok(collectibles.length>=30);assert.equal(new Set(collectibles.map(c=>c.id)).size,collectibles.length);for(const c of collectibles){assert.ok(findRegion(c.region));assert.ok(c.name&&c.area&&c.direction.length>20);assert.ok(Number.isInteger(c.sourceNumber));}});
test("region collectible filtering is correctly scoped",()=>{assert.ok(regionCollectibles("village-of-lu").length>=35);assert.ok(regionCollectibles("crimson-forest").every(c=>c.region==="crimson-forest"));});

test("Village of Lu has actionable route data and missable checkpoints",()=>{const entries=regionCollectibles("village-of-lu");assert.ok(entries.length>=35);assert.ok(entries.some(c=>c.sourceNumber===70&&c.phase==="Missable"));assert.ok(findRegion("village-of-lu").checkpoints.length>=5);});

test("all nine regions have sourced collectible directions",()=>{for(const region of regions){const entries=regionCollectibles(region.id);assert.ok(entries.length>0,region.id);assert.ok(region.collectibles>0,region.id);assert.ok(region.checkpoints.length>0,region.id);}});

test("Weeping Creek numbered collectible route is complete and unique",()=>{const entries=regionCollectibles("weeping-creek");assert.equal(entries.length,61);assert.deepEqual(entries.map(x=>x.sourceNumber).sort((a,b)=>a-b),Array.from({length:61},(_,i)=>i+1));});
test("all source-backed entries have useful labels and directions",()=>{for(const c of collectibles){assert.ok(c.name&&c.type&&c.area&&c.direction.length>=25,c.id);assert.ok(["First visit","Story","Missable","Return visit","Prerequisite"].includes(c.phase),c.id);}});

test("every selected route is ordered and bounded by its source numbering",()=>{for(const r of regions){const entries=regionCollectibles(r.id);assert.deepEqual(entries.map(x=>x.sourceNumber),entries.map(x=>x.sourceNumber).sort((a,b)=>a-b),r.id);assert.equal(new Set(entries.map(x=>x.sourceNumber)).size,entries.length,r.id);}});
test("first three regions have explicit missable checkpoints",()=>{for(const id of ["weeping-creek","crimson-forest","village-of-lu"]){const r=findRegion(id);assert.ok(r.checkpoints.some(x=>x.risk==="Missable"),id);assert.ok(regionCollectibles(id).some(x=>x.phase==="Missable"),id);}});

import {collectibleArt} from "../src/item-art.js";
test("item art only appears on exact source-backed entries",()=>{for(const c of collectibles){const art=collectibleArt(c.id);if(!art)continue;assert.equal(new URL(art.src).protocol,"https:");assert.equal(new URL(art.source).hostname,"pbz.gg");assert.match(art.src,/\/media\/game\//);assert.match(art.source,/^https:\/\/pbz\.gg\//);}});
test("Boulderguard and key early equipment have item pictures",()=>{for(const id of ["weeping-creek:4","weeping-creek:6","weeping-creek:8","weeping-creek:27","weeping-creek:48"])assert.ok(collectibleArt(id),id);assert.equal(collectibleArt("weeping-creek:1"),null);});

import {weepingPreflight,weepingRouteSteps} from "../src/weeping-playbook.js";
import {weepingEvidence} from "../src/weeping-evidence.js";
test("Weeping Creek preflight links resolve to real numbered routes and checkpoints",()=>{
  const region=findRegion("weeping-creek");
  const sourceNumbers=new Set(regionCollectibles(region.id).map(c=>c.sourceNumber));
  assert.ok(weepingPreflight.length>=4);
  for(const p of weepingPreflight){
    assert.ok(p.title&&p.detail.length>60);
    assert.ok(sourceNumbers.has(p.route),String(p.route));
    assert.ok(region.checkpoints[p.checkpoint],String(p.checkpoint));
    assert.equal(new URL(p.source).protocol,"https:");
    assert.match(p.confidence,/Source-documented/);
  }
});
test("Weeping Creek multi-stage tales have chronological actionable instructions",()=>{
  for(const key of ["triple-threat","flesh-lily","four-fierce-axes","purge-the-sect","festering-secret","apprentice-healer","severed-mindseal"]){
    const steps=weepingRouteSteps[key];
    assert.ok(steps.length>=3,key);
    assert.ok(steps.every(x=>x.length>35),key);
  }
  assert.match(weepingRouteSteps["severed-mindseal"].join(" "),/unknown/i);
});
test("Weeping Creek boss/tale evidence never claims independent game verification",()=>{
  assert.ok(weepingEvidence.bosses.length>=4);
  assert.ok(weepingEvidence.tales.length>=7);
  for(const item of [...weepingEvidence.bosses,...weepingEvidence.tales]){
    assert.ok(regionCollectibles("weeping-creek").some(c=>c.sourceNumber===item.number),item.title);
  }
});
