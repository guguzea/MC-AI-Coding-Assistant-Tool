---
title: "org.bukkit.event.player.PlayerLoginEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.player.PlayerLoginEvent extends org.bukkit.event.player.PlayerEvent`
- `public org.bukkit.event.player.PlayerLoginEvent(org.bukkit.entity.Player, java.lang.String, java.net.InetAddress, java.net.InetAddress)`
- `public org.bukkit.event.player.PlayerLoginEvent(org.bukkit.entity.Player, java.lang.String, java.net.InetAddress)`
- `public org.bukkit.event.player.PlayerLoginEvent(org.bukkit.entity.Player, java.lang.String, java.net.InetAddress, org.bukkit.event.player.PlayerLoginEvent$Result, java.lang.String, java.net.InetAddress)`
- `public java.net.InetAddress getRealAddress()`
- `public org.bukkit.event.player.PlayerLoginEvent$Result getResult()`
- `public void setResult(org.bukkit.event.player.PlayerLoginEvent$Result)`
- `public java.lang.String getKickMessage()`
- `public void setKickMessage(java.lang.String)`
- `public java.lang.String getHostname()`
- `public void allow()`
- `public void disallow(org.bukkit.event.player.PlayerLoginEvent$Result, java.lang.String)`
- `public java.net.InetAddress getAddress()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
