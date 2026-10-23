---
title: "org.bukkit.inventory.ItemFactory"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
- `public abstract org.bukkit.Material updateMaterial(org.bukkit.inventory.meta.ItemMeta, org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.Material getSpawnEgg(org.bukkit.entity.EntityType)`
