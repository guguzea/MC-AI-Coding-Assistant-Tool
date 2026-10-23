---
title: "org.bukkit.inventory.InventoryView"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.inventory.InventoryView`
- `public static final int OUTSIDE`
- `public abstract org.bukkit.inventory.Inventory getTopInventory()`
- `public abstract org.bukkit.inventory.Inventory getBottomInventory()`
- `public abstract org.bukkit.entity.HumanEntity getPlayer()`
- `public abstract org.bukkit.event.inventory.InventoryType getType()`
- `public abstract void setItem(int, org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.inventory.ItemStack getItem(int)`
- `public abstract void setCursor(org.bukkit.inventory.ItemStack)`
- `public abstract org.bukkit.inventory.ItemStack getCursor()`
- `public abstract org.bukkit.inventory.Inventory getInventory(int)`
- `public abstract int convertSlot(int)`
- `public abstract org.bukkit.event.inventory.InventoryType$SlotType getSlotType(int)`
- `public abstract void close()`
- `public abstract int countSlots()`
- `public abstract boolean setProperty(org.bukkit.inventory.InventoryView$Property, int)`
- `public abstract java.lang.String getTitle()`
- `public abstract java.lang.String getOriginalTitle()`
- `public abstract void setTitle(java.lang.String)`
