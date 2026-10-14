---
title: "org.bukkit.event.player.PlayerCommandPreprocessEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerCommandPreprocessEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerCommandPreprocessEvent**
`public class PlayerCommandPreprocessEvent extends PlayerEvent implements Cancellable`
- `public PlayerCommandPreprocessEvent(@NotNull Player player, @NotNull String message)`
- `public PlayerCommandPreprocessEvent(@NotNull Player player, @NotNull String message, @NotNull Set<Player> recipients)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public String getMessage()`
- `public void setMessage(@NotNull String command) throws IllegalArgumentException`
- `public void setPlayer(@NotNull Player player) throws IllegalArgumentException`
- `@NotNull @Deprecated(since="1.3.1") public Set<Player> getRecipients()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
