---
title: "io.papermc.paper.event.player.PlayerItemFrameChangeEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerItemFrameChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerItemFrameChangeEvent**
`@NullMarked public class PlayerItemFrameChangeEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerItemFrameChangeEvent(Player player, ItemFrame itemFrame, ItemStack itemStack, PlayerItemFrameChangeEvent.ItemFrameChangeAction action)`
- `public ItemFrame getItemFrame()`
- `public ItemStack getItemStack()`
- `public void setItemStack(@Nullable ItemStack itemStack)`
- `public PlayerItemFrameChangeEvent.ItemFrameChangeAction getAction()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
