---
title: "io.papermc.paper.event.player.PlayerToggleEntityAgeLockEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerToggleEntityAgeLockEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerToggleEntityAgeLockEvent**
`@NullMarked public class PlayerToggleEntityAgeLockEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerToggleEntityAgeLockEvent(Player player, LivingEntity entity, ItemStack item, EquipmentSlot hand, boolean ageLocked)`
- `public LivingEntity getEntity()`
- `public ItemStack getItem()`
- `public EquipmentSlot getHand()`
- `public boolean isAgeLocked()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
