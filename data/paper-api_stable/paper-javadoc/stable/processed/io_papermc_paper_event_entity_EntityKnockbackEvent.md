---
title: "io.papermc.paper.event.entity.EntityKnockbackEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityKnockbackEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityKnockbackEvent**
`@NullMarked public class EntityKnockbackEvent extends EntityEvent implements Cancellable`
- `protected Vector knockback`
- `@Internal public EntityKnockbackEvent(Entity entity, EntityKnockbackEvent.Cause cause, Vector knockback)`
- `public EntityKnockbackEvent.Cause getCause()`
- `public Vector getKnockback()`
- `public void setKnockback(Vector knockback)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
