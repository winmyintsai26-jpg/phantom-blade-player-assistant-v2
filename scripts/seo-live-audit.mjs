// Read-only SEO audit for the owned production domain.
// Does not change indexing, editorial approval, sitemap submissions, or AdSense.
import {regions} from "../src/regions.js";
import {problems} from "../src/help-problems.js";
import {guides} from "../src/guides.js";
import {objectiveRecords} from "../src/objectives.js";

const origin="https://phantombladeplayerguide.com";
const paths=["/","/help/","/objectives/",...regions.map(r=>"/regions/"+r.id+"/"),...problems.map(p=>"/help/"+p.id+"/"),...guides.map(g=>"/guides/"+g.id+"/"),...objectiveRecords.map(o=>o.route)];
const required=new Set(paths);
let failures=0;
const failuresLog=message=>{failures++;console.error("FAIL "+message)};
async function get(path){
 const res=await fetch(origin+path,{signal:AbortSignal.timeout(12000),headers:{"Cache-Control":"no-cache"}});
 return {status:res.status,body:await res.text(),headers:res.headers};
}
try {
 const [home,robots,sitemap,manifest]=await Promise.all([get("/"),get("/robots.txt"),get("/sitemap.xml"),get("/build-manifest.json")]);
 for(const [path,result] of [["/",home],["/robots.txt",robots],["/sitemap.xml",sitemap],["/build-manifest.json",manifest]]){
  console.log(path+" HTTP "+result.status);
  if(result.status!==200)failuresLog(path+" response "+result.status);
 }
 const expectedCanonical='<link rel="canonical" href="'+origin+'/">';
 if(!home.body.includes(expectedCanonical))failuresLog("Homepage canonical is not "+origin+"/");
 if(!/<title>[^<]*Phantom Blade Zero Player Guide/i.test(home.body))failuresLog("Homepage title missing player-guide terminology");
 if(!/<meta name="description" content="[^"]{30,160}">/i.test(home.body))failuresLog("Homepage meta description missing or invalid");
 if(!/<main id="main" class="prerender-fallback">/.test(home.body))failuresLog("Homepage is not meaningfully prerendered");
 for(const route of ["/help/","/objectives/","/regions/weeping-creek/"]){
  if(!home.body.includes('href="'+route+'"'))failuresLog("Homepage does not link to "+route);
 }
 if(!robots.body.includes("Sitemap: "+origin+"/sitemap.xml"))failuresLog("robots.txt sitemap host mismatch");
 if(!sitemap.body.includes("<loc>"+origin+"/</loc>"))failuresLog("sitemap homepage host mismatch");
 const sitemapUrls=[...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 const inSitemap=new Set(sitemapUrls);
 for(const route of required)if(!inSitemap.has(origin+route))failuresLog("Missing from sitemap: "+route);
 for(const uri of sitemapUrls)if(!uri.startsWith(origin+"/"))failuresLog("Foreign sitemap URL "+uri);
 let data=null;try{data=JSON.parse(manifest.body)}catch{failuresLog("Invalid build manifest JSON")}
 if(data){
  console.log("Live SHA: "+(data.commitSha||"not set"));
  console.log("Canonical origin: "+data.origin);
  console.log("Editorial approved: "+Boolean(data.editorialApproved));
  console.log("Indexing enabled: "+Boolean(data.indexingEnabled));
  console.log("Ads enabled: "+Boolean(data.adsEnabled));
  if(data.origin!==origin)failuresLog("Manifest origin does not match production domain");
  const meta=(home.body.match(/<meta name="robots" content="([^"]+)">/)||[])[1];
  console.log("Homepage robots: "+(meta||"missing"));
  if(data.indexingEnabled){
   if(!data.editorialApproved)failuresLog("Indexing active without editorial approval");
   if(meta!=="index,follow"||!robots.body.includes("Allow: /"))failuresLog("Indexing directives conflict");
  }else{
   console.warn("RELEASE GATE: production site is noindex until editorial approval; do not bypass approval.");
   if(meta!=="noindex,nofollow"||!robots.body.includes("Disallow: /"))failuresLog("Noindex directives conflict");
  }
 }
 const expected=process.env.GITHUB_SHA;
 if(expected&&data?.commitSha!==expected)console.warn("REVISION: current live SHA differs from this workflow revision; deployment not verified.");
} catch(e) {failuresLog("Cannot fetch production site: "+String(e))}
console.log("SEO audit: "+failures+" consistency failures; indexing changes are not made by this script.");
if(failures)process.exitCode=1;
