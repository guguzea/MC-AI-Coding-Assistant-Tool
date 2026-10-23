---
title: "org.bukkit.inventory.Inventory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/inventory/Inventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `int getSize()`
- `int getMaxStackSize()`
- `void setMaxStackSize(int size)`
- `@Nullable @Nullable ItemStack getItem(int index)`
- `void setItem(int index, @Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull HashMap<Integer,ItemStack> addItem(@NotNull @NotNull ItemStack... items) throws IllegalArgumentException`
- `@NotNull @NotNull HashMap<Integer,ItemStack> removeItem(@NotNull @NotNull ItemStack... items) throws IllegalArgumentException`
- `@NotNull @NotNull HashMap<Integer,ItemStack> removeItemAnySlot(@NotNull @NotNull ItemStack... items) throws IllegalArgumentException`
- `@Nullable @Nullable ItemStack @NotNull [] getContents()`
- `void setContents(@Nullable @Nullable ItemStack @NotNull [] items) throws IllegalArgumentException`
- `@Nullable @Nullable ItemStack @NotNull [] getStorageContents()`
- `void setStorageContents(@Nullable @Nullable ItemStack @NotNull [] items) throws IllegalArgumentException`
- `boolean contains(@NotNull @NotNull Material material) throws IllegalArgumentException`
- `@Contract("null -> false") boolean contains(@Nullable @Nullable ItemStack item)`
- `boolean contains(@NotNull @NotNull Material material, int amount) throws IllegalArgumentException`
- `@Contract("null, _ -> false") boolean contains(@Nullable @Nullable ItemStack item, int amount)`
- `@Contract("null, _ -> false") boolean containsAtLeast(@Nullable @Nullable ItemStack item, int amount)`
- `@NotNull @NotNull HashMap<Integer,? extends ItemStack> all(@NotNull @NotNull Material material) throws IllegalArgumentException`
- `@NotNull @NotNull HashMap<Integer,? extends ItemStack> all(@Nullable @Nullable ItemStack item)`
- `int first(@NotNull @NotNull Material material) throws IllegalArgumentException`
- `int first(@NotNull @NotNull ItemStack item)`
- `int firstEmpty()`
- `boolean isEmpty()`
- `void remove(@NotNull @NotNull Material material) throws IllegalArgumentException`
- `void remove(@NotNull @NotNull ItemStack item)`
- `void clear(int index)`
- `void clear()`
- `int close()`
- `@NotNull @NotNull List<HumanEntity> getViewers()`
- `@NotNull @NotNull InventoryType getType()`
- `@Nullable @Nullable InventoryHolder getHolder()`
- `@Nullable @Nullable InventoryHolder getHolder(boolean useSnapshot)`
- `@NotNull @NotNull ListIterator<ItemStack> iterator()`
- `@NotNull @NotNull ListIterator<ItemStack> iterator(int index)`
- `@Nullable @Nullable Location getLocation()`
