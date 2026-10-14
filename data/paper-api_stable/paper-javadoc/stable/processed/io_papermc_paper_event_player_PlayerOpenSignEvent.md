---
title: "io.papermc.paper.event.player.PlayerOpenSignEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerOpenSignEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerOpenSignEvent**
`@NullMarked public class PlayerOpenSignEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerOpenSignEvent(Player editor, Sign sign, Side side, PlayerOpenSignEvent.Cause cause)`
- `public Sign getSign()`
- `public Side getSide()`
- `public PlayerOpenSignEvent.Cause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
