---
title: "org.bukkit.event.player.PlayerCommandPreprocessEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerCommandPreprocessEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerCommandPreprocessEvent**
`public class PlayerCommandPreprocessEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerCommandPreprocessEvent(@NotNull @NotNull Player player, @NotNull @NotNull String message)`
- `@Internal public PlayerCommandPreprocessEvent(@NotNull @NotNull Player player, @NotNull @NotNull String message, @NotNull @NotNull Set<Player> recipients)`
- `@NotNull public @NotNull String getMessage()`
- `public void setMessage(@NotNull @NotNull String command) throws IllegalArgumentException`
- `@NotNull @Deprecated(since="1.3.1", forRemoval=true) public @NotNull Set<Player> getRecipients()`
- `@Deprecated(forRemoval=true) public void setPlayer(@NotNull @NotNull Player player) throws IllegalArgumentException`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
