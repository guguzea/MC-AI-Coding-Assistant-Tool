---
title: "io.papermc.paper.event.player.PlayerSwapWithEquipmentSlotEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerSwapWithEquipmentSlotEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerSwapWithEquipmentSlotEvent**
`@NullMarked public class PlayerSwapWithEquipmentSlotEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerSwapWithEquipmentSlotEvent(Player player, ItemStack itemInHand, EquipmentSlot slot, ItemStack itemToSwap)`
- `public ItemStack getItemInHand()`
- `public EquipmentSlot getSlot()`
- `public ItemStack getItemToSwap()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
