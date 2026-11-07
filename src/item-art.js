// Item artwork references are paired with exact named game-database entries.
// Thumbnail assets are hosted by their source; no third-party files are copied into the repository.
// Do not infer images for unmatched items from their type or from another similarly named item.
const sourcedArt={
  "weeping-creek:4":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/hunters-insight-210.webp",source:"https://pbz.gg/accessories/hunters-insight/"},
  "weeping-creek:6":{src:"https://pbz.gg/_ipx/w_104&f_webp&q_80/media/game/weapons/sanguine-twin-480.webp",source:"https://pbz.gg/weapons/sanguine-twin/"},
  "weeping-creek:8":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/battle-wraps-384.webp",source:"https://pbz.gg/accessories/battle-wraps/"},
  "weeping-creek:27":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/boulderguard-377.webp",source:"https://pbz.gg/accessories/boulderguard/"},
  "weeping-creek:48":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/medicine-case-351.webp",source:"https://pbz.gg/accessories/medicine-case/"}
};
export const collectibleArt=id=>sourcedArt[id]||null;
