---
title: "org.bukkit.event.player.PlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.event.player.PlayerPreLoginEvent extends org.bukkit.event.Event`
- `public org.bukkit.event.player.PlayerPreLoginEvent(java.lang.String, java.net.InetAddress)`
- `public org.bukkit.event.player.PlayerPreLoginEvent(java.lang.String, java.net.InetAddress, java.util.UUID)`
- `public org.bukkit.event.player.PlayerPreLoginEvent$Result getResult()`
- `public void setResult(org.bukkit.event.player.PlayerPreLoginEvent$Result)`
- `public java.lang.String getKickMessage()`
- `public void setKickMessage(java.lang.String)`
- `public void allow()`
- `public void disallow(org.bukkit.event.player.PlayerPreLoginEvent$Result, java.lang.String)`
- `public java.lang.String getName()`
- `public java.net.InetAddress getAddress()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public java.util.UUID getUniqueId()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
