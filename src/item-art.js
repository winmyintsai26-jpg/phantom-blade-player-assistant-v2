import {generatedArt} from "./item-art.generated.js";
// Item artwork references are paired with exact named game-database entries.
// Thumbnail assets are hosted by their source; no third-party files are copied into the repository.
// Do not infer images for unmatched items from their type or from another similarly named item.
const sourcedArt={
  "weeping-creek:4":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/hunters-insight-210.webp",source:"https://pbz.gg/accessories/hunters-insight/"},
  "weeping-creek:6":{src:"https://pbz.gg/_ipx/w_104&f_webp&q_80/media/game/weapons/sanguine-twin-480.webp",source:"https://pbz.gg/weapons/sanguine-twin/"},
  "weeping-creek:8":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/battle-wraps-384.webp",source:"https://pbz.gg/accessories/battle-wraps/"},
  "weeping-creek:27":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/boulderguard-377.webp",source:"https://pbz.gg/accessories/boulderguard/"},
  "weeping-creek:48":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/medicine-case-351.webp",source:"https://pbz.gg/accessories/medicine-case/"},
  "weeping-creek:61":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/pigeon-feed-303.webp",source:"https://pbz.gg/items/pigeon-feed/"},
  "weeping-creek:30":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/broken-string-bow-384.webp",source:"https://pbz.gg/items/broken-string-bow/"},
  "weeping-creek:60":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/alloyed-scythe-blade-384.webp",source:"https://pbz.gg/items/alloyed-scythe-blade/"},
  "village-of-lu:74":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/reinforced-bowstring-383.webp",source:"https://pbz.gg/items/reinforced-bowstring/"},
  "village-of-lu:75":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/border-banner-384.webp",source:"https://pbz.gg/items/border-banner/"},
  "village-of-lu:76":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/border-poems-384.webp",source:"https://pbz.gg/items/border-poems/"},
  "mandate-encampment:60":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/enhanced-chainsaw-320.webp",source:"https://pbz.gg/items/enhanced-chainsaw/"},
  "meigu-lake:6":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/everlasting-flame-384.webp",source:"https://pbz.gg/items/everlasting-flame/"},
  "meigu-lake:99":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/golden-ammunition-214.webp",source:"https://pbz.gg/items/golden-ammunition/"},
  "mountain-of-imprisonment:3":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/iron-butcher-mask-384.webp",source:"https://pbz.gg/items/iron-butcher-mask/"},
  "mirage-estate:14":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/maintenance-oil-310.webp",source:"https://pbz.gg/items/maintenance-oil/"},
  "mount-soulrend:2":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/craftsmans-tool-kit-384.webp",source:"https://pbz.gg/items/craftsmans-tool-kit/"},
  "village-of-lu:23":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/wedding-candles-253.webp",source:"https://pbz.gg/items/wedding-candles/"},
  "weeping-creek:42":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/lingrans-pendant-376.webp",source:"https://pbz.gg/accessories/lingrans-pendant/"},
  "weeping-creek:52":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/reflex-device-338.webp",source:"https://pbz.gg/accessories/reflex-device/"},
  "weeping-creek:55":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/ancient-armor-fragment-384.webp",source:"https://pbz.gg/accessories/ancient-armor-fragment/"},
  "weeping-creek:57":{src:"https://pbz.gg/_ipx/w_174&f_webp&q_80/media/game/items/shenjis-ring-174.webp",source:"https://pbz.gg/accessories/shenjis-ring/"},
  "crimson-forest:25":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/silent-wrap-376.webp",source:"https://pbz.gg/accessories/silent-wrap/"},
  "crimson-forest:66":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/brass-chest-guard-384.webp",source:"https://pbz.gg/accessories/brass-chest-guard/"},
  "village-of-lu:2":{src:"https://pbz.gg/_ipx/w_195&f_webp&q_80/media/game/items/jewels-knot-195.webp",source:"https://pbz.gg/accessories/jewels-knot/"},
  "village-of-lu:22":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/mothers-talisman-322.webp",source:"https://pbz.gg/accessories/mothers-talisman/"},
  "village-of-lu:41":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/arrowward-255.webp",source:"https://pbz.gg/accessories/arrowward/"},
  "pangzhen:6":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/flameward-331.webp",source:"https://pbz.gg/accessories/flameward/"},
  "pangzhen:15":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/crimson-resolve-232.webp",source:"https://pbz.gg/accessories/crimson-resolve/"},
  "meigu-lake:1":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/battleforged-302.webp",source:"https://pbz.gg/accessories/battleforged/"},
  "mountain-of-imprisonment:2":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/baishan-writ-384.webp",source:"https://pbz.gg/accessories/baishan-writ/"},
  "village-of-lu:73":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/remnant-spark-cage-377.webp",source:"https://pbz.gg/accessories/remnant-spark-cage/"},
  "village-of-lu:53":{src:"https://pbz.gg/_ipx/w_200&f_webp&q_80/media/game/items/agarwood-prayer-beads-384.webp",source:"https://pbz.gg/accessories/agarwood-prayer-beads/"}
};
export const collectibleArt=id=>sourcedArt[id]||generatedArt[id]||null;
