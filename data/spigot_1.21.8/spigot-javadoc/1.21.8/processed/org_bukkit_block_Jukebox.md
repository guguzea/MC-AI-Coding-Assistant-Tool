---
title: "org.bukkit.block.Jukebox"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
