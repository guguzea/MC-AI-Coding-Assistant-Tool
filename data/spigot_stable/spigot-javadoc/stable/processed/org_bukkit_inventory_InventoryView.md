---
title: "org.bukkit.inventory.InventoryView"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/InventoryView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface InventoryView**
`public interface InventoryView`
- `static final int OUTSIDE`
- `@NotNull Inventory getTopInventory()`
- `@NotNull Inventory getBottomInventory()`
- `@NotNull HumanEntity getPlayer()`
- `@NotNull InventoryType getType()`
- `void setItem(int slot, @Nullable ItemStack item)`
- `@Nullable ItemStack getItem(int slot)`
- `void setCursor(@Nullable ItemStack item)`
- `@Nullable ItemStack getCursor()`
- `@Nullable Inventory getInventory(int rawSlot)`
- `int convertSlot(int rawSlot)`
- `@NotNull InventoryType.SlotType getSlotType(int slot)`
- `void close()`
- `int countSlots()`
- `boolean setProperty(@NotNull InventoryView.Property prop, int value)`
- `@NotNull String getTitle()`
- `@NotNull String getOriginalTitle()`
- `void setTitle(@NotNull String title)`
