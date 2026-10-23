---
title: "org.bukkit.inventory.InventoryView"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
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
