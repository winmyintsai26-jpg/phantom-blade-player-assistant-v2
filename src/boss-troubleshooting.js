import {bossBySlug,combatProblems} from "./bosses.js";
import {getBossStrategy} from "./boss-strategies.js";
import {problems as helpProblems} from "./help-problems.js";
export const bossIssueCategories=[
 {id:"dodge",label:"Cannot dodge a specific attack"},
 {id:"parry",label:"Cannot parry consistently"},
 {id:"cues",label:"Cannot recognize the next attack"},
 {id:"damage-taken",label:"Taking too much damage"},
 {id:"damage",label:"Not dealing enough damage"},
 {id:"healing",label:"Running out of healing"},
 {id:"transition",label:"Cannot survive a phase transition"},
 {id:"counter",label:"Cannot find a counterattack opening"},
 {id:"arena",label:"Cannot reach the boss arena"},
 {id:"preparation",label:"Unsure how to prepare"}
];
const knownProblems=new Set(bossIssueCategories.map(x=>x.id));
export function bossPhaseChoices(slug){
 const boss=bossBySlug(slug);if(!boss)return [];
 const s=getBossStrategy(slug);
 return [...new Set([...(s?.phases||[]),...(boss.phases||[])])];
}
export function answerBossIssue(slug,phase="",issue=""){
 const boss=bossBySlug(slug);if(!boss)return null;
 const validPhases=bossPhaseChoices(slug);
 if(phase&&!validPhases.includes(phase))return {kind:"invalid",reason:"This phase is not documented for the selected boss."};
 if(!knownProblems.has(issue))return {kind:"invalid",reason:"Choose a supported combat problem."};
 const s=getBossStrategy(slug),sources=s?.sources||[];
 const result=(kind,matched,explanation)=>({kind,boss,phase,issue,matched,explanation,reviewedAt:s?.reviewedAt||null,
  sources:sources.filter(e=>matched?.some(a=>(a.evidence||[]).includes(e.id))),
  guideUrl:boss.helpId?"/help/"+boss.helpId+"/":null,externalUrl:boss.externalGuide?.url||null,
  generalUrl:"/guides/combat-diagnostics/"});
 if(s){
  if(issue==="arena"&&s.route?.length)return result("route",s.route,"Follow the publisher-supported approach and check each landmark; this path was not independently replayed.");
  if(issue==="preparation"&&s.preparation?.length)return result("preparation",s.preparation.map((response,i)=>({id:"prep-"+i,response,evidence:["guide"]})),"Before the fight");
  if(issue==="healing"&&s.recovery?.length)return result("recovery",s.recovery.map((response,i)=>({id:"recovery-"+i,response,evidence:["guide"]})),"Source-supported recovery and survival options");
  if(issue==="transition"&&s.phases?.length&&s.attacks.some(a=>a.phase))return result("transition",s.attacks.filter(a=>a.phase).slice(0,5),"Use these phase-labeled cues and responses; a phase transition is not automatically victory.");
  const options=s.attacks.filter(a=>a.problems.includes(issue));
  const exact=phase?options.filter(a=>a.phase===phase):options;
  if(exact.length)return result("attack",exact,"Boss-specific cues and responses supported by the linked publisher.");
  if(phase){
   const general=options.filter(a=>!a.phase);
   if(general.length)return result("boss-global",general,"These attacks are documented for this boss, but their phase placement is not verified. Do not assume they occur in the selected phase.");
  }
  if(issue==="preparation"&&s.prerequisites?.length)return result("preparation",s.prerequisites.map((response,i)=>({id:"requirement-"+i,response,evidence:["guide"]})),"Source-supported prerequisites");
 }
 // Help Center remains an explicit, separately labeled fallback; never misattribute its tactics to this source record.
 const help=helpProblems.find(p=>p.id===boss.helpId);
 if(help){
  const related={
   dodge:/dodge|sidestep|evade/i,parry:/parry|block|guard/i,cues:/watch|observe|flash|cue/i,
   "damage-taken":/damage|health|survive|shield/i,damage:/shield|punish|attack|axe/i,
   healing:/heal|health/i,transition:/phase|dismount|shield|sword/i,counter:/counter|punish|opening/i,
   arena:/bell|tower|route|approach/i,preparation:/before|reserve|weapon|equip|prepare/i
  }[issue];
  const steps=[...help.steps.map(x=>x.body),...help.troubleshooting].filter(x=>related.test(x)).slice(0,3);
  if(steps.length&&!phase)return {kind:"help",boss,phase,issue,matched:steps.map((response,i)=>({id:"help-"+i,response})),explanation:"Related existing Help Center information; verify the full guide for applicability.",sources:[],guideUrl:"/help/"+help.id+"/",externalUrl:boss.externalGuide?.url||null,generalUrl:"/guides/combat-diagnostics/"};
 }
 return result("missing",[],"No phase- and issue-specific V2 evidence is documented yet. General combat advice is not a verified tactic for this boss.");
}
