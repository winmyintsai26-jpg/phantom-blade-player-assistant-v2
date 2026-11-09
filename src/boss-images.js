// Phase 4.3: boss-specific licensed image registry.
// Only explicitly approved, identity-checked images may appear as boss portraits.
// A published URL, an official screenshot, or attribution alone DOES NOT grant reuse rights.
// Do not copy screenshots from index sites or gameplay videos without authorization.
import {bosses} from "./bosses.js";

export const BOSS_FALLBACK_ASSET="/phantom-guide-logo.png";
export const BOSS_FALLBACK_LABEL="No verified boss image available";
export const BOSS_IMAGE_REVIEW_DATE="2026-11-08";

// Keep each approval here as a separately reviewed record. Never infer image rights
// from a source link, image filename, artist credit, or the boss roster.
// Fields: bossId,assetPath,sourceUrl,publisher,license,permissionEvidence,
// permissionBasis,attribution,description,verificationStatus,variant,subjectId,
// width,height. No license/explicit permission has been established for the
// 59 third-party boss images reviewed at this stage.
export const approvedBossImages=Object.freeze({});

const defaultRecord=b=>({
 bossId:b.slug,
 status:"fallback",
 assetPath:null,
 sourceUrl:b.externalGuide?.url||b.sources[0]?.url||null,
 publisher:b.externalGuide?.name||b.sources[0]?.name||null,
 license:null,
 permissionBasis:null,
 permissionEvidence:null,
 attribution:null,
 description:null,
 verificationStatus:"identity-and-reuse-not-confirmed",
 variant:null,
 subjectId:null,
 width:null,
 height:null,
 reviewedAt:BOSS_IMAGE_REVIEW_DATE,
 fallbackAsset:BOSS_FALLBACK_ASSET,
 fallbackLabel:BOSS_FALLBACK_LABEL
});

export const bossImageManifest=Object.freeze(Object.fromEntries(bosses.map(b=>[
 b.slug,Object.freeze({...defaultRecord(b),...(approvedBossImages[b.slug]||{})})
])));

export const getBossImage=id=>bossImageManifest[id]||null;
const validLocalPath=value=>typeof value==="string"&&/^\\?\/(?!\/)[a-zA-Z0-9/_-]+\.(?:avif|webp|png|jpe?g)$/i.test(value)&&!value.includes("..");
const validHttps=value=>typeof value==="string"&&/^https:\/\/[^\s/?#]+\.[^\s]+/i.test(value);
export function canDisplayBossImage(record){
 return Boolean(
 record&&record.status==="approved"&&record.verificationStatus==="identity-confirmed"&&
 record.bossId===record.subjectId&&validLocalPath(record.assetPath)&&
 validHttps(record.sourceUrl)&&validHttps(record.permissionEvidence)&&
 typeof record.permissionBasis==="string"&&record.permissionBasis.trim().length>=8&&
 typeof record.license==="string"&&record.license.trim().length>=3&&
 typeof record.attribution==="string"&&record.attribution.trim().length>0&&
 typeof record.description==="string"&&record.description.trim().length>0&&
 Number.isInteger(record.width)&&record.width>0&&Number.isInteger(record.height)&&record.height>0
 );
}

export function validateBossImageManifest(){
 const errors=[],ids=new Set(bosses.map(b=>b.slug)),imageUses=new Map();
 if(Object.keys(bossImageManifest).length!==ids.size)errors.push("Boss image manifest must cover every documented fight.");
 for(const boss of bosses){
  const record=getBossImage(boss.slug);
  if(!record||record.bossId!==boss.slug){errors.push("Missing or mismatched boss image record: "+boss.slug);continue}
  if(record.status==="fallback"){
   if(record.assetPath!==null||record.verificationStatus!=="identity-and-reuse-not-confirmed")errors.push("Fallback must not claim portrait approval: "+boss.slug);
   if(record.fallbackAsset!==BOSS_FALLBACK_ASSET||record.fallbackLabel!==BOSS_FALLBACK_LABEL)errors.push("Incorrect branded fallback: "+boss.slug);
  }else if(record.status==="approved"){
   if(!canDisplayBossImage(record))errors.push("Image lacks permission or identity evidence: "+boss.slug);
   if(record.assetPath){
    const previous=imageUses.get(record.assetPath);
    if(previous&&previous!==boss.slug)errors.push("Image incorrectly reused by unrelated bosses: "+previous+" / "+boss.slug);
    imageUses.set(record.assetPath,boss.slug);
   }
  }else errors.push("Unsupported image state: "+boss.slug);
 }
 for(const key of Object.keys(approvedBossImages))if(!ids.has(key))errors.push("Orphan image approval: "+key);
 return errors;
}

export const bossImageCounts=()=>({
 reviewed:bosses.length,
 approved:bosses.filter(b=>canDisplayBossImage(getBossImage(b.slug))).length,
 permissionConfirmed:bosses.filter(b=>canDisplayBossImage(getBossImage(b.slug))).length,
 fallback:bosses.filter(b=>!canDisplayBossImage(getBossImage(b.slug))).length
});
