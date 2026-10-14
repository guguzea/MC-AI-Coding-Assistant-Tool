---
title: "org.bukkit.event.inventory.InventoryDragEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/inventory/InventoryDragEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class InventoryDragEvent**
`public class InventoryDragEvent extends InventoryInteractEvent`
- `@Internal public InventoryDragEvent(@NotNull @NotNull InventoryView view, @Nullable @Nullable ItemStack newCursor, @NotNull @NotNull ItemStack oldCursor, boolean right, @NotNull @NotNull Map<Integer, ItemStack> slots)`
- `@NotNull public @NotNull DragType getType()`
- `@Nullable public @Nullable ItemStack getCursor()`
- `public void setCursor(@Nullable @Nullable ItemStack newCursor)`
- `@NotNull public @NotNull ItemStack getOldCursor()`
- `@NotNull public @NotNull Map<Integer, ItemStack> getNewItems()`
- `@NotNull public @NotNull Set<Integer> getRawSlots()`
- `@NotNull public @NotNull Set<Integer> getInventorySlots()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
