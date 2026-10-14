---
title: "org.bukkit.entity.Bee"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Bee.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Bee**
`public interface Bee extends Animals`
- `@Nullable @Nullable Location getHive()`
- `void setHive(@Nullable @Nullable Location location)`
- `@Nullable @Nullable Location getFlower()`
- `void setFlower(@Nullable @Nullable Location location)`
- `boolean hasNectar()`
- `void setHasNectar(boolean nectar)`
- `boolean hasStung()`
- `void setHasStung(boolean stung)`
- `int getAnger()`
- `void setAnger(int anger)`
- `int getCannotEnterHiveTicks()`
- `void setCannotEnterHiveTicks(int ticks)`
- `void setRollingOverride(@NotNull TriState rolling)`
- `@NotNull TriState getRollingOverride()`
- `boolean isRolling()`
- `void setCropsGrownSincePollination(int crops)`
- `int getCropsGrownSincePollination()`
- `void setTicksSincePollination(int ticks)`
- `int getTicksSincePollination()`
- `void setTimeSinceSting(@NonNegative int time)`
- `int getTimeSinceSting()`
