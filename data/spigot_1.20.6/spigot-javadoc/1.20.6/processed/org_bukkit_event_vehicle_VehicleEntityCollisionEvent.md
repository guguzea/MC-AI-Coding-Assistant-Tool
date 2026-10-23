---
title: "org.bukkit.event.vehicle.VehicleEntityCollisionEvent"
package: "org.bukkit.event.vehicle"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
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
