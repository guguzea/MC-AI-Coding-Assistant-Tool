---
title: "org.bukkit.event.block.FluidLevelChangeEvent"
package: "org.bukkit.event.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.event.block.FluidLevelChangeEvent extends org.bukkit.event.block.BlockEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.block.FluidLevelChangeEvent(org.bukkit.block.Block, org.bukkit.block.data.BlockData)`
- `public org.bukkit.block.data.BlockData getNewData()`
- `public void setNewData(org.bukkit.block.data.BlockData)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
