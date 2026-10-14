---
title: "org.bukkit.event.inventory.InventoryPickupItemEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/InventoryPickupItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class InventoryPickupItemEvent**
`public class InventoryPickupItemEvent extends Event implements Cancellable`
- `public InventoryPickupItemEvent(@NotNull Inventory inventory, @NotNull Item item)`
- `@NotNull public Inventory getInventory()`
- `@NotNull public Item getItem()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
