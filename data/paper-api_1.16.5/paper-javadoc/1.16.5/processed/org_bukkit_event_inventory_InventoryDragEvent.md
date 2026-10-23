---
title: "org.bukkit.event.inventory.InventoryDragEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/inventory/InventoryDragEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public InventoryDragEvent&#8203;(@NotNull @NotNull InventoryView what, @Nullable @Nullable ItemStack newCursor, @NotNull @NotNull ItemStack oldCursor, boolean right, @NotNull @NotNull Map<Integer,&#8203;ItemStack> slots)`
- `@NotNull public @NotNull Map<Integer,&#8203;ItemStack> getNewItems()`
- `@NotNull public @NotNull Set<Integer> getRawSlots()`
- `@NotNull public @NotNull Set<Integer> getInventorySlots()`
- `@Nullable public @Nullable ItemStack getCursor()`
- `public void setCursor&#8203;(@Nullable @Nullable ItemStack newCursor)`
- `@NotNull public @NotNull ItemStack getOldCursor()`
- `@NotNull public @NotNull DragType getType()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
