// Phase 4.2: claim-level sourced, original combat and route guidance.
// Every tactic below is an editorial paraphrase; NONE is independently game-tested by V2.
// A roster entry without a strategy stays explicitly incomplete.
import {bosses} from "./bosses.js";
import {externalBossGuides} from "./boss-external-guides.js";
const reviewedAt="2026-11-08";
export const evidenceClasses=["officially-documented","gameplay-demonstrated","guide-supported","community-reported","unverified"];
const allSlug=id=>externalBossGuides[id]?.url;
const guide=(id)=>({id:"guide",url:allSlug(id),classification:"guide-supported",reviewedAt});
const mobalytics={id:"mobalytics",url:"https://mobalytics.gg/gamebase/guides/phantom-blade-zero-jing-ye-the-outlaw",classification:"guide-supported",reviewedAt};
const patch={id:"official-patch",url:"https://pbz.s-game.com/en-US/news/patch-notes-2026-11-03/",classification:"officially-documented",reviewedAt};
const rec=(id,detail)=>({bossId:id,reviewedAt,gameVersion:detail.gameVersion||null,verification:"guide-supported",sources:[...(allSlug(id)?[guide(id)]:[]),...(detail.extraSources||[])],...detail});
const cue=(id,problems,cue,response,avoid,phase=null)=>({id,problems,cue,response,avoid,phase,evidence:["guide"]});
const path=(instruction,check)=>({instruction,check,evidence:["guide"]});
const strategies=[
rec("peng-meng-the-axemaster",{
 bell:"Outpost",location:"Shallow river southwest of the Outpost",route:[path("From the Outpost Bell, pass the stele beneath the southwest pavilion and descend toward the river.","Look for ruined wooden scaffolding beside shallow water.")],
 preparation:["Keep clear of the bank scaffolding; it can hide his axe windups."],
 attacks:[
 cue("multi-sweep",["parry","damage-taken","cues"],"He begins broad horizontal axe sweeps in the shallows.","Maintain defense through the full string and attempt to parry individual swings.","Dropping guard after the first axe strike."),
 cue("ground-slam",["dodge","cues"],"An initial blow leads into a ground slam and expanding circular shockwave, followed by an overhead chop.","Avoid the first strike, stay clear of the expanding ground ring, then respond to the overhead chop.","Trying to parry the opening unparryable blow."),
 cue("red-grab",["dodge","cues","damage-taken"],"His attack produces a red warning before he reaches for Soul.","Evade the incoming grab rather than attempting a parry.","Dodging before the reaching motion or remaining in front of him."),
 cue("blue-stomp",["parry","cues","counter"],"He lifts a leg and surges forward with a blue streak.","Parry the marked incoming strike, then stay ready for the rest of the chain.","Assuming the first parry ends his combo.")
 ],
 recovery:["After an axe string finishes and there is distance, use the window to heal rather than healing beside him."],
 confirmation:"The published reward is the Dread Axe Phantom Edge.",
 limitations:["Exact attack timing varies by difficulty and was not checked by V2."]
}),
rec("jing-ye-the-outlaw",{
 bell:"Outlaw Trap",location:"Upper stream path east of Outlaw Trap",route:[
 path("From the Outlaw Trap Bell, move east to the stake-topped stone-walled pit and descend carefully.","You are inside the pit, looking toward the opposite rock face."),
 path("Use the first wall-run prompt to reach the ledge, then a second wall-run to climb to the upper slope.","An abandoned cart axle and wheels are visible near the upper path."),
 path("Follow the shallow stream east past the cart remains; avoid the dead-end rocky incline to the south.","A large grey boulder and dead horse mark the boss approach.")
 ],
 extraSources:[mobalytics],phases:["Mounted phase","Shield phase","Sword phase"],
 disagreements:["AllThings.How calls this a two-stage encounter (mounted and on foot); Mobalytics separates shield and later sword behavior into three practical phases."],
 preparation:["Prepare to switch from mounted-defense to shield breaking; the existing Hellwalker guide recommends saving Dread Axe charges."],
 attacks:[
 cue("mounted-charge",["dodge","cues","damage-taken"],"During the mounted stage he lines up a distant rush.","Move sideways out of the horse's line before the rush passes.","Backing straight down the charge lane.","Mounted phase"),
 cue("shield-thorns",["damage","preparation","damage-taken","counter"],"Once he dismounts he lifts a spiked shield; light strikes into it return damage.","Stop rapid light pressure into the shield. Use a supported shield-breaking option; the Hellwalker guide recommends reserved Dread Axe tokens.","Emptying health through repeated low-impact shield hits.","Shield phase"),
 cue("dust-leap",["dodge","cues","parry","counter"],"In the late sword sequence he throws up dust and leaps forward.","Dodge the grey leap; prepare for the reported blue follow-up as a possible counter opportunity.","Trying to block the leap itself.","Sword phase"),
 cue("red-grab",["dodge","healing","damage-taken"],"A later red grab can restore his health if it lands.","Prioritize evasion of the grab and delay risky attacks until the grab has missed.","Trading health into the grab while he regains life.","Sword phase")
 ],
 recovery:["If the shield keeps killing you, change your equipment or save more shield-break resources before the dismount.","Treat repeated sword-phase losses as a separate practice goal, not as mounted-phase failure."],
 confirmation:"Outlaw Warblade reward is reported when the fight is defeated.",
 limitations:["Source stage classification differs; no fixed transition percentage is asserted by V2."]
}),
rec("the-hunt-sixfold-scythe",{
 bell:"Great Waterfall",location:"Pool below Great Waterfall",phases:["Hunter of the Order","Sixfold Scythe"],
 route:[path("At the Great Waterfall Bell, use the southern bank and wade west toward the waterfall basin.","The encounter cutscene shows the Hunt above the pool.")],
 attacks:[
 cue("chain-lash",["dodge","cues"],"A chained sickle extends in a long straight lash across the shallow water.","Move off the attack line laterally rather than running straight back.","Assuming distance alone protects you from the chain."),
 cue("hook-grab",["dodge","damage-taken"],"He sends a hooked chain toward Soul to pull the target in.","Wait for the approaching hook, then dodge out of its path.","Evading at the earliest windup rather than the hook's arrival."),
 cue("sickle-string",["parry","counter"],"At close range the chained sickles strike repeatedly.","Defend through the entire sequence and parry the individual hits.","Attacking after only the first deflection.")
 ],
 recovery:["Use the Great Waterfall checkpoint before retrying; the chains can reach across the pool."],
 confirmation:"The source lists Hunter's Chain Sickle as the reward."
}),
rec("hua-deadly-betrothed",{
 bell:"Valley Sha-Chi Tower Base",location:"Flesh Lily Fields downhill from the Bell",gameVersion:"1.0302256 (Wayfarer/Pathbreaker grab frequency adjusted)",
 route:[path("From Valley Sha-Chi Tower Base, descend toward the red Flesh Lily Fields.","A red-draped wedding altar and lilies surround the cutscene area.")],
 extraSources:[patch],patchReview:{since:"2026-11-03",status:"requires-editorial-review",note:"Official patch reduced grab frequency on Wayfarer/Pathbreaker; pre-patch move timing must not be treated as current in those modes.",evidence:["official-patch"]},
 preparation:["This puppet is reported immune to Bleed; do not rely on Bleed damage as the main strategy."],
 attacks:[
 cue("lily-patches",["dodge","cues","damage-taken"],"Fresh red lily patches sprout around the arena floor.","Move to clear ground before the new patches erupt.","Stopping to deal damage while standing on newly appeared lilies."),
 cue("floating-blooms",["dodge","healing","cues"],"Large flowers drift toward Soul; a grab may follow as a flower approaches.","Move sideways and evade approaching blossoms; wait until the projectiles clear before healing.","Trying to heal while blossoms are airborne."),
 cue("two-blade-swings",["parry","counter"],"Hua lifts her heavy blade for a pair of cuts.","Defend the first and second swing individually before trying to counter.","Attacking immediately after the first parry."),
 cue("red-grab",["dodge","damage-taken"],"A red warning precedes Hua's damaging grapple.","Dodge the approaching grapple rather than trying to parry it.","Treating pre-patch grab frequency as reliable on current difficulties.")
 ],
 confirmation:"The Scarlet Wraithblade is reported as the fight reward; Flesh Lily Fields Bell becomes usable after the encounter."
}),
rec("bai-chilian-lady-of-the-twin-serpents",{
 bell:"Threadbound Great Tree",location:"Flower meadow beyond the Threadbound Great Tree Bell",
 prerequisites:["Review the potentially closing Crimson Forest tales before defeating the region boss."],
 phases:["Lady of the Twin Serpents","Sacrificial Serpent"],
 attacks:[
 cue("first-lunge",["dodge","parry","cues"],"In the first bar she surges toward you with successive rapid blade cuts.","Defend each of the incoming cuts in sequence; do not assume the first defense ends the lunge.","Standing still after the first deflection.","Lady of the Twin Serpents"),
 cue("serpent-rise",["dodge","damage-taken"],"Large serpents emerge from the meadow as she calls them.","Leave their emergence points and dodge the following serpent lunge.","Attacking while standing at a serpent emergence point.","Lady of the Twin Serpents"),
 cue("second-ring",["dodge","cues"],"During the second bar she rises inside a spinning ring of serpents.","Move away during the spin and evade her descent.","Continuing close attacks beneath the airborne ring.","Sacrificial Serpent"),
 cue("serpent-burst",["dodge","damage-taken"],"Glowing serpents and red ribbons spread outward from her body.","Create distance as the expanding burst begins.","Trying to trade damage during the burst.","Sacrificial Serpent")
 ],
 recovery:["In the first bar, let her finish a blade string before counterattacking.","Prepare for a second full health bar rather than spending everything in the first."],
 confirmation:"The source lists White Serpent & Crimson Viper and a Broken Illusory Pipa among the results.",
 limitations:["The reported quest lockouts should be rechecked against current quest progress."]
}),
rec("wan-jun-the-coppermaul",{
 bell:"Beneath the Watchtower",location:"Yard behind the chained barricade beside the bell",
 route:[path("At Beneath the Watchtower, turn toward the chained timber-and-stone barricade behind the bell.","The chained barricade is directly ahead and a prompt appears at its chains."),
 path("Use the in-game interaction to cut the chains with the axe ability, then move into the gatehouse yard.","The boss intro starts with Wan Jun rising from the steps.")],
 prerequisites:["Have the chain-cutting ability available to open the barricade; do not assume an ordinary attack works."],
 attacks:[
 cue("charging-maul",["dodge","damage-taken"],"Wan Jun runs across the yard with the large mace lifted.","Get off his travel line rather than backing directly toward the far wall.","Retreating straight backward into the charge."),
 cue("stone-rest",["counter","damage"],"He sits down and his skin takes on a cracked grey appearance.","Use this documented extended pause for controlled attacks, then disengage as he rises.","Assuming he stays motionless for the rest of the fight."),
 cue("red-flash",["dodge","cues"],"A red warning appears near his head before a spinning lunge.","Prepare to evade the lunge that follows the warning.","Committing to a slow attack through the warning.")
 ],
 confirmation:"Bashpole is a reported encounter reward.",
 limitations:["Published references differ on the nearest Bell for the Bashpole item versus the boss arena; this arena approach uses the Beneath the Watchtower guide, not an inferred shortcut."]
}),
rec("red-the-mysterious-swordswoman",{
 bell:"Dovecote",location:"Pagoda roof of Dovecote tower",
 route:[path("At the Dovecote Bell, enter the tower through its double doors.","The interior is decorated with doves, candles, and red threads."),
 path("Cross to the inside ladder, then use the marked wall-run at the next level.","You reach the exterior upper ladder."),
 path("Climb the final outer ladder onto the tiled roof.","Red waits at or near the roof spire.")],
 prerequisites:["If you intend to preserve the reported Red + Seven-Stars paired encounter, review the existing missable-branch guide before defeating Red alone."],
 attacks:[
 cue("red-dash",["dodge","cues"],"A red streak signals a swift sword dash across the roof.","Leave the line of the red dash before it crosses your position.","Waiting in the dash's straight path."),
 cue("spire-dive",["dodge","cues"],"Red climbs or jumps to the roof spire before plunging down.","Track her position above and stay in motion until the dive lands.","Healing beneath her while she is at the spire.")
 ],
 confirmation:"A standard item reward is not documented for the initial roof fight; verify the quest/encounter branch instead.",
 limitations:["Missable paired-fight conditions are based on the existing Mobalytics guide, not independent V2 testing."]
}),
rec("chief-disciple-of-the-seven-stars-formation",{
 bell:"Road to the Training Grounds",location:"Tower Rear Exit yard in Mandate Encampment",
 route:[path("From the Road to the Training Grounds Bell, approach the Tower Rear Exit yard marked by a burning tower.","White-robed disciples gather around you when the scene triggers.")],
 phases:["Seven-Stars Formation","Sword of Despair"],
 attacks:[
 cue("formation-rush",["dodge","damage-taken","preparation"],"White-robed swordsmen converge around Soul while the Chief Disciple attacks.","Circle near the outer edge of the troop instead of allowing attackers to close a full ring.","Standing motionless in the center while focusing on a single foe.","Seven-Stars Formation"),
 cue("blue-crescent",["dodge","cues"],"A broad sword motion sends a blue crescent across the dirt yard.","Read the sword's wide arc and move clear of the incoming wave.","Assuming distance from the boss means the wave cannot reach you.","Seven-Stars Formation"),
 cue("red-threads",["dodge","transition","cues"],"A second health bar appears and the arena turns red as threads spread.","Treat the red-thread pattern as a new attack family; preserve space to react to thread dives.","Continuing to attack as if the first formation stage were still active.","Sword of Despair")
 ],
 confirmation:"The Chief Disciple's second health bar must end; do not treat the first transition as victory."
}),
rec("blizzard-blademaster",{
 bell:"Whiteshadow’s Fall",location:"Frozen lake wreck near Whiteshadow’s Fall",
 route:[path("Approach the wreck at the far end of Meigu Lake's frozen section cautiously; the cutscene may trigger before the checkpoint.","The Whiteshadow’s Fall Bell is mounted on a post on the wreck."),
 path("Ring and rest at Whiteshadow’s Fall before walking into the boss encounter.","The Blizzard Blademaster health bar appears once you engage.")],
 preparation:["A source recommends Longevity Tonic; if heavily underpowered, return after upgrading rather than forcing a long fight."],
 attacks:[
 cue("red-ice",["dodge","cues"],"A red warning precedes a strike amid his ice attacks.","Evade the marked strike rather than standing in the warning lane.","Remaining still after the red marker."),
 cue("ice-burst",["damage-taken","dodge","cues"],"Jagged ice erupts around him at close distance.","Leave the immediate area once the ice buildup begins.","Remaining in melee range through the ground burst.")
 ],
 recovery:["Rest at the Bell to refill before retrying; make the checkpoint your first priority."],
 confirmation:"The published source reports the Whiteshadow weapon and the appearance of Puppet No. 99 afterward."
}),
rec("mu-xiaokui-young-mistress-of-the-order",{
 bell:"Lakeside",location:"Reeds beyond Lakeside Bell in Village of Lu",
 route:[path("From Lakeside Bell at the top of the lift out of Yuzan's area, follow the reeds toward the nearby encounter.","The scene begins as you emerge onto the lakeside approach.")],
 phases:["Young Mistress","Queen of Iron and Jade","Jade Dancer and Iron Fiend"],
 prerequisites:["The secret third stage is reported to depend on finishing the Young Mistress quest; don't assume every run includes it."],
 attacks:[
 cue("leap-dash",["dodge","cues","damage-taken"],"She vaults over Soul, lands, then streaks in a pale dash.","Track the landing and evade both the landing strike and the separate dash.","Using one dodge and assuming the sequence is over.","Young Mistress"),
 cue("crimson-string",["dodge","parry","damage-taken"],"Close-range crimson sword arcs come in short two- or three-hit bursts.","Respond to each swing in the string rather than only the opener.","Trying to counter after the first arc.","Young Mistress")
 ],
 confirmation:"The source describes two normal health bars and a conditional third guardian encounter."
}),
rec("yuzan-no-3-musician-puppet",{
 bell:"Beneath the Well",location:"Muddy basin below the Village of Lu well",
 route:[path("From Beneath the Well Bell, enter the muddy basin beneath the scaffolding.","A pipa-playing puppet sits at the opposite end of the arena.")],
 attacks:[
 cue("red-orb",["dodge","cues","damage-taken"],"A red aura gathers around Yuzan before curved red blades travel toward Soul.","Dodge the incoming blades as they near your position.","Trying to rush directly through her red projectile volley."),
 cue("blue-red-pair",["dodge","cues"],"A low blue blade is followed closely by a red blade.","Evade the blue hit and remain ready for the red follow-up.","Ending defense immediately after the blue projectile."),
 cue("close-pipa",["parry","counter"],"She switches to nearby pipa strikes once the player closes the gap.","Parry the close attacks if you can recognize each hit; avoid using the same response as her distant projectiles.","Treating her ranged and melee attacks as one pattern.")
 ],
 confirmation:"Heartrend Pipa is listed as the reward."
}),
rec("huangxing-the-kunlun-renegade",{
 bell:"The Lady’s Shrine",location:"Red hall beyond the Jade-Face courtyard",
 route:[path("Defeat Jade-Face first, then rest at The Lady's Shrine Bell.","The Pillars of Kunlun quest updates to confront Huangxing."),
 path("Go through the large door and cross Jade-Face's former court, then climb the stairway.","The cutscene begins in a timber hall with pillars and the Lady's statue.")],
 prerequisites:["Jade-Face must be defeated to unlock the reported story approach."],
 phases:["Kunlun Renegade","Whirling Executioner"],
 attacks:[
 cue("chain-ball",["dodge","cues","damage-taken"],"He swings a bladed ball overhead on a chain before hurling or dropping it.","Stay clear of its path and retain visibility of the chain as he winds up.","Standing behind a pillar that obscures the ball's motion.","Kunlun Renegade")
 ],
 recovery:["Keep the fight away from the pillars and statue dais so the camera can show the windup."],
 confirmation:"The encounter has a second full health-bar form after its first cutscene."
}),
rec("lei-dang-the-tiger-cannon",{
 bell:"Perfect Vessel Pond",location:"Gate building above the lantern stair in Mirage Estate",
 route:[path("From Perfect Vessel Pond Bell, climb the broad staircase with red lanterns toward the gate building.","The cutscene shows the boss beneath the red-lantern roofline.")],
 phases:["Tiger Cannon","One-Armed Tiger"],
 attacks:[
 cue("red-aim-line",["dodge","cues"],"A red targeting streak stretches across the arena before a ranged cannon shot.","Leave the indicated line and preserve movement space until the shell lands.","Standing in place while trying to damage him from range.","Tiger Cannon"),
 cue("cannon-slam",["dodge","damage-taken"],"At close range he raises the tiger-headed cannon arm overhead.","Move clear of the overhead strike and watch for the ground burst if he leaps.","Continuing close damage while his cannon is lifted.","Tiger Cannon")
 ],
 confirmation:"The source reports a Tiger Cannon reward after the full encounter."
}),
rec("yan-qiansui-the-zither-maiden",{
 bell:"Meigu Songhouse Dock",location:"Temple courtyard a short walk from the dock in Meigu Lake",
 route:[path("Rest at Meigu Songhouse Dock Bell and heal before approaching the temple yard.","Her health bar may appear while you are still approaching, with no fog gate.")],
 preparation:["Heal before walking into the open courtyard; she may attack before the player can prepare."],
 attacks:[
 cue("note-rows",["dodge","cues"],"Rows of luminous blue and red musical notes form across the yard and travel toward Soul.","Move out of the incoming note lanes instead of standing still to observe.","Continuing directly toward her through an active line of notes."),
 cue("red-ground-burst",["dodge","damage-taken"],"A red explosion effect appears on the ground at the player's feet.","Leave the marked spot promptly.","Staying in the red patch to trade hits.")
 ],
 recovery:["If you cannot damage her meaningfully with current equipment, the guide suggests returning after upgrades."],
 confirmation:"Illusory Pipa Strings and Fanatic's Fragment: Attachment are listed as rewards."
})
];
export const bossStrategies=Object.freeze(Object.fromEntries(strategies.map(s=>[s.bossId,s])));
export function getBossStrategy(id){return bossStrategies[id]||null}
export const bossEvidenceAudit=bosses.map(b=>{
 const s=bossStrategies[b.slug];
 return {bossId:b.slug,reviewedAt,rosterSources:b.sources.map(x=>x.url),strategyStatus:s?"curated-claim-evidence":b.hasExternalStrategy?"external-guide-only":"insufficient-strategy-evidence",
  specificBell:s?.bell||null,routeStatus:s?.route?.length?"source-supported-route":s?.bell?"bell-only":"no-turn-by-turn-route",
  outstanding:s?["In-game recreation and version-sensitive confirmation still required."]:["No V2-authored attack cue → response proof reviewed; consult external original where available.","Exact starting Bell and arena turns unverified unless specified elsewhere."],
  externalGuide:b.externalGuide?.url||null};
});
export function strategyCoverage(){
 const s=Object.values(bossStrategies);
 return {reviewed:bossEvidenceAudit.length,authored:s.length,withAttacks:s.filter(x=>x.attacks?.length).length,withPhases:s.filter(x=>x.phases?.length).length,withBell:s.filter(x=>x.bell).length,withRoute:s.filter(x=>x.route?.length).length,missing:bosses.length-s.length};
}
export function validateStrategies(){
 const known=new Set(bosses.map(b=>b.slug)),issues=[];
 if(strategies.length!==Object.keys(bossStrategies).length)issues.push("duplicate strategy records");
 for(const s of strategies){
  if(!known.has(s.bossId))issues.push("orphan "+s.bossId);
  const evid=new Set(s.sources.map(e=>e.id));
  for(const source of s.sources)if(!/^https:\/\//.test(source.url)||!evidenceClasses.includes(source.classification))issues.push("invalid source "+s.bossId);
  const phases=new Set(s.phases||[]);
  for(const a of s.attacks||[]){
   if(!a.id||!a.cue||!a.response||!a.avoid||!a.problems?.length)issues.push("incomplete cue "+s.bossId);
   if(a.phase&& !phases.has(a.phase))issues.push("unknown phase "+s.bossId+" "+a.phase);
   if(a.evidence.some(ref=>!evid.has(ref)))issues.push("unresolved evidence "+s.bossId);
  }
  for(const r of s.route||[])if(!r.instruction||!r.check||r.evidence?.some(ref=>!evid.has(ref)))issues.push("invalid route "+s.bossId);
 }
 return issues;
}
