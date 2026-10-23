---
title: "org.bukkit.event.player.PlayerUnleashEntityEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.event.player.PlayerUnleashEntityEvent extends org.bukkit.event.entity.EntityUnleashEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerUnleashEntityEvent(org.bukkit.entity.Entity, org.bukkit.entity.Player, org.bukkit.inventory.EquipmentSlot)`
- `public org.bukkit.event.player.PlayerUnleashEntityEvent(org.bukkit.entity.Entity, org.bukkit.entity.Player)`
- `public org.bukkit.entity.Player getPlayer()`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
