import {regions} from "./regions.js";
import {regionCollectibles} from "./collectibles.js";
import {SPOILER_KEY,makeProgressBackup,restoreProgressBackup,nextAction} from "./progress.js";

const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const spoilersVisible=()=>{try{return localStorage.getItem(SPOILER_KEY)==="true"}catch{return false}};
export function spoilerContent(inner,label){
 if(spoilersVisible())return inner;
 return '<details class="spoiler-gate"><summary>Reveal '+escapeHTML(label)+' · contains spoilers</summary><div class="spoiler-body">'+inner+'</div></details>';
}
export function nextActionCard(readProgress){
 const next=nextAction(readProgress);
 const description=next?'Based on your local checklists, your next suggested task is <strong>'+escapeHTML(next.title)+'</strong> in '+escapeHTML(next.region.name)+' ('+escapeHTML(next.kind)+').':'All currently indexed region items and checkpoints are marked complete on this device.';
 const action=next?'<a class="primary" href="'+escapeHTML(next.href)+'">Take me to the next task ↗</a>':'<a class="primary" href="/progress/">Back up progress ↗</a>';
 return '<section class="next-action" aria-labelledby="next-action-heading"><div><span class="eyebrow">— SAVED PROGRESS ADVISOR</span><h2 id="next-action-heading">What should I do next?</h2><p>'+description+' Checklist history is not connected to the game.</p></div>'+action+'</section>';
}
export function progressPage(layout,readProgress){
 document.title="Progress & backup | Phantom Blade Zero V2";
 const list=regions.map(r=>'<li><a href="/regions/'+r.id+'/">'+escapeHTML(r.name)+'</a><span>'+readProgress("items-"+r.id).length+' / '+regionCollectibles(r.id).length+' items · '+readProgress("region-"+r.id).length+' / '+r.checkpoints.length+' checkpoints</span></li>').join("");
 layout('<section class="progress-page"><a class="back" href="/">← Homepage</a><span class="eyebrow">— YOUR PLAYER DATA</span><h1>Progress & backup</h1><p class="intro">Checklists are stored on this device, not in your game account. Download a JSON backup before clearing browser data or switching devices.</p><section class="data-panel"><h2>Back up your progress</h2><p>Save all guide steps, collectibles, critical checkpoints, and spoiler preference in one JSON file.</p><button class="primary" id="export-progress" type="button">Export progress (.json) ↓</button><h2>Import saved progress</h2><p>Select a V2 JSON backup. Valid entries are <strong>merged</strong> with the existing progress on this device; existing ticks will not be removed.</p><input id="import-progress" type="file" accept=".json,application/json" aria-label="Select progress JSON backup"><p id="import-status" role="status" aria-live="polite"></p></section><section class="data-panel"><h2>Spoiler controls</h2><label class="spoiler-switch"><input type="checkbox" id="spoiler-toggle" '+(spoilersVisible()?'checked':'')+'> Reveal late-game and ending walkthrough details</label><p class="note">Critical missable warnings stay visible. This setting hides late-game and return-visit directions until you choose to reveal them.</p></section><section class="data-panel"><h2>Saved region checklist</h2><ul class="saved-regions">'+list+'</ul></section></section>');
 document.getElementById("export-progress").addEventListener("click",()=>{
  try{const data=JSON.stringify(makeProgressBackup(localStorage),null,2);const blob=new Blob([data],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="phantom-blade-v2-progress.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  catch(e){document.getElementById("import-status").textContent="Export unavailable: "+e.message}
 });
 document.getElementById("import-progress").addEventListener("change",async e=>{
  const file=e.target.files?.[0];if(!file)return;const status=document.getElementById("import-status");
  if(file.size>1024*1024){status.textContent="File too large. Select a JSON file under 1 MB.";return}
  try{const data=JSON.parse(await file.text());const n=restoreProgressBackup(localStorage,data);status.textContent="Imported "+n+" checklist groups. Refreshing…";setTimeout(()=>location.reload(),400)}
  catch(err){status.textContent="Import failed: "+err.message}
 });
 document.getElementById("spoiler-toggle").addEventListener("change",e=>{try{localStorage.setItem(SPOILER_KEY,String(e.target.checked))}catch{}});
}
