---
title: "org.bukkit.inventory.meta.EnchantmentStorageMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.inventory.meta.EnchantmentStorageMeta extends org.bukkit.inventory.meta.ItemMeta`
- `public abstract boolean hasStoredEnchants()`
- `public abstract boolean hasStoredEnchant(org.bukkit.enchantments.Enchantment)`
- `public abstract int getStoredEnchantLevel(org.bukkit.enchantments.Enchantment)`
- `public abstract java.util.Map<org.bukkit.enchantments.Enchantment, java.lang.Integer> getStoredEnchants()`
- `public abstract boolean addStoredEnchant(org.bukkit.enchantments.Enchantment, int, boolean)`
- `public abstract boolean removeStoredEnchant(org.bukkit.enchantments.Enchantment) throws java.lang.IllegalArgumentException`
- `public abstract boolean hasConflictingStoredEnchant(org.bukkit.enchantments.Enchantment)`
- `public abstract org.bukkit.inventory.meta.EnchantmentStorageMeta clone()`
- `public default org.bukkit.inventory.meta.ItemMeta clone()`
