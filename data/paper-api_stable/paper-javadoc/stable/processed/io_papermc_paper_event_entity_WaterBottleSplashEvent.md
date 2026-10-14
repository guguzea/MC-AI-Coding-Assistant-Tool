---
title: "io.papermc.paper.event.entity.WaterBottleSplashEvent"
package: "io.papermc.paper.event.entity"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/entity/WaterBottleSplashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class WaterBottleSplashEvent**
`@NullMarked public class WaterBottleSplashEvent extends PotionSplashEvent`
- `@Internal public WaterBottleSplashEvent(ThrownPotion potion, @Nullable Entity hitEntity, @Nullable Block hitBlock, @Nullable BlockFace hitFace, Map<LivingEntity, Double> affectedEntities, Set<LivingEntity> rehydrate, Set<LivingEntity> extinguish)`
- `public @Unmodifiable Collection<LivingEntity> getToDamage()`
- `public void doNotDamageAsWaterSensitive(LivingEntity entity)`
- `public void damageAsWaterSensitive(LivingEntity entity)`
- `public Collection<LivingEntity> getToRehydrate()`
- `public Collection<LivingEntity> getToExtinguish()`
- `@Deprecated(since="1.19.3") public Collection<LivingEntity> getAffectedEntities()`
- `@Deprecated(since="1.19.3") public double getIntensity(LivingEntity entity)`
- `@Deprecated(since="1.19.3") public void setIntensity(LivingEntity entity, double intensity)`
