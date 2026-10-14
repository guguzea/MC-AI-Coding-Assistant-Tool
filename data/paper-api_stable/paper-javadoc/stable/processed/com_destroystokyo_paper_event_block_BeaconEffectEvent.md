---
title: "com.destroystokyo.paper.event.block.BeaconEffectEvent"
package: "com.destroystokyo.paper.event.block"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/block/BeaconEffectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class BeaconEffectEvent**
`@NullMarked public class BeaconEffectEvent extends BlockEvent implements Cancellable`
- `@Internal public BeaconEffectEvent(Block beacon, PotionEffect effect, Player player, boolean primary)`
- `public PotionEffect getEffect()`
- `public void setEffect(PotionEffect effect)`
- `public Player getPlayer()`
- `public boolean isPrimary()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
