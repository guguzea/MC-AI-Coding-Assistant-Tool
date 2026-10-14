---
title: "org.bukkit.WorldBorder"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/WorldBorder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface WorldBorder**
`public interface WorldBorder`
- `@Nullable World getWorld()`
- `void reset()`
- `double getSize()`
- `void setSize(double newSize)`
- `void setSize(double newSize, long seconds)`
- `void setSize(double newSize, @NotNull TimeUnit unit, long time)`
- `@NotNull Location getCenter()`
- `void setCenter(double x, double z)`
- `void setCenter(@NotNull Location location)`
- `double getDamageBuffer()`
- `void setDamageBuffer(double blocks)`
- `double getDamageAmount()`
- `void setDamageAmount(double damage)`
- `int getWarningTime()`
- `void setWarningTime(int seconds)`
- `int getWarningDistance()`
- `void setWarningDistance(int distance)`
- `boolean isInside(@NotNull Location location)`
- `double getMaxSize()`
- `double getMaxCenterCoordinate()`
