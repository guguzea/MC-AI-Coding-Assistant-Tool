---
title: "io.papermc.paper.event.entity.WaterBottleSplashEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/entity/WaterBottleSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public WaterBottleSplashEvent(@NotNull @NotNull ThrownPotion potion, @NotNull @NotNull Map<LivingEntity,Double> affectedEntities, @NotNull @NotNull Set<LivingEntity> rehydrate, @NotNull @NotNull Set<LivingEntity> extinguish)`
- `@NotNull public @NotNull @Unmodifiable Collection<LivingEntity> getToDamage()`
- `public void doNotDamageAsWaterSensitive(@NotNull @NotNull LivingEntity entity)`
- `public void damageAsWaterSensitive(@NotNull @NotNull LivingEntity entity)`
- `@NotNull public @NotNull Collection<LivingEntity> getToRehydrate()`
- `@NotNull public @NotNull Collection<LivingEntity> getToExtinguish()`
- `@Deprecated @NotNull public @NotNull Collection<LivingEntity> getAffectedEntities()`
- `@Deprecated public double getIntensity(@NotNull @NotNull LivingEntity entity)`
- `@Deprecated public void setIntensity(@NotNull @NotNull LivingEntity entity, double intensity)`
