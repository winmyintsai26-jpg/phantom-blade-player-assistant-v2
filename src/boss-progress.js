import {bosses,combatProblems} from "./bosses.js";
const ids=new Set(bosses.map(b=>b.slug));
const allowed=new Set(combatProblems.map(p=>p.id));
export const bossTriedKey=slug=>"pbz-v2-boss-attempt:"+slug;
export function validBossSlug(slug){return ids.has(slug)}
export function sanitizeBossTried(slug,value){
 if(!ids.has(slug)||!Array.isArray(value))return [];
 return [...new Set(value.filter(x=>typeof x==="string"&&allowed.has(x)))];
}
export function readBossTried(storage,slug){
 if(!ids.has(slug))return [];
 try{return sanitizeBossTried(slug,JSON.parse(storage.getItem(bossTriedKey(slug))||"[]"))}catch{return []}
}
export function writeBossTried(storage,slug,attempts){
 if(!ids.has(slug)||!Array.isArray(attempts)||attempts.some(x=>!allowed.has(x)))return false;
 storage.setItem(bossTriedKey(slug),JSON.stringify(sanitizeBossTried(slug,attempts)));
 return true;
}
export function allBossTried(storage){
 return Object.fromEntries(bosses.map(b=>[b.slug,readBossTried(storage,b.slug)]));
}
