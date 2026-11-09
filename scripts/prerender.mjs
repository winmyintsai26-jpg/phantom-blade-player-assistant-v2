import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
import {regions} from "../src/regions.js";
import {guides} from "../src/guides.js";
import {regionCollectibles} from "../src/collectibles.js";
import {problems} from "../src/help-problems.js";
import {objectiveRecords} from "../src/objectives.js";
import {bosses} from "../src/bosses.js";
import {getBossStrategy} from "../src/boss-strategies.js";
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
const configuredOrigin=(process.env.V2_SITE_ORIGIN||"").trim();
// Canonical is the owned primary domain even on noindex previews; publish gates require explicit configuration.
const origin=(configuredOrigin||"https://phantombladeplayerguide.com").replace(/\/$/,"");
if((publish||publisherId||adActivationRequested)&&!configuredOrigin)throw new Error("Set V2_SITE_ORIGIN explicitly before indexing or AdSense configuration.");
if(!/^https:\/\/[^/]+$/i.test(origin))throw new Error("V2_SITE_ORIGIN must be an HTTPS site origin.");
if(publish&&origin.endsWith(".workers.dev"))throw new Error("Set a reviewed production custom domain before enabling indexing.");
if((publisherId||adActivationRequested)&&origin.endsWith(".workers.dev"))throw new Error("Use a custom production domain for AdSense verification; workers.dev is preview-only.");

