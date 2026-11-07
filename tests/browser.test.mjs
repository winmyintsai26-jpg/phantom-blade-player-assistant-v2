import test from "node:test";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {chromium} from "playwright";

const origin="http://127.0.0.1:4178";
const server=spawn("npm",["run","dev","--","--host","127.0.0.1","--port","4178","--strictPort"],{stdio:"pipe"});
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
    test("all nine region routes and home page render",async()=>{
      const page=await browser.newPage();
      const errors=[];page.on("pageerror",e=>errors.push(e.message));
      await page.goto(origin+"/");
      assert.match(await page.locator("h1").innerText(),/Every obstacle/);
      assert.equal(await page.locator(".region-card").count(),9);
      for(const route of ["weeping-creek","crimson-forest","village-of-lu","pangzhen","mandate-encampment","meigu-lake","mountain-of-imprisonment","mirage-estate","mount-soulrend"]){
        await page.goto(origin+"/regions/"+route+"/");
        assert.equal(await page.locator(".region-page h1").count(),1,route);
        assert.ok(await page.locator(".collectible-row").count()>0,route);
      }
      assert.deepEqual(errors,[]);
      await page.close();
    });
    test("search, phase filters and progress survive reload",async()=>{
      const page=await browser.newPage();
      await page.goto(origin+"/regions/weeping-creek/");
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
      await page.goto(origin+"/regions/crimson-forest/");
      assert.equal(await page.locator('[data-item-id="crimson-forest:1"]').count(),0);
      await page.goto(origin+"/regions/weeping-creek/");
      await page.locator('[data-item-id="weeping-creek:1"]').uncheck();
      await page.reload();
      assert.equal(await page.locator('[data-item-id="weeping-creek:1"]').isChecked(),false);
      await page.close();
    });
    test("correction report produces a prefilled GitHub link",async()=>{
      const page=await browser.newPage();
      await page.goto(origin+"/regions/village-of-lu/");
      await page.locator("#feedback-item").fill("#70");
      await page.locator("#feedback-details").fill("The item was not present after following the described route.");
      const popupPromise=page.waitForEvent("popup");
      await page.locator("#report-issue").click();
      const popup=await popupPromise;
      assert.match(popup.url(),/github.com\/winmyintsai26-jpg\/phantom-blade-player-assistant-v2\/issues\/new/);
      assert.match(decodeURIComponent(popup.url()),/Village of Lu/);
      await popup.close();await page.close();
    });
    test("mobile layout has no horizontal overflow on home and region",async()=>{
      const page=await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true});
      for(const path of ["/","/regions/weeping-creek/","/regions/village-of-lu/"]){
        await page.goto(origin+path);
        const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
        assert.ok(sizes.scroll<=sizes.client+2,path+" overflow "+JSON.stringify(sizes));
      }
      await page.close();
    });
  }finally{await browser.close()}
}finally{server.kill("SIGTERM")}
