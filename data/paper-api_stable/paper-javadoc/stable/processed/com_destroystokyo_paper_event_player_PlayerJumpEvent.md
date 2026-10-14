---
title: "com.destroystokyo.paper.event.player.PlayerJumpEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerJumpEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerJumpEvent**
`@NullMarked public class PlayerJumpEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerJumpEvent(Player player, Location from, Location to)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public Location getFrom()`
- `public void setFrom(Location from)`
- `public Location getTo()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
