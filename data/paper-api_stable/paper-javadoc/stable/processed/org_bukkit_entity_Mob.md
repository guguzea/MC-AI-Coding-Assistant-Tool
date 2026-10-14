---
title: "org.bukkit.entity.Mob"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Mob.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Mob**
`@NullMarked public interface Mob extends LivingEntity, Lootable, Leashable`
- `boolean shouldDespawnInPeaceful()`
- `void setDespawnInPeacefulOverride(TriState state)`
- `TriState getDespawnInPeacefulOverride()`
- `EntityEquipment getEquipment()`
- `Pathfinder getPathfinder()`
- `boolean isInDaylight()`
- `void lookAt(Location location)`
- `void lookAt(Location location, float headRotationSpeed, float maxHeadPitch)`
- `void lookAt(Entity entity)`
- `void lookAt(Entity entity, float headRotationSpeed, float maxHeadPitch)`
- `void lookAt(double x, double y, double z)`
- `void lookAt(double x, double y, double z, float headRotationSpeed, float maxHeadPitch)`
- `int getHeadRotationSpeed()`
- `int getMaxHeadPitch()`
- `void setTarget(@Nullable LivingEntity target)`
- `@Nullable LivingEntity getTarget()`
- `void setAware(boolean aware)`
- `boolean isAware()`
- `@Nullable Sound getAmbientSound()`
- `default void setLootTable(@Nullable LootTable table, long seed)`
- `boolean isAggressive()`
- `void setAggressive(boolean aggressive)`
- `boolean isLeftHanded()`
- `void setLeftHanded(boolean leftHanded)`
- `int getPossibleExperienceReward()`
