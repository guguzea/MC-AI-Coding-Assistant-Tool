---
title: "org.bukkit.entity.FishHook"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/FishHook.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface FishHook**
`public interface FishHook extends Projectile`
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
- `@Deprecated(since="1.9.2") double getBiteChance()`
- `@Deprecated(since="1.9.2") void setBiteChance(double chance) throws IllegalArgumentException`
- `boolean isInOpenWater()`
- `@Nullable Entity getHookedEntity()`
- `void setHookedEntity(@Nullable Entity entity)`
- `boolean pullHookedEntity()`
- `boolean isSkyInfluenced()`
- `void setSkyInfluenced(boolean skyInfluenced)`
- `boolean isRainInfluenced()`
- `void setRainInfluenced(boolean rainInfluenced)`
- `@NotNull FishHook.HookState getState()`
