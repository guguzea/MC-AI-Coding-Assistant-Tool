---
title: "com.destroystokyo.paper.event.entity.EntityPathfindEvent"
package: "com.destroystokyo.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/entity/EntityPathfindEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityPathfindEvent**
`@NullMarked public class EntityPathfindEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityPathfindEvent(Entity entity, Location location, @Nullable Entity targetEntity)`
- `public Entity getEntity()`
- `public @Nullable Entity getTargetEntity()`
- `public Location getLoc()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
