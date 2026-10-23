---
title: "org.bukkit.event.player.PlayerFishEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.player.PlayerFishEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerFishEvent(org.bukkit.entity.Player, org.bukkit.entity.Entity, org.bukkit.entity.FishHook, org.bukkit.inventory.EquipmentSlot, org.bukkit.event.player.PlayerFishEvent$State)`
- `public org.bukkit.event.player.PlayerFishEvent(org.bukkit.entity.Player, org.bukkit.entity.Entity, org.bukkit.entity.FishHook, org.bukkit.event.player.PlayerFishEvent$State)`
- `public org.bukkit.entity.Entity getCaught()`
- `public org.bukkit.entity.FishHook getHook()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public int getExpToDrop()`
- `public void setExpToDrop(int)`
- `public org.bukkit.inventory.EquipmentSlot getHand()`
- `public org.bukkit.event.player.PlayerFishEvent$State getState()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
