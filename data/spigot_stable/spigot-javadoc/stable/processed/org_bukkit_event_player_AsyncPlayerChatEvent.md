---
title: "org.bukkit.event.player.AsyncPlayerChatEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/AsyncPlayerChatEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class AsyncPlayerChatEvent**
`public class AsyncPlayerChatEvent extends PlayerEvent implements Cancellable`
- `public AsyncPlayerChatEvent(boolean async, @NotNull Player who, @NotNull String message, @NotNull Set<Player> players)`
- `@NotNull public String getMessage()`
- `public void setMessage(@NotNull String message)`
- `@NotNull public String getFormat()`
- `public void setFormat(@NotNull String format) throws IllegalFormatException, NullPointerException`
- `@NotNull public Set<Player> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
