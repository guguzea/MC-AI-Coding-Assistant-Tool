---
title: "io.papermc.paper.event.player.PlayerInsertLecternBookEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerInsertLecternBookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerInsertLecternBookEvent**
`@NullMarked public class PlayerInsertLecternBookEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerInsertLecternBookEvent(Player player, Block block, ItemStack book)`
- `public Block getBlock()`
- `public Lectern getLectern()`
- `public ItemStack getBook()`
- `public void setBook(ItemStack book)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
