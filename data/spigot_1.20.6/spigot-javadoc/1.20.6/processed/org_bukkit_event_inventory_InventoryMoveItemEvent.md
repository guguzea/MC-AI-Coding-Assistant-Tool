---
title: "org.bukkit.event.inventory.InventoryMoveItemEvent"
package: "org.bukkit.event.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.inventory.InventoryMoveItemEvent extends org.bukkit.event.Event implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.inventory.InventoryMoveItemEvent(org.bukkit.inventory.Inventory, org.bukkit.inventory.ItemStack, org.bukkit.inventory.Inventory, boolean)`
- `public org.bukkit.inventory.Inventory getSource()`
- `public org.bukkit.inventory.ItemStack getItem()`
- `public void setItem(org.bukkit.inventory.ItemStack)`
- `public org.bukkit.inventory.Inventory getDestination()`
- `public org.bukkit.inventory.Inventory getInitiator()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
