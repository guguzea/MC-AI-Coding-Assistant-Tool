---
title: "org.bukkit.event.vehicle.VehicleDamageEvent"
package: "org.bukkit.event.vehicle"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/vehicle/VehicleDamageEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class VehicleDamageEvent**
`public class VehicleDamageEvent extends VehicleEvent implements Cancellable`
- `public VehicleDamageEvent(@NotNull Vehicle vehicle, @Nullable Entity attacker, double damage)`
- `@Nullable public Entity getAttacker()`
- `public double getDamage()`
- `public void setDamage(double damage)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
