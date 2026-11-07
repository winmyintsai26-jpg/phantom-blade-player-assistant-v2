import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {regions} from "../src/regions.js";
import {guides} from "../src/guides.js";
import {regionCollectibles} from "../src/collectibles.js";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const output=path.join(root,"dist");
const template=await readFile(path.join(output,"index.html"),"utf8");
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pages=[
  {route:"/progress/",title:"Progress backup & settings",description:"Back up and restore your progress across devices.",main:'<h1>Progress backup &amp; settings</h1><p>Export saved checkpoints or import a backup after loading this page.</p>'},
  ...regions.map(r=>({route:"/regions/"+r.id+"/",title:r.name+" walkthrough reference",description:r.description,main:'<h1>'+esc(r.name)+'</h1><p>'+esc(r.description)+'</p><p>Source-researched, not independently game-tested. '+regionCollectibles(r.id).length+' selected item routes.</p><h2>Important checkpoints</h2><ul>'+r.checkpoints.map(c=>'<li><strong>'+esc(c.title)+'</strong> — '+esc(c.risk)+'</li>').join("")+'</ul><h2>Selected collectible index</h2><ol>'+regionCollectibles(r.id).map(c=>'<li>'+esc(c.name)+' ('+esc(c.type)+')</li>').join("")+'</ol>'})),
  ...guides.map(g=>({route:"/guides/"+g.id+"/",title:g.title,description:g.summary,main:'<h1>'+esc(g.title)+'</h1><p>'+esc(g.summary)+'</p><p>'+esc(g.status)+'</p><h2>Guide steps</h2><ol>'+g.steps.map(s=>'<li>'+esc(s.title)+'</li>').join("")+'</ol>'}))
];
for(const p of pages){
 const html=template
 .replace(/<title>[^<]*<\/title>/,'<title>'+esc(p.title)+' | Phantom Blade Zero V2</title>')
 .replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+esc(p.description)+'">')
 .replace('<div id="app"></div>','<div id="app"><main id="main" class="prerender-fallback">'+p.main+'</main></div>');
 const destination=path.join(output,p.route.slice(1),"index.html");
 await mkdir(path.dirname(destination),{recursive:true});
 await writeFile(destination,html,"utf8");
}
console.log("Pre-rendered "+pages.length+" deep-link pages.");
