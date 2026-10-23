---
title: "org.bukkit.event.inventory.InventoryMoveItemEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/inventory/InventoryMoveItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public boolean calledGetItem`
- `public boolean calledSetItem`
- `public InventoryMoveItemEvent(@NotNull @NotNull Inventory sourceInventory, @NotNull @NotNull ItemStack itemStack, @NotNull @NotNull Inventory destinationInventory, boolean didSourceInitiate)`
- `@NotNull public @NotNull Inventory getSource()`
- `@NotNull public @NotNull ItemStack getItem()`
- `public void setItem(@NotNull @NotNull ItemStack itemStack)`
- `@NotNull public @NotNull Inventory getDestination()`
- `@NotNull public @NotNull Inventory getInitiator()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
