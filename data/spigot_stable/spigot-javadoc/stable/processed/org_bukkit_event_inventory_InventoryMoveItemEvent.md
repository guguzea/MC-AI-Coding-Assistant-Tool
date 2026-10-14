---
title: "org.bukkit.event.inventory.InventoryMoveItemEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/InventoryMoveItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class InventoryMoveItemEvent**
`public class InventoryMoveItemEvent extends Event implements Cancellable`
- `public InventoryMoveItemEvent(@NotNull Inventory sourceInventory, @NotNull ItemStack itemStack, @NotNull Inventory destinationInventory, boolean didSourceInitiate)`
- `@NotNull public Inventory getSource()`
- `@NotNull public ItemStack getItem()`
- `public void setItem(@NotNull ItemStack itemStack)`
- `@NotNull public Inventory getDestination()`
- `@NotNull public Inventory getInitiator()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
