---
title: "org.bukkit.event.server.ServerListPingEvent"
package: "org.bukkit.event.server"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.event.server.ServerListPingEvent extends org.bukkit.event.server.ServerEvent implements java.lang.Iterable<org.bukkit.entity.Player>`
- `public org.bukkit.event.server.ServerListPingEvent(java.lang.String, java.net.InetAddress, java.lang.String, int, int)`
- `protected org.bukkit.event.server.ServerListPingEvent(java.lang.String, java.net.InetAddress, java.lang.String, int)`
- `public java.lang.String getHostname()`
- `public java.net.InetAddress getAddress()`
- `public java.lang.String getMotd()`
- `public void setMotd(java.lang.String)`
- `public int getNumPlayers()`
- `public int getMaxPlayers()`
- `public boolean shouldSendChatPreviews()`
- `public void setMaxPlayers(int)`
- `public void setServerIcon(org.bukkit.util.CachedServerIcon) throws java.lang.IllegalArgumentException, java.lang.UnsupportedOperationException`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public java.util.Iterator<org.bukkit.entity.Player> iterator() throws java.lang.UnsupportedOperationException`
