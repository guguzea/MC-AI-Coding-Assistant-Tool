---
title: "org.bukkit.event.entity.EntityPickupItemEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityPickupItemEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityPickupItemEvent**
`public class EntityPickupItemEvent extends EntityEvent implements Cancellable`
- `public EntityPickupItemEvent(@NotNull LivingEntity entity, @NotNull Item item, int remaining)`
- `@NotNull public LivingEntity getEntity()`
- `@NotNull public Item getItem()`
- `public int getRemaining()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
