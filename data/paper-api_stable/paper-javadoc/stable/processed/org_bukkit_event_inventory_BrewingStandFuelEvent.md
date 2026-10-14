---
title: "org.bukkit.event.inventory.BrewingStandFuelEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/BrewingStandFuelEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BrewingStandFuelEvent**
`public class BrewingStandFuelEvent extends BlockEvent implements Cancellable`
- `@Internal public BrewingStandFuelEvent(@NotNull @NotNull Block brewingStand, @NotNull @NotNull ItemStack fuel, int fuelPower)`
- `@NotNull public @NotNull ItemStack getFuel()`
- `public int getFuelPower()`
- `public void setFuelPower(int fuelPower)`
- `public boolean isConsuming()`
- `public void setConsuming(boolean consuming)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
