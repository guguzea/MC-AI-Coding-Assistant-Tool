---
title: "org.bukkit.event.inventory.InventoryPickupItemEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/InventoryPickupItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class InventoryPickupItemEvent**
`public class InventoryPickupItemEvent extends Event implements Cancellable`
- `@Internal public InventoryPickupItemEvent(@NotNull @NotNull Inventory inventory, @NotNull @NotNull Item item)`
- `@NotNull public @NotNull Inventory getInventory()`
- `@NotNull public @NotNull Item getItem()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
