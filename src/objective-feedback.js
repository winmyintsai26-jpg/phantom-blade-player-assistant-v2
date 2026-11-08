// Objective feedback stays separate from local completion checks.
// Players review the drafted issue on GitHub and submit it themselves.
const base="https://github.com/winmyintsai26-jpg/phantom-blade-player-assistant-v2/issues/new";
const outcomes={solved:"Completed",blocked:"Blocked on a step",missing:"Missing location / prerequisite",different:"Different game state"};
const safe=s=>String(s||"").trim().slice(0,1200);
export function objectiveFeedbackDraft({objective,outcome,failedStep,missingLocation,platform,version,details}){
 if(!objective?.id||!objective?.route||!outcomes[outcome])throw new Error("Choose an objective and feedback outcome.");
 const steps=Array.isArray(objective.acquisitionSteps)?objective.acquisitionSteps:[];
 const step=failedStep===""?"Not specified":Number.isInteger(Number(failedStep))&&Number(failedStep)>=0&&Number(failedStep)<steps.length?"Step "+(Number(failedStep)+1)+": "+steps[Number(failedStep)]:"Not specified";
 const body=[
 "Objective: "+safe(objective.name),
 "Record ID: "+safe(objective.id),
 "Page: "+safe(objective.route),
 "Result: "+outcomes[outcome],
 "Step: "+safe(step),
 "Missing location / prerequisite: "+(safe(missingLocation)||"Not specified"),
 "Platform: "+(safe(platform)||"Not specified"),
 "Game version: "+(safe(version)||"Not specified"),
 "",
 "What happened: "+(safe(details)||"No additional details."),
 "",
 "User-submitted report; not independently verified gameplay evidence."
 ].join("\n");
 return {title:"[Objective] "+safe(objective.name)+" — "+outcomes[outcome],body};
}
export function objectiveFeedbackUrl(args){
 const d=objectiveFeedbackDraft(args);
 return base+"?"+new URLSearchParams(d).toString();
}
