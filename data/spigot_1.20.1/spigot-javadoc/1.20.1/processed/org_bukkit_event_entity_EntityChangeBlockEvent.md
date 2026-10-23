---
title: "org.bukkit.event.entity.EntityChangeBlockEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.entity.EntityChangeBlockEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EntityChangeBlockEvent(org.bukkit.entity.Entity, org.bukkit.block.Block, org.bukkit.block.data.BlockData)`
- `public org.bukkit.block.Block getBlock()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.Material getTo()`
- `public org.bukkit.block.data.BlockData getBlockData()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
