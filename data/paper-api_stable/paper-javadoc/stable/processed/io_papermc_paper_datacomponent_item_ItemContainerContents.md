---
title: "io.papermc.paper.datacomponent.item.ItemContainerContents"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/ItemContainerContents.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemContainerContents**
`@NonExtendable public interface ItemContainerContents`
- `@Contract(value="_ -> new", pure=true) static ItemContainerContents containerContents(List<ItemStack> contents)`
- `@Contract(value="-> new", pure=true) static ItemContainerContents.Builder containerContents()`
- `@Contract(value="-> new", pure=true) @Unmodifiable List<ItemStack> contents()`
