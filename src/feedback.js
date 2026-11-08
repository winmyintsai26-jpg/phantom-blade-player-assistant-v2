// Pure, testable GitHub issue draft; submitting always requires the player to log in.
export const issueRepo="https://github.com/winmyintsai26-jpg/phantom-blade-player-assistant-v2";
export function playerIssueDraft({title,slug,diagnosis,outcome,description,platform,siteOrigin}){
 const validOutcomes={"solved":"This solved my problem","not-solved":"This did not solve my problem","different":"My situation is different"};
 if(!validOutcomes[outcome]||!title||!slug)throw new Error("Choose a guide and an outcome.");
 const text=s=>String(s||"").trim().slice(0,2500);
 const safeOrigin=/^https:\/\/[^/]+$/i.test(String(siteOrigin||""))?siteOrigin:"https://phantom-blade-player-assistant-v2.winmyintsai26.workers.dev";
 const fields=[
  "Guide: "+text(title),
  "Guide URL: "+safeOrigin+"/help/"+encodeURIComponent(slug)+"/",
  "Selected troubleshooting problem: "+text(diagnosis||"No diagnosis selected"),
  "Player result: "+validOutcomes[outcome],
  "Game version / platform: "+text(platform||"Not provided"),
  "",
  "What happened:",
  text(description||"No additional details provided."),
  "",
  "Evidence note: user report, not independent gameplay verification."
 ];
 return {title:"[Player Help] "+title+" — "+validOutcomes[outcome],body:fields.join("\n")};
}
export function playerIssueUrl(args){
 const draft=playerIssueDraft(args);
 return issueRepo+"/issues/new?title="+encodeURIComponent(draft.title)+"&body="+encodeURIComponent(draft.body);
}
