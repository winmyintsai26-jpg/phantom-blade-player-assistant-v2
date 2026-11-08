import {regions} from "./regions.js";
import {guides} from "./guides.js";
import {regionCollectibles} from "./collectibles.js";
import {objectiveRecords} from "./objectives.js";

export const PREFIX="pbz-v2-progress:";
export const SPOILER_KEY="pbz-v2-settings:show-spoilers";
export const BACKUP_VERSION=2;
export const OBJECTIVE_PREFIX="pbz-v2-objective:";
const objectiveIds=new Set(objectiveRecords.map(o=>o.id));
const allowed=new Map();
for(const g of guides)allowed.set(g.id,new Set(g.steps.map((_,i)=>i)));
for(const r of regions){
  allowed.set("region-"+r.id,new Set(r.checkpoints.map((_,i)=>i)));
  allowed.set("items-"+r.id,new Set(regionCollectibles(r.id).map(c=>c.sourceNumber)));
}
export function validProgressId(id){return allowed.has(id)}
export function sanitizeProgress(id,value){
  const valid=allowed.get(id);
  if(!valid||!Array.isArray(value))return [];
  return [...new Set(value.filter(n=>Number.isSafeInteger(n)&&valid.has(n)))].sort((a,b)=>a-b);
}
export function parseProgress(id,raw){
  try{return sanitizeProgress(id,JSON.parse(raw||"[]"))}catch{return []}
}
export function makeProgressBackup(storage,createdAt=new Date().toISOString()){
  const progress={};
  for(const id of allowed.keys())progress[id]=parseProgress(id,storage.getItem(PREFIX+id));
  const objectives={};
  for(const id of objectiveIds)objectives[id]=storage.getItem(OBJECTIVE_PREFIX+id)==="true";
  return {app:"phantom-blade-player-assistant-v2",version:BACKUP_VERSION,createdAt,progress,objectives,settings:{showSpoilers:storage.getItem(SPOILER_KEY)==="true"}};
}
export function restoreProgressBackup(storage,backup){
  if(!backup||typeof backup!=="object"||Array.isArray(backup)||backup.app!=="phantom-blade-player-assistant-v2"||![1,BACKUP_VERSION].includes(backup.version)||!backup.progress||typeof backup.progress!=="object"||Array.isArray(backup.progress))throw new Error("Not a supported Phantom Blade Zero V2 progress backup.");
  const entries=Object.entries(backup.progress);
  for(const [id,steps] of entries){
    if(!validProgressId(id)||!Array.isArray(steps)||steps.length>1000||steps.some(n=>!Number.isSafeInteger(n)||!allowed.get(id).has(n)))throw new Error("Backup has unrecognized or invalid progress.");
  }
  const objectiveEntries=backup.version===2?Object.entries(backup.objectives||{}):[];
  if(backup.version===2&&(!backup.objectives||typeof backup.objectives!=="object"||Array.isArray(backup.objectives)))throw new Error("Invalid objective confirmations in backup.");
  for(const [id,value] of objectiveEntries){
    if(!objectiveIds.has(id)||typeof value!=="boolean")throw new Error("Backup has invalid objective confirmations.");
  }
  const updates=entries.map(([id,steps])=>[PREFIX+id,JSON.stringify(sanitizeProgress(id,steps))]);
  // Merge existing progress rather than deleting/checking off unrelated saved work.
  for(const [key,value] of updates){const id=key.slice(PREFIX.length);storage.setItem(key,JSON.stringify(sanitizeProgress(id,[...parseProgress(id,storage.getItem(key)),...JSON.parse(value)])));}
  for(const [id,value] of objectiveEntries)if(value)storage.setItem(OBJECTIVE_PREFIX+id,"true");
  if(backup.settings?.showSpoilers===true)storage.setItem(SPOILER_KEY,"true");
  return entries.length;
}
export function nextAction(readProgress){
  for(const r of regions){
    const checkpoints=readProgress("region-"+r.id);
    const priority=r.checkpoints.findIndex((c,i)=>!checkpoints.includes(i)&&/Missable|Point of no return/.test(c.risk));
    if(priority!==-1)return {region:r,title:r.checkpoints[priority].title,kind:"critical checkpoint",href:"/regions/"+r.id+"/#checkpoint-"+priority};
    const entries=regionCollectibles(r.id);
    const found=readProgress("items-"+r.id);
    const next=entries.find(c=>!found.includes(c.sourceNumber));
    if(next)return {region:r,title:next.name,kind:"collectible #"+next.sourceNumber,href:"/regions/"+r.id+"/#item-"+next.sourceNumber};
    const normal=r.checkpoints.findIndex((_,i)=>!checkpoints.includes(i));
    if(normal!==-1)return {region:r,title:r.checkpoints[normal].title,kind:"checkpoint",href:"/regions/"+r.id+"/#checkpoint-"+normal};
  }
  return null;
}
