---
title: "io.papermc.paper.datacomponent.item.Consumable"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/Consumable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Consumable**
`@NonExtendable public interface Consumable extends BuildableDataComponent<Consumable, Consumable.Builder>`
- `@Contract(value="-> new", pure=true) static Consumable.Builder consumable()`
- `@Contract(pure=true) @NonNegative float consumeSeconds()`
- `@Contract(pure=true) ItemUseAnimation animation()`
- `@Contract(pure=true) Key sound()`
- `@Contract(pure=true) boolean hasConsumeParticles()`
- `@Contract(pure=true) @Unmodifiable List<ConsumeEffect> consumeEffects()`
