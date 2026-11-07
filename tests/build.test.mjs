import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {regions} from "../src/regions.js";
import {guides} from "../src/guides.js";
import {problems} from "../src/help-problems.js";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..","dist");
const read=f=>readFile(path.join(root,f),"utf8");
const manifest=JSON.parse(await read("build-manifest.json"));
const expected=["/","/help/","/progress/",...regions.map(r=>"/regions/"+r.id+"/"),...guides.map(g=>"/guides/"+g.id+"/"),...problems.map(p=>"/help/"+p.id+"/")];
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
