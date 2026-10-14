---
title: "org.bukkit.event.inventory.BrewEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/BrewEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BrewEvent**
`public class BrewEvent extends BlockEvent implements Cancellable`
- `public BrewEvent(@NotNull Block brewer, @NotNull BrewerInventory contents, @NotNull List<ItemStack> results, int fuelLevel)`
- `@NotNull public BrewerInventory getContents()`
- `public int getFuelLevel()`
- `@NotNull public List<ItemStack> getResults()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
