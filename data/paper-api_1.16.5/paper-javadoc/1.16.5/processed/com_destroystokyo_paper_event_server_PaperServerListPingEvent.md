---
title: "com.destroystokyo.paper.event.server.PaperServerListPingEvent"
package: "com.destroystokyo.paper.event.server"
source: https://jd.papermc.io/paper/1.16.5/com/destroystokyo/paper/event/server/PaperServerListPingEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public PaperServerListPingEvent&#8203;(@NotNull @NotNull StatusClient client, @NotNull @NotNull String motd, int numPlayers, int maxPlayers, @NotNull @NotNull String version, int protocolVersion, @Nullable @Nullable CachedServerIcon favicon)`
- `public PaperServerListPingEvent&#8203;(@NotNull @NotNull StatusClient client, @NotNull Component motd, int numPlayers, int maxPlayers, @NotNull @NotNull String version, int protocolVersion, @Nullable @Nullable CachedServerIcon favicon)`
- `@NotNull public @NotNull StatusClient getClient()`
- `public int getNumPlayers()`
- `public void setNumPlayers&#8203;(int numPlayers)`
- `public int getMaxPlayers()`
- `public boolean shouldHidePlayers()`
- `public void setHidePlayers&#8203;(boolean hidePlayers)`
- `@NotNull public @NotNull List<PlayerProfile> getPlayerSample()`
- `@NotNull public @NotNull String getVersion()`
- `public void setVersion&#8203;(@NotNull @NotNull String version)`
- `public int getProtocolVersion()`
- `public void setProtocolVersion&#8203;(int protocolVersion)`
- `@Nullable public @Nullable CachedServerIcon getServerIcon()`
- `public void setServerIcon&#8203;(@Nullable @Nullable CachedServerIcon icon)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull Iterator<Player> iterator()`
- `@NotNull protected @NotNull Object[] getOnlinePlayers()`
- `@NotNull protected @NotNull Player getBukkitPlayer&#8203;(@NotNull @NotNull Object player)`
