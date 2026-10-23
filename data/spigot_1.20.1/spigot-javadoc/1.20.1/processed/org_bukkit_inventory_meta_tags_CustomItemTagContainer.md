---
title: "org.bukkit.inventory.meta.tags.CustomItemTagContainer"
package: "org.bukkit.inventory.meta.tags"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.inventory.meta.tags.CustomItemTagContainer`
- `public abstract <T, Z> void setCustomTag(org.bukkit.NamespacedKey, org.bukkit.inventory.meta.tags.ItemTagType<T, Z>, Z)`
- `public abstract <T, Z> boolean hasCustomTag(org.bukkit.NamespacedKey, org.bukkit.inventory.meta.tags.ItemTagType<T, Z>)`
- `public abstract <T, Z> Z getCustomTag(org.bukkit.NamespacedKey, org.bukkit.inventory.meta.tags.ItemTagType<T, Z>)`
- `public abstract void removeCustomTag(org.bukkit.NamespacedKey)`
- `public abstract boolean isEmpty()`
- `public abstract org.bukkit.inventory.meta.tags.ItemTagAdapterContext getAdapterContext()`
