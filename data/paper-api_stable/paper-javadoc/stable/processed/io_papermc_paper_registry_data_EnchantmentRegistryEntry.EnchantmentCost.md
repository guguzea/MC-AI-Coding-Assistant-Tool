---
title: "io.papermc.paper.registry.data.EnchantmentRegistryEntry.EnchantmentCost"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/EnchantmentRegistryEntry.EnchantmentCost.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EnchantmentRegistryEntry.EnchantmentCost**
`@NonExtendable public static interface EnchantmentRegistryEntry.EnchantmentCost`
- `int baseCost()`
- `int additionalPerLevelCost()`
- `@Contract(value="_, _ -> new", pure=true) static EnchantmentRegistryEntry.EnchantmentCost of(int baseCost, int additionalPerLevelCost)`
