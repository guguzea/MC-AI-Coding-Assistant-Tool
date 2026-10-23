---
title: "org.bukkit.event.inventory.BrewEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/inventory/BrewEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public BrewEvent(@NotNull @NotNull Block brewer, @NotNull @NotNull BrewerInventory contents, @NotNull @NotNull List<ItemStack> results, int fuelLevel)`
- `@NotNull public @NotNull BrewerInventory getContents()`
- `public int getFuelLevel()`
- `@NotNull public @NotNull List<ItemStack> getResults()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
