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
