---
title: "org.bukkit.event.server.ServerListPingEvent"
package: "org.bukkit.event.server"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/server/ServerListPingEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ServerListPingEvent**
`public class ServerListPingEvent extends ServerEvent implements Iterable<Player>`
- `public ServerListPingEvent(@NotNull String hostname, @NotNull InetAddress address, @NotNull String motd, int numPlayers, int maxPlayers)`
- `protected ServerListPingEvent(@NotNull String hostname, @NotNull InetAddress address, @NotNull String motd, int maxPlayers)`
- `@NotNull public String getHostname()`
- `@NotNull public InetAddress getAddress()`
- `@NotNull public String getMotd()`
- `public void setMotd(@NotNull String motd)`
- `public int getNumPlayers()`
- `public int getMaxPlayers()`
- `@Deprecated(since="1.19.3") public boolean shouldSendChatPreviews()`
- `public void setMaxPlayers(int maxPlayers)`
- `public void setServerIcon(CachedServerIcon icon) throws IllegalArgumentException, UnsupportedOperationException`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
- `@NotNull public Iterator<Player> iterator() throws UnsupportedOperationException`
