---
title: "io.papermc.paper.event.entity.WaterBottleSplashEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/event/entity/WaterBottleSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public WaterBottleSplashEvent(ThrownPotion potion, @Nullable Entity hitEntity, @Nullable Block hitBlock, @Nullable BlockFace hitFace, Map<LivingEntity,Double> affectedEntities, Set<LivingEntity> rehydrate, Set<LivingEntity> extinguish)`
- `public @Unmodifiable Collection<LivingEntity> getToDamage()`
- `public void doNotDamageAsWaterSensitive(LivingEntity entity)`
- `public void damageAsWaterSensitive(LivingEntity entity)`
- `public Collection<LivingEntity> getToRehydrate()`
- `public Collection<LivingEntity> getToExtinguish()`
- `@Deprecated(since="1.19.3") public Collection<LivingEntity> getAffectedEntities()`
- `@Deprecated(since="1.19.3") public double getIntensity(LivingEntity entity)`
- `@Deprecated(since="1.19.3") public void setIntensity(LivingEntity entity, double intensity)`
