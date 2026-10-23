---
title: "org.bukkit.event.player.PlayerSpawnChangeEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
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
