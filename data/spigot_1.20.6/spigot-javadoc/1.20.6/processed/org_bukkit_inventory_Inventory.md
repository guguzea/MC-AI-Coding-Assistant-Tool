---
title: "org.bukkit.inventory.Inventory"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.inventory.Inventory extends java.lang.Iterable<org.bukkit.inventory.ItemStack>`
- `public abstract int getSize()`
- `public abstract int getMaxStackSize()`
- `public abstract void setMaxStackSize(int)`
- `public abstract org.bukkit.inventory.ItemStack getItem(int)`
- `public abstract void setItem(int, org.bukkit.inventory.ItemStack)`
- `public abstract java.util.HashMap<java.lang.Integer, org.bukkit.inventory.ItemStack> addItem(org.bukkit.inventory.ItemStack...) throws java.lang.IllegalArgumentException`
- `public abstract java.util.HashMap<java.lang.Integer, org.bukkit.inventory.ItemStack> removeItem(org.bukkit.inventory.ItemStack...) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.inventory.ItemStack[] getContents()`
- `public abstract void setContents(org.bukkit.inventory.ItemStack[]) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.inventory.ItemStack[] getStorageContents()`
- `public abstract void setStorageContents(org.bukkit.inventory.ItemStack[]) throws java.lang.IllegalArgumentException`
- `public abstract boolean contains(org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract boolean contains(org.bukkit.inventory.ItemStack)`
- `public abstract boolean contains(org.bukkit.Material, int) throws java.lang.IllegalArgumentException`
- `public abstract boolean contains(org.bukkit.inventory.ItemStack, int)`
- `public abstract boolean containsAtLeast(org.bukkit.inventory.ItemStack, int)`
- `public abstract java.util.HashMap<java.lang.Integer, ? extends org.bukkit.inventory.ItemStack> all(org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract java.util.HashMap<java.lang.Integer, ? extends org.bukkit.inventory.ItemStack> all(org.bukkit.inventory.ItemStack)`
- `public abstract int first(org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract int first(org.bukkit.inventory.ItemStack)`
- `public abstract int firstEmpty()`
- `public abstract boolean isEmpty()`
- `public abstract void remove(org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract void remove(org.bukkit.inventory.ItemStack)`
- `public abstract void clear(int)`
- `public abstract void clear()`
- `public abstract java.util.List<org.bukkit.entity.HumanEntity> getViewers()`
- `public abstract org.bukkit.event.inventory.InventoryType getType()`
- `public abstract org.bukkit.inventory.InventoryHolder getHolder()`
- `public abstract java.util.ListIterator<org.bukkit.inventory.ItemStack> iterator()`
- `public abstract java.util.ListIterator<org.bukkit.inventory.ItemStack> iterator(int)`
- `public abstract org.bukkit.Location getLocation()`
- `public default java.util.Iterator iterator()`
