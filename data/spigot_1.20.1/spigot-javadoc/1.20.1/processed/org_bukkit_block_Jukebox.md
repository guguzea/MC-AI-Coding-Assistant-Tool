---
title: "org.bukkit.block.Jukebox"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
