---
title: "io.papermc.paper.event.player.PlayerPickItemEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerPickItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerPickItemEvent**
`@NullMarked public abstract class PlayerPickItemEvent extends PlayerEvent implements Cancellable`
- `@Internal protected PlayerPickItemEvent(Player player, ItemStack item, boolean includeData, int targetSlot, int sourceSlot)`
- `public ItemStack getItem()`
- `public boolean isIncludeData()`
- `public @Range(from=0L,to=8L) int getTargetSlot()`
- `public void setTargetSlot(@Range(from=0L,to=8L) int targetSlot)`
- `public @Range(from=-1L,to=35L) int getSourceSlot()`
- `public void setSourceSlot(@Range(from=-1L,to=35L) int sourceSlot)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
