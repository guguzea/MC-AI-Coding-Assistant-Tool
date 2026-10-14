---
title: "org.bukkit.event.inventory.InventoryMoveItemEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/InventoryMoveItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class InventoryMoveItemEvent**
`public class InventoryMoveItemEvent extends Event implements Cancellable`
- `@Internal public InventoryMoveItemEvent(@NotNull @NotNull Inventory sourceInventory, @NotNull @NotNull ItemStack itemStack, @NotNull @NotNull Inventory destinationInventory, boolean didSourceInitiate)`
- `@NotNull public @NotNull Inventory getSource()`
- `@NotNull public @NotNull ItemStack getItem()`
- `public void setItem(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull public @NotNull Inventory getDestination()`
- `@NotNull public @NotNull Inventory getInitiator()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
