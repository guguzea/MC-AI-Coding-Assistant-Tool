---
title: "org.bukkit.entity.FishHook"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/entity/FishHook.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `int getMinWaitTime()`
- `void setMinWaitTime(int minWaitTime)`
- `int getMaxWaitTime()`
- `void setMaxWaitTime(int maxWaitTime)`
- `void setWaitTime(int min, int max)`
- `int getMinLureTime()`
- `void setMinLureTime(int minLureTime)`
- `int getMaxLureTime()`
- `void setMaxLureTime(int maxLureTime)`
- `void setLureTime(int min, int max)`
- `float getMinLureAngle()`
- `void setMinLureAngle(float minLureAngle)`
- `float getMaxLureAngle()`
- `void setMaxLureAngle(float maxLureAngle)`
- `void setLureAngle(float min, float max)`
- `boolean getApplyLure()`
- `void setApplyLure(boolean applyLure)`
- `@Deprecated(since="1.9.2", forRemoval=true) double getBiteChance()`
- `@Deprecated(since="1.9.2", forRemoval=true) void setBiteChance(double chance) throws IllegalArgumentException`
- `boolean isInOpenWater()`
- `@Nullable @Nullable Entity getHookedEntity()`
- `void setHookedEntity(@Nullable @Nullable Entity entity)`
- `boolean pullHookedEntity()`
- `boolean isSkyInfluenced()`
- `void setSkyInfluenced(boolean skyInfluenced)`
- `boolean isRainInfluenced()`
- `void setRainInfluenced(boolean rainInfluenced)`
- `@NotNull @NotNull FishHook.HookState getState()`
- `int getWaitTime()`
- `void setWaitTime(int ticks)`
- `@org.jetbrains.annotations.Range(from=0L, to=2147483647L) int getTimeUntilBite()`
- `void setTimeUntilBite(@org.jetbrains.annotations.Range(from=1L, to=2147483647L) int ticks) throws IllegalArgumentException`
- `void resetFishingState()`
