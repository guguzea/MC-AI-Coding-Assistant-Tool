---
title: "org.bukkit.event.player.PlayerSignOpenEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.event.player.PlayerSignOpenEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerSignOpenEvent(org.bukkit.entity.Player, org.bukkit.block.Sign, org.bukkit.block.sign.Side, org.bukkit.event.player.PlayerSignOpenEvent$Cause)`
- `public org.bukkit.block.Sign getSign()`
- `public org.bukkit.block.sign.Side getSide()`
- `public org.bukkit.event.player.PlayerSignOpenEvent$Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
