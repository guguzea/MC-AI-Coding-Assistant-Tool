---
title: "io.papermc.paper.datacomponent.item.ItemAdventurePredicate"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/ItemAdventurePredicate.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemAdventurePredicate**
`@NonExtendable public interface ItemAdventurePredicate`
- `@Contract(value="_ -> new", pure=true) static ItemAdventurePredicate itemAdventurePredicate(List<BlockPredicate> predicates)`
- `@Contract(value="-> new", pure=true) static ItemAdventurePredicate.Builder itemAdventurePredicate()`
- `@Contract(pure=true) @Unmodifiable List<BlockPredicate> predicates()`
