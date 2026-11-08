/** Resolve exact-name pbz.gg thumbnails during build. No third-party images are copied. */
import {readFile,writeFile} from "node:fs/promises";
import {collectibles} from "../src/collectibles.js";
const output=new URL("../src/item-art.generated.js",import.meta.url);
const original=await readFile(new URL("../src/item-art.js",import.meta.url),"utf8");
const known=new Set([...original.matchAll(/"([a-z-]+:\d+)":\{src:/g)].map(m=>m[1]));
const skip=new Set(["Bell","Tale","Challenge","Memory Flower"]);
const aliases={"A Puppet's Wooden Heart reward":"A Puppet's Wooden Heart","Remnant Spark Cage":"Legendary Remnant Spark Cage","Reflex Device":"Legendary Reflex Device","Ancient Armor Fragment":"Legendary Ancient Armor Fragment","Brass Chest Guard":"Legendary Brass Chest Guard","Nuo Mask":"Legendary Nuo Mask","Crude Radiant Heart":"Legendary Crude Radiant Heart","Crimson Resolve":"Legendary Crimson Resolve"};
const norm=s=>String(s||"").toLowerCase().replace(/&amp;/g,"&").replace(/&#(?:x27|39);/gi,"'").replace(/[^a-z0-9]+/g," ").trim();
const slug=s=>s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/['’]/g,"").replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const attr=(tag,key)=>(tag.match(new RegExp("\\b"+key+'="([^"]*)"',"i"))||[])[1];
const candidates=collectibles.filter(c=>!known.has(c.id)&&!skip.has(c.type));
const art={};let cursor=0;
async function find(c){
 const name=aliases[c.name]||c.name;
 const section=c.type==="Accessory"?"accessories":c.type==="Weapon"?"weapons":c.type==="Phantom Edge"?"weapons/phantom-edges":"items";
 const source="https://pbz.gg/"+section+"/"+slug(name)+"/";
 try{
  const response=await fetch(source,{signal:AbortSignal.timeout(8500)});
  if(!response.ok)return null;
  const html=await response.text();
  const heading=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g,"").trim();
  if(norm(heading)!==norm(name))return null;
  const tags=[...html.matchAll(/<img\b[^>]*>/gi)].map(m=>m[0]);
  const matched=tags.find(tag=>{
   const alt=norm(attr(tag,"alt"));
   return alt===norm("Phantom Blade Zero "+name)||alt===norm("Phantom Blade Zero accessory "+name);
  });
  if(!matched)return null;
  const raw=(attr(matched,"src")||attr(matched,"data-src")||"").replace(/&amp;/g,"&");
  const src=new URL(raw,source).href;
  if(!src.startsWith("https://pbz.gg/")||!src.includes("/media/game/")||!(/\.(webp|png|jpe?g)(?:$|\?)/i.test(src)))return null;
  return {src,source};
 }catch{return null}
}
async function worker(){while(cursor<candidates.length){const c=candidates[cursor++];const result=await find(c);if(result)art[c.id]=result;}}
await Promise.all(Array.from({length:8},worker));
let old={};try{const previous=await readFile(output,"utf8");const match=previous.match(/export const generatedArt\s*=\s*(\{[\s\S]*\});/);if(match)old=JSON.parse(match[1]);}catch{}
const combined={...old,...art};
await writeFile(output,"// Exact-name pbz.gg artwork references; images remain hosted by their source.\nexport const generatedArt = "+JSON.stringify(combined,null,2)+";\n");
console.log("Item image references: "+Object.keys(combined).length+" generated; "+candidates.length+" candidates checked.");
