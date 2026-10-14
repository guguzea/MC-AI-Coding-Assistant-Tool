---
title: "io.papermc.paper.event.player.PlayerInventorySlotChangeEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerInventorySlotChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerInventorySlotChangeEvent**
`@NullMarked public class PlayerInventorySlotChangeEvent extends PlayerEvent`
- `public PlayerInventorySlotChangeEvent(Player player, int rawSlot, ItemStack oldItemStack, ItemStack newItemStack)`
- `public int getRawSlot()`
- `public int getSlot()`
- `public ItemStack getOldItemStack()`
- `public ItemStack getNewItemStack()`
- `public boolean shouldTriggerAdvancements()`
- `public void setShouldTriggerAdvancements(boolean triggerAdvancements)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
