---
title: "org.bukkit.WorldBorder"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.WorldBorder`
- `public abstract org.bukkit.World getWorld()`
- `public abstract void reset()`
- `public abstract double getSize()`
- `public abstract void setSize(double)`
- `public abstract void setSize(double, long)`
- `public abstract void setSize(double, java.util.concurrent.TimeUnit, long)`
- `public abstract org.bukkit.Location getCenter()`
- `public abstract void setCenter(double, double)`
- `public abstract void setCenter(org.bukkit.Location)`
- `public abstract double getDamageBuffer()`
- `public abstract void setDamageBuffer(double)`
- `public abstract double getDamageAmount()`
- `public abstract void setDamageAmount(double)`
- `public abstract int getWarningTime()`
- `public abstract void setWarningTime(int)`
- `public abstract int getWarningDistance()`
- `public abstract void setWarningDistance(int)`
- `public abstract boolean isInside(org.bukkit.Location)`
- `public abstract double getMaxSize()`
- `public abstract double getMaxCenterCoordinate()`
