---
title: "io.papermc.paper.datacomponent.item.Tool.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/Tool.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Tool.Builder**
`@NonExtendable public static interface Tool.Builder extends DataComponentBuilder<Tool>`
- `@Contract(value="_ -> this", mutates="this") Tool.Builder damagePerBlock(@NonNegative int damage)`
- `@Contract(value="_ -> this", mutates="this") Tool.Builder defaultMiningSpeed(float miningSpeed)`
- `@Contract(value="_ -> this", mutates="this") Tool.Builder addRule(Tool.Rule rule)`
- `@Contract(value="_ -> this", mutates="this") Tool.Builder canDestroyBlocksInCreative(boolean canDestroyBlocksInCreative)`
- `@Contract(value="_ -> this", mutates="this") Tool.Builder addRules(Collection<Tool.Rule> rules)`
