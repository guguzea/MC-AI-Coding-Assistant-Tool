---
title: "com.destroystokyo.paper.event.server.PaperServerListPingEvent"
package: "com.destroystokyo.paper.event.server"
source: https://jd.papermc.io/paper/1.21.1/com/destroystokyo/paper/event/server/PaperServerListPingEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated @Internal public PaperServerListPingEvent(@NotNull @NotNull StatusClient client, @NotNull @NotNull String motd, int numPlayers, int maxPlayers, @NotNull @NotNull String version, int protocolVersion, @Nullable @Nullable CachedServerIcon favicon)`
- `@Internal public PaperServerListPingEvent(@NotNull @NotNull StatusClient client, @NotNull Component motd, int numPlayers, int maxPlayers, @NotNull @NotNull String version, int protocolVersion, @Nullable @Nullable CachedServerIcon favicon)`
- `@NotNull public @NotNull StatusClient getClient()`
- `public int getNumPlayers()`
- `public void setNumPlayers(int numPlayers)`
- `public int getMaxPlayers()`
- `public boolean shouldHidePlayers()`
- `public void setHidePlayers(boolean hidePlayers)`
- `@NotNull public @NotNull List<PaperServerListPingEvent.ListedPlayerInfo> getListedPlayers()`
- `@NotNull @Deprecated(forRemoval=true, since="1.20.6") public @NotNull List<PlayerProfile> getPlayerSample()`
- `@NotNull public @NotNull String getVersion()`
- `public void setVersion(@NotNull @NotNull String version)`
- `public int getProtocolVersion()`
- `public void setProtocolVersion(int protocolVersion)`
- `@Nullable public @Nullable CachedServerIcon getServerIcon()`
- `public void setServerIcon(@Nullable @Nullable CachedServerIcon icon)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull @Deprecated(forRemoval=true, since="1.20.6") public @NotNull Iterator<Player> iterator()`
- `@NotNull protected @NotNull Object[] getOnlinePlayers()`
- `@NotNull protected @NotNull Player getBukkitPlayer(@NotNull @NotNull Object player)`
