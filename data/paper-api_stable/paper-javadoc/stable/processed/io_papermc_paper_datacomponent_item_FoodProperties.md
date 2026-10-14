---
title: "io.papermc.paper.datacomponent.item.FoodProperties"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/FoodProperties.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface FoodProperties**
`@NonExtendable public interface FoodProperties extends BuildableDataComponent<FoodProperties, FoodProperties.Builder>`
- `@Contract(value="-> new", pure=true) static FoodProperties.Builder food()`
- `@Contract(pure=true) @NonNegative int nutrition()`
- `@Contract(pure=true) float saturation()`
- `@Contract(pure=true) boolean canAlwaysEat()`
