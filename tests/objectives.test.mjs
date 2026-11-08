import test from "node:test";
import assert from "node:assert/strict";
import {collectibles} from "../src/collectibles.js";
import {objectiveRecords,getObjective,getObjectiveById,searchObjectives} from "../src/objectives.js";
import {findRegion} from "../src/regions.js";
test("phase 2 publishes only curated, unique objective records",()=>{
 assert.equal(objectiveRecords.length,9);
 assert.equal(new Set(objectiveRecords.map(o=>o.stableId)).size,objectiveRecords.length);
 assert.equal(new Set(objectiveRecords.map(o=>o.route)).size,objectiveRecords.length);
 for(const o of objectiveRecords){
  assert.ok(collectibles.some(c=>c.id===o.id));
  assert.ok(findRegion(o.region));
  assert.match(o.route,/^\/objectives\/[a-z-]+\/\d+\/$/);
  assert.ok(o.prerequisites.length&&o.acquisitionSteps.length);
  assert.ok(o.nearestBell&&o.completionConfirmation&&o.missableWarning);
  assert.ok(o.sources.length&&o.sources.every(s=>s.url.startsWith("https://")));
  assert.match(o.verification,/not gameplay-tested/i);
  assert.equal(getObjective(o.region,o.sourceNumber)?.id,o.id);
  for(const id of o.relatedIds)assert.ok(getObjectiveById(id),"Missing related record: "+id);
 }
});
test("search and missing routes are safe",()=>{
 assert.ok(searchObjectives("sha-chi tower").length>0);
 assert.ok(searchObjectives("outlaw trap").length>0);
 assert.equal(getObjective("weeping-creek",99999),undefined);
 assert.equal(searchObjectives("imaginary-sword-unlisted").length,0);
});
