---
title: "org.bukkit.event.player.PlayerChatEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerChatEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerChatEvent**
`@Deprecated(since="1.3.1") public class PlayerChatEvent extends PlayerEvent implements Cancellable`
- `public PlayerChatEvent(@NotNull Player player, @NotNull String message)`
- `public PlayerChatEvent(@NotNull Player player, @NotNull String message, @NotNull String format, @NotNull Set<Player> recipients)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public String getMessage()`
- `public void setMessage(@NotNull String message)`
- `public void setPlayer(@NotNull Player player)`
- `@NotNull public String getFormat()`
- `public void setFormat(@NotNull String format)`
- `@NotNull public Set<Player> getRecipients()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
