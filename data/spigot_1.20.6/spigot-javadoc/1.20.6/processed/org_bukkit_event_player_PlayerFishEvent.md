---
title: "org.bukkit.event.player.PlayerFishEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
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
