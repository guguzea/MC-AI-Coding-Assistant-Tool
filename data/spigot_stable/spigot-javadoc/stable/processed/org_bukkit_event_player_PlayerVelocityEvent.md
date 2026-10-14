---
title: "org.bukkit.event.player.PlayerVelocityEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerVelocityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerVelocityEvent**
`public class PlayerVelocityEvent extends PlayerEvent implements Cancellable`
- `public PlayerVelocityEvent(@NotNull Player player, @NotNull Vector velocity)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Vector getVelocity()`
- `public void setVelocity(@NotNull Vector velocity)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
