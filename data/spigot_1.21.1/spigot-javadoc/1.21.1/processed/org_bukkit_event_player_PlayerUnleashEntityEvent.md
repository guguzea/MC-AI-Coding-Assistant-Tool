---
title: "org.bukkit.event.player.PlayerUnleashEntityEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public class org.bukkit.event.player.PlayerUnleashEntityEvent extends org.bukkit.event.entity.EntityUnleashEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerUnleashEntityEvent(org.bukkit.entity.Entity, org.bukkit.entity.Player, org.bukkit.inventory.EquipmentSlot)`
- `public org.bukkit.event.player.PlayerUnleashEntityEvent(org.bukkit.entity.Entity, org.bukkit.entity.Player)`
- `public org.bukkit.entity.Player getPlayer()`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
