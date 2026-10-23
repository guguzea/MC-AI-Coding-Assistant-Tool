---
title: "org.bukkit.block.Jukebox"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.block.Jukebox extends org.bukkit.block.TileState,org.bukkit.inventory.BlockInventoryHolder`
- `public abstract org.bukkit.Material getPlaying()`
- `public abstract void setPlaying(org.bukkit.Material)`
- `public abstract boolean hasRecord()`
- `public abstract org.bukkit.inventory.ItemStack getRecord()`
- `public abstract void setRecord(org.bukkit.inventory.ItemStack)`
- `public abstract boolean isPlaying()`
- `public abstract boolean startPlaying()`
- `public abstract void stopPlaying()`
- `public abstract boolean eject()`
- `public abstract org.bukkit.inventory.JukeboxInventory getInventory()`
- `public abstract org.bukkit.inventory.JukeboxInventory getSnapshotInventory()`
- `public default org.bukkit.inventory.Inventory getInventory()`
