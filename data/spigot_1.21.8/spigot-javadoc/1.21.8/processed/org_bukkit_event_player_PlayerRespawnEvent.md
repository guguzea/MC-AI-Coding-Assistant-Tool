---
title: "org.bukkit.event.player.PlayerRespawnEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.player.PlayerRespawnEvent extends org.bukkit.event.player.PlayerEvent`
- `public org.bukkit.event.player.PlayerRespawnEvent(org.bukkit.entity.Player, org.bukkit.Location, boolean)`
- `public org.bukkit.event.player.PlayerRespawnEvent(org.bukkit.entity.Player, org.bukkit.Location, boolean, boolean)`
- `public org.bukkit.event.player.PlayerRespawnEvent(org.bukkit.entity.Player, org.bukkit.Location, boolean, boolean, org.bukkit.event.player.PlayerRespawnEvent$RespawnReason)`
- `public org.bukkit.Location getRespawnLocation()`
- `public void setRespawnLocation(org.bukkit.Location)`
- `public boolean isBedSpawn()`
- `public boolean isAnchorSpawn()`
- `public org.bukkit.event.player.PlayerRespawnEvent$RespawnReason getRespawnReason()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
