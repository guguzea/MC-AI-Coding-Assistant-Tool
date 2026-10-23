---
title: "org.bukkit.entity.Mob"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/entity/Mob.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@NotNull EntityEquipment getEquipment()`
- `@NotNull Pathfinder getPathfinder()`
- `boolean isInDaylight()`
- `void lookAt(@NotNull Location location)`
- `void lookAt(@NotNull Location location, float headRotationSpeed, float maxHeadPitch)`
- `void lookAt(@NotNull @NotNull Entity entity)`
- `void lookAt(@NotNull @NotNull Entity entity, float headRotationSpeed, float maxHeadPitch)`
- `void lookAt(double x, double y, double z)`
- `void lookAt(double x, double y, double z, float headRotationSpeed, float maxHeadPitch)`
- `int getHeadRotationSpeed()`
- `int getMaxHeadPitch()`
- `void setTarget(@Nullable @Nullable LivingEntity target)`
- `@Nullable @Nullable LivingEntity getTarget()`
- `void setAware(boolean aware)`
- `boolean isAware()`
- `@Nullable @Nullable Sound getAmbientSound()`
- `boolean isLeftHanded()`
- `void setLeftHanded(boolean leftHanded)`
- `int getPossibleExperienceReward()`
