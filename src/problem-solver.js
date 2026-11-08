import {problems} from "./help-problems.js";
import {objectiveRecords} from "./objectives.js";
import {regions} from "./regions.js";
import {bosses} from "./bosses.js";

export const solverCategories=[
 {id:"boss",label:"Boss fight"},
 {id:"quest",label:"Quest or puzzle"},
 {id:"item",label:"Item or collectible"},
 {id:"navigation",label:"Exploration or navigation"}
];
const categoryForProblem=p=>{
 if(p.category==="Boss Fights"||p.category==="Combat Mechanics")return "boss";
 if(p.category==="Map Exploration & Navigation")return "navigation";
 if(p.category==="Weapons & Equipment")return "item";
 return "quest";
};
export function problemCandidates(category){
 if(!solverCategories.some(x=>x.id===category))return [];
 const help=problems.filter(p=>categoryForProblem(p)===category).map(p=>({
  id:"problem:"+p.id,kind:"problem",category,title:p.title,region:p.region,href:"/help/"+p.id+"/",
  requirements:p.prerequisites,steps:p.steps.map(s=>s.body),confirmation:p.steps.at(-1)?.check||null,
  recovery:p.troubleshooting,choices:p.choices,status:p.status
 }));
 const bossList=category==="boss"?bosses.map(b=>({
  id:"boss:"+b.slug,kind:"boss",category,title:b.name,region:b.regionName,href:"/bosses/"+b.slug+"/",
  requirements:[],steps:[],confirmation:null,recovery:[],choices:[],
  status:b.hasStrategy?"Existing curated boss-specific guidance":b.hasExternalStrategy?"Published moveset guide linked on boss profile":"Detailed strategy not yet documented"
 })):[];
 const item=objectiveRecords.filter(o=>
  category==="item"?!["Bell","Tale","Challenge"].includes(o.type):
  category==="navigation"?o.type==="Bell":
  category==="quest"?o.type==="Tale":false
 ).map(o=>({
  id:"objective:"+o.id,kind:"objective",category,title:o.name,region:o.regionName,href:o.route,
  requirements:o.prerequisites,steps:o.acquisitionSteps,confirmation:o.completionConfirmation,
  recovery:[o.missableWarning],choices:[],status:o.verification
 }));
 const locations=category==="navigation"?regions.map(r=>({
  id:"region:"+r.id,kind:"region",category,title:r.name,region:r.name,href:"/regions/"+r.id+"/",
  requirements:[],steps:[],confirmation:null,recovery:[],choices:[],status:"Region reference · specific route may be incomplete"
 })):[];
 return [...help,...bossList,...item,...locations].sort((a,b)=>a.title.localeCompare(b.title));
}
export const getProblemCandidate=(category,id)=>problemCandidates(category).find(x=>x.id===id)||null;
export function problemSolution(category,id,choiceIndex=""){
 const candidate=getProblemCandidate(category,id);
 if(!candidate)return null;
 const idx=choiceIndex===""?null:Number(choiceIndex);
 const chosen=Number.isSafeInteger(idx)&&idx>=0?candidate.choices[idx]:null;
 return {...candidate,focused:chosen?{title:chosen.lead,steps:chosen.steps}:null,
  hasSpecificInstructions:Boolean(candidate.steps.length||chosen?.steps?.length),
  isGameplayVerified:false};
}
