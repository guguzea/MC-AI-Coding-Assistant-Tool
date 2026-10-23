---
title: "org.bukkit.inventory.meta.SkullMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.inventory.meta.SkullMeta extends org.bukkit.inventory.meta.ItemMeta`
- `public abstract java.lang.String getOwner()`
- `public abstract boolean hasOwner()`
- `public abstract boolean setOwner(java.lang.String)`
- `public abstract org.bukkit.OfflinePlayer getOwningPlayer()`
- `public abstract boolean setOwningPlayer(org.bukkit.OfflinePlayer)`
- `public abstract org.bukkit.profile.PlayerProfile getOwnerProfile()`
- `public abstract void setOwnerProfile(org.bukkit.profile.PlayerProfile)`
- `public abstract void setNoteBlockSound(org.bukkit.NamespacedKey)`
- `public abstract org.bukkit.NamespacedKey getNoteBlockSound()`
- `public abstract org.bukkit.inventory.meta.SkullMeta clone()`
- `public default org.bukkit.inventory.meta.ItemMeta clone()`
