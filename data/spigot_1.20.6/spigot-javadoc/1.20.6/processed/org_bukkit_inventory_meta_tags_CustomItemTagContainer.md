---
title: "org.bukkit.inventory.meta.tags.CustomItemTagContainer"
package: "org.bukkit.inventory.meta.tags"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.inventory.meta.tags.CustomItemTagContainer`
- `public abstract <T, Z> void setCustomTag(org.bukkit.NamespacedKey, org.bukkit.inventory.meta.tags.ItemTagType<T, Z>, Z)`
- `public abstract <T, Z> boolean hasCustomTag(org.bukkit.NamespacedKey, org.bukkit.inventory.meta.tags.ItemTagType<T, Z>)`
- `public abstract <T, Z> Z getCustomTag(org.bukkit.NamespacedKey, org.bukkit.inventory.meta.tags.ItemTagType<T, Z>)`
- `public abstract void removeCustomTag(org.bukkit.NamespacedKey)`
- `public abstract boolean isEmpty()`
- `public abstract org.bukkit.inventory.meta.tags.ItemTagAdapterContext getAdapterContext()`
