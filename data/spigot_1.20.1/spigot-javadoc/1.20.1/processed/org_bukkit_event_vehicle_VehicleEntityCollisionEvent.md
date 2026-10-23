---
title: "org.bukkit.event.vehicle.VehicleEntityCollisionEvent"
package: "org.bukkit.event.vehicle"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.vehicle.VehicleEntityCollisionEvent extends org.bukkit.event.vehicle.VehicleCollisionEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.vehicle.VehicleEntityCollisionEvent(org.bukkit.entity.Vehicle, org.bukkit.entity.Entity)`
- `public org.bukkit.entity.Entity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public boolean isPickupCancelled()`
- `public void setPickupCancelled(boolean)`
- `public boolean isCollisionCancelled()`
- `public void setCollisionCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
