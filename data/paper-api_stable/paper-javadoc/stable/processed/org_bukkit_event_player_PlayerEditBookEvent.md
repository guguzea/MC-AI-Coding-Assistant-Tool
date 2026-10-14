---
title: "org.bukkit.event.player.PlayerEditBookEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerEditBookEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerEditBookEvent**
`public class PlayerEditBookEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerEditBookEvent(@NotNull @NotNull Player player, int slot, @NotNull @NotNull BookMeta previousBookMeta, @NotNull @NotNull BookMeta newBookMeta, boolean isSigning)`
- `@NotNull public @NotNull BookMeta getPreviousBookMeta()`
- `@NotNull public @NotNull BookMeta getNewBookMeta()`
- `@Deprecated(since="1.13.1", forRemoval=true) public int getSlot()`
- `public void setNewBookMeta(@NotNull @NotNull BookMeta newBookMeta) throws IllegalArgumentException`
- `public boolean isSigning()`
- `public void setSigning(boolean signing)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
