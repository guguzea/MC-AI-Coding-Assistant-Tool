---
title: "org.bukkit.event.inventory.InventoryClickEvent"
package: "org.bukkit.event.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/inventory/InventoryClickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class InventoryClickEvent**
`public class InventoryClickEvent extends InventoryInteractEvent`
- `public InventoryClickEvent(@NotNull InventoryView view, @NotNull InventoryType.SlotType type, int slot, @NotNull ClickType click, @NotNull InventoryAction action)`
- `public InventoryClickEvent(@NotNull InventoryView view, @NotNull InventoryType.SlotType type, int slot, @NotNull ClickType click, @NotNull InventoryAction action, int key)`
- `@NotNull public InventoryType.SlotType getSlotType()`
- `@Nullable public ItemStack getCursor()`
- `@Nullable public ItemStack getCurrentItem()`
- `public boolean isRightClick()`
- `public boolean isLeftClick()`
- `public boolean isShiftClick()`
- `@Deprecated(since="1.5.2") public void setCursor(@Nullable ItemStack stack)`
- `public void setCurrentItem(@Nullable ItemStack stack)`
- `@Nullable public Inventory getClickedInventory()`
- `public int getSlot()`
- `public int getRawSlot()`
- `public int getHotbarButton()`
- `@NotNull public InventoryAction getAction()`
- `@NotNull public ClickType getClick()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
