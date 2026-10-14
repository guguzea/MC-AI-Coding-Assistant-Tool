---
title: "org.bukkit.event.entity.EntityTameEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityTameEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityTameEvent**
`public class EntityTameEvent extends EntityEvent implements Cancellable`
- `public EntityTameEvent(@NotNull LivingEntity entity, @NotNull AnimalTamer owner)`
- `@NotNull public LivingEntity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public AnimalTamer getOwner()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
