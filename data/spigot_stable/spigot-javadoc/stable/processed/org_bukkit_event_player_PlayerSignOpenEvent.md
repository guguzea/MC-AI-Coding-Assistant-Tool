---
title: "org.bukkit.event.player.PlayerSignOpenEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerSignOpenEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerSignOpenEvent**
`public class PlayerSignOpenEvent extends PlayerEvent implements Cancellable`
- `public PlayerSignOpenEvent(@NotNull Player player, @NotNull Sign sign, @NotNull Side side, @NotNull PlayerSignOpenEvent.Cause cause)`
- `@NotNull public Sign getSign()`
- `@NotNull public Side getSide()`
- `@NotNull public PlayerSignOpenEvent.Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
