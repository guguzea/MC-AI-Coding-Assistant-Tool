---
title: "org.bukkit.event.player.PlayerSpawnChangeEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.event.player.PlayerSpawnChangeEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerSpawnChangeEvent(org.bukkit.entity.Player, org.bukkit.Location, boolean, org.bukkit.event.player.PlayerSpawnChangeEvent$Cause)`
- `public org.bukkit.event.player.PlayerSpawnChangeEvent$Cause getCause()`
- `public boolean isForced()`
- `public void setForced(boolean)`
- `public org.bukkit.Location getNewSpawn()`
- `public void setNewSpawn(org.bukkit.Location)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
