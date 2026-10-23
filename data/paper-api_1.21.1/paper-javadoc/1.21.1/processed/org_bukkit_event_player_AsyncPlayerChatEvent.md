---
title: "org.bukkit.event.player.AsyncPlayerChatEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/AsyncPlayerChatEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public AsyncPlayerChatEvent(boolean async, @NotNull @NotNull Player who, @NotNull @NotNull String message, @NotNull @NotNull Set<Player> players)`
- `@NotNull public @NotNull String getMessage()`
- `public void setMessage(@NotNull @NotNull String message)`
- `@NotNull public @NotNull String getFormat()`
- `public void setFormat(@NotNull @NotNull String format) throws IllegalFormatException, NullPointerException`
- `@NotNull public @NotNull Set<Player> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
