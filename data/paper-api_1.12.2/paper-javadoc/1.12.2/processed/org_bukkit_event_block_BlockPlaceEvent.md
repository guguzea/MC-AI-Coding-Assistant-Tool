---
title: "org.bukkit.event.block.BlockPlaceEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/event/block/BlockPlaceEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `protected boolean canBuild`
- `protected boolean cancel`
- `protected EquipmentSlot hand`
- `protected ItemStack itemInHand`
- `protected Block placedAgainst`
- `protected Player player`
- `protected BlockState replacedBlockState`
- `boolean canBuild()`
- `Block getBlockAgainst()`
- `Block getBlockPlaced()`
- `BlockState getBlockReplacedState()`
- `EquipmentSlot getHand()`
- `static HandlerList getHandlerList()`
- `HandlerList getHandlers()`
- `ItemStack getItemInHand()`
- `Player getPlayer()`
- `boolean isCancelled()`
- `void setBuild(boolean canBuild)`
- `void setCancelled(boolean cancel)`
