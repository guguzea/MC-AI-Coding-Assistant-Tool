---
title: "io.papermc.paper.event.player.PlayerItemFrameChangeEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/event/player/PlayerItemFrameChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Internal public PlayerItemFrameChangeEvent(Player player, ItemFrame itemFrame, ItemStack itemStack, PlayerItemFrameChangeEvent.ItemFrameChangeAction action)`
- `public ItemFrame getItemFrame()`
- `public ItemStack getItemStack()`
- `public void setItemStack(@Nullable ItemStack itemStack)`
- `public PlayerItemFrameChangeEvent.ItemFrameChangeAction getAction()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
