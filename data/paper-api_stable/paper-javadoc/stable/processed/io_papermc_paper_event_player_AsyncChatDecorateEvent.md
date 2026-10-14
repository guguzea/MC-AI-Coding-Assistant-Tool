---
title: "io.papermc.paper.event.player.AsyncChatDecorateEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/AsyncChatDecorateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AsyncChatDecorateEvent**
`@Experimental @NullMarked public class AsyncChatDecorateEvent extends ServerEvent implements Cancellable`
- `@Internal public AsyncChatDecorateEvent(@Nullable Player player, Component originalMessage)`
- `public @Nullable Player player()`
- `public Component originalMessage()`
- `public Component result()`
- `public void result(Component result)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
