---
title: "com.destroystokyo.paper.event.player.PlayerElytraBoostEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerElytraBoostEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerElytraBoostEvent**
`@NullMarked public class PlayerElytraBoostEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerElytraBoostEvent(Player player, ItemStack itemStack, Firework firework, EquipmentSlot hand)`
- `public ItemStack getItemStack()`
- `public Firework getFirework()`
- `public boolean shouldConsume()`
- `public void setShouldConsume(boolean consume)`
- `public EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
