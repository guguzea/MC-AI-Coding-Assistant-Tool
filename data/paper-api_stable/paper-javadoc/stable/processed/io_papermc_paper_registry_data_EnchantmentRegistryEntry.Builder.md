---
title: "io.papermc.paper.registry.data.EnchantmentRegistryEntry.Builder"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/EnchantmentRegistryEntry.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EnchantmentRegistryEntry.Builder**
`@NonExtendable public static interface EnchantmentRegistryEntry.Builder extends EnchantmentRegistryEntry, RegistryBuilder<Enchantment>`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder description(Component description)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder supportedItems(RegistryKeySet<ItemType> supportedItems)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder primaryItems(@Nullable RegistryKeySet<ItemType> primaryItems)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder weight(@Range(from=1L,to=1024L) int weight)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder maxLevel(@Range(from=1L,to=255L) int maxLevel)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder minimumCost(EnchantmentRegistryEntry.EnchantmentCost minimumCost)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder maximumCost(EnchantmentRegistryEntry.EnchantmentCost maximumCost)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder anvilCost(@NonNegative int anvilCost)`
- `@Contract(value="_ -> this", mutates="this") default EnchantmentRegistryEntry.Builder activeSlots(EquipmentSlotGroup... activeSlots)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder activeSlots(Iterable<EquipmentSlotGroup> activeSlots)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder exclusiveWith(RegistryKeySet<Enchantment> exclusiveWith)`
