---
title: "org.bukkit.event.player.PlayerGameModeChangeEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerGameModeChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerGameModeChangeEvent**
`public class PlayerGameModeChangeEvent extends PlayerEvent implements Cancellable`
- `public PlayerGameModeChangeEvent(@NotNull Player player, @NotNull GameMode newGameMode)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public GameMode getNewGameMode()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
