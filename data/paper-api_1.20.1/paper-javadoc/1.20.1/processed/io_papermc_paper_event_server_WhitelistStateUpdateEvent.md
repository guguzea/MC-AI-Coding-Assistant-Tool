---
title: "io.papermc.paper.event.server.WhitelistStateUpdateEvent"
package: "io.papermc.paper.event.server"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/server/WhitelistStateUpdateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public WhitelistStateUpdateEvent(@NotNull @NotNull PlayerProfile who, @NotNull @NotNull WhitelistStateUpdateEvent.WhitelistStatus status)`
- `@NotNull public @NotNull OfflinePlayer getPlayer()`
- `@NotNull public @NotNull PlayerProfile getPlayerProfile()`
- `@NotNull public @NotNull WhitelistStateUpdateEvent.WhitelistStatus getStatus()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
