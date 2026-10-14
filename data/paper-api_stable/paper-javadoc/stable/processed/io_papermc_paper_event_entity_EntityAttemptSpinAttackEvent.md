---
title: "io.papermc.paper.event.entity.EntityAttemptSpinAttackEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityAttemptSpinAttackEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityAttemptSpinAttackEvent**
`@NullMarked public class EntityAttemptSpinAttackEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityAttemptSpinAttackEvent(LivingEntity entity, LivingEntity target)`
- `public LivingEntity getEntity()`
- `public LivingEntity getTarget()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
