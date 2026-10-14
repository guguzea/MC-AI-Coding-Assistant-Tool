---
title: "io.papermc.paper.datacomponent.item.PotionContents"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/PotionContents.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PotionContents**
`@NonExtendable public interface PotionContents`
- `@Contract(value="-> new", pure=true) static PotionContents.Builder potionContents()`
- `@Contract(pure=true) @Nullable PotionType potion()`
- `@Contract(pure=true) @Nullable Color customColor()`
- `@Contract(pure=true) @Unmodifiable List<PotionEffect> customEffects()`
- `@Contract(pure=true) @Nullable String customName()`
- `@Contract(pure=true) @Unmodifiable List<PotionEffect> allEffects()`
- `@Contract(pure=true) Color computeEffectiveColor()`
