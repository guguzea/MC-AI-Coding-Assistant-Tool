---
title: "io.papermc.paper.datacomponent.item.ItemLore"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/ItemLore.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemLore**
`@NonExtendable public interface ItemLore`
- `@Contract(value="_ -> new", pure=true) static ItemLore lore(List<? extends ComponentLike> lines)`
- `@Contract(value="-> new", pure=true) static ItemLore.Builder lore()`
- `@Contract(pure=true) @Unmodifiable List<Component> lines()`
- `@Contract(pure=true) @Unmodifiable List<Component> styledLines()`
