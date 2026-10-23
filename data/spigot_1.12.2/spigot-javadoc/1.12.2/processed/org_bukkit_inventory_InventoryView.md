---
title: "org.bukkit.inventory.InventoryView"
package: "org.bukkit.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
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
- `public final int convertSlot(int)`
- `public final void close()`
- `public final int countSlots()`
- `public final boolean setProperty(org.bukkit.inventory.InventoryView$Property, int)`
- `public final java.lang.String getTitle()`
