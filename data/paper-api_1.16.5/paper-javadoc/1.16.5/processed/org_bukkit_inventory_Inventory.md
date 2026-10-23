---
title: "org.bukkit.inventory.Inventory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/Inventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `int getSize()`
- `int getMaxStackSize()`
- `void setMaxStackSize&#8203;(int size)`
- `@Nullable @Nullable ItemStack getItem&#8203;(int index)`
- `void setItem&#8203;(int index, @Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull HashMap<Integer,&#8203;ItemStack> addItem&#8203;(@NotNull @NotNull ItemStack... items) throws IllegalArgumentException`
- `@NotNull @NotNull HashMap<Integer,&#8203;ItemStack> removeItem&#8203;(@NotNull @NotNull ItemStack... items) throws IllegalArgumentException`
- `@NotNull @NotNull HashMap<Integer,&#8203;ItemStack> removeItemAnySlot&#8203;(@NotNull @NotNull ItemStack... items) throws IllegalArgumentException`
- `@Nullable ItemStack @NonNull [] getContents()`
- `void setContents&#8203;(@NotNull @NotNull ItemStack[] items) throws IllegalArgumentException`
- `@NotNull @NotNull ItemStack[] getStorageContents()`
- `void setStorageContents&#8203;(@NotNull @NotNull ItemStack[] items) throws IllegalArgumentException`
- `boolean contains&#8203;(@NotNull @NotNull Material material) throws IllegalArgumentException`
- `@Contract("null -> false") boolean contains&#8203;(@Nullable @Nullable ItemStack item)`
- `boolean contains&#8203;(@NotNull @NotNull Material material, int amount) throws IllegalArgumentException`
- `@Contract("null, _ -> false") boolean contains&#8203;(@Nullable @Nullable ItemStack item, int amount)`
- `@Contract("null, _ -> false") boolean containsAtLeast&#8203;(@Nullable @Nullable ItemStack item, int amount)`
- `@NotNull @NotNull HashMap<Integer,&#8203;? extends ItemStack> all&#8203;(@NotNull @NotNull Material material) throws IllegalArgumentException`
- `@NotNull @NotNull HashMap<Integer,&#8203;? extends ItemStack> all&#8203;(@Nullable @Nullable ItemStack item)`
- `int first&#8203;(@NotNull @NotNull Material material) throws IllegalArgumentException`
- `int first&#8203;(@NotNull @NotNull ItemStack item)`
- `int firstEmpty()`
- `boolean isEmpty()`
- `void remove&#8203;(@NotNull @NotNull Material material) throws IllegalArgumentException`
- `void remove&#8203;(@NotNull @NotNull ItemStack item)`
- `void clear&#8203;(int index)`
- `void clear()`
- `int close()`
- `@NotNull @NotNull List<HumanEntity> getViewers()`
- `@NotNull @NotNull InventoryType getType()`
- `@Nullable @Nullable InventoryHolder getHolder()`
- `@Nullable @Nullable InventoryHolder getHolder&#8203;(boolean useSnapshot)`
- `@NotNull @NotNull ListIterator<ItemStack> iterator()`
- `@NotNull @NotNull ListIterator<ItemStack> iterator&#8203;(int index)`
- `@Nullable @Nullable Location getLocation()`
