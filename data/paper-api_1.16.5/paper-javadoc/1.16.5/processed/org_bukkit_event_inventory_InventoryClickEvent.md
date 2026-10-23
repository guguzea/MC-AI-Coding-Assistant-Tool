---
title: "org.bukkit.event.inventory.InventoryClickEvent"
package: "org.bukkit.event.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/inventory/InventoryClickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public InventoryClickEvent&#8203;(@NotNull @NotNull InventoryView view, @NotNull @NotNull InventoryType.SlotType type, int slot, @NotNull @NotNull ClickType click, @NotNull @NotNull InventoryAction action)`
- `public InventoryClickEvent&#8203;(@NotNull @NotNull InventoryView view, @NotNull @NotNull InventoryType.SlotType type, int slot, @NotNull @NotNull ClickType click, @NotNull @NotNull InventoryAction action, int key)`
- `@NotNull public @NotNull InventoryType.SlotType getSlotType()`
- `@Nullable public @Nullable ItemStack getCursor()`
- `@Nullable public @Nullable ItemStack getCurrentItem()`
- `public boolean isRightClick()`
- `public boolean isLeftClick()`
- `public boolean isShiftClick()`
- `@Deprecated public void setCursor&#8203;(@Nullable @Nullable ItemStack stack)`
- `public void setCurrentItem&#8203;(@Nullable @Nullable ItemStack stack)`
- `@Nullable public @Nullable Inventory getClickedInventory()`
- `public int getSlot()`
- `public int getRawSlot()`
- `public int getHotbarButton()`
- `@NotNull public @NotNull InventoryAction getAction()`
- `@NotNull public @NotNull ClickType getClick()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
