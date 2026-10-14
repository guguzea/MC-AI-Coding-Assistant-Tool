---
title: "org.bukkit.event.inventory.BrewingStandFuelEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/BrewingStandFuelEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BrewingStandFuelEvent**
`public class BrewingStandFuelEvent extends BlockEvent implements Cancellable`
- `public BrewingStandFuelEvent(@NotNull Block brewingStand, @NotNull ItemStack fuel, int fuelPower)`
- `@NotNull public ItemStack getFuel()`
- `public int getFuelPower()`
- `public void setFuelPower(int fuelPower)`
- `public boolean isConsuming()`
- `public void setConsuming(boolean consuming)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
