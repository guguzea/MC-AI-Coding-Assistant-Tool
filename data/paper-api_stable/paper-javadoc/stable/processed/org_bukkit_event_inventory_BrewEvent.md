---
title: "org.bukkit.event.inventory.BrewEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/BrewEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BrewEvent**
`public class BrewEvent extends BlockEvent implements Cancellable`
- `@Internal public BrewEvent(@NotNull @NotNull Block brewer, @NotNull @NotNull BrewerInventory contents, @NotNull @NotNull List<ItemStack> results, int fuelLevel)`
- `@NotNull public @NotNull BrewerInventory getContents()`
- `@NotNull public @NotNull List<ItemStack> getResults()`
- `public int getFuelLevel()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
