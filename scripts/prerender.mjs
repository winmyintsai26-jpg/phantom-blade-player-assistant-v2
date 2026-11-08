import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
import {regions} from "../src/regions.js";
import {guides} from "../src/guides.js";
import {regionCollectibles} from "../src/collectibles.js";
import {problems} from "../src/help-problems.js";
import {sitePages} from "../src/site-pages.js";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const output=path.join(root,"dist");
const commitSha=process.env.V2_BUILD_SHA||process.env.GITHUB_SHA||(()=>{try{return execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim()}catch{return null}})();
const template=await readFile(path.join(output,"index.html"),"utf8");
const xmlEscape=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));
const htmlEscape=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const publish=process.env.V2_INDEXING_ENABLED==="true";
const approved=process.env.V2_EDITORIAL_APPROVED==="true";
const publisherId=(process.env.V2_ADSENSE_PUBLISHER_ID||"").trim();
const adActivationRequested=process.env.V2_ADS_ENABLED==="true";
const adsenseApproved=process.env.V2_ADSENSE_SITE_APPROVED==="true";
if(publisherId&&!/^ca-pub-\d{16}$/.test(publisherId))throw new Error("Invalid V2_ADSENSE_PUBLISHER_ID; expected ca-pub- and 16 digits.");
if(adActivationRequested&&(!adsenseApproved||!approved||!publish||!publisherId))throw new Error("Ads need an approved site, publisher ID, editorial acceptance and indexing enabled.");
if(publish&&!approved)throw new Error("Indexing requires V2_EDITORIAL_APPROVED=true after editorial acceptance.");
const origin=(process.env.V2_SITE_ORIGIN||"https://phantom-blade-player-assistant-v2.winmyintsai26.workers.dev").replace(/\/$/,"");
if(!/^https:\/\/[^/]+$/i.test(origin))throw new Error("V2_SITE_ORIGIN must be an HTTPS site origin.");
if(publish&&origin.endsWith(".workers.dev"))throw new Error("Set a reviewed production custom domain before enabling indexing.");
if((publisherId||adActivationRequested)&&origin.endsWith(".workers.dev"))throw new Error("Use a custom production domain for AdSense verification; workers.dev is preview-only.");

const pages=[
 {route:"/",title:"Phantom Blade Zero Player Assistant V2",description:"Evidence-first Phantom Blade Zero player help, guide library and region checklist.",main:'<h1>Phantom Blade Zero Player Assistant</h1><p>Find player help, guides and region routes.</p><p><a href="/help/">Player Help Center</a></p>'},
 {route:"/help/",title:"Player Help Center",description:"Solve real player problems in Phantom Blade Zero with searchable boss, combat, navigation and quest guides.",main:'<h1>Player Help Center</h1><p>Find problem-solving walkthroughs.</p><ul>'+problems.map(p=>'<li><a href="/help/'+htmlEscape(p.id)+'/">'+htmlEscape(p.title)+'</a></li>').join("")+'</ul>'},
 ...problems.map(p=>({route:"/help/"+p.id+"/",title:p.title,description:p.summary,main:'<h1>'+htmlEscape(p.title)+'</h1><p>'+htmlEscape(p.summary)+'</p><p>'+htmlEscape(p.status)+'</p><h2>Steps</h2><ol>'+p.steps.map(s=>'<li><h3>'+htmlEscape(s.title)+'</h3><p>'+htmlEscape(s.body)+'</p></li>').join("")+'</ol>'})),
 ...Object.entries(sitePages).map(([id,p])=>({route:"/"+id+"/",title:p.title,description:p.description,main:p.html})),
 {route:"/progress/",title:"Progress backup and settings",description:"Export and import Phantom Blade Zero guide checklists, including spoiler preferences.",main:'<h1>Progress backup and settings</h1><p>Export saved checkpoints or import a backup on this device.</p>'},
 ...regions.map(r=>({route:"/regions/"+r.id+"/",title:r.name+" walkthrough reference",description:r.description,main:'<h1>'+htmlEscape(r.name)+'</h1><p>'+htmlEscape(r.description)+'</p><p>Source-researched, not independently game-tested. '+regionCollectibles(r.id).length+' indexed item routes.</p><h2>Important checkpoints</h2><ul>'+r.checkpoints.map(c=>'<li><strong>'+htmlEscape(c.title)+'</strong> — '+htmlEscape(c.risk)+'</li>').join("")+'</ul><h2>Selected collectibles</h2><ol>'+regionCollectibles(r.id).map(c=>'<li>'+htmlEscape(c.name)+' ('+htmlEscape(c.type)+')</li>').join("")+'</ol>'})),
 ...guides.map(g=>({route:"/guides/"+g.id+"/",title:g.title,description:g.summary,main:'<h1>'+htmlEscape(g.title)+'</h1><p>'+htmlEscape(g.summary)+'</p><p>'+htmlEscape(g.status)+'</p><h2>Steps</h2><ol>'+g.steps.map(s=>'<li>'+htmlEscape(s.title)+'</li>').join("")+'</ol>'}))
];
const unique=new Set();
for(const page of pages){
 if(unique.has(page.route))throw new Error("Duplicate prerender route: "+page.route);
 unique.add(page.route);
 const meta=htmlEscape(page.description.slice(0,160));
 const canonical=origin+page.route;
 let html=template
 .replace(/<title>[^<]*<\/title>/,'<title>'+htmlEscape(page.title)+' | Phantom Blade Zero V2</title>')
 .replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+meta+'">')
 .replace(/<meta name="robots" content="[^"]*">/,'<meta name="robots" content="'+(publish?"index,follow":"noindex,nofollow")+'">')
 .replace('</head>','<link rel="canonical" href="'+htmlEscape(canonical)+'">'+
   (publisherId?'<meta name="google-adsense-account" content="'+publisherId+'">':'')+
   (adActivationRequested?'<script async crossorigin="anonymous" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+publisherId+'"></script>':'')+
   '</head>');
 if(page.route!=="/")html=html.replace('<div id="app"></div>','<div id="app"><main id="main" class="prerender-fallback">'+page.main+'</main></div>');
 const dest=page.route==="/"?path.join(output,"index.html"):path.join(output,page.route.slice(1),"index.html");
 await mkdir(path.dirname(dest),{recursive:true});
 await writeFile(dest,html,"utf8");
}
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(p=>'  <url><loc>'+xmlEscape(origin+p.route)+'</loc></url>').join("\n")+'\n</urlset>\n';
await writeFile(path.join(output,"sitemap.xml"),sitemap,"utf8");
if(publisherId)await writeFile(path.join(output,"ads.txt"),"google.com, "+publisherId.replace(/^ca-/,"")+", DIRECT, f08c47fec0942fa0\n","utf8");
const robots=publish?["User-agent: *","Allow: /","Sitemap: "+origin+"/sitemap.xml",""]:["User-agent: *","Disallow: /","Sitemap: "+origin+"/sitemap.xml",""];
await writeFile(path.join(output,"robots.txt"),robots.join("\n"),"utf8");
await writeFile(path.join(output,"build-manifest.json"),JSON.stringify({origin,commitSha,indexingEnabled:publish,editorialApproved:approved,adsenseConfigured:Boolean(publisherId),adsEnabled:adActivationRequested,routes:[...unique]},null,2)+"\n","utf8");
console.log("Pre-rendered "+pages.length+" routes. Indexing: "+(publish?"ON (editorial approval)":"OFF (preview)")+".");
