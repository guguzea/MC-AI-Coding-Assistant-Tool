---
title: "io.papermc.paper.event.packet.UncheckedSignChangeEvent"
package: "io.papermc.paper.event.packet"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/packet/UncheckedSignChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class UncheckedSignChangeEvent**
`@NullMarked public class UncheckedSignChangeEvent extends PlayerEvent implements Cancellable`
- `@Internal public UncheckedSignChangeEvent(Player editor, BlockPosition editedBlockPosition, Side side, List<Component> lines)`
- `public BlockPosition getEditedBlockPosition()`
- `public Side getSide()`
- `public @Unmodifiable List<Component> lines()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
