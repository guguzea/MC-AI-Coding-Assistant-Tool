---
title: "org.bukkit.inventory.InventoryView"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/InventoryView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface InventoryView**
`public interface InventoryView`
- `static final int OUTSIDE`
- `@NotNull @NotNull Inventory getTopInventory()`
- `@NotNull @NotNull Inventory getBottomInventory()`
- `@NotNull @NotNull HumanEntity getPlayer()`
- `@NotNull @NotNull InventoryType getType()`
- `void setItem(int slot, @Nullable @Nullable ItemStack item)`
- `@Nullable @Nullable ItemStack getItem(int slot)`
- `void setCursor(@Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull ItemStack getCursor()`
- `@Nullable @Nullable Inventory getInventory(int rawSlot)`
- `int convertSlot(int rawSlot)`
- `@NotNull InventoryType.SlotType getSlotType(int slot)`
- `void open()`
- `void close()`
- `int countSlots()`
- `boolean setProperty(@NotNull @NotNull InventoryView.Property prop, int value)`
- `@NotNull default Component title()`
- `@Deprecated @NotNull @NotNull String getTitle()`
- `@NotNull @Deprecated(since="1.21.1") @NotNull String getOriginalTitle()`
- `@Deprecated(since="1.21.1") void setTitle(@NotNull @NotNull String title)`
- `@Nullable @Nullable MenuType getMenuType()`
