---
title: "org.bukkit.event.player.AsyncPlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.event.player.AsyncPlayerPreLoginEvent extends org.bukkit.event.Event`
- `public org.bukkit.event.player.AsyncPlayerPreLoginEvent(java.lang.String, java.net.InetAddress)`
- `public org.bukkit.event.player.AsyncPlayerPreLoginEvent(java.lang.String, java.net.InetAddress, java.util.UUID)`
- `public org.bukkit.event.player.AsyncPlayerPreLoginEvent(java.lang.String, java.net.InetAddress, java.util.UUID, boolean)`
- `public org.bukkit.event.player.AsyncPlayerPreLoginEvent$Result getLoginResult()`
- `public org.bukkit.event.player.PlayerPreLoginEvent$Result getResult()`
- `public void setLoginResult(org.bukkit.event.player.AsyncPlayerPreLoginEvent$Result)`
- `public void setResult(org.bukkit.event.player.PlayerPreLoginEvent$Result)`
- `public java.lang.String getKickMessage()`
- `public void setKickMessage(java.lang.String)`
- `public void allow()`
- `public void disallow(org.bukkit.event.player.AsyncPlayerPreLoginEvent$Result, java.lang.String)`
- `public void disallow(org.bukkit.event.player.PlayerPreLoginEvent$Result, java.lang.String)`
- `public java.lang.String getName()`
- `public java.net.InetAddress getAddress()`
- `public java.util.UUID getUniqueId()`
- `public boolean isTransferred()`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
