---
title: "io.papermc.paper.event.player.PlayerFlowerPotManipulateEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerFlowerPotManipulateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerFlowerPotManipulateEvent**
`@NullMarked public class PlayerFlowerPotManipulateEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerFlowerPotManipulateEvent(Player player, Block flowerpot, ItemStack item, boolean placing)`
- `public Block getFlowerpot()`
- `public ItemStack getItem()`
- `public boolean isPlacing()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
