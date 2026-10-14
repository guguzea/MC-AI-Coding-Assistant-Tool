---
title: "org.bukkit.event.vehicle.VehicleDamageEvent"
package: "org.bukkit.event.vehicle"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/vehicle/VehicleDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class VehicleDamageEvent**
`public class VehicleDamageEvent extends VehicleEvent implements Cancellable`
- `@Internal public VehicleDamageEvent(@NotNull @NotNull Vehicle vehicle, @NotNull @NotNull DamageSource damageSource, @Nullable @Nullable Entity attacker, double damage)`
- `@NotNull public @NotNull DamageSource getDamageSource()`
- `@Nullable public @Nullable Entity getAttacker()`
- `public double getDamage()`
- `public void setDamage(double damage)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
