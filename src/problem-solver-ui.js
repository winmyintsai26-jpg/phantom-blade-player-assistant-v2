import {solverCategories,problemCandidates,problemSolution} from "./problem-solver.js";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function renderProblemSolver(layout){
 document.title="Solve My Problem | Phantom Blade Zero Player Guide";
 layout(`<section class="solver-page"><a class="back" href="/">← Home</a><span class="eyebrow">— PLAYER PROBLEM SOLVER</span><h1>Solve My Problem</h1><p class="intro">Choose what you are stuck on. This matches your answers to existing source-researched guides—without guessing or reading your game save.</p><div class="solver-controls"><label for="solver-category">1. What kind of problem?<select id="solver-category"><option value="">Select a category</option>${solverCategories.map(c=>`<option value="${c.id}">${esc(c.label)}</option>`).join("")}</select></label><label for="solver-target">2. Which objective or encounter?<select id="solver-target" disabled><option value="">Choose a category first</option></select></label><label for="solver-situation">3. Which situation fits?<select id="solver-situation" disabled><option value="">Choose a problem first</option></select></label></div><div class="solver-actions"><button id="solver-show" type="button" disabled>Show next steps</button><button id="solver-reset" type="button">Start over</button></div><div id="solver-result" role="status" aria-live="polite"><p>Select a category to find an existing guide.</p></div></section>`);
 const category=document.querySelector("#solver-category"),target=document.querySelector("#solver-target"),situation=document.querySelector("#solver-situation"),show=document.querySelector("#solver-show"),result=document.querySelector("#solver-result");
 const reset=()=>{category.value="";target.innerHTML='<option value="">Choose a category first</option>';target.disabled=true;situation.innerHTML='<option value="">Choose a problem first</option>';situation.disabled=true;show.disabled=true;result.innerHTML="<p>Select a category to find an existing guide.</p>"};
 category.addEventListener("change",()=>{
  const matches=problemCandidates(category.value);
  target.disabled=!matches.length;
  target.innerHTML='<option value="">Choose a known problem</option>'+matches.map(c=>`<option value="${esc(c.id)}">${esc(c.title)} — ${esc(c.region)}</option>`).join("");
  situation.innerHTML='<option value="">Choose a problem first</option>';situation.disabled=true;show.disabled=true;
  result.innerHTML=matches.length?"<p>Select the matching objective or encounter.</p>":'<p class="empty">We do not have an evidenced guide in that category yet. <a href="/contact/">Report your situation</a> so the research queue can prioritize it.</p>';
 });
 target.addEventListener("change",()=>{
  const c=problemSolution(category.value,target.value);
  situation.innerHTML='<option value="">General guidance / not sure</option>'+(c?.choices||[]).map((x,i)=>`<option value="${i}">${esc(x.label)}</option>`).join("");
  situation.disabled=!c?.choices?.length;show.disabled=!c;result.innerHTML="<p>Choose a situation when available, then show the next steps.</p>";
 });
 show.addEventListener("click",()=>{
  const c=problemSolution(category.value,target.value,situation.value);
  if(!c){result.innerHTML='<p class="empty">No matching documented solution was found. <a href="/contact/">Report the missing route</a>.</p>';return}
  const steps=c.focused?.steps||c.steps;
  result.innerHTML=`<article class="solver-result"><span class="eyebrow">SOURCE-RESEARCHED · NOT GAMEPLAY-TESTED</span><h2>${esc(c.title)}</h2><p>${esc(c.status)} · ${esc(c.region)}</p><h3>Before starting</h3>${c.requirements.length?`<ul>${c.requirements.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:"<p>Prerequisites have not been established in this record. Confirm your current quest and nearest Bell.</p>"}<h3>${c.focused?esc(c.focused.title):"What to do next"}</h3>${steps.length?`<ol>${steps.slice(0,5).map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`:"<p>This region reference does not contain a complete route. Open the region page for its documented checkpoints rather than following invented instructions.</p>"}<h3>How to confirm</h3><p>${esc(c.confirmation||"No specific completion confirmation has been established for this reference. Check the in-game journal or inventory.")}</p>${c.recovery.length?`<h3>If that did not work</h3><ul>${c.recovery.slice(0,3).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}<a class="primary" href="${esc(c.href)}">Open the full ${c.kind==="region"?"region reference":"guide"} ↗</a><p class="note">This recommendation is based only on existing written references; it does not prove in-game completion.</p></article>`;
 });
 document.querySelector("#solver-reset").addEventListener("click",reset);
}
