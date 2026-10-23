---
title: "io.papermc.paper.event.entity.EntityFertilizeEggEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/entity/EntityFertilizeEggEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EntityFertilizeEggEvent(@NotNull @NotNull LivingEntity mother, @NotNull @NotNull LivingEntity father, @Nullable @Nullable Player breeder, @Nullable @Nullable ItemStack bredWith, int experience)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@NotNull public @NotNull LivingEntity getMother()`
- `@NotNull public @NotNull LivingEntity getFather()`
- `@Nullable public @Nullable Player getBreeder()`
- `@Nullable public @Nullable ItemStack getBredWith()`
- `public int getExperience()`
- `public void setExperience(int experience)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
