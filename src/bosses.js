// Editorial fight-level roster. Names, regions and families are factual index references,
// not copied walkthrough text. Do not conflate encounter counts, phases or individual enemies.
// Source registers: https://pbz.gg/bosses/ (59 grouped fights / 75 bars as listed),
// https://allthings.how/phantom-blade-zero-bosses/ (74 bar/title entries),
// https://www.powerpyx.com/phantom-blade-zero-trophy-guide-roadmap/ (selected main/optional claims).
import {problems} from "./help-problems.js";

export const bossSources={
 pbz:{name:"pbz.gg — regional boss index",url:"https://pbz.gg/bosses/"},
 all:{name:"AllThings.How — boss title and encounter roster",url:"https://allthings.how/phantom-blade-zero-bosses/"},
 power:{name:"PowerPyx — trophy and encounter classification",url:"https://www.powerpyx.com/phantom-blade-zero-trophy-guide-roadmap/"}
};
// Each tuple is [name, family, aliases/alternate bars]. One record is a fight grouping.
// An alias is NOT automatically an identical opponent or a gameplay phase.
const roster=[
 ["Prologue",[
 ["Zuo Shang","Masters",["Zuo Shang, the Order's Shadow Sovereign","Young Zuo Shang"]],
 ["The Hunt, Hunter of the Order","Perfect Transcensions",[]]
 ]],
 ["weeping-creek",[
 ["Aberrant Three-faced Puppet","Puppets",["Aberrant Three-Faced Puppet"]],
 ["Jagged Steel, the Frenzied Brute","Maskwalkers",[]],
 ["Peng Meng, the Axemaster","Maskwalkers",["Axemaster Peng Meng"]],
 ["Hua, Deadly Betrothed","Puppets",[]],
 ["The Hunt, Sixfold Scythe","Perfect Transcensions",["The Hunt, Hunter of the Order — waterfall rematch"]],
 ["The Gold-Masked One","Masters",["Gold-Masked One — Lóng Pillar"]],
 ["Acolyte Hansui","Maskwalkers",[]],
 ["Mó Yuan, Leader of the Bastion of Mó","Masters",["Mo Yuan"]],
 ["The Puppet Scavenger","Maskwalkers",[]]
 ]],
 ["crimson-forest",[
 ["Hua Qianxiao, the Sword Fanatic","Maskwalkers",[]],
 ["Stone Hand Iron Fever","Maskwalkers",[]],
 ["Jing Ye, the Outlaw","Maskwalkers",["Jing Ye"]],
 ["Bai Chilian, Lady of the Twin Serpents","Maskwalkers",["Bai Chilian, the Sacrificial Serpent"]],
 ["Yucong, No. 34 Twisted Puppet","Puppets",["Steel Yucong","Frost Yucong","Chaos Yucong"]]
 ]],
 ["village-of-lu",[
 ["Zhuo Bi, the Gatekeeper","Perfect Transcensions",[]],
 ["Master Bi Yuan of the Tianxuan Sect","Masters",[]],
 ["Master Bi Hai of Kuye Temple","Masters",[]],
 ["Yuzan, No. 3 Musician Puppet","Puppets",[]],
 ["Acolyte Yanru","Maskwalkers",[]],
 ["Mu Xiaokui, Young Mistress of the Order","Masters",["Mu Xiaokui, Queen of Iron and Jade","Jade Dancer, Young Mistress's Guardian","Iron Fiend, Young Mistress's Guardian"]],
 ["Dusk, the Puppeteer","Maskwalkers",[]]
 ]],
 ["pangzhen",[
 ["Blaze, Shadow Warden Captain","Perfect Transcensions",["Blaze, Phosphor Consciousness"]],
 ["Cavalrybane, Elite Shadow Warden","Perfect Transcensions",["Shadow Warden Cavalrybane"]],
 ["Wu Xuan, the Fallen General","Perfect Transcensions",[]],
 ["Gu Wanyue, the Wailing Wraith","Maskwalkers",[]],
 ["Xie Qiudong, the Divine Healer","Perfect Transcensions",[]],
 ["You Loong, Leader of the Blackwater Crew","Perfect Transcensions",[]],
 ["Chang Hong, the Thunder Spear","Masters",["Chang Hong, the Thunder Lancer"]],
 ["Acolyte Lei Ting","Maskwalkers",[]],
 ["Flame, the Mask-Bound Lion Dance Grandmaster","Perfect Transcensions",["The Lion Dance Grandmaster's Final Dance"]],
 ["Soulclaimer, Elite Shadow Warden","Perfect Transcensions",["Shadow Warden Soulclaimer"]],
 ["Zhu Yuan, the Searing Blade","Perfect Transcensions",[]]
 ]],
 ["mandate-encampment",[
 ["Corpse-Eating Xue","Maskwalkers",[]],
 ["Wan Jun, the Coppermaul","Perfect Transcensions",[]],
 ["Red, the Mysterious Swordswoman","Perfect Transcensions",["Red"]],
 ["Chief Disciple of the Seven-Stars Formation","Perfect Transcensions",["Chief Disciple, Sword of Despair","Seven Stars","Seven-Stars Formation"]],
 ["Wu Lengshuang, the Soft Sword","Perfect Transcensions",[]],
 ["Yubi, No. 21 Swordfighter Puppet","Puppets",[]]
 ]],
 ["meigu-lake",[
 ["Acolyte Guhe","Maskwalkers",[]],
 ["You Loong, the Frenzied Blackwater Crew Leader","Perfect Transcensions",["You Loong — Meigu Lake rematch"]],
 ["Yan Qiansui, the Zither Maiden","Maskwalkers",[]],
 ["One-Eyed Archer","Masters",[]],
 ["Blizzard Blademaster","Masters",[]],
 ["Heartpiercer, Elite Shadow Warden","Perfect Transcensions",["Shadow Warden Heartpiercer"]],
 ["Grief-Stricken Jin","Perfect Transcensions",[]]
 ]],
 ["mountain-of-imprisonment",[
 ["Iron Butcher, the Frenzied Brute","Maskwalkers",[]],
 ["Bi Feng, Giant Saber Commander","Perfect Transcensions",[]],
 ["Kui Yanyan, the Deranged","Maskwalkers",[]],
 ["Jade-Face","Perfect Transcensions",[]],
 ["Huangxing, the Kunlun Renegade","Perfect Transcensions",["Huangxing, the Whirling Executioner"]]
 ]],
 ["mirage-estate",[
 ["Yuding, No.12, Crescent Blade Puppet","Puppets",[]],
 ["Qiu Feng, the Crimson Boneblade","Maskwalkers",[]],
 ["Lei Dang, the Tiger Cannon","Masters",["Lei Dang, One-Armed Tiger","Lei Dang, the Order's Envoy"]]
 ]],
 ["mount-soulrend",[
 ["The Crusher and the Saw","Perfect Transcensions",["The Crusher, Earthshattering Form"]],
 ["Meng Hua, The Merciful Lady of the Blossom Veil","Puppets",["Leng Tu, Herald of the Veil"]],
 ["Zuo Shang, the True Lóng","Masters",["Zuo Shang, the Order's Shadow Sovereign — finale"]]
 ]]
];
const normalize=s=>String(s).normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const regionLabels={Prologue:"Prologue","weeping-creek":"Weeping Creek Valley","crimson-forest":"Crimson Forest","village-of-lu":"Village of Lu",pangzhen:"Pangzhen","mandate-encampment":"Mandate Encampment","meigu-lake":"Meigu Lake","mountain-of-imprisonment":"Mountain of Imprisonment","mirage-estate":"Mirage Estate","mount-soulrend":"Mount Soulrend"};
// Trophy-based classifications are explicitly narrow; other fights are unclassified.
const knownMain=new Set(["peng-meng-the-axemaster","jagged-steel-the-frenzied-brute","the-hunt-sixfold-scythe","jing-ye-the-outlaw","bai-chilian-lady-of-the-twin-serpents","mu-xiaokui-young-mistress-of-the-order","blaze-shadow-warden-captain","yuzan-no-3-musician-puppet","yuding-no-12-crescent-blade-puppet","lei-dang-the-tiger-cannon","the-crusher-and-the-saw","meng-hua-the-merciful-lady-of-the-blossom-veil"]);
const knownOptional=new Set(["aberrant-three-faced-puppet","the-puppet-scavenger","chief-disciple-of-the-seven-stars-formation","huangxing-the-kunlun-renegade","blizzard-blademaster","yubi-no-21-swordfighter-puppet","yucong-no-34-twisted-puppet"]);
const specificHelp={
 "jing-ye-the-outlaw":"jing-ye-dismounted",
 "red-the-mysterious-swordswoman":"red-seven-sword",
 "chief-disciple-of-the-seven-stars-formation":"red-seven-sword"
};
const locationDetail={
 "jing-ye-the-outlaw":"Beyond Outlaw Trap Bell",
 "wan-jun-the-coppermaul":"Near Main Encampment Gate",
 "red-the-mysterious-swordswoman":"Dovecote tower, initial encounter reported",
 "chief-disciple-of-the-seven-stars-formation":"Mandate Encampment, paired encounter report",
 "aberrant-three-faced-puppet":"Challenge Rift by The Lady's Rift Bell",
 "the-puppet-scavenger":"Crimson Manor side area",
 "blizzard-blademaster":"Phantom Illusionist Ruins",
 "huangxing-the-kunlun-renegade":"Near the mountain summit"
};
export const bosses=roster.flatMap(([region,records])=>records.map(([name,family,aliases])=>{
 const slug=normalize(name),helpId=specificHelp[slug],help=problems.find(p=>p.id===helpId)||null;
 return {id:slug,slug,name,aliases,region,regionName:regionLabels[region],family,category:knownMain.has(slug)?"main":knownOptional.has(slug)?"optional":"undetermined",location:locationDetail[slug]||null,phases:help&&help.id==="jing-ye-dismounted"?["Mounted phase","Shield phase","Sword phase"]:[],helpId:help?.id||null,hasStrategy:Boolean(help),sources:[bossSources.pbz,bossSources.all,...(knownMain.has(slug)||knownOptional.has(slug)?[bossSources.power]:[])],verification:"Published index · not independently gameplay-tested"};
}));
export const bossBySlug=slug=>bosses.find(b=>b.slug===slug)||null;
export function searchBosses({query="",region="",category=""}={}){
 const q=normalize(query);
 return bosses.filter(b=>(!region||b.region===region)&&(!category||b.category===category)&&(!q||[b.name,...b.aliases,b.regionName,b.family].some(x=>normalize(x).includes(q))));
}
export const bossCounts=()=>({total:bosses.length,located:bosses.filter(b=>b.regionName).length,strategies:bosses.filter(b=>b.hasStrategy).length,incomplete:bosses.filter(b=>!b.hasStrategy||!b.location).length});
export const combatProblems=[{id:"dodge",label:"Dodging attacks"},{id:"parry",label:"Parrying"},{id:"cues",label:"Recognizing attacks"},{id:"damage",label:"Low damage"},{id:"healing",label:"Healing and survival"},{id:"preparation",label:"Preparation"}];
// Never synthesize an answer from generic boss classifications or unvalidated keyword matching.
export function bossAdvice(slug,phase="",problem=""){
 const b=bossBySlug(slug);if(!b)return null;
 const help=problems.find(p=>p.id===b.helpId)||null;
 if(help&&phase&&b.phases.length){
  const match=help.choices.find(c=>c.label.toLowerCase().includes(phase.toLowerCase().replace(" phase","")));
  if(match)return {kind:"documented",label:match.lead,steps:match.steps,source:"Existing player problem guide",href:"/help/"+help.id+"/"};
 }
 // Only help text explicitly attached to this boss qualifies as boss-specific.
 if(help&&problem==="preparation"&&help.prerequisites.length)return {kind:"documented",label:"Before this encounter",steps:help.prerequisites,source:"Existing player problem guide",href:"/help/"+help.id+"/"};
 return {kind:"missing",label:"Strategy not yet documented for this phase or problem",steps:[],href:help?"/help/"+help.id+"/":null,generalHref:"/guides/combat-diagnostics/"};
}
