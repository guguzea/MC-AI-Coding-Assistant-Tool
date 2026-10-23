---
title: "org.bukkit.event.player.PlayerEditBookEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerEditBookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public PlayerEditBookEvent(@NotNull @NotNull Player who, int slot, @NotNull @NotNull BookMeta previousBookMeta, @NotNull @NotNull BookMeta newBookMeta, boolean isSigning)`
- `@NotNull public @NotNull BookMeta getPreviousBookMeta()`
- `@NotNull public @NotNull BookMeta getNewBookMeta()`
- `@Deprecated(since="1.13.1", forRemoval=true) public int getSlot()`
- `public void setNewBookMeta(@NotNull @NotNull BookMeta newBookMeta) throws IllegalArgumentException`
- `public boolean isSigning()`
- `public void setSigning(boolean signing)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
