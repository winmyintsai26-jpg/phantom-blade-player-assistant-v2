import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {regions} from "../src/regions.js";
import {guides} from "../src/guides.js";
import {problems} from "../src/help-problems.js";
import {objectiveRecords} from "../src/objectives.js";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..","dist");
const read=f=>readFile(path.join(root,f),"utf8");
const manifest=JSON.parse(await read("build-manifest.json"));
const expected=["/","/help/","/objectives/",...objectiveRecords.map(o=>o.route),"/about/","/privacy/","/contact/","/progress/",...regions.map(r=>"/regions/"+r.id+"/"),...guides.map(g=>"/guides/"+g.id+"/"),...problems.map(p=>"/help/"+p.id+"/")];
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
  assert.ok(html.includes('name="robots" content="'+(manifest.indexingEnabled?"index,follow":"noindex,nofollow")+'"'),route);
  assert.ok(html.includes('/assets/'),route+" missing compiled assets");
 }
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
 assert.deepEqual(new Set(urls),new Set(expected.map(p=>manifest.origin+p)));
 assert.equal(urls.length,expected.length);
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
