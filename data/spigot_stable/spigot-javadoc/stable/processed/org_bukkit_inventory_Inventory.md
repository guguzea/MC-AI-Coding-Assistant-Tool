---
title: "org.bukkit.inventory.Inventory"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/Inventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Inventory**
`public interface Inventory extends Iterable<ItemStack>`
- `int getSize()`
- `int getMaxStackSize()`
- `void setMaxStackSize(int size)`
- `@Nullable ItemStack getItem(int index)`
- `void setItem(int index, @Nullable ItemStack item)`
- `@NotNull HashMap<Integer, ItemStack> addItem(@NotNull ItemStack... items) throws IllegalArgumentException`
- `@NotNull HashMap<Integer, ItemStack> removeItem(@NotNull ItemStack... items) throws IllegalArgumentException`
- `@NotNull ItemStack[] getContents()`
- `void setContents(@NotNull ItemStack[] items) throws IllegalArgumentException`
- `@NotNull ItemStack[] getStorageContents()`
- `void setStorageContents(@NotNull ItemStack[] items) throws IllegalArgumentException`
- `boolean contains(@NotNull Material material) throws IllegalArgumentException`
- `@Contract("null -> false") boolean contains(@Nullable ItemStack item)`
- `boolean contains(@NotNull Material material, int amount) throws IllegalArgumentException`
- `@Contract("null, _ -> false") boolean contains(@Nullable ItemStack item, int amount)`
- `@Contract("null, _ -> false") boolean containsAtLeast(@Nullable ItemStack item, int amount)`
- `@NotNull HashMap<Integer, ? extends ItemStack> all(@NotNull Material material) throws IllegalArgumentException`
- `@NotNull HashMap<Integer, ? extends ItemStack> all(@Nullable ItemStack item)`
- `int first(@NotNull Material material) throws IllegalArgumentException`
- `int first(@NotNull ItemStack item)`
- `int firstEmpty()`
- `boolean isEmpty()`
- `void remove(@NotNull Material material) throws IllegalArgumentException`
- `void remove(@NotNull ItemStack item)`
- `void clear(int index)`
- `void clear()`
- `@NotNull List<HumanEntity> getViewers()`
- `@NotNull InventoryType getType()`
- `@Nullable InventoryHolder getHolder()`
- `@NotNull ListIterator<ItemStack> iterator()`
- `@NotNull ListIterator<ItemStack> iterator(int index)`
- `@Nullable Location getLocation()`
