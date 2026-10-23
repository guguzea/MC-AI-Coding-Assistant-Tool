---
title: "org.bukkit.event.entity.EntityExplodeEvent"
package: "org.bukkit.event.entity"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.event.entity.EntityExplodeEvent extends org.bukkit.event.entity.EntityEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.entity.EntityExplodeEvent(org.bukkit.entity.Entity, org.bukkit.Location, java.util.List<org.bukkit.block.Block>, float, org.bukkit.ExplosionResult)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.ExplosionResult getExplosionResult()`
- `public java.util.List<org.bukkit.block.Block> blockList()`
- `public org.bukkit.Location getLocation()`
- `public float getYield()`
- `public void setYield(float)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
