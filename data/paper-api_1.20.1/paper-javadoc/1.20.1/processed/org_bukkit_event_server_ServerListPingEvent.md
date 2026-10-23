---
title: "org.bukkit.event.server.ServerListPingEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/server/ServerListPingEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public ServerListPingEvent(@NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull String motd, int numPlayers, int maxPlayers)`
- `@Deprecated protected ServerListPingEvent(@NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull @NotNull String motd, int maxPlayers)`
- `@Deprecated public ServerListPingEvent(@NotNull @NotNull InetAddress address, @NotNull Component motd, int numPlayers, int maxPlayers)`
- `public ServerListPingEvent(@NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull Component motd, int numPlayers, int maxPlayers)`
- `@Deprecated protected ServerListPingEvent(@NotNull @NotNull InetAddress address, @NotNull Component motd, int maxPlayers)`
- `protected ServerListPingEvent(@NotNull @NotNull String hostname, @NotNull @NotNull InetAddress address, @NotNull Component motd, int maxPlayers)`
- `public @NotNull Component motd()`
- `public void motd(@NotNull Component motd)`
- `@NotNull public @NotNull String getHostname()`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull @Deprecated public @NotNull String getMotd()`
- `@Deprecated public void setMotd(@NotNull @NotNull String motd)`
- `public int getNumPlayers()`
- `public int getMaxPlayers()`
- `@Deprecated public boolean shouldSendChatPreviews()`
- `public void setMaxPlayers(int maxPlayers)`
- `public void setServerIcon(@UndefinedNullability("implementation dependent") CachedServerIcon icon) throws IllegalArgumentException, UnsupportedOperationException`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public @NotNull Iterator<Player> iterator() throws UnsupportedOperationException`