const sourceLinks=(sources=[])=>sources.length?'<h2>Sources and limitations</h2><ul>'+sources.filter(x=>x?.url&&/^https:\/\//.test(x.url)).map(x=>'<li><a href="'+htmlEscape(x.url)+'">'+htmlEscape(x.name||x.url)+'</a></li>').join("")+'</ul>':'<p>No individual supporting source is linked in this record. These instructions are not independently game-tested.</p>';
const pages=[
 {route:"/",title:"Phantom Blade Zero Player Guide | Bosses, Items & Routes",description:"Independent Phantom Blade Zero player guide for boss fights, item locations, Bells, missable quests and step-by-step troubleshooting with evidence labels.",main:
 '<section aria-labelledby="homepage-heading"><h1 id="homepage-heading">Phantom Blade Zero Player Guide</h1><p>An independent Phantom Blade Zero player guide for players who need a next step, not just a location name. Find starting Bells, prerequisites, acquisition routes, boss troubleshooting and ways to confirm an objective is complete. Published sources support these guides; they have not been independently game-tested.</p>'+
 '<h2>Find help for your next objective</h2><ul>'+
 '<li><a href="/solver/">Solve My Problem with guided troubleshooting</a></li>'+
 '<li><a href="/bosses/">Browse all documented bosses</a></li>'+
 '<li><a href="/help/">Bosses, map navigation and quest troubleshooting</a></li>'+
 '<li><a href="/objectives/">Item locations, starting Bells and acquisition steps</a></li>'+
 '<li><a href="/progress/">Saved checklists and progress backup</a></li></ul>'+
 '<h2>Popular player problems</h2><ul>'+problems.map(p=>'<li><a href="/help/'+htmlEscape(p.id)+'/">'+htmlEscape(p.title)+'</a></li>').join("")+'</ul>'+
 '<h2>Explore the regions</h2><ul>'+regions.map(r=>'<li><a href="/regions/'+htmlEscape(r.id)+'/">'+htmlEscape(r.name)+'</a></li>').join("")+'</ul>'+
 '<h2>Step-by-step objective routes</h2><ul>'+objectiveRecords.map(o=>'<li><a href="'+o.route+'">'+htmlEscape(o.name)+' — '+htmlEscape(o.regionName)+'</a></li>').join("")+'</ul>'+
 '<h2>Guided player workspaces</h2><ul>'+guides.map(g=>'<li><a href="/guides/'+g.id+'/">'+htmlEscape(g.title)+'</a></li>').join("")+'</ul></section>'},
 {route:"/solver/",title:"Solve My Problem",description:"Find a Phantom Blade Zero player solution for a boss, quest, item or navigation problem with an evidence-labeled guide.",main:'<h1>Solve My Problem</h1><p>Choose a boss, quest, item or navigation issue, then select the situation you are stuck in. We show source-researched steps where documented, and clearly label missing evidence.</p><p><a href="/bosses/">Browse documented bosses</a> · <a href="/objectives/">Find item routes</a></p><ul>'+problems.map(x=>'<li><a href="/help/'+htmlEscape(x.id)+'/">'+htmlEscape(x.title)+'</a></li>').join("")+'</ul><p><a href="/objectives/">Search the item finder</a></p>'},
 {route:"/bosses/",title:"Phantom Blade Zero Boss Directory",description:"Browse documented Phantom Blade Zero boss fights across all regions, with sources, alternate names, encounter status and links to available strategies.",main:'<h1>Phantom Blade Zero Boss Directory</h1><p>Browse '+bosses.length+' source-indexed fight groupings across the prologue and every region. Different sources count health bars, phases and repeat encounters differently. A roster listing does not mean a verified combat strategy exists. Incomplete profiles are excluded from indexing. See the <a href="/about/">editorial approach</a> and <a href="https://pbz.gg/bosses/">source roster</a>.</p><ul>'+bosses.map(b=>'<li><a href="/bosses/'+b.slug+'/">'+htmlEscape(b.name)+'</a> — '+htmlEscape(b.regionName)+'</li>').join("")+'</ul>'},
 ...bosses.map(b=>{
  const strategy=getBossStrategy(b.slug);
  const evidence=strategy?.sources||[];
  const escList=items=>'<ol>'+items.map(x=>'<li>'+htmlEscape(x.instruction||x.response||x)+'</li>').join("")+'</ol>';
  const detail='<article><h1>'+htmlEscape(b.name)+'</h1><p>'+htmlEscape(b.regionName)+' · '+htmlEscape(b.family)+'</p><p>Published source research — not independently game-tested.</p>'+
  '<h2>Starting location and Bell</h2><p>'+htmlEscape(strategy?.bell||b.location||"Exact Bell not established")+'</p>'+
  (strategy?.route?.length?'<h3>How to reach the arena</h3>'+escList(strategy.route):'<p>Detailed Bell-to-arena steps not yet documented.</p>')+
  (strategy?.preparation?.length?'<h2>Preparation</h2><ul>'+strategy.preparation.map(x=>'<li>'+htmlEscape(x)+'</li>').join("")+'</ul>':"")+
  (strategy?.attacks?.length?'<h2>Attack cues and recommended responses</h2>'+strategy.attacks.map(a=>'<section><h3>'+htmlEscape(a.cue)+'</h3><p>Recommended response: '+htmlEscape(a.response)+'</p><p>Avoid: '+htmlEscape(a.avoid)+'</p></section>').join(""):'<h2>Combat strategy</h2><p>Strategy not yet documented. See original sources and report missing information.</p>')+
  (strategy?.confirmation?'<h2>Confirming completion</h2><p>'+htmlEscape(strategy.confirmation)+'</p>':"")+
  (strategy?.patchReview?'<h2>Version warning</h2><p>'+htmlEscape(strategy.patchReview.note)+'</p>':"")+
  '<h2>Sources</h2><ul>'+(evidence.length?evidence:b.sources).map(x=>'<li><a href="'+htmlEscape(x.url)+'">'+htmlEscape(x.url)+'</a></li>').join("")+'</ul>'+
  '<p><a href="/bosses/">Browse all bosses</a></p></article>';
  return {route:"/bosses/"+b.slug+"/",title:b.name+" — Boss Evidence and Strategy",description:strategy?
   "Source-researched "+b.name+" boss guide: starting Bell, attack cues, defensive responses and route evidence. Not independently game-tested.":
   "Research status for "+b.name+" in "+b.regionName+". Published boss roster and unresolved strategy evidence.",
   eligibleForSitemap:Boolean(strategy?.attacks?.length),main:detail};
 }),
 {route:"/help/",title:"Player Help Center",description:"Solve real player problems in Phantom Blade Zero with searchable boss, combat, navigation and quest guides.",main:'<h1>Player Help Center</h1><p>Find problem-solving walkthroughs.</p><ul>'+problems.map(p=>'<li><a href="/help/'+htmlEscape(p.id)+'/">'+htmlEscape(p.title)+'</a></li>').join("")+'</ul>'},
 ...problems.map(p=>({route:"/help/"+p.id+"/",title:p.title,description:p.summary,main:'<article><h1>'+htmlEscape(p.title)+'</h1><p>'+htmlEscape(p.summary)+'</p><p>'+htmlEscape(p.status)+' — source-researched, not independently game-tested.</p><h2>Before starting</h2><ul>'+p.prerequisites.map(x=>'<li>'+htmlEscape(x)+'</li>').join("")+'</ul><h2>Steps and checks</h2><ol>'+p.steps.map(step=>'<li><h3>'+htmlEscape(step.title)+'</h3><p>'+htmlEscape(step.body)+'</p><p><strong>Check:</strong> '+htmlEscape(step.check||"Verify your in-game journal or encounter.")+'</p></li>').join("")+'</ol><h2>If this did not work</h2><ul>'+p.troubleshooting.map(x=>'<li>'+htmlEscape(x)+'</li>').join("")+'</ul>'+sourceLinks(p.links)+'<p><a href="/help/">Back to Help Center</a></p></article>'})),
 ...Object.entries(sitePages).map(([id,p])=>({route:"/"+id+"/",title:p.title,description:p.description,main:p.html})),
 {route:"/objectives/",title:"Smart Item Finder: items and Bells",description:"Find actionable item and Bell routes with prerequisites, starting landmarks, source notes and success checks.",main:'<h1>Smart Item Finder</h1><p>Selected source-researched routes; not gameplay-tested.</p><ul>'+objectiveRecords.map(o=>'<li><a href="'+o.route+'">'+htmlEscape(o.name)+'</a></li>').join("")+'</ul>'},
 ...objectiveRecords.map(o=>({route:o.route,title:o.name+" acquisition guide",description:"Find "+o.name+" in "+o.regionName+". Start at "+o.nearestBell+" and review prerequisites, route and success checks.",main:'<h1>'+htmlEscape(o.name)+'</h1><p>'+htmlEscape(o.verification)+'</p><p>Starting Bell: '+htmlEscape(o.nearestBell)+'</p><h2>Prerequisites</h2><ul>'+o.prerequisites.map(x=>'<li>'+htmlEscape(x)+'</li>').join("")+'</ul><h2>Acquisition steps</h2><ol>'+o.acquisitionSteps.map(x=>'<li>'+htmlEscape(x)+'</li>').join("")+'</ol><h2>Confirmation</h2><p>'+htmlEscape(o.completionConfirmation)+'</p><h2>Missable or version-sensitive notes</h2><p>'+htmlEscape(o.missableWarning||"No specific missable lockout documented.")+'</p><p>'+htmlEscape(o.sourceNote||"Written-source reference; not gameplay-tested.")+'</p>'+sourceLinks(o.sources)+'<p><a href="'+o.regionUrl+'">Return to region</a></p>'})),
 {route:"/progress/",eligibleForSitemap:false,title:"Progress backup and settings",description:"Export and import Phantom Blade Zero guide checklists, including spoiler preferences.",main:'<h1>Progress backup and settings</h1><p>Export saved checkpoints or import a backup on this device.</p>'},
 ...regions.map(r=>({route:"/regions/"+r.id+"/",title:r.name+" walkthrough reference",description:r.description,main:'<h1>'+htmlEscape(r.name)+'</h1><p>'+htmlEscape(r.description)+'</p><p>Source-researched, not independently game-tested. '+regionCollectibles(r.id).length+' indexed item routes.</p><h2>Important checkpoints</h2><ul>'+r.checkpoints.map(c=>'<li><strong>'+htmlEscape(c.title)+'</strong> — '+htmlEscape(c.detail)+' <em>('+htmlEscape(c.risk)+')</em></li>').join("")+'</ul><h2>Curated item guides</h2><ul>'+objectiveRecords.filter(o=>o.region===r.id).map(o=>'<li><a href="'+o.route+'">'+htmlEscape(o.name)+'</a></li>').join("")+'</ul><h2>Documented bosses</h2><ul>'+bosses.filter(b=>b.region===r.id).map(b=>'<li><a href="/bosses/'+b.slug+'/">'+htmlEscape(b.name)+'</a></li>').join("")+'</ul><h2>Selected collectibles</h2><ol>'+regionCollectibles(r.id).map(c=>'<li>'+htmlEscape(c.name)+' ('+htmlEscape(c.type)+')</li>').join("")+'</ol><p><a href="'+htmlEscape(r.source)+'">Regional collectible source reference</a>; the current routes are not independently game-tested.</p>'})),
 ...guides.map(g=>({route:"/guides/"+g.id+"/",title:g.title,description:g.summary,main:'<h1>'+htmlEscape(g.title)+'</h1><p>'+htmlEscape(g.summary)+'</p><p>'+htmlEscape(g.status)+'</p><h2>Before starting</h2><ul>'+g.requirements.map(x=>'<li>'+htmlEscape(x)+'</li>').join("")+'</ul><h2>Steps and checks</h2><ol>'+g.steps.map(step=>'<li><h3>'+htmlEscape(step.title)+'</h3><p>'+htmlEscape(step.body)+'</p><p><strong>Check:</strong> '+htmlEscape(step.check||"Verify your quest or encounter state.")+'</p></li>').join("")+'</ol>'+sourceLinks(g.sources)+'<p><a href="/solver/">Solve another problem</a></p>'}))
];
// Descriptive schema only; no ratings, reviews or claimed gameplay verification.
function structuredData(page){
 const canonical=origin+page.route;
 const isHome=page.route==="/";
 const website={"@context":"https://schema.org","@type":"WebSite",name:"Phantom Blade Zero Player Assistant",url:origin+"/",description:"Independent source-researched player guidance; not affiliated with S-GAME."};
 const entity={"@context":"https://schema.org","@type":"WebPage",name:page.title,url:canonical,description:page.description,isPartOf:{"@type":"WebSite",name:website.name,url:website.url},inLanguage:"en"};
 const parents=page.route.startsWith("/objectives/")&&page.route!=="/objectives/"?[{name:"Smart Item Finder",url:origin+"/objectives/"}]:page.route.startsWith("/help/")&&page.route!=="/help/"?[{name:"Player Help Center",url:origin+"/help/"}]:page.route.startsWith("/bosses/")&&page.route!=="/bosses/"?[{name:"Boss Directory",url:origin+"/bosses/"}]:[];
 const breadcrumbs=[{name:"Home",url:origin+"/"},...parents,...(!isHome?[{name:page.title,url:canonical}]:[])];
 const breadcrumb=!isHome?{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:breadcrumbs.map((item,i)=>({"@type":"ListItem",position:i+1,name:item.name,item:item.url}))}:null;
 return [isHome?website:null,entity,breadcrumb].filter(Boolean).map(obj=>'<script type="application/ld+json">'+JSON.stringify(obj).replace(/</g,"\\u003c")+'</script>').join("");
}
const unique=new Set();
for(const page of pages){
 if(unique.has(page.route))throw new Error("Duplicate prerender route: "+page.route);
 unique.add(page.route);
 const meta=htmlEscape(page.description.slice(0,160));
 const canonical=origin+page.route;
 let html=template
 .replace(/<title>[^<]*<\/title>/,'<title>'+htmlEscape(page.route==="/"?page.title:page.title+" | Phantom Blade Zero V2")+'</title>')
 .replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+meta+'">')
 .replace(/<meta name="robots" content="[^"]*">/,'<meta name="robots" content="'+(publish&&page.eligibleForSitemap!==false?"index,follow":"noindex,nofollow")+'">')
 .replace('</head>','<link rel="canonical" href="'+htmlEscape(canonical)+'">'+structuredData(page)+
   (publisherId?'<meta name="google-adsense-account" content="'+publisherId+'">':'')+
   (adActivationRequested?'<script async crossorigin="anonymous" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+publisherId+'"></script>':'')+
   '</head>');
 html=html.replace('<div id="app"></div>','<div id="app"><main id="main" class="prerender-fallback">'+page.main+'</main></div>');
 const dest=page.route==="/"?path.join(output,"index.html"):path.join(output,page.route.slice(1),"index.html");
 await mkdir(path.dirname(dest),{recursive:true});
 await writeFile(dest,html,"utf8");
}
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.filter(p=>p.eligibleForSitemap!==false).map(p=>'  <url><loc>'+xmlEscape(origin+p.route)+'</loc></url>').join("\n")+'\n</urlset>\n';
await writeFile(path.join(output,"sitemap.xml"),sitemap,"utf8");
if(publisherId)await writeFile(path.join(output,"ads.txt"),"google.com, "+publisherId.replace(/^ca-/,"")+", DIRECT, f08c47fec0942fa0\n","utf8");
const robots=publish?["User-agent: *","Allow: /","Sitemap: "+origin+"/sitemap.xml",""]:["User-agent: *","Disallow: /","Sitemap: "+origin+"/sitemap.xml",""];
await writeFile(path.join(output,"robots.txt"),robots.join("\n"),"utf8");
await writeFile(path.join(output,"build-manifest.json"),JSON.stringify({origin,commitSha,indexingEnabled:publish,editorialApproved:approved,adsenseConfigured:Boolean(publisherId),adsEnabled:adActivationRequested,routes:[...unique]},null,2)+"\n","utf8");
console.log("Pre-rendered "+pages.length+" routes. Indexing: "+(publish?"ON (editorial approval)":"OFF (preview)")+".");
