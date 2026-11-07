// Region video directory. Direct timestamps are chapter-indexed references (not independently tested gameplay).
// YouTube search links deliberately do NOT claim a specific video exists or has been reviewed.
export const regionVideoLibrary={
"weeping-creek":[
{title:"100% walkthrough — first Bell (21:30)",creator:"Just Human",url:"https://www.youtube.com/watch?v=1fpHDWIOhos&t=1290s",kind:"Video reference",note:"Long-form Weeping Creek walkthrough with chaptered route context."},
{title:"Boulderguard item footage (2:19)",creator:"IGN",url:"https://www.youtube.com/watch?v=H2aOYCISwlQ&t=139s",kind:"Video reference",note:"Item video index; does not independently establish a missable cutoff."},
{title:"Broken-String Bow (4:52)",creator:"IGN",url:"https://www.youtube.com/watch?v=H2aOYCISwlQ&t=292s",kind:"Video reference",note:"Bow pickup reference; verify quest hand-in deadline separately."},
{title:"Boss montage — Weeping Creek (0:57)",creator:"vAnother Level",url:"https://www.youtube.com/watch?v=0PxHKLVVomI&t=57s",kind:"Video reference",note:"Begins with Weeping Creek boss chapters; this is a quick overview, not a strategy guide."},
{title:"Missable quest checklist — Outpost (3:20)",creator:"LaserBolt",url:"https://www.youtube.com/watch?v=ZFOkOCvzgpQ&t=200s",kind:"Video reference",note:"Quest and Boulderguard context; verify deadlines against in-game events."}
],
"crimson-forest":[
{title:"Boss montage — Crimson Forest (4:39)",creator:"vAnother Level",url:"https://www.youtube.com/watch?v=0PxHKLVVomI&t=279s",kind:"Video reference",note:"Regional boss chapters; beware of major story spoilers."}
],
"village-of-lu":[
{title:"Boss montage — Village of Lu (7:07)",creator:"vAnother Level",url:"https://www.youtube.com/watch?v=0PxHKLVVomI&t=427s",kind:"Video reference",note:"Regional boss overview; not a collectible walkthrough."}
],
"pangzhen":[
{title:"Boss montage — Pangzhen (11:26)",creator:"vAnother Level",url:"https://www.youtube.com/watch?v=0PxHKLVVomI&t=686s",kind:"Video reference",note:"Region boss chapters; spoilers for major encounters."}
],
"mandate-encampment":[
{title:"Boss montage — Mandate Encampment (17:36)",creator:"vAnother Level",url:"https://www.youtube.com/watch?v=0PxHKLVVomI&t=1056s",kind:"Video reference",note:"Region boss chapters; not a full collection route."}
],
"meigu-lake":[
{title:"Boss montage — Meigu Lake (21:18)",creator:"vAnother Level",url:"https://www.youtube.com/watch?v=0PxHKLVVomI&t=1278s",kind:"Video reference",note:"Region boss chapters; not a full collection route."}
],
"mountain-of-imprisonment":[
{title:"Boss montage — Mountain of Imprisonment (25:37)",creator:"vAnother Level",url:"https://www.youtube.com/watch?v=0PxHKLVVomI&t=1537s",kind:"Video reference",note:"Starts at the Mountain of Imprisonment boss chapter."}
],
"mirage-estate":[],
"mount-soulrend":[]
};
const search=(region,type)=>"https://www.youtube.com/results?search_query="+encodeURIComponent("Phantom Blade Zero "+region+" "+type);
export function regionVideos(region){
 const videos=[...(regionVideoLibrary[region.id]||[])];
 videos.push({title:"Find "+region.name+" collectible walkthroughs",creator:"YouTube search",url:search(region.name,"all collectibles 100% locations"),kind:"Search results — not reviewed",note:"Search results change over time. Confirm the video covers this exact region before following it."});
 videos.push({title:"Find "+region.name+" quests and bosses",creator:"YouTube search",url:search(region.name,"side quests boss guide"),kind:"Search results — not reviewed",note:"Fallback discovery link; no particular creator or video has been verified."});
 return videos;
}
