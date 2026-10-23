---
title: "io.papermc.paper.datacomponent.item.Tool"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/datacomponent/item/Tool.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(value="-> new", pure=true) static Tool.Builder tool()`
- `static Tool.Rule rule(RegistryKeySet<BlockType> blocks, @Nullable Float speed, TriState correctForDrops)`
- `@Contract(pure=true) float defaultMiningSpeed()`
- `@Contract(pure=true) @org.checkerframework.checker.index.qual.NonNegative int damagePerBlock()`
- `@Contract(pure=true) @Unmodifiable List<Tool.Rule> rules()`
