import test from "node:test";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {chromium} from "playwright";
import {problems,findProblems} from "../src/help-problems.js";
import {regions} from "../src/regions.js";
import {guides} from "../src/guides.js";
import {objectiveRecords} from "../src/objectives.js";
import {bosses} from "../src/bosses.js";
import {renderStepImage} from "../src/step-media.js";

const origin="http://127.0.0.1:4178";
// External promotional images and fonts must not block functional route QA.
const openPage=(page,url)=>page.goto(url,{waitUntil:"domcontentloaded",timeout:20000});
// Start Vite directly so SIGTERM cleans up the actual server, not only an npm parent process.
const server=spawn(process.execPath,["./node_modules/vite/bin/vite.js","--host","127.0.0.1","--port","4178","--strictPort"],{stdio:"pipe"});
let stderr="";
server.stderr.on("data",d=>{stderr+=String(d)});
async function waitForServer(){
  for(let i=0;i<70;i++){
    if(server.exitCode!==null)throw new Error("Vite exited early: "+stderr);
    try{const r=await fetch(origin);if(r.ok)return}catch{}
    await new Promise(r=>setTimeout(r,300));
  }
  throw new Error("Vite did not start: "+stderr);
}
try{
  await waitForServer();
  const browser=await chromium.launch({headless:true});
  try{
    await test("Phase 4.1 browse full boss roster, filter and follow sourced strategy",async()=>{
      const page=await browser.newPage();
      const errors=[];page.on("pageerror",e=>errors.push(e.message));
      await openPage(page,origin+"/bosses/");
      assert.equal(await page.locator(".boss-card").count(),bosses.length);
      await page.locator("#boss-query").fill("FROST YUCONG");
      assert.equal(await page.locator(".boss-card").count(),1);
      await page.locator("#boss-query").fill("");
      await page.locator("#boss-region").selectOption("crimson-forest");
      assert.equal(await page.locator(".boss-card").count(),bosses.filter(b=>b.region==="crimson-forest").length);
      await page.locator("#boss-category").selectOption("optional");
      assert.equal(await page.locator(".boss-card").count(),bosses.filter(b=>b.region==="crimson-forest"&&b.category==="optional").length);
      await openPage(page,origin+"/bosses/jing-ye-the-outlaw/");
      assert.match(await page.locator("h1").innerText(),/Jing Ye/);
      await page.locator("#boss-phase").selectOption("Shield phase");
      await page.locator("#boss-problem").selectOption("damage");
      await page.locator("#boss-advice").click();
      assert.match(await page.locator("#boss-advice-result").innerText(),/shield|damage/i);
      await openPage(page,origin+"/bosses/peng-meng-the-axemaster/");
      await page.locator("#boss-problem").selectOption("parry");
      await page.locator("#boss-advice").click();
      assert.match(await page.locator("#boss-advice-result").innerText(),/Strategy not yet documented/);
      assert.equal(await page.locator('a[href="/guides/combat-diagnostics/"]').count()>=1,true);
      await openPage(page,origin+"/regions/crimson-forest/");
      assert.ok(await page.locator('a[href="/bosses/?region=crimson-forest"]').count()>0);
      assert.deepEqual(errors,[]);
      await page.close();
    });
    await test("Phase 4.1 boss status, tried tactics and feedback draft persist",async()=>{
      const page=await browser.newPage();
      await openPage(page,origin+"/bosses/jing-ye-the-outlaw/");
      await page.locator("#boss-status").selectOption("in-progress");
      await page.locator('[data-boss-attempt="parry"]').check();
      await page.reload({waitUntil:"domcontentloaded"});
      assert.equal(await page.locator("#boss-status").inputValue(),"in-progress");
      assert.equal(await page.locator('[data-boss-attempt="parry"]').isChecked(),true);
      assert.equal(await page.locator("#boss-feedback-send").isDisabled(),true);
      await page.locator("#boss-feedback-result").selectOption("failed");
      assert.equal(await page.locator("#boss-feedback-send").isEnabled(),true);
      await page.locator("#boss-status").selectOption("completed");
      await openPage(page,origin+"/progress/");
      assert.ok((await page.locator(".progress-page").innerText()).includes("Boss progress by region"));
      await page.close();
    });
    await test("Phase 4 problem solver and item finder route real players to existing guides",async()=>{
      const page=await browser.newPage();
      const errors=[];page.on("pageerror",e=>errors.push(e.message));
      await openPage(page,origin+"/");
      assert.equal(await page.locator('a[href="/solver/"]').count()>0,true);
      await openPage(page,origin+"/solver/");
      assert.match(await page.locator("h1").innerText(),/Solve My Problem/);
      await page.locator("#solver-category").selectOption("boss");
      await page.locator("#solver-target").selectOption("problem:jing-ye-dismounted");
      await page.locator("#solver-situation").selectOption("1");
      await page.locator("#solver-show").click();
      assert.match(await page.locator("#solver-result").innerText(),/Jing Ye/);
      assert.equal(await page.locator('#solver-result a[href="/help/jing-ye-dismounted/"]').count(),1);
      await page.locator("#solver-reset").click();
      assert.equal(await page.locator("#solver-target").isDisabled(),true);
      await page.locator("#solver-category").selectOption("navigation");
      await page.locator("#solver-target").selectOption("region:mirage-estate");
      await page.locator("#solver-show").click();
      assert.match(await page.locator("#solver-result").innerText(),/complete route/i);
      await openPage(page,origin+"/objectives/");
      await page.locator("#objective-search").fill("pIgEoN fEeD");
      assert.ok(await page.locator(".objective-card").count()>=1);
      await page.locator("#objective-search").fill("");
      await page.locator("#item-region").selectOption("weeping-creek");
      await page.locator("#item-type").selectOption("Bell");
      assert.ok(await page.locator(".objective-card").count()>=1);
      assert.equal(await page.locator(".objective-card").first().innerText().then(x=>x.includes("Starting Bell not established")),true);
      await page.locator("#objective-search").fill("totally unknown item");
      assert.match(await page.locator("#objective-results").innerText(),/No matching record/);
      assert.deepEqual(errors,[]);
      await page.close();
    });
    await test("authorized step images reserve space and fail to readable text fallback",async()=>{
      const page=await browser.newPage();
      await openPage(page,origin+"/guides/healers-legacy/");
      const html=renderStepImage({src:"/images/nonexistent-route-reference.webp",alt:"Missing route reference",caption:"Bridge reference",attribution:"Example only in test",status:"Not game-tested",authorized:true});
      await page.locator("#guide-step-0").evaluate((el,html)=>el.insertAdjacentHTML("beforeend",html),html);
      const img=page.locator("#guide-step-0 .step-media img");
      await img.evaluate(el=>new Promise(resolve=>{if(el.complete)return resolve();el.addEventListener("load",resolve,{once:true});el.addEventListener("error",resolve,{once:true})}));
      assert.equal(await img.isHidden(),true);
      assert.equal(await page.locator("#guide-step-0 .step-media-fallback").isVisible(),true);
      assert.match(await page.locator("#guide-step-0").innerText(),/Bridge reference/);
      assert.match(await page.locator("#guide-step-0").innerText(),/Find the Twin Flesh Lilies/);
      await page.close();
    });
    await test("Phase 4 manual states and missable warnings remain local and exportable",async()=>{
      const page=await browser.newPage();
      await openPage(page,origin+"/progress/");
      assert.equal(await page.locator("#progress-region").count(),1);
      await page.locator("#progress-region").selectOption("weeping-creek");
      const status=page.locator('[data-progress-state="checkpoint:weeping-creek:0"]');
      assert.equal(await status.inputValue(),"not-started");
      assert.ok(await page.locator("#missable-outstanding li").count()>0);
      await status.selectOption("in-progress");
      await page.reload({waitUntil:"domcontentloaded"});
      assert.equal(await page.locator('[data-progress-state="checkpoint:weeping-creek:0"]').inputValue(),"in-progress");
      await page.locator('[data-progress-state="checkpoint:weeping-creek:0"]').selectOption("completed");
      assert.equal(await page.locator('[data-progress-state="checkpoint:weeping-creek:0"]').inputValue(),"completed");
      assert.equal(await page.evaluate(()=>localStorage.getItem("pbz-v2-status:checkpoint:weeping-creek:0")),"completed");
      await page.locator('[data-progress-state="objective:weeping-creek:52"]').selectOption("completed");
      await openPage(page,origin+"/objectives/weeping-creek/52/");
      assert.equal(await page.locator("#objective-completed").isChecked(),true);
      await page.close();
    });
    await test("curated objective search, deep links and local completion check work",async()=>{
      const page=await browser.newPage();
      const errors=[];page.on("pageerror",e=>errors.push(e.message));
      await openPage(page,origin+"/objectives/");
      assert.equal(await page.locator(".objective-card").count(),objectiveRecords.length);
      await page.locator("#objective-search").fill("outlaw trap");
      assert.ok(await page.locator(".objective-card").count()>=1);
      await openPage(page,origin+"/regions/weeping-creek/");
      assert.ok(await page.locator(".objective-entry-link").count()>=1);
      await openPage(page,origin+"/objectives/weeping-creek/52/");
      assert.match(await page.locator("h1").innerText(),/Reflex Device/);
      assert.match(await page.locator(".objective-intro").innerText(),/Sha-Chi Tower Base/);
      assert.ok(await page.locator(".objective-section").count()>=4);
      assert.equal(await page.locator("#objective-report-button").isDisabled(),true);
      await page.locator("#objective-outcome").selectOption("missing");
      await page.locator("#objective-failed-step").selectOption("0");
      await page.locator("#objective-missing").fill("Gate key absent");
      await page.locator("#objective-platform").fill("PC");
      await page.locator("#objective-version").fill("Test patch");
      assert.equal(await page.locator("#objective-report-button").isEnabled(),true);
      const storageBefore=await page.evaluate(()=>localStorage.getItem("pbz-v2-objective:weeping-creek:52"));
      assert.equal(storageBefore,null);

      await page.locator("#objective-completed").check();
      // Outcome report must never toggle or erase the player's saved completion choice.
      assert.equal(await page.locator("#objective-completed").isChecked(),true);

      await page.reload({waitUntil:"domcontentloaded"});
      assert.equal(await page.locator("#objective-completed").isChecked(),true);
      assert.deepEqual(errors,[]);
      await page.close();
    });
    await test("selected header logo and favicon load on desktop and mobile",async()=>{
      for(const width of [1366,375]){
        const page=await browser.newPage({viewport:{width,height:812}});
        for(const route of ["/","/help/","/objectives/","/regions/weeping-creek/","/about/"]){
          await openPage(page,origin+route);
          const brand=page.locator('.header a.brand[href="/"]');
          assert.equal(await brand.count(),1,route);
          const logo=brand.locator("img.brand-logo");
          assert.equal(await logo.getAttribute("src"),"/phantom-guide-logo.png");
          assert.equal(await logo.getAttribute("width"),"56");
          assert.equal(await logo.getAttribute("height"),"56");
          assert.equal(await logo.getAttribute("alt"),"");
          assert.equal(await logo.evaluate(img=>img.complete&&img.naturalWidth>0),true,route+" logo did not load");
          const favicon=await page.locator('link[rel="icon"]').getAttribute("href");
          const touch=await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
          assert.equal(favicon,"/favicon.png");
          assert.equal(touch,"/phantom-guide-icon-192.png");
          assert.equal((await page.request.get(origin+favicon)).status(),200);
          assert.equal((await page.request.get(origin+touch)).status(),200);
          const size=await logo.boundingBox();
          assert.ok(size.width>=38&&size.width<=57,route+" logo size at "+width);
        }
        await page.close();
      }
    });
    await test("all nine region routes and home page render",async()=>{
      const page=await browser.newPage();
      const errors=[];page.on("pageerror",e=>errors.push(e.message));
      await openPage(page,origin+"/");
      assert.match(await page.locator("h1").innerText(),/Every obstacle/);
      assert.equal(await page.locator(".region-card").count(),regions.length);
      for(const {id:route} of regions){
        await openPage(page,origin+"/regions/"+route+"/");
        assert.equal(await page.locator(".region-page h1").count(),1,route);
        assert.equal(await page.locator(".region-cover img").count(),1,route);
        assert.equal(await page.locator(".region-hub").count(),1,route);
        assert.equal(await page.locator(".region-jump a").count(),6,route);
        assert.equal(await page.locator("#before-bosses").count(),1,route);
        assert.equal(await page.locator("#critical-checkpoints").count(),1,route);
        assert.equal(await page.locator("#collectible-route").count(),1,route);
        assert.equal(await page.locator("#research-reference").count(),1,route);
        assert.equal(await page.locator("#region-videos").count(),1,route);
        assert.ok(await page.locator("#region-videos .video-research-list a").count()>=2,route);
        assert.equal(await page.locator("#region-videos a[href*=\"youtube.com/results\"]").count(),2,route);
        assert.equal(await page.locator(route==="weeping-creek"?"#weeping-routes":"#regional-tales").count(),1,route);
        assert.ok(await page.locator(".region-cover").evaluate(el=>document.querySelector(".region-page .pills").compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),route+" cover must follow region heading and stats");
        assert.ok(await page.locator(".collectible-row").count()>0,route);
      }
      assert.deepEqual(errors,[]);
      await page.close();
    });
    await test("all nine regions use distinct hero pictures",async()=>{const page=await browser.newPage();const images=[];for(const {id:slug} of regions){await openPage(page,origin+"/regions/"+slug+"/");images.push(await page.locator(".region-cover img").getAttribute("src"));}assert.equal(new Set(images).size,regions.length);await page.close();});
    await test("all four homepage workspaces render complete steps with region links",async()=>{
      const page=await browser.newPage();
      for(const [slug,minimum] of [["healers-legacy",9],["ending-checkpoints",7],["missable-preflight",8],["combat-diagnostics",8]]){
        await openPage(page,origin+"/guides/"+slug+"/");
        assert.equal(await page.locator(".guide h1").count(),1,slug);
        assert.equal(await page.locator(".guide .step").count(),minimum,slug);
        assert.equal(await page.locator(".guide-stage").count(),minimum,slug);
        assert.ok(await page.locator("#sources a").count()>=2,slug);
      }
      await page.close();
    });
    await test("About and Privacy pages render and are reachable from site footer",async()=>{
      const page=await browser.newPage();
      await openPage(page,origin+"/");
      assert.equal(await page.locator('.footer-links a[href="/about/"]').count(),1);
      assert.equal(await page.locator('.footer-links a[href="/privacy/"]').count(),1);
      assert.equal(await page.locator('.footer-links a[href="/contact/"]').count(),1);
      assert.equal(await page.locator('.header nav a[href="/objectives/"]').count(),1);
      for(const pathname of ["/about/","/privacy/","/contact/"]){
        const response=await openPage(page,origin+pathname);
        assert.equal(response.status(),200,pathname);
        assert.equal(await page.locator(".site-info h1").count(),1,pathname);
        await page.reload({waitUntil:"domcontentloaded"});
        assert.equal(await page.locator(".site-info").count(),1,pathname);
      }
      await page.close();
    });
    await test("Player Help Center filters, diagnosis and feedback work",async()=>{
      const page=await browser.newPage();
      const errors=[];page.on("pageerror",e=>errors.push(e.message));
      await openPage(page,origin+"/help/");
      assert.equal(await page.locator(".help-card").count(),problems.length);
      assert.deepEqual(await page.locator(".help-card").evaluateAll(links=>links.map(a=>new URL(a.href).pathname)),problems.map(p=>"/help/"+p.id+"/"));
      await page.locator("#problem-search").fill("Jing Ye");
      assert.equal(await page.locator(".help-card").count(),1);
      await page.locator("#problem-search").fill("");
      await page.locator("#problem-category").selectOption("Quests & Bugs");
      assert.equal(await page.locator(".help-card").count(),findProblems("","Quests & Bugs").length);
      assert.ok(findProblems("","Quests & Bugs").some(p=>p.id==="pipa-ng-plus"));
      await openPage(page,origin+"/help/jing-ye-dismounted/");
      assert.equal(await page.locator(".help-steps li").count(),5);
      await page.locator('[data-diagnosis="1"]').click();
      assert.match(await page.locator("#diagnosis-result").innerText(),/shield/i);
      await page.locator('[data-feedback="not-solved"]').click();
      assert.equal(await page.locator("#send-feedback").isDisabled(),false);
      assert.deepEqual(errors,[]);
      await page.close();
    });
    await test("all current help deep links render and survive direct reload",async()=>{
      const page=await browser.newPage({viewport:{width:1366,height:768}});
      const errors=[];page.on("pageerror",e=>errors.push(e.message));
      for(const {id:slug} of problems){
        const response=await openPage(page,origin+"/help/"+slug+"/");
        assert.equal(response.status(),200,slug);
        assert.equal(await page.locator(".help-article h1").count(),1,slug);
        assert.equal(await page.locator(".help-article h1").innerText(),problems.find(p=>p.id===slug).title,slug+" title");
        assert.ok(await page.locator(".help-steps li").count()>=3,slug);
        assert.ok(await page.locator(".diagnosis-option").count()>=2,slug);
        await page.reload();
        assert.equal(await page.locator(".help-article").count(),1,slug+" on reload");
      }
      assert.deepEqual(errors,[]);
      await page.close();
    });
    await test("feedback draft carries selected diagnosis and platform",async()=>{
      const page=await browser.newPage();
      await openPage(page,origin+"/help/jing-ye-dismounted/");
      await page.locator('[data-diagnosis="1"]').click();
      await page.locator('[data-feedback="different"]').click();
      await page.locator("#feedback-platform").fill("PS5, version 1.0.1");
      await page.locator("#feedback-detail").fill("I can dismount but the shield never breaks.");
      const popupPromise=page.waitForEvent("popup");
      await page.locator("#send-feedback").click();
      const popup=await popupPromise;
      const prepared=decodeURIComponent(decodeURIComponent(popup.url())); // GitHub may redirect through login and double-encode the draft
      assert.match(prepared,/Selected troubleshooting problem: I can get him off his horse/);
      assert.match(prepared,/PS5, version 1.0.1/);
      assert.match(prepared,/My situation is different/);
      await popup.close();await page.close();
    });
    await test("Player Help pages have no mobile horizontal overflow",async()=>{
      const page=await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true});
      for(const url of ["/help/","/help/sha-chi-tower-base/","/help/red-seven-sword/"]){
        await openPage(page,origin+url);
        const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
        assert.ok(sizes.scroll<=sizes.client+2,url+" overflow "+JSON.stringify(sizes));
      }
      await page.close();
    });
    await test("search, phase filters and progress survive reload",async()=>{
      const page=await browser.newPage();
      await openPage(page,origin+"/regions/weeping-creek/");
      assert.equal(await page.locator(".collectible-row").count(),61);
      await page.locator("#item-search").fill("Boulderguard");
      assert.equal(await page.locator(".collectible-row").count(),1);
      await page.locator("#clear-item-filters").click();
      assert.equal(await page.locator(".collectible-row").count(),61);
      await page.locator("#item-phase").selectOption("Missable");
      assert.ok(await page.locator(".collectible-row").count()>0);
      await page.locator("#clear-item-filters").click();
      const checkbox=page.locator('[data-item-id="weeping-creek:1"]');
      await checkbox.check();
      assert.match(await page.locator("#item-progress").innerText(),/1 \/ 61/);
      await page.reload();
      assert.equal(await page.locator('[data-item-id="weeping-creek:1"]').isChecked(),true);
      await openPage(page,origin+"/regions/crimson-forest/");
      assert.equal(await page.locator('[data-item-id="weeping-creek:1"]').count(),0,"weeping item must not leak into Crimson Forest");
      assert.equal(await page.locator('[data-item-id="crimson-forest:1"]').count(),1,"Crimson Forest should retain its own numbered first entry");
      await openPage(page,origin+"/regions/weeping-creek/");
      await page.locator('[data-item-id="weeping-creek:1"]').uncheck();
      await page.reload();
      assert.equal(await page.locator('[data-item-id="weeping-creek:1"]').isChecked(),false);
      await page.close();
    });
    await test("Weeping Creek dashboard and route modes keep saved progress intact",async()=>{
      const page=await browser.newPage();
      await openPage(page,origin+"/regions/weeping-creek/");
      assert.equal(await page.locator(".region-hub").count(),1);
      assert.equal(await page.locator(".region-jump a").count(),6);
      assert.equal(await page.locator(".route-stage").count(),2);
      assert.match(await page.locator(".route-stage").last().innerText(),/CLEANUP VISITS/);
      assert.equal(await page.locator(".collectible-row").count(),61);
      await page.locator('[data-route-mode="missable"]').click();
      assert.ok(await page.locator(".collectible-row").count()>0);
      assert.equal(await page.locator('.collectible-row .collectible-tags span:nth-child(2)').filter({hasNotText:"Missable"}).count(),0);
      await page.locator('[data-route-mode="return"]').click();
      assert.ok(await page.locator(".collectible-row").count()>0);
      await page.locator('[data-route-mode="remaining"]').click();
      assert.equal(await page.locator(".collectible-row").count(),61);
      // The Not found view removes checked rows synchronously, so click instead of check() (which expects the element to remain).
      await page.locator('[data-item-id="weeping-creek:1"]').evaluate(input=>input.click());
      assert.equal(await page.locator('[data-item-id="weeping-creek:1"]').count(),0);
      await page.locator("#clear-item-filters").click();
      assert.equal(await page.locator(".collectible-row").count(),61);
      assert.equal(await page.locator('[data-item-id="weeping-creek:1"]').isChecked(),true);
      assert.equal(await page.locator(".guide-collection").count(),2);
      await page.locator(".guide-collection").first().locator("summary").click();
      assert.ok(await page.locator(".guide-collection").first().locator(".route-summary").count()>0);
      await page.close();
    });
    await test("correction report produces a prefilled GitHub link",async()=>{
      const page=await browser.newPage();
      await openPage(page,origin+"/regions/village-of-lu/");
      await page.locator("#feedback-item").fill("#70");
      await page.locator("#feedback-details").fill("The item was not present after following the described route.");
      const popupPromise=page.waitForEvent("popup");
      await page.locator("#report-issue").click();
      const popup=await popupPromise;
      await popup.waitForURL(/github.com/,{timeout:5000}).catch(()=>{});const draftUrl=decodeURIComponent(decodeURIComponent(popup.url()));
      assert.match(draftUrl,/github.com\/winmyintsai26-jpg\/phantom-blade-player-assistant-v2\/issues\/new/);
      assert.match(draftUrl,/Village of Lu/);
      await popup.close();await page.close();
    });
    await test("mobile layout has no horizontal overflow on home and region",async()=>{
      const page=await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true});
      for(const path of ["/","/solver/","/bosses/","/bosses/jing-ye-the-outlaw/","/help/","/objectives/","/progress/","/contact/","/regions/weeping-creek/","/regions/village-of-lu/"]){
        await openPage(page,origin+path);
        const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
        assert.ok(sizes.scroll<=sizes.client+2,path+" overflow "+JSON.stringify(sizes));
      }
      await page.close();
    });
  }finally{await browser.close()}
}finally{server.kill("SIGTERM")}
