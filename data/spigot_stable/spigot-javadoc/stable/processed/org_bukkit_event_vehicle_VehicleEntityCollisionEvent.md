---
title: "org.bukkit.event.vehicle.VehicleEntityCollisionEvent"
package: "org.bukkit.event.vehicle"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/vehicle/VehicleEntityCollisionEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class VehicleEntityCollisionEvent**
`public class VehicleEntityCollisionEvent extends VehicleCollisionEvent implements Cancellable`
- `public VehicleEntityCollisionEvent(@NotNull Vehicle vehicle, @NotNull Entity entity)`
- `@NotNull public Entity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public boolean isPickupCancelled()`
- `public void setPickupCancelled(boolean cancel)`
- `public boolean isCollisionCancelled()`
- `public void setCollisionCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
