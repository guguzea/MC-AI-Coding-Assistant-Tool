---
title: "org.bukkit.event.player.PlayerMoveEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerMoveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerMoveEvent**
`public class PlayerMoveEvent extends PlayerEvent implements Cancellable`
- `public PlayerMoveEvent(@NotNull Player player, @NotNull Location from, @Nullable Location to)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Location getFrom()`
- `public void setFrom(@NotNull Location from)`
- `@Nullable public Location getTo()`
- `public void setTo(@NotNull Location to)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
