---
title: "org.bukkit.entity.Raider"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Raider.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Raider**
`public interface Raider extends Monster`
- `void setRaid(@Nullable @Nullable Raid raid)`
- `@Nullable @Nullable Raid getRaid()`
- `int getWave()`
- `void setWave(int wave)`
- `@Nullable @Nullable Block getPatrolTarget()`
- `void setPatrolTarget(@Nullable @Nullable Block block)`
- `boolean isPatrolLeader()`
- `void setPatrolLeader(boolean leader)`
- `boolean isCanJoinRaid()`
- `void setCanJoinRaid(boolean join)`
- `int getTicksOutsideRaid()`
- `void setTicksOutsideRaid(int ticks)`
- `boolean isCelebrating()`
- `void setCelebrating(boolean celebrating)`
- `@NotNull @NotNull Sound getCelebrationSound()`
