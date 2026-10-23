---
title: "org.bukkit.event.player.PlayerGameModeChangeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerGameModeChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerGameModeChangeEvent(@NotNull @NotNull Player player, @NotNull @NotNull GameMode newGameMode)`
- `public PlayerGameModeChangeEvent(@NotNull @NotNull Player player, @NotNull @NotNull GameMode newGameMode, @NotNull @NotNull PlayerGameModeChangeEvent.Cause cause, @Nullable Component cancelMessage)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull GameMode getNewGameMode()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `@NotNull public @NotNull PlayerGameModeChangeEvent.Cause getCause()`
- `@Nullable public Component cancelMessage()`
- `public void cancelMessage(@Nullable Component message)`
