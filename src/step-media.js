// Step images must be deliberately sourced; no placeholder gameplay imagery.
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function validStepImage(image){
 if(!image||typeof image!=="object"||!image.authorized)return false;
 if(!image.src||!image.alt||!image.caption||!image.attribution||!image.status)return false;
 const src=String(image.src);
 return (/^\/(?!\/)[a-zA-Z0-9/_.,-]+\.(?:png|webp|jpe?g)$/.test(src)||/^https:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9/_.,?=&%-]+\.(?:png|webp|jpe?g)(?:\?.*)?$/.test(src));
}
export function renderStepImage(image){
 if(!validStepImage(image))return "";
 const status=esc(image.status);
 const type=esc(image.type||"Source image · not proof of this route");
 return `<figure class="step-media"><div class="step-media-frame"><img loading="lazy" decoding="async" width="640" height="360" src="${esc(image.src)}" alt="${esc(image.alt)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><p class="step-media-fallback" hidden>Image unavailable. Follow the written step below.</p></div><figcaption>${esc(image.caption)} · ${type} · ${status} · ${esc(image.attribution)}</figcaption></figure>`;
}
