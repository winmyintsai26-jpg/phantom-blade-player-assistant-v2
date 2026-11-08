// Read-only Cloudflare UI audit. Never submits feedback or changes site-wide settings.
import {chromium} from "playwright";
import {regions} from "../src/regions.js";
import {problems,findProblems} from "../src/help-problems.js";
import {objectiveRecords} from "../src/objectives.js";
const origin=(process.env.V2_SITE_ORIGIN||"https://phantom-blade-player-assistant-v2.winmyintsai26.workers.dev").replace(/\/$/,"");
const routes=["/","/help/","/objectives/","/about/","/privacy/","/contact/","/progress/",
 ...regions.map(r=>"/regions/"+r.id+"/"),
 ...problems.map(p=>"/help/"+p.id+"/"),...objectiveRecords.map(o=>o.route)];
let failures=0,warnings=0;
const fail=message=>{failures++;console.log("FAIL "+message)};
const warn=message=>{warnings++;console.log("WARN "+message)};
const browser=await chromium.launch({headless:true});
try{
 for(const viewport of [{width:1366,height:768},{width:375,height:812}]){
  const page=await browser.newPage({viewport,isMobile:viewport.width<500,hasTouch:viewport.width<500});
  page.on("pageerror",error=>fail("JS "+error.message));
  for(const route of routes){
   try{
    const response=await page.goto(origin+route,{waitUntil:"domcontentloaded",timeout:22000});
    if(!response?.ok()) {fail(route+" HTTP "+(response?.status()??"no response"));continue}
    if(await page.locator("h1").count()!==1){fail(route+" missing or duplicate H1");continue}
    const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
    if(width.scroll>width.client+2)fail(route+" horizontal overflow at "+viewport.width+"px");
    const brokenInternal=await page.locator('a[href^="/"]').evaluateAll(a=>a.filter(el=>!el.getAttribute("href")||el.getAttribute("href")==="/undefined/").map(el=>el.outerHTML.slice(0,120)));
    if(brokenInternal.length)fail(route+" invalid internal anchors: "+brokenInternal.join(","));
    const imgs=await page.locator("img").evaluateAll(imgs=>imgs.filter(img=>img.complete&&img.naturalWidth===0).map(img=>img.currentSrc||img.src));
    if(imgs.length)warn(route+" unavailable external images: "+imgs.length+" "+imgs.slice(0,2).join(" "));
    console.log("PASS "+viewport.width+"px "+route);
   }catch(error){fail(route+" "+String(error))}
  }
  try{
   await page.goto(origin+"/help/",{waitUntil:"domcontentloaded"});
   if(await page.locator(".help-card").count()!==problems.length)fail("Help card count mismatch");
   await page.locator("#problem-search").fill("Jing Ye");
   if(await page.locator(".help-card").count()!==findProblems("Jing Ye").length)fail("Help search");
   await page.locator("#problem-search").fill("");
   await page.locator("#problem-category").selectOption("Quests & Bugs");
   if(await page.locator(".help-card").count()!==findProblems("","Quests & Bugs").length)fail("Help category filter");
   await page.goto(origin+"/help/jing-ye-dismounted/",{waitUntil:"domcontentloaded"});
   await page.locator('[data-diagnosis="1"]').click();
   if(!/shield/i.test(await page.locator("#diagnosis-result").innerText()))fail("Jing Ye diagnosis");
   await page.locator('[data-feedback="not-solved"]').click();
   if(await page.locator("#send-feedback").isDisabled())fail("Help feedback disabled");
   await page.goto(origin+"/objectives/",{waitUntil:"domcontentloaded"});
   if(await page.locator(".objective-card").count()!==objectiveRecords.length)fail("Objective count");
   await page.locator("#objective-search").fill("Outlaw Trap");
   if(await page.locator(".objective-card").count()<1)fail("Objective search");
   await page.goto(origin+"/objectives/weeping-creek/52/",{waitUntil:"domcontentloaded"});
   const report=page.locator("#objective-report-button");
   if(!await report.isDisabled())fail("Unselected outcome should not submit");
   await page.locator("#objective-outcome").selectOption("missing");
   if(!await report.isEnabled())fail("Selected feedback outcome unavailable");
   await page.goto(origin+"/regions/weeping-creek/",{waitUntil:"domcontentloaded"});
   await page.locator("#item-search").fill("Boulderguard");
   if(await page.locator(".collectible-row").count()!==1)fail("Region item search");
   await page.locator("#clear-item-filters").click();
   await page.locator("#item-phase").selectOption("Missable");
   if(await page.locator(".collectible-row").count()<1)fail("Region phase filter");
   await page.goto(origin+"/progress/",{waitUntil:"domcontentloaded"});
   if(await page.locator("h1").count()!==1)fail("Progress page");
  }catch(error){fail("Interactions at "+viewport.width+"px: "+String(error))}
  await page.close();
 }
}finally{await browser.close()}
console.log("Live browser audit: "+failures+" failures; "+warnings+" external image warnings. Deployment identity must be verified separately by live build manifest.");
if(failures)process.exitCode=1;
