---
title: "io.papermc.paper.event.player.PlayerLecternPageChangeEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerLecternPageChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerLecternPageChangeEvent(@NotNull @NotNull Player player, @NotNull @NotNull Lectern lectern, @NotNull @NotNull ItemStack book, @NotNull @NotNull PlayerLecternPageChangeEvent.PageChangeDirection pageChangeDirection, int oldPage, int newPage)`
- `@NotNull public @NotNull Lectern getLectern()`
- `@NotNull public @NotNull ItemStack getBook()`
- `@NotNull public @NotNull PlayerLecternPageChangeEvent.PageChangeDirection getPageChangeDirection()`
- `public int getOldPage()`
- `public int getNewPage()`
- `public void setNewPage(int newPage)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
