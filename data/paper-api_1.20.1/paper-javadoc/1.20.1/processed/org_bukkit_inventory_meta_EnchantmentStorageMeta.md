---
title: "org.bukkit.inventory.meta.EnchantmentStorageMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/inventory/meta/EnchantmentStorageMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `boolean hasStoredEnchants()`
- `boolean hasStoredEnchant(@NotNull @NotNull Enchantment ench)`
- `int getStoredEnchantLevel(@NotNull @NotNull Enchantment ench)`
- `@NotNull @NotNull Map<Enchantment,Integer> getStoredEnchants()`
- `boolean addStoredEnchant(@NotNull @NotNull Enchantment ench, int level, boolean ignoreLevelRestriction)`
- `boolean removeStoredEnchant(@NotNull @NotNull Enchantment ench) throws IllegalArgumentException`
- `boolean hasConflictingStoredEnchant(@NotNull @NotNull Enchantment ench)`
- `@NotNull @NotNull EnchantmentStorageMeta clone()`
