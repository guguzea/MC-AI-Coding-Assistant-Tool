---
title: "org.bukkit.map.MapView"
package: "org.bukkit.map"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/map/MapView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface MapView**
`public interface MapView`
- `int getId()`
- `boolean isVirtual()`
- `@NotNull MapView.Scale getScale()`
- `void setScale(@NotNull MapView.Scale scale)`
- `int getCenterX()`
- `int getCenterZ()`
- `void setCenterX(int x)`
- `void setCenterZ(int z)`
- `@Nullable World getWorld()`
- `void setWorld(@NotNull World world)`
- `@NotNull List<MapRenderer> getRenderers()`
- `void addRenderer(@NotNull MapRenderer renderer)`
- `boolean removeRenderer(@Nullable MapRenderer renderer)`
- `boolean isTrackingPosition()`
- `void setTrackingPosition(boolean trackingPosition)`
- `boolean isUnlimitedTracking()`
- `void setUnlimitedTracking(boolean unlimited)`
- `boolean isLocked()`
- `void setLocked(boolean locked)`
