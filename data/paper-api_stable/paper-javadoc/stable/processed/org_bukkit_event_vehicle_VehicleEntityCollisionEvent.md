---
title: "org.bukkit.event.vehicle.VehicleEntityCollisionEvent"
package: "org.bukkit.event.vehicle"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/vehicle/VehicleEntityCollisionEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class VehicleEntityCollisionEvent**
`public class VehicleEntityCollisionEvent extends VehicleCollisionEvent implements Cancellable`
- `@Internal public VehicleEntityCollisionEvent(@NotNull @NotNull Vehicle vehicle, @NotNull @NotNull Entity entity)`
- `@NotNull public @NotNull Entity getEntity()`
- `@Deprecated(forRemoval=true) public boolean isPickupCancelled()`
- `@Deprecated(forRemoval=true) public void setPickupCancelled(boolean cancel)`
- `@Deprecated(forRemoval=true) public boolean isCollisionCancelled()`
- `@Deprecated(forRemoval=true) public void setCollisionCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
