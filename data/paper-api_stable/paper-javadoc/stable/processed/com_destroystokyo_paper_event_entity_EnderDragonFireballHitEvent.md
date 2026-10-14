---
title: "com.destroystokyo.paper.event.entity.EnderDragonFireballHitEvent"
package: "com.destroystokyo.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/entity/EnderDragonFireballHitEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EnderDragonFireballHitEvent**
`@NullMarked public class EnderDragonFireballHitEvent extends EntityEvent implements Cancellable`
- `@Internal public EnderDragonFireballHitEvent(DragonFireball fireball, Collection<LivingEntity> targets, AreaEffectCloud areaEffectCloud)`
- `public DragonFireball getEntity()`
- `public Collection<LivingEntity> getTargets()`
- `public AreaEffectCloud getAreaEffectCloud()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
