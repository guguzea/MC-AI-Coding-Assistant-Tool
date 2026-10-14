---
title: "org.bukkit.event.player.PlayerGameModeChangeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerGameModeChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerGameModeChangeEvent**
`public class PlayerGameModeChangeEvent extends PlayerEvent implements Cancellable`
- `@Internal @Deprecated(forRemoval=true) public PlayerGameModeChangeEvent(@NotNull @NotNull Player player, @NotNull @NotNull GameMode newGameMode)`
- `@Internal public PlayerGameModeChangeEvent(@NotNull @NotNull Player player, @NotNull @NotNull GameMode newGameMode, @NotNull @NotNull PlayerGameModeChangeEvent.Cause cause, @Nullable Component cancelMessage)`
- `@NotNull public @NotNull GameMode getNewGameMode()`
- `@NotNull public @NotNull PlayerGameModeChangeEvent.Cause getCause()`
- `@Nullable public @Nullable Component cancelMessage()`
- `public void cancelMessage(@Nullable @Nullable Component message)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
