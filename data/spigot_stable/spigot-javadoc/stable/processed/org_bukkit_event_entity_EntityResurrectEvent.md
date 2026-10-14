---
title: "org.bukkit.event.entity.EntityResurrectEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityResurrectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityResurrectEvent**
`public class EntityResurrectEvent extends EntityEvent implements Cancellable`
- `public EntityResurrectEvent(@NotNull LivingEntity what, @Nullable EquipmentSlot hand)`
- `@Deprecated(since="1.19.2") public EntityResurrectEvent(@NotNull LivingEntity what)`
- `@NotNull public LivingEntity getEntity()`
- `@Nullable public EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
