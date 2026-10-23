---
title: "org.bukkit.event.player.PlayerInteractEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/event/player/PlayerInteractEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `protected Action action`
- `protected Block blockClicked`
- `protected BlockFace blockFace`
- `protected ItemStack item`
- `Action getAction()`
- `BlockFace getBlockFace()`
- `Block getClickedBlock()`
- `EquipmentSlot getHand()`
- `static HandlerList getHandlerList()`
- `HandlerList getHandlers()`
- `ItemStack getItem()`
- `Material getMaterial()`
- `boolean hasBlock()`
- `boolean hasItem()`
- `boolean isBlockInHand()`
- `boolean isCancelled()`
- `void setCancelled(boolean cancel)`
- `void setUseInteractedBlock(Event.Result useInteractedBlock)`
- `void setUseItemInHand(Event.Result useItemInHand)`
- `Event.Result useInteractedBlock()`
- `Event.Result useItemInHand()`
