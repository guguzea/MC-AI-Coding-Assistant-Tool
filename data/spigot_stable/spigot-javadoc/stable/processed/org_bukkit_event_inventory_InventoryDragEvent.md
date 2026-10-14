---
title: "org.bukkit.event.inventory.InventoryDragEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/InventoryDragEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class InventoryDragEvent**
`public class InventoryDragEvent extends InventoryInteractEvent`
- `public InventoryDragEvent(@NotNull InventoryView what, @Nullable ItemStack newCursor, @NotNull ItemStack oldCursor, boolean right, @NotNull Map<Integer, ItemStack> slots)`
- `@NotNull public Map<Integer, ItemStack> getNewItems()`
- `@NotNull public Set<Integer> getRawSlots()`
- `@NotNull public Set<Integer> getInventorySlots()`
- `@Nullable public ItemStack getCursor()`
- `public void setCursor(@Nullable ItemStack newCursor)`
- `@NotNull public ItemStack getOldCursor()`
- `@NotNull public DragType getType()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
