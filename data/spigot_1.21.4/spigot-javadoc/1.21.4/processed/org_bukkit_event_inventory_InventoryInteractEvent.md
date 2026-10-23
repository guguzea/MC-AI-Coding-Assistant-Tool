---
title: "org.bukkit.event.inventory.InventoryInteractEvent"
package: "org.bukkit.event.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public abstract class org.bukkit.event.inventory.InventoryInteractEvent extends org.bukkit.event.inventory.InventoryEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.inventory.InventoryInteractEvent(org.bukkit.inventory.InventoryView)`
- `public org.bukkit.entity.HumanEntity getWhoClicked()`
- `public void setResult(org.bukkit.event.Event$Result)`
- `public org.bukkit.event.Event$Result getResult()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
