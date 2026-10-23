---
title: "io.papermc.paper.event.player.PlayerInventorySlotChangeEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/event/player/PlayerInventorySlotChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public PlayerInventorySlotChangeEvent(Player player, int rawSlot, ItemStack oldItemStack, ItemStack newItemStack)`
- `public int getRawSlot()`
- `public int getSlot()`
- `public ItemStack getOldItemStack()`
- `public ItemStack getNewItemStack()`
- `public boolean shouldTriggerAdvancements()`
- `public void setShouldTriggerAdvancements(boolean triggerAdvancements)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
