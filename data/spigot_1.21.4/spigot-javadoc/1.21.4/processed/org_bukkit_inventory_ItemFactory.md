---
title: "org.bukkit.inventory.ItemFactory"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.inventory.ItemFactory`
- `public abstract org.bukkit.inventory.meta.ItemMeta getItemMeta(org.bukkit.Material)`
- `public abstract boolean isApplicable(org.bukkit.inventory.meta.ItemMeta, org.bukkit.inventory.ItemStack) throws java.lang.IllegalArgumentException`
- `public abstract boolean isApplicable(org.bukkit.inventory.meta.ItemMeta, org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract boolean equals(org.bukkit.inventory.meta.ItemMeta, org.bukkit.inventory.meta.ItemMeta) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.inventory.meta.ItemMeta asMetaFor(org.bukkit.inventory.meta.ItemMeta, org.bukkit.inventory.ItemStack) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.inventory.meta.ItemMeta asMetaFor(org.bukkit.inventory.meta.ItemMeta, org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.Color getDefaultLeatherColor()`
- `public abstract org.bukkit.inventory.ItemStack createItemStack(java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.Material getSpawnEgg(org.bukkit.entity.EntityType)`
- `public abstract org.bukkit.inventory.ItemStack enchantItem(org.bukkit.entity.Entity, org.bukkit.inventory.ItemStack, int, boolean)`
- `public abstract org.bukkit.inventory.ItemStack enchantItem(org.bukkit.World, org.bukkit.inventory.ItemStack, int, boolean)`
- `public abstract org.bukkit.inventory.ItemStack enchantItem(org.bukkit.inventory.ItemStack, int, boolean)`
