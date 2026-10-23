---
title: "org.bukkit.map.MapView"
package: "org.bukkit.map"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/map/MapView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `int getId()`
- `boolean isVirtual()`
- `@NotNull @NotNull MapView.Scale getScale()`
- `void setScale(@NotNull @NotNull MapView.Scale scale)`
- `int getCenterX()`
- `int getCenterZ()`
- `void setCenterX(int x)`
- `void setCenterZ(int z)`
- `@Nullable @Nullable World getWorld()`
- `void setWorld(@NotNull @NotNull World world)`
- `@NotNull @NotNull List<MapRenderer> getRenderers()`
- `void addRenderer(@NotNull @NotNull MapRenderer renderer)`
- `boolean removeRenderer(@Nullable @Nullable MapRenderer renderer)`
- `boolean isTrackingPosition()`
- `void setTrackingPosition(boolean trackingPosition)`
- `boolean isUnlimitedTracking()`
- `void setUnlimitedTracking(boolean unlimited)`
- `boolean isLocked()`
- `void setLocked(boolean locked)`
