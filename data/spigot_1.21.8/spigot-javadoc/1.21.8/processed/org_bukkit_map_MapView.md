---
title: "org.bukkit.map.MapView"
package: "org.bukkit.map"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.map.MapView`
- `public abstract int getId()`
- `public abstract boolean isVirtual()`
- `public abstract org.bukkit.map.MapView$Scale getScale()`
- `public abstract void setScale(org.bukkit.map.MapView$Scale)`
- `public abstract int getCenterX()`
- `public abstract int getCenterZ()`
- `public abstract void setCenterX(int)`
- `public abstract void setCenterZ(int)`
- `public abstract org.bukkit.World getWorld()`
- `public abstract void setWorld(org.bukkit.World)`
- `public abstract java.util.List<org.bukkit.map.MapRenderer> getRenderers()`
- `public abstract void addRenderer(org.bukkit.map.MapRenderer)`
- `public abstract boolean removeRenderer(org.bukkit.map.MapRenderer)`
- `public abstract boolean isTrackingPosition()`
- `public abstract void setTrackingPosition(boolean)`
- `public abstract boolean isUnlimitedTracking()`
- `public abstract void setUnlimitedTracking(boolean)`
- `public abstract boolean isLocked()`
- `public abstract void setLocked(boolean)`
