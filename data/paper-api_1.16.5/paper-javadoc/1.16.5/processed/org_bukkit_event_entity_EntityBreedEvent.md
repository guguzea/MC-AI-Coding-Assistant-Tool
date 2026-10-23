---
title: "org.bukkit.event.entity.EntityBreedEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/EntityBreedEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public EntityBreedEvent&#8203;(@NotNull @NotNull LivingEntity child, @NotNull @NotNull LivingEntity mother, @NotNull @NotNull LivingEntity father, @Nullable @Nullable LivingEntity breeder, @Nullable @Nullable ItemStack bredWith, int experience)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@NotNull public @NotNull LivingEntity getMother()`
- `@NotNull public @NotNull LivingEntity getFather()`
- `@Nullable public @Nullable LivingEntity getBreeder()`
- `@Nullable public @Nullable ItemStack getBredWith()`
- `public int getExperience()`
- `public void setExperience&#8203;(int experience)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
