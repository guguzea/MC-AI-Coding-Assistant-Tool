---
title: "org.bukkit.event.player.PlayerEditBookEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/player/PlayerEditBookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerEditBookEvent&#8203;(@NotNull @NotNull Player who, int slot, @NotNull @NotNull BookMeta previousBookMeta, @NotNull @NotNull BookMeta newBookMeta, boolean isSigning)`
- `@NotNull public @NotNull BookMeta getPreviousBookMeta()`
- `@NotNull public @NotNull BookMeta getNewBookMeta()`
- `@Deprecated public int getSlot()`
- `public void setNewBookMeta&#8203;(@NotNull @NotNull BookMeta newBookMeta) throws IllegalArgumentException`
- `public boolean isSigning()`
- `public void setSigning&#8203;(boolean signing)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
