---
title: "io.papermc.paper.event.entity.EntityBreakEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityBreakEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityBreakEvent**
`@NullMarked public class EntityBreakEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityBreakEvent(Entity entity, EntityBreakEvent.RemoveCause cause)`
- `public EntityBreakEvent.RemoveCause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
