import {problems,helpCategories,getProblem,findProblems} from "./help-problems.js";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const repo="https://github.com/winmyintsai26-jpg/phantom-blade-player-assistant-v2";
const safeLink=url=>url.startsWith("/")||url.startsWith("https://");
const problemCard=p=>`<a href="/help/${p.id}/" class="help-card"><span class="help-category">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><small>${esc(p.region)} · ${esc(p.status)} ↗</small></a>`;
export function renderHelpCenter(layout){
 document.title="Player Help Center | Phantom Blade Zero V2";
 layout(`<div class="help-shell"><a href="/" class="back">← Homepage</a><span class="eyebrow">— PLAYER HELP CENTER</span><h1>What are you stuck on?</h1><p class="intro">Find a real player problem and follow source-backed troubleshooting. Unverified details are clearly identified; no game save is read automatically.</p><div class="help-searchbar"><input id="problem-search" type="search" aria-label="Search player problems" placeholder="Try: Jing Ye, tower base, parry, NG+…"><select id="problem-category" aria-label="Filter problems by category"><option>All</option>${helpCategories.map(c=>`<option>${esc(c)}</option>`).join("")}</select></div><p id="problem-count" role="status"></p><div class="help-cards" id="problem-list"></div><p class="note">Don't see your exact issue? Open any related guide and use the feedback form. New reports help identify missing routes.</p></div>`);
 const search=document.getElementById("problem-search"),filter=document.getElementById("problem-category"),count=document.getElementById("problem-count"),list=document.getElementById("problem-list");
 const draw=()=>{const matches=findProblems(search.value,filter.value);count.textContent=matches.length+" player problems found";list.innerHTML=matches.length?matches.map(problemCard).join(""):'<p class="empty">No matching guide yet. Try a shorter term or another category.</p>'};
 search.addEventListener("input",draw);filter.addEventListener("change",draw);draw();
}
export function renderProblem(layout,id){
 const p=getProblem(id);if(!p)return false;
 document.title=p.title+" | Phantom Blade Zero V2";
 const choices=p.choices.map((c,i)=>`<button type="button" class="diagnosis-option" data-diagnosis="${i}" aria-pressed="false">${esc(c.label)}</button>`).join("");
 const stepItems=p.steps.map((s,i)=>`<li id="help-step-${i}"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p><p class="help-check"><b>Confirm:</b> ${esc(s.check)}</p></li>`).join("");
 layout(`<div class="help-shell help-article"><a href="/help/" class="back">← Player Help Center</a><span class="eyebrow">— ${esc(p.category.toUpperCase())}</span><h1>${esc(p.title)}</h1><p class="intro">${esc(p.summary)}</p><div class="pills"><span>${esc(p.region)}</span><span>${esc(p.status)}</span></div><div class="warning"><p><strong>Evidence notice:</strong> ${esc(p.cause)} Sources may differ and these instructions have not been independently replayed in-game.</p></div><nav class="help-jump" aria-label="Guide navigation"><a href="#diagnosis">Choose your problem</a><a href="#requirements">Before starting</a><a href="#solution">Steps</a><a href="#feedback">Feedback</a></nav><section id="diagnosis" class="help-panel"><h2>Where are you struggling?</h2><p>Choose the closest description. We'll show a focused plan without hiding the full guide.</p><div class="diagnosis-options">${choices}</div><div id="diagnosis-result" role="status" aria-live="polite"><p>Choose a situation above to see tailored instructions.</p></div></section><section id="requirements" class="help-panel"><h2>Before you start</h2><ul>${p.prerequisites.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section><section id="solution" class="help-panel"><h2>Step-by-step solution</h2><ol class="help-steps">${stepItems}</ol></section><section class="help-panel"><h2>Common mistakes</h2><ul>${p.mistakes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><h2>If that did not work</h2><ul>${p.troubleshooting.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section><section class="help-panel"><h2>Sources and related help</h2><div class="help-sources">${p.links.filter(x=>safeLink(x.url)).map(x=>`<a href="${esc(x.url)}" ${x.url.startsWith("/")?"":'target="_blank" rel="noopener noreferrer"'}>${esc(x.name)} ↗</a>`).join("")}</div><div class="help-related">${p.related.map(x=>getProblem(x)).filter(Boolean).map(x=>problemCard(x)).join("")}</div></section><section class="help-panel help-feedback" id="feedback"><h2>Did this solve your problem?</h2><div class="feedback-choices"><button type="button" data-feedback="solved">This solved my problem</button><button type="button" data-feedback="not-solved">This did not solve my problem</button><button type="button" data-feedback="different">My situation is different</button></div><label for="feedback-detail">What happened? Include the region, nearest Bell, phase and game version if known.</label><textarea id="feedback-detail" rows="4" maxlength="2500" placeholder="Tell us what worked or what failed…"></textarea><button type="button" id="send-feedback" disabled>Prepare feedback on GitHub ↗</button><p id="feedback-help" role="status">Select an outcome to prepare a correction report. You review and submit the report yourself through GitHub.</p></section></div>`);
 document.querySelectorAll("[data-diagnosis]").forEach(button=>button.addEventListener("click",()=>{
   const i=Number(button.dataset.diagnosis),c=p.choices[i];if(!c)return;
   document.querySelectorAll("[data-diagnosis]").forEach(x=>x.setAttribute("aria-pressed",String(x===button)));
   document.getElementById("diagnosis-result").innerHTML=`<h3>${esc(c.lead)}</h3><ol>${c.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`;
 }));
 let outcome=null;const detail=document.getElementById("feedback-detail");
 document.querySelectorAll("[data-feedback]").forEach(button=>button.addEventListener("click",()=>{
   outcome=button.dataset.feedback;
   document.querySelectorAll("[data-feedback]").forEach(x=>x.setAttribute("aria-pressed",String(x===button)));
   document.getElementById("send-feedback").disabled=false;
   document.getElementById("feedback-help").textContent="You can add details, then open a prefilled GitHub issue for review.";
 }));
 document.getElementById("send-feedback").addEventListener("click",()=>{
   if(!outcome)return;
   const title="[Player Help] "+p.title+" — "+outcome;
   const body=["Guide: "+p.title,"URL: /help/"+p.id+"/","Outcome: "+outcome,"Player report:",detail.value.trim()||"No additional details provided.","","Please verify against gameplay before modifying verified claims."].join("\n");
   const url=repo+"/issues/new?title="+encodeURIComponent(title)+"&body="+encodeURIComponent(body);
   window.open(url,"_blank","noopener,noreferrer");
   document.getElementById("feedback-help").textContent="GitHub opened in a new tab. Submit the report there when ready.";
 });
 return true;
}
