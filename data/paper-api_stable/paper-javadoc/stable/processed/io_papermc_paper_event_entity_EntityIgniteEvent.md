---
title: "io.papermc.paper.event.entity.EntityIgniteEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityIgniteEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityIgniteEvent**
`@NullMarked public class EntityIgniteEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityIgniteEvent(Entity entity, int fuseTime)`
- `public @Positive int getFuseTime()`
- `public void setFuseTime(@Positive int ticks)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
