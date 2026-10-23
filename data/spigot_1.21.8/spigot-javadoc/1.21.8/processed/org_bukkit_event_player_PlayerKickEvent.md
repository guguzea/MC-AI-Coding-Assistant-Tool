---
title: "org.bukkit.event.player.PlayerKickEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.player.PlayerKickEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerKickEvent(org.bukkit.entity.Player, java.lang.String, java.lang.String)`
- `public java.lang.String getReason()`
- `public java.lang.String getLeaveMessage()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public void setReason(java.lang.String)`
- `public void setLeaveMessage(java.lang.String)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
