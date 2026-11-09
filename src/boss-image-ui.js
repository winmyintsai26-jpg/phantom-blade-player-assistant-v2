import {canDisplayBossImage,getBossImage,BOSS_FALLBACK_ASSET,BOSS_FALLBACK_LABEL} from "./boss-images.js";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// The brand mark is decorative and NEVER represents the selected boss.
// A failed approved image is replaced with an unmistakably labeled brand placeholder.
export function bossImageHtml(boss,{profile=false}={}){
 const img=getBossImage(boss.slug),approved=canDisplayBossImage(img);
 const variant=profile?"profile":"card";
 const label=esc(BOSS_FALLBACK_LABEL);
 const fallback='<div class="boss-image-fallback"'+(approved?' hidden':'')+'><img src="'+esc(BOSS_FALLBACK_ASSET)+'" alt="" loading="lazy" decoding="async" width="124" height="124"><span>'+label+'</span></div>';
 const picture=approved?'<img class="boss-portrait" src="'+esc(img.assetPath)+'" alt="'+esc(img.description)+'" loading="'+(profile?'eager':'lazy')+'" decoding="async" width="'+img.width+'" height="'+img.height+'" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="boss-image-fallback" hidden><img src="'+esc(BOSS_FALLBACK_ASSET)+'" alt="" loading="lazy" decoding="async" width="124" height="124"><span>'+label+'</span></div>':'';
 return '<figure class="boss-image boss-image--'+variant+'" data-boss-image-id="'+esc(boss.slug)+'" data-image-status="'+(approved?'approved':'fallback')+'">'+
 '<div class="boss-image-stage">'+(approved?picture:fallback)+'</div>'+
 (approved?'<figcaption>'+esc(img.attribution)+' · '+esc(img.license)+(img.variant?' · '+esc(img.variant):'')+'</figcaption>':'<figcaption>Branded placeholder only — not a portrait or game screenshot.</figcaption>')+
 '</figure>';
}
