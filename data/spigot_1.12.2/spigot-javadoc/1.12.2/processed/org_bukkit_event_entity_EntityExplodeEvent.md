---
title: "org.bukkit.event.entity.EntityExplodeEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.entity.EntityExplodeEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EntityExplodeEvent(org.bukkit.entity.Entity, org.bukkit.Location, java.util.List<org.bukkit.block.Block>, float)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public java.util.List<org.bukkit.block.Block> blockList()`
- `public org.bukkit.Location getLocation()`
- `public float getYield()`
- `public void setYield(float)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
