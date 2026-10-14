---
title: "org.bukkit.event.entity.EntityResurrectEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityResurrectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityResurrectEvent**
`public class EntityResurrectEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityResurrectEvent(@NotNull @NotNull LivingEntity livingEntity, @Nullable @Nullable EquipmentSlot hand)`
- `@Internal @Deprecated(since="1.19.2", forRemoval=true) public EntityResurrectEvent(@NotNull @NotNull LivingEntity livingEntity)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@Nullable public @Nullable EquipmentSlot getHand()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
