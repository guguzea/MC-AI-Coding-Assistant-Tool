---
title: "org.bukkit.WorldBorder"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/WorldBorder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface WorldBorder**
`public interface WorldBorder`
- `@Nullable @Nullable World getWorld()`
- `void reset()`
- `double getSize()`
- `void setSize(double newSize)`
- `void changeSize(double newSize, @Range(from=0L,to=2147483647L) long ticks)`
- `@Deprecated(since="1.21.11", forRemoval=true) default void setSize(double newSize, long seconds)`
- `@Deprecated(since="1.21.11", forRemoval=true) default void setSize(double newSize, @NotNull @NotNull TimeUnit unit, @NonNegative long time)`
- `@NotNull @NotNull Location getCenter()`
- `void setCenter(double x, double z)`
- `void setCenter(@NotNull @NotNull Location location)`
- `double getDamageBuffer()`
- `void setDamageBuffer(double blocks)`
- `double getDamageAmount()`
- `void setDamageAmount(double damage)`
- `@Deprecated(since="1.21.11", forRemoval=true) default @NonNegative int getWarningTime()`
- `@Deprecated(since="1.21.11", forRemoval=true) default void setWarningTime(@NonNegative int seconds)`
- `@NonNegative int getWarningTimeTicks()`
- `void setWarningTimeTicks(@NonNegative int ticks)`
- `int getWarningDistance()`
- `void setWarningDistance(int distance)`
- `boolean isInside(@NotNull @NotNull Location location)`
- `double getMaxSize()`
- `double getMaxCenterCoordinate()`
