---
title: "io.papermc.paper.event.entity.EntityEffectTickEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityEffectTickEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityEffectTickEvent**
`@NullMarked public class EntityEffectTickEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityEffectTickEvent(LivingEntity entity, PotionEffectType type, int amplifier)`
- `public LivingEntity getEntity()`
- `public PotionEffectType getType()`
- `public int getAmplifier()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
