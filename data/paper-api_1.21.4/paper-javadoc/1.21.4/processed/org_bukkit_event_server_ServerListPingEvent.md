---
title: "org.bukkit.event.server.ServerListPingEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/server/ServerListPingEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Deprecated(forRemoval=true) @Internal public ServerListPingEvent(@NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull String motd, int numPlayers, int maxPlayers)`
- `@Deprecated(forRemoval=true) @Internal protected ServerListPingEvent(@NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull String motd, int maxPlayers)`
- `@Deprecated(forRemoval=true) @Internal public ServerListPingEvent(@NotNull @NotNull InetAddress address, @NotNull Component motd, int numPlayers, int maxPlayers)`
- `@Internal public ServerListPingEvent(@NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull Component motd, int numPlayers, int maxPlayers)`
- `@Deprecated(forRemoval=true) @Internal protected ServerListPingEvent(@NotNull @NotNull InetAddress address, @NotNull Component motd, int maxPlayers)`
- `@Internal protected ServerListPingEvent(@NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull Component motd, int maxPlayers)`
- `public @NotNull Component motd()`
- `public void motd(@NotNull Component motd)`
- `@NotNull public @NotNull String getHostname()`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull @Deprecated public @NotNull String getMotd()`
- `@Deprecated public void setMotd(@NotNull @NotNull String motd)`
- `public int getNumPlayers()`
- `public int getMaxPlayers()`
- `@Deprecated(since="1.19.3", forRemoval=true) public boolean shouldSendChatPreviews()`
- `public void setMaxPlayers(int maxPlayers)`
- `public void setServerIcon(@UndefinedNullability("implementation dependent") CachedServerIcon icon) throws IllegalArgumentException, UnsupportedOperationException`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull @Deprecated(forRemoval=true, since="1.20.6") public @NotNull Iterator<Player> iterator() throws UnsupportedOperationException`
