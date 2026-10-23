---
title: "org.bukkit.event.player.PlayerGameModeChangeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerGameModeChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerGameModeChangeEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull GameMode newGameMode)`
- `public PlayerGameModeChangeEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull GameMode newGameMode, @NotNull @NotNull PlayerGameModeChangeEvent.Cause cause, @Nullable Component cancelMessage)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull GameMode getNewGameMode()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public @NotNull PlayerGameModeChangeEvent.Cause getCause()`
- `@Nullable public Component cancelMessage()`
- `public void cancelMessage&#8203;(@Nullable Component message)`
