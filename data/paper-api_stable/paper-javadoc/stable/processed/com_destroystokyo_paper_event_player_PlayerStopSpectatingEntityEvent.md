---
title: "com.destroystokyo.paper.event.player.PlayerStopSpectatingEntityEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerStopSpectatingEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerStopSpectatingEntityEvent**
`@NullMarked public class PlayerStopSpectatingEntityEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerStopSpectatingEntityEvent(Player player, Entity spectatorTarget)`
- `public Entity getSpectatorTarget()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
