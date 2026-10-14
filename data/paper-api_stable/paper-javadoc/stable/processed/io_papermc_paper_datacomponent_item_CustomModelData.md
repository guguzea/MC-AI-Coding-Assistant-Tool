---
title: "io.papermc.paper.datacomponent.item.CustomModelData"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/CustomModelData.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface CustomModelData**
`@NonExtendable public interface CustomModelData`
- `@Contract(value="-> new", pure=true) static CustomModelData.Builder customModelData()`
- `@Contract(pure=true) @Unmodifiable List<Float> floats()`
- `@Contract(pure=true) @Unmodifiable List<Boolean> flags()`
- `@Contract(pure=true) @Unmodifiable List<String> strings()`
- `@Contract(pure=true) @Unmodifiable List<Color> colors()`
