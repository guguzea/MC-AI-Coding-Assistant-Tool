---
title: "io.papermc.paper.datacomponent.item.blocksattacks.ItemDamageFunction"
package: "io.papermc.paper.datacomponent.item.blocksattacks"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/blocksattacks/ItemDamageFunction.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemDamageFunction**
`@NonExtendable public interface ItemDamageFunction`
- `@Contract(value="-> new", pure=true) static ItemDamageFunction.Builder itemDamageFunction()`
- `@NonNegative float threshold()`
- `float base()`
- `float factor()`
- `int damageToApply(float damage)`
