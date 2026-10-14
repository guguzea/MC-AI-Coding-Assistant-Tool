---
title: "org.bukkit.entity.Vex"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Vex.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Vex**
`public interface Vex extends Monster`
- `boolean isCharging()`
- `void setCharging(boolean charging)`
- `@Nullable @Nullable Location getBound()`
- `void setBound(@Nullable @Nullable Location location)`
- `@Deprecated default int getLifeTicks()`
- `@Deprecated void setLifeTicks(int lifeTicks)`
- `@Deprecated default boolean hasLimitedLife()`
- `@Deprecated(forRemoval=true, since="26.2") @Nullable default @Nullable Mob getSummoner()`
- `@Deprecated(forRemoval=true, since="26.2") default void setSummoner(@Nullable @Nullable Mob summoner)`
- `@Nullable @Nullable LivingEntity getOwner()`
- `void setOwner(@Nullable @Nullable LivingEntity owner)`
- `boolean hasLimitedLifetime()`
- `void setLimitedLifetime(boolean hasLimitedLifetime)`
- `int getLimitedLifetimeTicks()`
- `void setLimitedLifetimeTicks(int ticks)`
