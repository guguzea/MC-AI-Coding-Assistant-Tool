---
title: "org.bukkit.event.vehicle.VehicleDestroyEvent"
package: "org.bukkit.event.vehicle"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/vehicle/VehicleDestroyEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class VehicleDestroyEvent**
`public class VehicleDestroyEvent extends VehicleEvent implements Cancellable`
- `@Internal public VehicleDestroyEvent(@NotNull @NotNull Vehicle vehicle, @NotNull @NotNull DamageSource damageSource, @Nullable @Nullable Entity attacker)`
- `@NotNull public @NotNull DamageSource getDamageSource()`
- `@Nullable public @Nullable Entity getAttacker()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
