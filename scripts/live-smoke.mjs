// Non-blocking real-network smoke check for the existing Cloudflare Worker.
// A 200 response is not proof that the current GitHub commit was deployed.
const origin=(process.env.V2_SITE_ORIGIN||"https://phantom-blade-player-assistant-v2.winmyintsai26.workers.dev").replace(/\/$/,"");
import {regions} from "../src/regions.js";
import {problems} from "../src/help-problems.js";
import {objectiveRecords} from "../src/objectives.js";
import {guides} from "../src/guides.js";
const urls=["/","/help/","/objectives/","/about/","/privacy/","/contact/","/progress/",
 ...regions.map(r=>"/regions/"+r.id+"/"),
 ...problems.map(p=>"/help/"+p.id+"/"),
 ...objectiveRecords.map(o=>o.route),
 ...guides.map(g=>"/guides/"+g.id+"/")];
const results=await Promise.all(urls.map(async pathname=>{
 try{
  const response=await fetch(origin+pathname,{redirect:"follow",signal:AbortSignal.timeout(12000),headers:{"Cache-Control":"no-cache"}});
  const html=await response.text();
  const plausible=response.ok&&(/<html/i.test(html))&&(/phantom blade/i.test(html));
  return {pathname,status:response.status,ok:plausible,problem:plausible?null:"Unexpected HTTP status or page content"};
 }catch(e){return {pathname,status:null,ok:false,problem:String(e)}}
}));
for(const result of results)console.log((result.ok?"PASS":"FAIL")+" "+result.pathname+" "+(result.status??"unreachable")+(result.problem?" "+result.problem:""));
let commitState="NOT VERIFIED";
try{
 const response=await fetch(origin+"/build-manifest.json",{signal:AbortSignal.timeout(12000),headers:{"Cache-Control":"no-cache"}});
 if(response.ok){
  const manifest=await response.json();
  console.log("LIVE BUILD MANIFEST: "+JSON.stringify({origin:manifest.origin,commitSha:manifest.commitSha||null,routes:manifest.routes?.length,indexingEnabled:manifest.indexingEnabled}));
  const expected=process.env.GITHUB_SHA||null;
  commitState=expected&&manifest.commitSha===expected?"CONFIRMED":manifest.commitSha?"MISMATCH / DIFFERENT REVISION":"MISSING REVISION MARKER";
 }else console.log("LIVE BUILD MANIFEST: HTTP "+response.status);
}catch(e){console.log("LIVE BUILD MANIFEST: unreachable "+String(e))}
console.log("Live URL pass count: "+results.filter(x=>x.ok).length+"/"+urls.length+". Current GitHub revision deployment: "+commitState+".");
if(results.some(x=>!x.ok)||commitState!=="CONFIRMED")process.exitCode=1;
