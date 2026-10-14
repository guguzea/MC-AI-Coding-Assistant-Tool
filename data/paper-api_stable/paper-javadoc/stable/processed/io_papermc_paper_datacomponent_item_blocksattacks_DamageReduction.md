---
title: "io.papermc.paper.datacomponent.item.blocksattacks.DamageReduction"
package: "io.papermc.paper.datacomponent.item.blocksattacks"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/blocksattacks/DamageReduction.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DamageReduction**
`@NonExtendable public interface DamageReduction`
- `@Contract(value="-> new", pure=true) static DamageReduction.Builder damageReduction()`
- `@Nullable RegistryKeySet<DamageType> type()`
- `@Positive float horizontalBlockingAngle()`
- `float base()`
- `float factor()`
