import {regions} from "./regions.js";
import {objectiveRecords} from "./objectives.js";
export const STATUS_PREFIX="pbz-v2-status:";
export const progressStatuses=["not-started","in-progress","completed"];
export const supportedStatusIds=[
 ...regions.flatMap(r=>r.checkpoints.map((_,i)=>"checkpoint:"+r.id+":"+i)),
 ...objectiveRecords.map(o=>"objective:"+o.id)
];
const supported=new Set(supportedStatusIds);
export const validStatusId=id=>supported.has(id);
export function readManualStatus(storage,id){
 if(!supported.has(id))return "not-started";
 try{
  const value=storage.getItem(STATUS_PREFIX+id);
  if(progressStatuses.includes(value))return value;
  if(id.startsWith("objective:")&&storage.getItem("pbz-v2-objective:"+id.slice("objective:".length))==="true")return "completed";
 }catch{}
 return "not-started";
}
export function saveManualStatus(storage,id,status){
 if(!supported.has(id)||!progressStatuses.includes(status))return false;
 storage.setItem(STATUS_PREFIX+id,status);
 if(id.startsWith("objective:"))storage.setItem("pbz-v2-objective:"+id.slice("objective:".length),String(status==="completed"));
 return true;
}
export function outstandingMissables(storage,regionId){
 const region=regions.find(r=>r.id===regionId);if(!region)return [];
 const checks=region.checkpoints.map((c,i)=>({id:"checkpoint:"+region.id+":"+i,title:c.title,detail:c.detail,risk:c.risk,href:"/regions/"+region.id+"/#checkpoint-"+i})).filter(c=>/Missable|Point of no return/i.test(c.risk));
 const objectives=objectiveRecords.filter(o=>o.region===region.id&&/missable/i.test(o.missableWarning)).map(o=>({id:"objective:"+o.id,title:o.name,detail:o.missableWarning,risk:"Source-reported missable",href:o.route}));
 return [...checks,...objectives].filter(c=>readManualStatus(storage,c.id)!=="completed");
}
export function regionStatusSummary(storage,regionId){
 const region=regions.find(r=>r.id===regionId);if(!region)return null;
 const ids=supportedStatusIds.filter(id=>id.startsWith("checkpoint:"+regionId+":")||id.startsWith("objective:"+regionId+":"));
 return {region,counts:Object.fromEntries(progressStatuses.map(s=>[s,ids.filter(id=>readManualStatus(storage,id)===s).length])),total:ids.length,warnings:outstandingMissables(storage,regionId)};
}
