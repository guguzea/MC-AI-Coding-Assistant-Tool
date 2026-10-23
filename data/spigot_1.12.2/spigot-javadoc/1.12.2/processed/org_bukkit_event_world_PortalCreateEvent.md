---
title: "org.bukkit.event.world.PortalCreateEvent"
package: "org.bukkit.event.world"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.world.PortalCreateEvent extends org.bukkit.event.world.WorldEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.world.PortalCreateEvent(java.util.Collection<org.bukkit.block.Block>, org.bukkit.World, org.bukkit.event.world.PortalCreateEvent$CreateReason)`
- `public java.util.ArrayList<org.bukkit.block.Block> getBlocks()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.world.PortalCreateEvent$CreateReason getReason()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
