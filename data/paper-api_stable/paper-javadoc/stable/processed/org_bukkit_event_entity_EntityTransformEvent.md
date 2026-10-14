---
title: "org.bukkit.event.entity.EntityTransformEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityTransformEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityTransformEvent**
`@NullMarked public class EntityTransformEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityTransformEvent(Entity original, List<Entity> transformedEntities, EntityTransformEvent.TransformReason transformReason)`
- `public List<Entity> getTransformedEntities()`
- `public Entity getTransformedEntity()`
- `public EntityTransformEvent.TransformReason getTransformReason()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
