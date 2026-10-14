---
title: "org.bukkit.entity.Raider"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Raider.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Raider**
`public interface Raider extends Monster`
- `void setRaid(@Nullable Raid raid)`
- `@Nullable Raid getRaid()`
- `int getWave()`
- `void setWave(int wave)`
- `@Nullable Block getPatrolTarget()`
- `void setPatrolTarget(@Nullable Block block)`
- `boolean isPatrolLeader()`
- `void setPatrolLeader(boolean leader)`
- `boolean isCanJoinRaid()`
- `void setCanJoinRaid(boolean join)`
- `int getTicksOutsideRaid()`
- `void setTicksOutsideRaid(int ticks)`
- `boolean isCelebrating()`
- `void setCelebrating(boolean celebrating)`
- `@NotNull Sound getCelebrationSound()`
