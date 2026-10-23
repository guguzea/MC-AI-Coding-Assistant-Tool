---
title: "org.bukkit.event.inventory.InventoryInteractEvent"
package: "org.bukkit.event.inventory"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public abstract class org.bukkit.event.inventory.InventoryInteractEvent extends org.bukkit.event.inventory.InventoryEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.inventory.InventoryInteractEvent(org.bukkit.inventory.InventoryView)`
- `public org.bukkit.entity.HumanEntity getWhoClicked()`
- `public void setResult(org.bukkit.event.Event$Result)`
- `public org.bukkit.event.Event$Result getResult()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
