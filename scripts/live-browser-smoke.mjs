// Read-only remote browser probe. Does not edit player progress or submit feedback.
import {chromium} from "playwright";
const origin=(process.env.V2_SITE_ORIGIN||"https://phantom-blade-player-assistant-v2.winmyintsai26.workers.dev").replace(/\/$/,"");
let fails=0;
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 page.on("pageerror",e=>{console.log("JS ERROR: "+e.message);fails++});
 for(const route of ["/","/about/","/privacy/","/help/","/help/jing-ye-dismounted/","/help/sha-chi-tower-base/","/regions/weeping-creek/"]){
  try{
   const r=await page.goto(origin+route,{waitUntil:"domcontentloaded",timeout:20000});
   const h1=(await page.locator("h1").first().textContent())?.trim()||"";
   console.log((r.ok()&&h1?"PASS ":"FAIL ")+route+" "+r.status()+" "+h1.slice(0,110));if(!r.ok()||!h1)fails++;
   if(route==="/help/"){
    const search=page.locator("#problem-search");if(await search.count()){
     await search.fill("Jing Ye");const count=await page.locator(".help-card").count();console.log("Live help search matched "+count+" cards");if(count!==1)fails++;
    }else{console.log("Live help search not present");fails++}
   }
   if(route==="/help/jing-ye-dismounted/"){
    const choice=page.locator('[data-diagnosis="1"]');
    if(await choice.count()){await choice.click();const result=await page.locator("#diagnosis-result").textContent();console.log("Live diagnosis interaction "+(result?.toLowerCase().includes("shield")?"PASS":"FAIL"));if(!result?.toLowerCase().includes("shield"))fails++}
    else{console.log("Live diagnosis choice missing");fails++}
   }
   if(route==="/regions/weeping-creek/"){
    const cover=page.locator(".region-cover img");
    if(await cover.count()){
     await page.waitForTimeout(1200);
     const img=await cover.evaluate(i=>({src:i.src,loaded:i.complete&&i.naturalWidth>0,alt:i.alt}));
     console.log("Live region image "+JSON.stringify(img));if(!img.loaded)fails++;
    }else{console.log("Live region cover missing");fails++}
    console.log("Live video links "+await page.locator("#region-videos a").count());
   }
  }catch(e){console.log("FAIL "+route+" "+String(e));fails++}
 }
 await page.close();
}finally{await browser.close()}
console.log("Live browser smoke failed checks: "+fails+". Current commit deployment remains unverified without matching build manifest SHA.");
if(fails)process.exitCode=1;
