---
title: "org.bukkit.event.entity.EntityTransformEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityTransformEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityTransformEvent**
`public class EntityTransformEvent extends EntityEvent implements Cancellable`
- `public EntityTransformEvent(@NotNull Entity original, @NotNull List<Entity> convertedList, @NotNull EntityTransformEvent.TransformReason transformReason)`
- `@NotNull public Entity getTransformedEntity()`
- `@NotNull public List<Entity> getTransformedEntities()`
- `@NotNull public EntityTransformEvent.TransformReason getTransformReason()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
