---
title: "org.bukkit.event.server.ServerListPingEvent"
package: "org.bukkit.event.server"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/server/ServerListPingEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public ServerListPingEvent&#8203;(@NotNull @NotNull InetAddress address, @NotNull @NotNull String motd, int numPlayers, int maxPlayers)`
- `@Deprecated protected ServerListPingEvent&#8203;(@NotNull @NotNull InetAddress address, @NotNull @NotNull String motd, int maxPlayers)`
- `public ServerListPingEvent&#8203;(@NotNull @NotNull InetAddress address, @NotNull Component motd, int numPlayers, int maxPlayers)`
- `protected ServerListPingEvent&#8203;(@NotNull @NotNull InetAddress address, @NotNull Component motd, int maxPlayers)`
- `@NotNull public Component motd()`
- `public void motd&#8203;(@NotNull Component motd)`
- `@NotNull public @NotNull InetAddress getAddress()`
- `@NotNull @Deprecated public @NotNull String getMotd()`
- `@Deprecated public void setMotd&#8203;(@NotNull @NotNull String motd)`
- `public int getNumPlayers()`
- `public int getMaxPlayers()`
- `public void setMaxPlayers&#8203;(int maxPlayers)`
- `public void setServerIcon&#8203;(CachedServerIcon icon) throws IllegalArgumentException, UnsupportedOperationException`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public @NotNull Iterator<Player> iterator() throws UnsupportedOperationException`
