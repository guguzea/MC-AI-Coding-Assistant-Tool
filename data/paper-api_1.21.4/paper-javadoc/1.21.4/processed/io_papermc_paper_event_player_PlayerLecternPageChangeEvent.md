---
title: "io.papermc.paper.event.player.PlayerLecternPageChangeEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/event/player/PlayerLecternPageChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public PlayerLecternPageChangeEvent(Player player, Lectern lectern, ItemStack book, PlayerLecternPageChangeEvent.PageChangeDirection pageChangeDirection, int oldPage, int newPage)`
- `public Lectern getLectern()`
- `public ItemStack getBook()`
- `public PlayerLecternPageChangeEvent.PageChangeDirection getPageChangeDirection()`
- `public int getOldPage()`
- `public int getNewPage()`
- `public void setNewPage(int newPage)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
