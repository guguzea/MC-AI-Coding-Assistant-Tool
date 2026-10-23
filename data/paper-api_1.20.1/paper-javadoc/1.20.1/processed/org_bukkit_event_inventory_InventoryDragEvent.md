---
title: "org.bukkit.event.inventory.InventoryDragEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/inventory/InventoryDragEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public InventoryDragEvent(@NotNull @NotNull InventoryView what, @Nullable @Nullable ItemStack newCursor, @NotNull @NotNull ItemStack oldCursor, boolean right, @NotNull @NotNull Map<Integer,ItemStack> slots)`
- `@NotNull public @NotNull Map<Integer,ItemStack> getNewItems()`
- `@NotNull public @NotNull Set<Integer> getRawSlots()`
- `@NotNull public @NotNull Set<Integer> getInventorySlots()`
- `@Nullable public @Nullable ItemStack getCursor()`
- `public void setCursor(@Nullable @Nullable ItemStack newCursor)`
- `@NotNull public @NotNull ItemStack getOldCursor()`
- `@NotNull public @NotNull DragType getType()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
