---
title: "org.bukkit.event.player.PlayerKickEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
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
