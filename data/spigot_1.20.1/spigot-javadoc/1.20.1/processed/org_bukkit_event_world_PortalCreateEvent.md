---
title: "org.bukkit.event.world.PortalCreateEvent"
package: "org.bukkit.event.world"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.world.PortalCreateEvent extends org.bukkit.event.world.WorldEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.world.PortalCreateEvent(java.util.List<org.bukkit.block.BlockState>, org.bukkit.World, org.bukkit.event.world.PortalCreateEvent$CreateReason)`
- `public org.bukkit.event.world.PortalCreateEvent(java.util.List<org.bukkit.block.BlockState>, org.bukkit.World, org.bukkit.entity.Entity, org.bukkit.event.world.PortalCreateEvent$CreateReason)`
- `public java.util.List<org.bukkit.block.BlockState> getBlocks()`
- `public org.bukkit.entity.Entity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.world.PortalCreateEvent$CreateReason getReason()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
