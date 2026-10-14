---
title: "org.bukkit.event.entity.EntityBreedEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntityBreedEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntityBreedEvent**
`public class EntityBreedEvent extends EntityEvent implements Cancellable`
- `@Internal public EntityBreedEvent(@NotNull @NotNull LivingEntity child, @NotNull @NotNull LivingEntity mother, @NotNull @NotNull LivingEntity father, @Nullable @Nullable LivingEntity breeder, @Nullable @Nullable ItemStack bredWith, int experience)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@NotNull public @NotNull LivingEntity getMother()`
- `@NotNull public @NotNull LivingEntity getFather()`
- `@Nullable public @Nullable LivingEntity getBreeder()`
- `@Nullable public @Nullable ItemStack getBredWith()`
- `public int getExperience()`
- `public void setExperience(int experience)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
