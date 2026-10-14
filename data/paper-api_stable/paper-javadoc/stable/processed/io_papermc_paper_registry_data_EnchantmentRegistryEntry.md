---
title: "io.papermc.paper.registry.data.EnchantmentRegistryEntry"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/EnchantmentRegistryEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EnchantmentRegistryEntry**
`@NonExtendable public interface EnchantmentRegistryEntry`
- `Component description()`
- `RegistryKeySet<ItemType> supportedItems()`
- `@Nullable RegistryKeySet<ItemType> primaryItems()`
- `@Range(from=1L,to=1024L) int weight()`
- `@Range(from=1L,to=255L) int maxLevel()`
- `EnchantmentRegistryEntry.EnchantmentCost minimumCost()`
- `EnchantmentRegistryEntry.EnchantmentCost maximumCost()`
- `@NonNegative int anvilCost()`
- `@Unmodifiable List<EquipmentSlotGroup> activeSlots()`
- `RegistryKeySet<Enchantment> exclusiveWith()`
