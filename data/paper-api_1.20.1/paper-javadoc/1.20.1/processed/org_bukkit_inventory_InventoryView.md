---
title: "org.bukkit.inventory.InventoryView"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/inventory/InventoryView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public static final int OUTSIDE`
- `public InventoryView()`
- `@NotNull public abstract @NotNull Inventory getTopInventory()`
- `@NotNull public abstract @NotNull Inventory getBottomInventory()`
- `@NotNull public abstract @NotNull HumanEntity getPlayer()`
- `@NotNull public abstract @NotNull InventoryType getType()`
- `public void setItem(int slot, @Nullable @Nullable ItemStack item)`
- `@Nullable public @Nullable ItemStack getItem(int slot)`
- `public final void setCursor(@Nullable @Nullable ItemStack item)`
- `@NotNull public final @NotNull ItemStack getCursor()`
- `@Nullable public final @Nullable Inventory getInventory(int rawSlot)`
- `public final int convertSlot(int rawSlot)`
- `@NotNull public final InventoryType.SlotType getSlotType(int slot)`
- `public final void close()`
- `public final int countSlots()`
- `public final boolean setProperty(@NotNull @NotNull InventoryView.Property prop, int value)`
- `@NotNull public Component title()`
- `@Deprecated @NotNull public abstract @NotNull String getTitle()`
- `@NotNull public abstract @NotNull String getOriginalTitle()`
- `public abstract void setTitle(@NotNull @NotNull String title)`
