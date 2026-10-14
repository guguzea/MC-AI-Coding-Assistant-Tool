---
title: "io.papermc.paper.datacomponent.item.BlockItemDataProperties"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/BlockItemDataProperties.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BlockItemDataProperties**
`@NonExtendable public interface BlockItemDataProperties`
- `@Contract(value="-> new", pure=true) static BlockItemDataProperties.Builder blockItemStateProperties()`
- `@Contract(pure=true) BlockData createBlockData(BlockType blockType)`
- `@Contract(pure=true) BlockData applyTo(BlockData blockData)`
