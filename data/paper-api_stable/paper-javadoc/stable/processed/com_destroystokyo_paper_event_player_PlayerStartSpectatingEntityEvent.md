---
title: "com.destroystokyo.paper.event.player.PlayerStartSpectatingEntityEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerStartSpectatingEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerStartSpectatingEntityEvent**
`@NullMarked public class PlayerStartSpectatingEntityEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerStartSpectatingEntityEvent(Player player, Entity currentSpectatorTarget, Entity newSpectatorTarget)`
- `public Entity getCurrentSpectatorTarget()`
- `public Entity getNewSpectatorTarget()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
