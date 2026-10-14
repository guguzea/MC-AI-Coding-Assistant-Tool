---
title: "org.bukkit.event.vehicle.VehicleExitEvent"
package: "org.bukkit.event.vehicle"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/vehicle/VehicleExitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class VehicleExitEvent**
`public class VehicleExitEvent extends VehicleEvent implements Cancellable`
- `@Internal public VehicleExitEvent(@NotNull @NotNull Vehicle vehicle, @NotNull @NotNull LivingEntity exited, boolean isCancellable)`
- `@Internal public VehicleExitEvent(@NotNull @NotNull Vehicle vehicle, @NotNull @NotNull LivingEntity exited)`
- `@NotNull public @NotNull LivingEntity getExited()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancellable()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
