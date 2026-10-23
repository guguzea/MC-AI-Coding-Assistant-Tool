---
title: "org.bukkit.event.player.PlayerCommandPreprocessEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerCommandPreprocessEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerCommandPreprocessEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull String message)`
- `public PlayerCommandPreprocessEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull String message, @NotNull @NotNull Set<Player> recipients)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull String getMessage()`
- `public void setMessage&#8203;(@NotNull @NotNull String command) throws IllegalArgumentException`
- `public void setPlayer&#8203;(@NotNull @NotNull Player player) throws IllegalArgumentException`
- `@NotNull @Deprecated public @NotNull Set<Player> getRecipients()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
