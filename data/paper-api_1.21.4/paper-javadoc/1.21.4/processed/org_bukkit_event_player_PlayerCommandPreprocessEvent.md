---
title: "org.bukkit.event.player.PlayerCommandPreprocessEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerCommandPreprocessEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public PlayerCommandPreprocessEvent(@NotNull @NotNull Player player, @NotNull @NotNull String message)`
- `public PlayerCommandPreprocessEvent(@NotNull @NotNull Player player, @NotNull @NotNull String message, @NotNull @NotNull Set<Player> recipients)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull String getMessage()`
- `public void setMessage(@NotNull @NotNull String command) throws IllegalArgumentException`
- `@Deprecated(forRemoval=true) public void setPlayer(@NotNull @NotNull Player player) throws IllegalArgumentException`
- `@NotNull @Deprecated(since="1.3.1", forRemoval=true) public @NotNull Set<Player> getRecipients()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
