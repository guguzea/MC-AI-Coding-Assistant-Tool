---
title: "io.papermc.paper.event.entity.EntityMoveEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/EntityMoveEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityMoveEvent**
`@NullMarked public class EntityMoveEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityMoveEvent(LivingEntity entity, Location from, Location to)`
- `public LivingEntity getEntity()`
- `public Location getFrom()`
- `public void setFrom(Location from)`
- `public Location getTo()`
- `public void setTo(Location to)`
- `public boolean hasChangedPosition()`
- `public boolean hasExplicitlyChangedPosition()`
- `public boolean hasChangedBlock()`
- `public boolean hasExplicitlyChangedBlock()`
- `public boolean hasChangedOrientation()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
