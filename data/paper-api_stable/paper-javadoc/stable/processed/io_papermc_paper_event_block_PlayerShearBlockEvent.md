---
title: "io.papermc.paper.event.block.PlayerShearBlockEvent"
package: "io.papermc.paper.event.block"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/block/PlayerShearBlockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerShearBlockEvent**
`@NullMarked public class PlayerShearBlockEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerShearBlockEvent(Player player, Block block, ItemStack item, EquipmentSlot hand, List<ItemStack> drops)`
- `public Block getBlock()`
- `public ItemStack getItem()`
- `public EquipmentSlot getHand()`
- `public List<ItemStack> getDrops()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
