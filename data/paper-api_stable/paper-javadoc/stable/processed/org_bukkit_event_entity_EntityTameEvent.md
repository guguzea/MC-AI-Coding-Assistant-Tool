---
title: "org.bukkit.event.entity.EntityTameEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityTameEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityTameEvent**
`public class EntityTameEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityTameEvent(@NotNull @NotNull LivingEntity entity, @NotNull @NotNull AnimalTamer owner)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@NotNull public @NotNull AnimalTamer getOwner()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
