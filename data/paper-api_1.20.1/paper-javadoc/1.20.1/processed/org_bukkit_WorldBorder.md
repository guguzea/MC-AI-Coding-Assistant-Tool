---
title: "org.bukkit.WorldBorder"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/WorldBorder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable World getWorld()`
- `void reset()`
- `double getSize()`
- `void setSize(double newSize)`
- `void setSize(double newSize, long seconds)`
- `void setSize(double newSize, @NotNull @NotNull TimeUnit unit, long time)`
- `@NotNull @NotNull Location getCenter()`
- `void setCenter(double x, double z)`
- `void setCenter(@NotNull @NotNull Location location)`
- `double getDamageBuffer()`
- `void setDamageBuffer(double blocks)`
- `double getDamageAmount()`
- `void setDamageAmount(double damage)`
- `int getWarningTime()`
- `void setWarningTime(int seconds)`
- `int getWarningDistance()`
- `void setWarningDistance(int distance)`
- `boolean isInside(@NotNull @NotNull Location location)`
- `double getMaxSize()`
- `double getMaxCenterCoordinate()`
- `@Deprecated(forRemoval=true) @ScheduledForRemoval(inVersion="1.21") default boolean isInBounds(@NotNull @NotNull Location location)`
