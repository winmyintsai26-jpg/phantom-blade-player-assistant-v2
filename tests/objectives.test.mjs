import test from "node:test";
import assert from "node:assert/strict";
import {collectibles} from "../src/collectibles.js";
import {objectiveRecords,getObjective,getObjectiveById,searchObjectives} from "../src/objectives.js";
import {findRegion} from "../src/regions.js";
import {getProblem} from "../src/help-problems.js";
import {objectiveFeedbackDraft,objectiveFeedbackUrl} from "../src/objective-feedback.js";
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
  for(const id of o.relatedIds)assert.ok(collectibles.some(c=>c.id===id),"Missing referenced collectible: "+id);
  if(o.relatedProblem)assert.ok(getProblem(o.relatedProblem),"Missing linked troubleshooting guide");
  if(o.nextProblem)assert.ok(getProblem(o.nextProblem),"Missing next boss guide");
  if(o.relatedGuide)assert.match(o.relatedGuide,/^\/guides\/[a-z-]+\/$/);
 }
});
test("search and missing routes are safe",()=>{
 assert.ok(searchObjectives("sha-chi tower").length>0);
 assert.ok(searchObjectives("outlaw trap").length>0);
 assert.equal(getObjective("weeping-creek",99999),undefined);
 assert.equal(searchObjectives("imaginary-sword-unlisted").length,0);
});

test("Outlaw Trap navigation and Jing Ye next encounter remain distinct",()=>{
 const bell=getObjective("crimson-forest",14);
 assert.ok(bell);assert.equal(bell.relatedProblem,null);
 assert.equal(bell.nextProblem,"jing-ye-dismounted");
 assert.match(bell.acquisitionSteps.join(" "),/left/i);
 assert.match(bell.acquisitionSteps.join(" "),/bridge/i);
});
test("objective feedback collects outcome and failed step without changing progress",()=>{
 const objective=getObjective("weeping-creek",52);
 const draft=objectiveFeedbackDraft({objective,outcome:"missing",failedStep:"1",missingLocation:"Gate key",platform:"PC",version:"1.0",details:"Could not access furnace."});
 assert.match(draft.body,/Missing location \/ prerequisite: Gate key/);
 assert.match(draft.body,/Step 2:/);
 assert.match(draft.body,/Platform: PC/);
 assert.match(draft.body,/Game version: 1.0/);
 assert.match(objectiveFeedbackUrl({objective,outcome:"solved",failedStep:"",missingLocation:"",platform:"",version:"",details:"Worked"}),/github.com/);
 assert.throws(()=>objectiveFeedbackDraft({objective,outcome:"not-valid"}));
});
test("Bashpole and Drunken Sword published guidance is discoverable",()=>{
 const bash=getProblem("bashpole-acquisition"),drunk=getProblem("drunken-sword");
 assert.ok(bash&&drunk);
 assert.match(bash.steps.map(x=>x.body).join(" "),/Wan Jun/);
 assert.match(drunk.steps.map(x=>x.body).join(" "),/5,000 Remnant Dust/);
});
