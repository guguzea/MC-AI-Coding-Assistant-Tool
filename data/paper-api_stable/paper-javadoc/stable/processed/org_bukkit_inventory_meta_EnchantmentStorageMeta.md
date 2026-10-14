---
title: "org.bukkit.inventory.meta.EnchantmentStorageMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/EnchantmentStorageMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EnchantmentStorageMeta**
`public interface EnchantmentStorageMeta extends ItemMeta`
- `boolean hasStoredEnchants()`
- `boolean hasStoredEnchant(@NotNull @NotNull Enchantment enchant)`
- `int getStoredEnchantLevel(@NotNull @NotNull Enchantment enchant)`
- `@NotNull @NotNull Map<Enchantment, Integer> getStoredEnchants()`
- `boolean addStoredEnchant(@NotNull @NotNull Enchantment enchant, int level, boolean ignoreLevelRestriction)`
- `boolean removeStoredEnchant(@NotNull @NotNull Enchantment enchant) throws IllegalArgumentException`
- `boolean hasConflictingStoredEnchant(@NotNull @NotNull Enchantment enchant)`
- `@NotNull @NotNull EnchantmentStorageMeta clone()`
