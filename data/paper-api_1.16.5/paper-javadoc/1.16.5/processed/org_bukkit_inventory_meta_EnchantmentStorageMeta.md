---
title: "org.bukkit.inventory.meta.EnchantmentStorageMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/meta/EnchantmentStorageMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `boolean hasStoredEnchants()`
- `boolean hasStoredEnchant&#8203;(@NotNull @NotNull Enchantment ench)`
- `int getStoredEnchantLevel&#8203;(@NotNull @NotNull Enchantment ench)`
- `@NotNull @NotNull Map<Enchantment,&#8203;Integer> getStoredEnchants()`
- `boolean addStoredEnchant&#8203;(@NotNull @NotNull Enchantment ench, int level, boolean ignoreLevelRestriction)`
- `boolean removeStoredEnchant&#8203;(@NotNull @NotNull Enchantment ench) throws IllegalArgumentException`
- `boolean hasConflictingStoredEnchant&#8203;(@NotNull @NotNull Enchantment ench)`
- `@NotNull @NotNull EnchantmentStorageMeta clone()`
