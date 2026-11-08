import {collectibles} from "./collectibles.js";
import {objectiveRecords} from "./objectives.js";
import {findRegion} from "./regions.js";
const curated=new Map(objectiveRecords.map(o=>[o.id,o]));
export const itemTypes=[...new Set(collectibles.map(c=>c.type))].sort();
export function findItemRecords({query="",region="",type=""}={}){
 const q=String(query).trim().toLowerCase();
 const list=(!q&&!region&&!type)?objectiveRecords:collectibles;
 return list.filter(c=>(!region||c.region===region)&&(!type||c.type===type)&&
  (!q||[c.name,c.type,c.area,c.direction,findRegion(c.region)?.name,curated.get(c.id)?.nearestBell].join(" ").toLowerCase().includes(q))
 ).map(c=>{
  const full=curated.get(c.id),reg=findRegion(c.region);
  return {id:c.id,name:c.name,type:c.type,regionName:reg?.name||c.region,region:c.region,area:c.area,
   nearestBell:full?.nearestBell||null,
   prerequisites:full?.prerequisites||null,
   steps:full?.acquisitionSteps||null,
   confirmation:full?.completionConfirmation||null,
   direction:c.direction,
   href:full?.route||"/regions/"+c.region+"/#item-"+c.sourceNumber,
   status:full?full.verification:"Source-indexed reference · detailed route not established",
   isCurated:Boolean(full)};
 });
}
