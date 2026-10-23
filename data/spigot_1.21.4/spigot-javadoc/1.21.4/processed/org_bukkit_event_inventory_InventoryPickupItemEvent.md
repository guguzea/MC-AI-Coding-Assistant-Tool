---
title: "org.bukkit.event.inventory.InventoryPickupItemEvent"
package: "org.bukkit.event.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.event.inventory.InventoryPickupItemEvent extends org.bukkit.event.Event implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.inventory.InventoryPickupItemEvent(org.bukkit.inventory.Inventory, org.bukkit.entity.Item)`
- `public org.bukkit.inventory.Inventory getInventory()`
- `public org.bukkit.entity.Item getItem()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
