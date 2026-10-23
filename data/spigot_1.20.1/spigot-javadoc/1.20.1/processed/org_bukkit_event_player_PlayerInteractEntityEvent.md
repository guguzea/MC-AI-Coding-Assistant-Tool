---
title: "org.bukkit.event.player.PlayerInteractEntityEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.player.PlayerInteractEntityEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `protected org.bukkit.entity.Entity clickedEntity`
- `public org.bukkit.event.player.PlayerInteractEntityEvent(org.bukkit.entity.Player, org.bukkit.entity.Entity)`
- `public org.bukkit.event.player.PlayerInteractEntityEvent(org.bukkit.entity.Player, org.bukkit.entity.Entity, org.bukkit.inventory.EquipmentSlot)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.entity.Entity getRightClicked()`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
