---
title: "org.bukkit.event.player.PlayerAnimationEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerAnimationEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerAnimationEvent**
`public class PlayerAnimationEvent extends PlayerEvent implements Cancellable`
- `@Deprecated(since="1.19") public PlayerAnimationEvent(@NotNull Player player)`
- `public PlayerAnimationEvent(@NotNull Player player, @NotNull PlayerAnimationType playerAnimationType)`
- `@NotNull public PlayerAnimationType getAnimationType()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
