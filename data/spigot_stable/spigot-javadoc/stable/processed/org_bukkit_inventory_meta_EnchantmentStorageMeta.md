---
title: "org.bukkit.inventory.meta.EnchantmentStorageMeta"
package: "org.bukkit.inventory.meta"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/EnchantmentStorageMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface EnchantmentStorageMeta**
`public interface EnchantmentStorageMeta extends ItemMeta`
- `boolean hasStoredEnchants()`
- `boolean hasStoredEnchant(@NotNull Enchantment ench)`
- `int getStoredEnchantLevel(@NotNull Enchantment ench)`
- `@NotNull Map<Enchantment, Integer> getStoredEnchants()`
- `boolean addStoredEnchant(@NotNull Enchantment ench, int level, boolean ignoreLevelRestriction)`
- `boolean removeStoredEnchant(@NotNull Enchantment ench) throws IllegalArgumentException`
- `boolean hasConflictingStoredEnchant(@NotNull Enchantment ench)`
- `@NotNull EnchantmentStorageMeta clone()`
