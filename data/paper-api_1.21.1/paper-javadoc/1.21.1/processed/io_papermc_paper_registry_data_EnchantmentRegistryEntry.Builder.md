---
title: "io.papermc.paper.registry.data.EnchantmentRegistryEntry.Builder"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/registry/data/EnchantmentRegistryEntry.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder description(Component description)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder supportedItems(RegistryKeySet<ItemType> supportedItems)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder primaryItems(@Nullable RegistryKeySet<ItemType> primaryItems)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder weight(@org.jetbrains.annotations.Range(from=1L, to=1024L) int weight)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder maxLevel(@org.jetbrains.annotations.Range(from=1L, to=255L) int maxLevel)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder minimumCost(EnchantmentRegistryEntry.EnchantmentCost minimumCost)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder maximumCost(EnchantmentRegistryEntry.EnchantmentCost maximumCost)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder anvilCost(@org.jetbrains.annotations.Range(from=0L, to=2147483647L) int anvilCost)`
- `@Contract(value="_ -> this", mutates="this") default EnchantmentRegistryEntry.Builder activeSlots(EquipmentSlotGroup... activeSlots)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder activeSlots(Iterable<EquipmentSlotGroup> activeSlots)`
- `@Contract(value="_ -> this", mutates="this") EnchantmentRegistryEntry.Builder exclusiveWith(RegistryKeySet<Enchantment> exclusiveWith)`
