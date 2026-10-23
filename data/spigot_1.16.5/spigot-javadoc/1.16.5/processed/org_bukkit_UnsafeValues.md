---
title: "org.bukkit.UnsafeValues"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.UnsafeValues`
- `public abstract org.bukkit.Material toLegacy(org.bukkit.Material)`
- `public abstract org.bukkit.Material fromLegacy(org.bukkit.Material)`
- `public abstract org.bukkit.Material fromLegacy(org.bukkit.material.MaterialData)`
- `public abstract org.bukkit.Material fromLegacy(org.bukkit.material.MaterialData, boolean)`
- `public abstract org.bukkit.block.data.BlockData fromLegacy(org.bukkit.Material, byte)`
- `public abstract org.bukkit.Material getMaterial(java.lang.String, int)`
- `public abstract int getDataVersion()`
- `public abstract org.bukkit.inventory.ItemStack modifyItemStack(org.bukkit.inventory.ItemStack, java.lang.String)`
- `public abstract void checkSupported(org.bukkit.plugin.PluginDescriptionFile) throws org.bukkit.plugin.InvalidPluginException`
- `public abstract byte[] processClass(org.bukkit.plugin.PluginDescriptionFile, java.lang.String, byte[])`
- `public abstract org.bukkit.advancement.Advancement loadAdvancement(org.bukkit.NamespacedKey, java.lang.String)`
- `public abstract boolean removeAdvancement(org.bukkit.NamespacedKey)`
