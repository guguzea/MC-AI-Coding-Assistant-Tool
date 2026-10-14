---
title: "org.bukkit.event.entity.EntityBreedEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntityBreedEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntityBreedEvent**
`public class EntityBreedEvent extends EntityEvent implements Cancellable`
- `public EntityBreedEvent(@NotNull LivingEntity child, @NotNull LivingEntity mother, @NotNull LivingEntity father, @Nullable LivingEntity breeder, @Nullable ItemStack bredWith, int experience)`
- `@NotNull public LivingEntity getEntity()`
- `@NotNull public LivingEntity getMother()`
- `@NotNull public LivingEntity getFather()`
- `@Nullable public LivingEntity getBreeder()`
- `@Nullable public ItemStack getBredWith()`
- `public int getExperience()`
- `public void setExperience(int experience)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
