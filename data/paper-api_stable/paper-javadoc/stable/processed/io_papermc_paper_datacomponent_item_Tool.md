---
title: "io.papermc.paper.datacomponent.item.Tool"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/Tool.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Tool**
`@NonExtendable public interface Tool`
- `@Contract(value="-> new", pure=true) static Tool.Builder tool()`
- `static Tool.Rule rule(RegistryKeySet<BlockType> blocks, @Nullable Float speed, TriState correctForDrops)`
- `@Contract(pure=true) float defaultMiningSpeed()`
- `@Contract(pure=true) @NonNegative int damagePerBlock()`
- `@Contract(pure=true) @Unmodifiable List<Tool.Rule> rules()`
- `@Contract(pure=true) boolean canDestroyBlocksInCreative()`
