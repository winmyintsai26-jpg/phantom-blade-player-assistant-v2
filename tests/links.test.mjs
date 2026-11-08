import test from "node:test";
import assert from "node:assert/strict";
import {guides} from "../src/guides.js";
import {problems} from "../src/help-problems.js";
import {regions} from "../src/regions.js";
import {objectiveRecords} from "../src/objectives.js";
import {sitePages} from "../src/site-pages.js";

const valid=new Set(["/","/help/","/objectives/","/progress/",
 ...Object.keys(sitePages).map(id=>"/"+id+"/"),
 ...guides.map(g=>"/guides/"+g.id+"/"),
 ...problems.map(p=>"/help/"+p.id+"/"),
 ...regions.map(r=>"/regions/"+r.id+"/"),
 ...objectiveRecords.map(o=>o.route)]);
const local=url=>url?.startsWith("/")&&!url.startsWith("//");
function validInternalLink(url,context){
 if(!local(url))return;
 const parsed=new URL(url,"https://example.invalid");
 assert.ok(valid.has(parsed.pathname),"Broken internal link "+url+" in "+context);
}
test("all help links resolve to current site pages",()=>{
 for(const p of problems)for(const link of p.links)validInternalLink(link.url,p.id);
});
test("objective related references resolve to published routes",()=>{
 for(const o of objectiveRecords){
  validInternalLink(o.regionUrl,o.id);
  validInternalLink(o.relatedGuide,o.id);
  if(o.relatedProblem)validInternalLink("/help/"+o.relatedProblem+"/",o.id);
  if(o.nextProblem)validInternalLink("/help/"+o.nextProblem+"/",o.id);
  for(const id of o.relatedIds)assert.ok(objectiveRecords.some(x=>x.id===id)||regions.some(r=>id.startsWith(r.id+":")),o.id+" references unknown "+id);
 }
});
test("public policy pages link only to existing internal destinations",()=>{
 for(const [id,page] of Object.entries(sitePages)){
  for(const [,url] of page.html.matchAll(/href="(\/[^"]*)"/g))validInternalLink(url,id);
 }
});
