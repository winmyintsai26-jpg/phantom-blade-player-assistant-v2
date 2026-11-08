import test from "node:test";
import assert from "node:assert/strict";
import {makeProgressBackup,restoreProgressBackup,nextAction,parseProgress,sanitizeProgress} from "../src/progress.js";
import {weepingEvidence} from "../src/weeping-evidence.js";
import {regions} from "../src/regions.js";
import {regionCollectibles} from "../src/collectibles.js";
const makeStorage=(initial={})=>{const values=new Map(Object.entries(initial));return {getItem:key=>values.has(key)?values.get(key):null,setItem:(key,val)=>values.set(key,String(val)),entries:()=>Object.fromEntries(values)}};
test("invalid, out-of-range and repeated ticks cannot enter progress",()=>{
 assert.deepEqual(sanitizeProgress("items-weeping-creek",[1,1,27,999,"2",-3]),[1,27]);
 assert.deepEqual(parseProgress("region-weeping-creek","bad"),[]);
 assert.deepEqual(parseProgress("items-weeping-creek",'[27,999,27]'),[27]);
});
test("backup restores across devices without deleting existing ticks",()=>{
 const first=makeStorage({"pbz-v2-progress:items-weeping-creek":"[1,27]","pbz-v2-settings:show-spoilers":"true"});
 const backup=makeProgressBackup(first,"2026-11-07T00:00:00.000Z");
 assert.equal(backup.version,2);
 assert.deepEqual(backup.progress["items-weeping-creek"],[1,27]);
 const second=makeStorage({"pbz-v2-progress:items-weeping-creek":"[2]"});
 const count=restoreProgressBackup(second,backup);
 assert.ok(count>=9);
 assert.deepEqual(JSON.parse(second.getItem("pbz-v2-progress:items-weeping-creek")),[1,2,27]);
 assert.equal(second.getItem("pbz-v2-settings:show-spoilers"),"true");
});
test("objective confirmations export and import without overwriting completed results",()=>{
 const first=makeStorage({"pbz-v2-objective:weeping-creek:52":"true","pbz-v2-objective:crimson-forest:14":"false"});
 const backup=makeProgressBackup(first);
 assert.equal(backup.objectives["weeping-creek:52"],true);
 assert.equal(backup.objectives["crimson-forest:14"],false);
 const second=makeStorage({"pbz-v2-objective:crimson-forest:14":"true"});
 restoreProgressBackup(second,backup);
 assert.equal(second.getItem("pbz-v2-objective:weeping-creek:52"),"true");
 assert.equal(second.getItem("pbz-v2-objective:crimson-forest:14"),"true");
});
test("legacy V2 version-one backups remain importable",()=>{
 const legacy={app:"phantom-blade-player-assistant-v2",version:1,progress:{"items-weeping-creek":[27]},settings:{showSpoilers:false}};
 const second=makeStorage();
 restoreProgressBackup(second,legacy);
 assert.deepEqual(JSON.parse(second.getItem("pbz-v2-progress:items-weeping-creek")),[27]);
});
test("invalid objective identifiers cannot write any restored progress",()=>{
 const second=makeStorage();
 const backup=makeProgressBackup(second);
 backup.objectives["untrusted-id"]=true;
 assert.throws(()=>restoreProgressBackup(second,backup),/invalid objective/);
 assert.deepEqual(second.entries(),{});
});
test("reject suspicious backup ids and out of range indexes before writing",()=>{
 const second=makeStorage();
 assert.throws(()=>restoreProgressBackup(second,{app:"phantom-blade-player-assistant-v2",version:1,progress:{"malicious":[1]}}));
 assert.throws(()=>restoreProgressBackup(second,{app:"phantom-blade-player-assistant-v2",version:1,progress:{"items-weeping-creek":[999]}}));
 assert.deepEqual(second.entries(),{});
});
test("next action points to earliest unmet critical checkpoint, then an item",()=>{
 const first=nextAction(()=>[]);
 assert.equal(first.region.id,"weeping-creek");
 assert.match(first.href,/^\/regions\/weeping-creek\/#checkpoint-/);
 const critical=regions[0].checkpoints.map((c,i)=>({c,i})).filter(({c})=>/Missable|Point of no return/.test(c.risk)).map(({i})=>i);
 for(let n=0;n<critical.length;n++){
   const partial=critical.slice(0,n);
   const action=nextAction(id=>id==="region-weeping-creek"?partial:[]);
   assert.equal(action.href,"/regions/weeping-creek/#checkpoint-"+critical[n],"next critical warning must come before collectibles");
 }
 const next=nextAction(id=>id==="region-weeping-creek"?regions[0].checkpoints.map((_,i)=>i):[]);
 assert.equal(next.region.id,"weeping-creek");
 assert.ok(next.href.includes("#item-"));
});
test("Weeping Creek researched bosses and tales link to existing collectible source numbers",()=>{
 const numbers=new Set(regionCollectibles("weeping-creek").map(c=>c.sourceNumber));
 assert.ok(weepingEvidence.bosses.length>=4);
 assert.ok(weepingEvidence.tales.length>=6);
 for(const entry of [...weepingEvidence.bosses,...weepingEvidence.tales]){
   assert.ok(numbers.has(entry.number),entry.title);
   assert.ok(entry.bell && entry.title);
 }
 for(const url of weepingEvidence.sources)assert.equal(new URL(url).protocol,"https:");
 assert.equal(regions[0].id,"weeping-creek");
});
