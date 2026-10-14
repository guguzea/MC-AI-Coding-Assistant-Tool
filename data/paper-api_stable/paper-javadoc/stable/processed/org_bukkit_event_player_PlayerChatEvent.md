---
title: "org.bukkit.event.player.PlayerChatEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerChatEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerChatEvent**
`@Deprecated(since="1.3.1") public class PlayerChatEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerChatEvent(@NotNull @NotNull Player player, @NotNull @NotNull String message)`
- `@Internal public PlayerChatEvent(@NotNull @NotNull Player player, @NotNull @NotNull String message, @NotNull @NotNull String format, @NotNull @NotNull Set<Player> recipients)`
- `@NotNull public @NotNull String getMessage()`
- `public void setMessage(@NotNull @NotNull String message)`
- `public void setPlayer(@NotNull @NotNull Player player)`
- `@NotNull public @NotNull String getFormat()`
- `public void setFormat(@NotNull @NotNull String format)`
- `@NotNull public @NotNull Set<Player> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
