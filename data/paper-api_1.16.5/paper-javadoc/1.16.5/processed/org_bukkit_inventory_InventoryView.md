---
title: "org.bukkit.inventory.InventoryView"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/InventoryView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public static final int OUTSIDE`
- `public InventoryView()`
- `@NotNull public abstract @NotNull Inventory getTopInventory()`
- `@NotNull public abstract @NotNull Inventory getBottomInventory()`
- `@NotNull public abstract @NotNull HumanEntity getPlayer()`
- `@NotNull public abstract @NotNull InventoryType getType()`
- `public void setItem&#8203;(int slot, @Nullable @Nullable ItemStack item)`
- `@Nullable public @Nullable ItemStack getItem&#8203;(int slot)`
- `public final void setCursor&#8203;(@Nullable @Nullable ItemStack item)`
- `@Nullable public final @Nullable ItemStack getCursor()`
- `@Nullable public final @Nullable Inventory getInventory&#8203;(int rawSlot)`
- `public final int convertSlot&#8203;(int rawSlot)`
- `@NotNull public final InventoryType.SlotType getSlotType&#8203;(int slot)`
- `public final void close()`
- `public final int countSlots()`
- `public final boolean setProperty&#8203;(@NotNull @NotNull InventoryView.Property prop, int value)`
- `@NotNull public Component title()`
- `@Deprecated @NotNull public abstract @NotNull String getTitle()`
