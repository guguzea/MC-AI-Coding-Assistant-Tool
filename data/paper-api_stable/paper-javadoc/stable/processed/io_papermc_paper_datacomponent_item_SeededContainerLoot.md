---
title: "io.papermc.paper.datacomponent.item.SeededContainerLoot"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/SeededContainerLoot.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SeededContainerLoot**
`@NonExtendable public interface SeededContainerLoot`
- `@Contract(value="_, _ -> new", pure=true) static SeededContainerLoot seededContainerLoot(Key lootTableKey, long seed)`
- `@Contract(value="_ -> new", pure=true) static SeededContainerLoot.Builder seededContainerLoot(Key lootTableKey)`
- `@Contract(pure=true) Key lootTable()`
- `@Contract(pure=true) long seed()`
