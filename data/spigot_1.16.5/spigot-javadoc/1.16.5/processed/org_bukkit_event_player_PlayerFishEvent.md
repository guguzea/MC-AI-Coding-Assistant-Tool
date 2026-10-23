---
title: "org.bukkit.event.player.PlayerFishEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.event.player.PlayerFishEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerFishEvent(org.bukkit.entity.Player, org.bukkit.entity.Entity, org.bukkit.entity.FishHook, org.bukkit.event.player.PlayerFishEvent$State)`
- `public org.bukkit.entity.Entity getCaught()`
- `public org.bukkit.entity.FishHook getHook()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public int getExpToDrop()`
- `public void setExpToDrop(int)`
- `public org.bukkit.event.player.PlayerFishEvent$State getState()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
