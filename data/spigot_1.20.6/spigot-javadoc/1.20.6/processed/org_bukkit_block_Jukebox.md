---
title: "org.bukkit.block.Jukebox"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
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
