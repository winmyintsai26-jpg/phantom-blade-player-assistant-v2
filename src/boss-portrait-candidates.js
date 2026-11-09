// Research-only image candidates. NONE is licensed for reproduction on this site.
// Source is the *exact pbz.gg boss detail page* manually opened and its labeled
// portrait image link observed on 2026-11-08. Do not embed, hotlink, download,
// mirror or promote any image from this list to approvedBossImages without permission.
// The "source-provided label" is not independent visual identity verification.
// Tuple: [V2 boss ID, pbz.gg page slug, observed portrait filename, variant note].
const leads=[
 ["zuo-shang","zuo-shang-prologue","zuo-shang-portrait-960.webp","Younger Zuo Shang — prologue sparring"],
 ["zuo-shang-the-order-s-shadow-sovereign","zuo-shang-the-orders-shadow-sovereign-prologue","zuo-shang-the-orders-shadow-sovereign-prologue-portrait-960.webp","Shadow Sovereign — prologue"],
 ["the-hunt-hunter-of-the-order","the-hunt-hunter-of-the-order","the-hunt-hunter-of-the-order-portrait-960.webp","The Hunt — prologue"],
 ["aberrant-three-faced-puppet","aberrant-three-faced-puppet","aberrant-three-faced-puppet-portrait-960.webp",null],
 ["jagged-steel-the-frenzied-brute","jagged-steel","jagged-steel-the-frenzied-brute-portrait-960.webp",null],
 ["peng-meng-the-axemaster","peng-meng","peng-meng-the-axemaster-portrait-960.webp",null],
 ["hua-deadly-betrothed","hua","hua-deadly-betrothed-portrait-960.webp",null],
 ["the-hunt-sixfold-scythe","the-hunt-sixfold-scythe","the-hunt-sixfold-scythe-portrait-960.webp","Sixfold Scythe rematch"],
 ["the-gold-masked-one","the-gold-masked-one","the-gold-masked-one-portrait-960.webp",null],
 ["acolyte-hansui","acolyte-hansui","acolyte-hansui-portrait-960.webp",null],
 ["mo-yuan-leader-of-the-bastion-of-mo","mo-yuan","mo-yuan-leader-of-the-bastion-of-mo-portrait-960.webp",null],
 ["the-puppet-scavenger","the-puppet-scavenger","the-puppet-scavenger-portrait-960.webp",null],
 ["hua-qianxiao-the-sword-fanatic","hua-qianxiao","hua-qianxiao-the-sword-fanatic-portrait-960.webp",null],
 ["stone-hand-iron-fever","stone-hand-iron-fever","stone-hand-iron-fever-portrait-960.webp",null],
 ["jing-ye-the-outlaw","jing-ye","jing-ye-the-outlaw-portrait-960.webp","Mounted outlaw, variant unverified"],
 ["bai-chilian-lady-of-the-twin-serpents","bai-chilian","bai-chilian-lady-of-the-twin-serpents-portrait-960.webp","Lady of the Twin Serpents / Sacrificial Serpent"],
 ["yucong-no-34-twisted-puppet","yucong","yucong-no-34-twisted-puppet-portrait-960.webp","Multi-stage Yucong, pictured phase unverified"],
 ["zhuo-bi-the-gatekeeper","zhuo-bi","zhuo-bi-the-gatekeeper-portrait-960.webp",null],
 ["master-bi-yuan-of-the-tianxuan-sect","master-bi-yuan-of-the-tianxuan-sect","master-bi-yuan-of-the-tianxuan-sect-portrait-960.webp",null],
 ["master-bi-hai-of-kuye-temple","master-bi-hai-of-kuye-temple","master-bi-hai-of-kuye-temple-portrait-818.webp",null],
 ["yuzan-no-3-musician-puppet","yuzan","yuzan-no-3-musician-puppet-portrait-960.webp",null],
 ["acolyte-yanru","acolyte-yanru","acolyte-yanru-portrait-960.webp",null],
 ["mu-xiaokui-young-mistress-of-the-order","mu-xiaokui","mu-xiaokui-young-mistress-of-the-order-portrait-960.webp","Young Mistress; guardian variant unverified"],
 ["dusk-the-puppeteer","dusk","dusk-the-puppeteer-portrait-960.webp",null],
 ["blaze-shadow-warden-captain","blaze","blaze-shadow-warden-captain-portrait-960.webp",null],
 ["cavalrybane-elite-shadow-warden","cavalrybane","cavalrybane-elite-shadow-warden-portrait-960.webp",null],
 ["wu-xuan-the-fallen-general","wu-xuan","wu-xuan-the-fallen-general-portrait-960.webp",null],
 ["gu-wanyue-the-wailing-wraith","gu-wanyue","gu-wanyue-the-wailing-wraith-portrait-960.webp",null],
 ["xie-qiudong-the-divine-healer","xie-qiudong","xie-qiudong-the-divine-healer-portrait-960.webp",null],
 ["you-loong-leader-of-the-blackwater-crew","you-loong-leader-of-the-blackwater-crew","you-loong-leader-of-the-blackwater-crew-portrait-960.webp","Initial Pangzhen encounter"],
 ["chang-hong-the-thunder-spear","chang-hong","chang-hong-the-thunder-spear-portrait-960.webp",null],
 ["acolyte-lei-ting","acolyte-lei-ting","acolyte-lei-ting-portrait-960.webp",null],
 ["flame-the-mask-bound-lion-dance-grandmaster","flame","flame-the-mask-bound-lion-dance-grandmaster-portrait-960.webp",null],
 ["soulclaimer-elite-shadow-warden","soulclaimer",null,"Only a generic chapter icon was observed; no boss portrait candidate"],
 ["zhu-yuan-the-searing-blade","zhu-yuan","zhu-yuan-the-searing-blade-portrait-960.webp",null],
 ["corpse-eating-xue","corpse-eating-xue","corpse-eating-xue-portrait-960.webp",null],
 ["wan-jun-the-coppermaul","wan-jun","wan-jun-the-coppermaul-portrait-960.webp",null],
 ["red-the-mysterious-swordswoman","red","red-the-mysterious-swordswoman-portrait-960.webp","Red first encounter; paired fight variant unverified"],
 ["chief-disciple-of-the-seven-stars-formation","chief-disciple","chief-disciple-of-the-seven-stars-formation-portrait-960.webp","Seven-Stars formation — phase/participant unverified"],
 ["wu-lengshuang-the-soft-sword","wu-lengshuang","wu-lengshuang-the-soft-sword-portrait-855.webp",null],
 ["yubi-no-21-swordfighter-puppet","yubi","yubi-no-21-swordfighter-puppet-portrait-960.webp",null],
 ["acolyte-guhe","acolyte-guhe","acolyte-guhe-portrait-960.webp",null],
 ["you-loong-the-frenzied-blackwater-crew-leader","you-loong-the-frenzied-blackwater-crew-leader","you-loong-the-frenzied-blackwater-crew-leader-portrait-960.webp","Frenzied Meigu Lake rematch"],
 ["yan-qiansui-the-zither-maiden","yan-qiansui","yan-qiansui-the-zither-maiden-portrait-960.webp",null],
 ["one-eyed-archer","one-eyed-archer","one-eyed-archer-portrait-960.webp",null],
 ["blizzard-blademaster","blizzard-blademaster","blizzard-blademaster-portrait-960.webp",null],
 ["heartpiercer-elite-shadow-warden","heartpiercer","heartpiercer-elite-shadow-warden-portrait-960.webp",null],
 ["grief-stricken-jin","grief-stricken-jin","grief-stricken-jin-portrait-960.webp",null],
 ["iron-butcher-the-frenzied-brute","iron-butcher",null,"Only a generic chapter icon was observed; no boss portrait candidate"],
 ["bi-feng-giant-saber-commander","bi-feng","bi-feng-giant-saber-commander-portrait-960.webp",null],
 ["kui-yanyan-the-deranged","kui-yanyan","kui-yanyan-the-deranged-portrait-960.webp",null],
 ["jade-face","jade-face","jade-face-portrait-960.webp",null],
 ["huangxing-the-kunlun-renegade","huangxing","huangxing-the-kunlun-renegade-portrait-960.webp",null],
 ["yuding-no-12-crescent-blade-puppet","yuding","yuding-no-12-crescent-blade-puppet-portrait-960.webp",null],
 ["qiu-feng-the-crimson-boneblade","qiu-feng","qiu-feng-the-crimson-boneblade-portrait-960.webp",null],
 ["lei-dang-the-tiger-cannon","lei-dang","lei-dang-the-tiger-cannon-portrait-960.webp",null],
 ["the-crusher-and-the-saw","the-crusher","the-crusher-and-the-saw-portrait-960.webp","Multiple participants; identity of depicted member unverified"],
 ["meng-hua-the-merciful-lady-of-the-blossom-veil","meng-hua","meng-hua-the-merciful-lady-of-the-blossom-veil-portrait-960.webp","Meng Hua / Leng Tu phase unverified"],
 ["zuo-shang-the-true-long","zuo-shang-the-orders-shadow-sovereign-mount-soulrend","zuo-shang-the-orders-shadow-sovereign-mount-soulrend-portrait-960.webp","Mount Soulrend rematch"]
];

export const portraitCandidates=Object.freeze(Object.fromEntries(leads.map(([bossId,pageSlug,portraitFile,variant])=>[
 bossId,Object.freeze({
  bossId,
  sourcePageUrl:"https://pbz.gg/bosses/"+pageSlug+"/",
  candidateImageUrl:portraitFile?
   "https://pbz.gg/_ipx/w_320&f_webp&q_80/media/game/bosses/"+portraitFile:null,
  sourceSite:"pbz.gg — independent community database, not original rights holder",
  underlyingGameRightsHolder:"PARAWULIN PRODUCTION LIMITED / S-GAME",
  variant,
  imageReferenceStatus:portraitFile?"source-alt-labeled; visual verification pending":"no-portrait-on-researched-page",
  permissionStatus:"not-authorized-for-republication",
  mayEmbed:false,
  mayHost:false,
  reviewedAt:"2026-11-08"
 })
])));
export const portraitCandidateStats=()=>({
 researched:leads.length,
 labeledReferenceImages:leads.filter(([, ,file])=>Boolean(file)).length,
 noPortraitFound:leads.filter(([, ,file])=>!file).length,
 approvedForDisplay:0
});
