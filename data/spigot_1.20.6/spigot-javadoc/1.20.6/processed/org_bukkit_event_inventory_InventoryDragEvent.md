---
title: "org.bukkit.event.inventory.InventoryDragEvent"
package: "org.bukkit.event.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.inventory.InventoryDragEvent extends org.bukkit.event.inventory.InventoryInteractEvent`
- `public org.bukkit.event.inventory.InventoryDragEvent(org.bukkit.inventory.InventoryView, org.bukkit.inventory.ItemStack, org.bukkit.inventory.ItemStack, boolean, java.util.Map<java.lang.Integer, org.bukkit.inventory.ItemStack>)`
- `public java.util.Map<java.lang.Integer, org.bukkit.inventory.ItemStack> getNewItems()`
- `public java.util.Set<java.lang.Integer> getRawSlots()`
- `public java.util.Set<java.lang.Integer> getInventorySlots()`
- `public org.bukkit.inventory.ItemStack getCursor()`
- `public void setCursor(org.bukkit.inventory.ItemStack)`
- `public org.bukkit.inventory.ItemStack getOldCursor()`
- `public org.bukkit.event.inventory.DragType getType()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
