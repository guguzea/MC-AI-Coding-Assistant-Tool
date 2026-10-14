---
title: "org.bukkit.event.player.AsyncPlayerChatEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/AsyncPlayerChatEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AsyncPlayerChatEvent**
`@Deprecated public class AsyncPlayerChatEvent extends PlayerEvent implements Cancellable`
- `@Internal public AsyncPlayerChatEvent(boolean async, @NotNull @NotNull Player player, @NotNull @NotNull String message, @NotNull @NotNull Set<Player> players)`
- `@NotNull public @NotNull String getMessage()`
- `public void setMessage(@NotNull @NotNull String message)`
- `@NotNull public @NotNull String getFormat()`
- `public void setFormat(@NotNull @NotNull String format) throws IllegalFormatException, NullPointerException`
- `@NotNull public @NotNull Set<Player> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
