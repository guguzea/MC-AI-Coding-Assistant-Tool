---
title: "org.bukkit.event.player.PlayerEditBookEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerEditBookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerEditBookEvent**
`public class PlayerEditBookEvent extends PlayerEvent implements Cancellable`
- `public PlayerEditBookEvent(@NotNull Player who, int slot, @NotNull BookMeta previousBookMeta, @NotNull BookMeta newBookMeta, boolean isSigning)`
- `@NotNull public BookMeta getPreviousBookMeta()`
- `@NotNull public BookMeta getNewBookMeta()`
- `@Deprecated(since="1.13.1") public int getSlot()`
- `public void setNewBookMeta(@NotNull BookMeta newBookMeta) throws IllegalArgumentException`
- `public boolean isSigning()`
- `public void setSigning(boolean signing)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
