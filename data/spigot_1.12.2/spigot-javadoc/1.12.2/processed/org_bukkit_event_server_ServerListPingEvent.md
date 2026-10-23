---
title: "org.bukkit.event.server.ServerListPingEvent"
package: "org.bukkit.event.server"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.server.ServerListPingEvent extends org.bukkit.event.server.ServerEvent implements java.lang.Iterable<org.bukkit.entity.Player>`
- `public org.bukkit.event.server.ServerListPingEvent(java.net.InetAddress, java.lang.String, int, int)`
- `protected org.bukkit.event.server.ServerListPingEvent(java.net.InetAddress, java.lang.String, int)`
- `public java.net.InetAddress getAddress()`
- `public java.lang.String getMotd()`
- `public void setMotd(java.lang.String)`
- `public int getNumPlayers()`
- `public int getMaxPlayers()`
- `public void setMaxPlayers(int)`
- `public void setServerIcon(org.bukkit.util.CachedServerIcon) throws java.lang.IllegalArgumentException, java.lang.UnsupportedOperationException`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public java.util.Iterator<org.bukkit.entity.Player> iterator() throws java.lang.UnsupportedOperationException`
