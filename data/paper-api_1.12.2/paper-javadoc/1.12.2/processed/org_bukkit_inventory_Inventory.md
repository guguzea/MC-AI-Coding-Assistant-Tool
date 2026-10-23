---
title: "org.bukkit.inventory.Inventory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/inventory/Inventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `HashMap<Integer,ItemStack> addItem(ItemStack... items)`
- `HashMap<Integer,? extends ItemStack> all(int materialId)`
- `HashMap<Integer,? extends ItemStack> all(ItemStack item)`
- `HashMap<Integer,? extends ItemStack> all(Material material)`
- `void clear()`
- `void clear(int index)`
- `boolean contains(int materialId)`
- `boolean contains(int materialId, int amount)`
- `boolean contains(ItemStack item)`
- `boolean contains(ItemStack item, int amount)`
- `boolean contains(Material material)`
- `boolean contains(Material material, int amount)`
- `boolean containsAtLeast(ItemStack item, int amount)`
- `int first(int materialId)`
- `int first(ItemStack item)`
- `int first(Material material)`
- `int firstEmpty()`
- `ItemStack[] getContents()`
- `InventoryHolder getHolder()`
- `ItemStack getItem(int index)`
- `Location getLocation()`
- `int getMaxStackSize()`
- `String getName()`
- `int getSize()`
- `ItemStack[] getStorageContents()`
- `String getTitle()`
- `InventoryType getType()`
- `List<HumanEntity> getViewers()`
- `ListIterator<ItemStack> iterator()`
- `ListIterator<ItemStack> iterator(int index)`
- `void remove(int materialId)`
- `void remove(ItemStack item)`
- `void remove(Material material)`
- `HashMap<Integer,ItemStack> removeItem(ItemStack... items)`
- `void setContents(ItemStack[] items)`
- `void setItem(int index, ItemStack item)`
- `void setMaxStackSize(int size)`
- `void setStorageContents(ItemStack[] items)`
