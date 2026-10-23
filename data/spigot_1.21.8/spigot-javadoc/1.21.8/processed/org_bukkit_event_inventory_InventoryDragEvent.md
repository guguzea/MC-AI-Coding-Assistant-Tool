---
title: "org.bukkit.event.inventory.InventoryDragEvent"
package: "org.bukkit.event.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
