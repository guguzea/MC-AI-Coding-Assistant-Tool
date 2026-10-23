---
title: "org.bukkit.inventory.InventoryView"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public abstract class org.bukkit.inventory.InventoryView`
- `public static final int OUTSIDE`
- `public org.bukkit.inventory.InventoryView()`
- `public abstract org.bukkit.inventory.Inventory getTopInventory()`
- `public abstract org.bukkit.inventory.Inventory getBottomInventory()`
- `public abstract org.bukkit.entity.HumanEntity getPlayer()`
- `public abstract org.bukkit.event.inventory.InventoryType getType()`
- `public void setItem(int, org.bukkit.inventory.ItemStack)`
- `public org.bukkit.inventory.ItemStack getItem(int)`
- `public final void setCursor(org.bukkit.inventory.ItemStack)`
- `public final org.bukkit.inventory.ItemStack getCursor()`
- `public final org.bukkit.inventory.Inventory getInventory(int)`
- `public final int convertSlot(int)`
- `public final org.bukkit.event.inventory.InventoryType$SlotType getSlotType(int)`
- `public final void close()`
- `public final int countSlots()`
- `public final boolean setProperty(org.bukkit.inventory.InventoryView$Property, int)`
- `public abstract java.lang.String getTitle()`
- `public abstract java.lang.String getOriginalTitle()`
- `public abstract void setTitle(java.lang.String)`
