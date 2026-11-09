import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {regions} from "../src/regions.js";
import {guides} from "../src/guides.js";
import {problems} from "../src/help-problems.js";
import {objectiveRecords} from "../src/objectives.js";
import {bosses} from "../src/bosses.js";
import {getBossStrategy} from "../src/boss-strategies.js";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..","dist");
const read=f=>readFile(path.join(root,f),"utf8");
const manifest=JSON.parse(await read("build-manifest.json"));
const expected=["/","/solver/","/bosses/",...bosses.map(x=>"/bosses/"+x.slug+"/"),"/help/","/objectives/",...objectiveRecords.map(o=>o.route),"/about/","/privacy/","/contact/","/progress/",...regions.map(r=>"/regions/"+r.id+"/"),...guides.map(g=>"/guides/"+g.id+"/"),...problems.map(p=>"/help/"+p.id+"/")];
test("all generated routes have unique titles, descriptions and canonical",async()=>{
 assert.equal(new Set(expected).size,expected.length);
 assert.deepEqual(new Set(manifest.routes),new Set(expected));
 const titles=new Set();
 for(const route of expected){
  const html=await read(route==="/"?"index.html":route.slice(1)+"index.html");
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title,route);
  assert.ok(!titles.has(title),"Duplicate title: "+title);titles.add(title);
  assert.match(html,/<meta name="description" content="[^"]{30,160}">/);
  assert.ok(html.includes('<link rel="canonical" href="'+manifest.origin+route+'">'),route);
  assert.ok(html.includes('name="robots" content="'+(manifest.indexingEnabled&&route!=="/progress/"&&(!route.startsWith("/bosses/")||route==="/bosses/"||Boolean(getBossStrategy(bosses.find(x=>"/bosses/"+x.slug+"/"===route)?.slug)?.attacks?.length))?"index,follow":"noindex,nofollow")+'"'),route);
  assert.ok(html.includes('/assets/'),route+" missing compiled assets");
 }
});
test("homepage gives crawlers a useful player guide and real internal links without JavaScript",async()=>{
 const html=await read("index.html");
 assert.match(html,/<title>Phantom Blade Zero Player Guide \| Bosses, Items &amp; Routes<\/title>/);
 assert.match(html,/<meta name="description" content="[^"]*Phantom Blade Zero player guide[^"]*">/i);
 assert.match(html,/<main id="main" class="prerender-fallback">[\s\S]*?<h1[^>]*>Phantom Blade Zero Player Guide<\/h1>/);
 const linked=[...html.matchAll(/<a href="(\/[^"#?]+\/)"[^>]*>/g)].map(m=>m[1]);
 for(const route of ["/help/","/objectives/","/regions/weeping-creek/","/help/jing-ye-dismounted/","/guides/healers-legacy/"]){
  assert.ok(linked.includes(route),"Missing crawlable link to "+route);
 }
 for(const link of linked)assert.ok(expected.includes(link),"Homepage points to missing route: "+link);
 assert.ok(linked.length>=regions.length+problems.length+objectiveRecords.length+guides.length);
});
test("production canonical and sitemap use the owned domain, with editorial indexing gates intact",async()=>{
 assert.equal(manifest.origin,"https://phantombladeplayerguide.com");
 const html=await read("index.html");
 assert.match(html,/<link rel="canonical" href="https:\/\/phantombladeplayerguide\.com\/"/);
 const robots=await read("robots.txt");
 assert.match(robots,/Sitemap: https:\/\/phantombladeplayerguide\.com\/sitemap\.xml/);
 if(!manifest.editorialApproved)assert.equal(manifest.indexingEnabled,false);
 if(!manifest.indexingEnabled)assert.match(robots,/Disallow: \/\n/);
});
test("semantic structured data exists for every prerendered page and links only to valid route parents",async()=>{
 for(const route of expected){
  const html=await read(route==="/"?"index.html":route.slice(1)+"index.html");
  const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  assert.ok(blocks.some(x=>x["@type"]==="WebPage"&&x.url===manifest.origin+route),route);
  if(route==="/")assert.ok(blocks.some(x=>x["@type"]==="WebSite"));
  else{
   const trail=blocks.find(x=>x["@type"]==="BreadcrumbList");
   assert.ok(trail,route);
   assert.equal(trail.itemListElement[0].item,manifest.origin+"/");
   for(const crumb of trail.itemListElement){
    assert.ok(expected.includes(new URL(crumb.item).pathname),"nonexistent breadcrumb target: "+crumb.item);
   }
  }
 }
});
test("sitemap contains valid XML header and every canonical URL",async()=>{
 const xml=await read("sitemap.xml");
 assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n'));
 assert.ok(xml.endsWith('</urlset>\n'));
 assert.ok(!xml.includes("\\n"),"literal slash-n in XML");
 const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 const eligible=expected.filter(route=>route!=="/progress/"&&(!route.startsWith("/bosses/")||route==="/bosses/"||bosses.some(x=>getBossStrategy(x.slug)?.attacks?.length&&"/bosses/"+x.slug+"/"===route)));
 assert.deepEqual(new Set(urls),new Set(eligible.map(p=>manifest.origin+p)));
 assert.equal(urls.length,eligible.length);
});
test("preview never permits indexing without editorial approval",async()=>{
 const robots=await read("robots.txt");
 if(!manifest.indexingEnabled){
  assert.match(robots,/Disallow: \/\n/);
  assert.equal(manifest.editorialApproved,false);
 }else{
  assert.equal(manifest.editorialApproved,true);
  assert.match(robots,/Allow: \/\n/);
 }
});

test("AdSense stays disabled until explicitly enabled and approved",async()=>{
 const html=await read("index.html");
 const publisherConfigured=Boolean(manifest.adsenseConfigured);
 if(!manifest.adsEnabled){
  assert.ok(!html.includes("pagead/js/adsbygoogle.js"),"Unapproved preview must not request advertising");
 }else{
  assert.equal(manifest.indexingEnabled,true);
  assert.equal(manifest.editorialApproved,true);
  assert.equal(publisherConfigured,true);
  assert.match(html,/pagead\/js\/adsbygoogle.js\?client=ca-pub-\d{16}/);
 }
 if(publisherConfigured){
  const ads=await read("ads.txt");
  assert.match(ads,/^google.com, pub-\d{16}, DIRECT, f08c47fec0942fa0\n$/);
  assert.match(html,/<meta name="google-adsense-account" content="ca-pub-\d{16}">/);
 }else{
  assert.ok(!html.includes('name="google-adsense-account"'));
 }
});
test("About and Privacy pages are readable and have real policy details",async()=>{
 const about=await read("about/index.html"),privacy=await read("privacy/index.html");
 assert.match(about,/independent fan-made reference/i);
 assert.match(privacy,/localStorage/);
 assert.match(privacy,/Google AdSense/);
 assert.match(privacy,/Cloudflare Workers/);
});

test("every sitemap URL is canonical, content-bearing and eligible for indexing only after approval",async()=>{
 const sitemap=await read("sitemap.xml");
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.ok(!urls.includes(manifest.origin+"/progress/"));
 assert.ok(!urls.some(url=>url.endsWith("/bosses/acolyte-hansui/")),"unresearched boss profile must stay out of sitemap");
 for(const url of urls){
  const route=new URL(url).pathname;
  assert.ok(expected.includes(route),"sitemap exposes nonexistent page "+route);
  const html=await read(route==="/"?"index.html":route.slice(1)+"index.html");
  assert.ok(html.includes('<link rel="canonical" href="'+url+'">'),"bad canonical "+route);
  assert.ok(html.includes('<main id="main" class="prerender-fallback">'),"missing prerendered content "+route);
  assert.ok(html.includes('name="robots" content="'+(manifest.indexingEnabled?"index,follow":"noindex,nofollow")+'"'),"robots mismatch "+route);
 }
 const progress=await read("progress/index.html");
 assert.ok(progress.includes('name="robots" content="noindex,nofollow"'));
});
test("source-researched guide pages expose actual instructions, checks and references without JavaScript",async()=>{
 const help=await read("help/jing-ye-dismounted/index.html");
 assert.match(help,/<h2>Before starting<\/h2>/);
 assert.match(help,/<h2>Steps and checks<\/h2>/);
 assert.match(help, /<strong>Check:<\/strong>/);
 assert.match(help, /<h2>Sources and limitations<\/h2>/);
 const region=await read("regions/weeping-creek/index.html");
 assert.match(region,/<h2>Important checkpoints<\/h2>/);
 assert.match(region, /<h2>Documented bosses<\/h2>/);
 assert.match(region, /Regional collectible source reference/);
 const guide=await read("guides/healers-legacy/index.html");
 assert.match(guide, /<h2>Steps and checks<\/h2>/);
 assert.match(guide, /<strong>Check:<\/strong>/);
 assert.match(guide, /<h2>Sources and limitations<\/h2>/);
 const objective=await read("objectives/weeping-creek/52/index.html");
 assert.match(objective, /<h2>Missable or version-sensitive notes<\/h2>/);
 assert.match(objective, /<h2>Sources and limitations<\/h2>/);
});
test("boss structured breadcrumbs point through the directory",async()=>{
 const html=await read("bosses/jing-ye-the-outlaw/index.html");
 const trail=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x=>JSON.parse(x[1])).find(x=>x["@type"]==="BreadcrumbList");
 assert.deepEqual(trail.itemListElement.map(x=>new URL(x.item).pathname),["/","/bosses/","/bosses/jing-ye-the-outlaw/"]);
});
