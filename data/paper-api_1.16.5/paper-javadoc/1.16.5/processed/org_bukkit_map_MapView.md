---
title: "org.bukkit.map.MapView"
package: "org.bukkit.map"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/map/MapView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `int getId()`
- `boolean isVirtual()`
- `@NotNull @NotNull MapView.Scale getScale()`
- `void setScale&#8203;(@NotNull @NotNull MapView.Scale scale)`
- `int getCenterX()`
- `int getCenterZ()`
- `void setCenterX&#8203;(int x)`
- `void setCenterZ&#8203;(int z)`
- `@Nullable @Nullable World getWorld()`
- `void setWorld&#8203;(@NotNull @NotNull World world)`
- `@NotNull @NotNull List<MapRenderer> getRenderers()`
- `void addRenderer&#8203;(@NotNull @NotNull MapRenderer renderer)`
- `boolean removeRenderer&#8203;(@Nullable @Nullable MapRenderer renderer)`
- `boolean isTrackingPosition()`
- `void setTrackingPosition&#8203;(boolean trackingPosition)`
- `boolean isUnlimitedTracking()`
- `void setUnlimitedTracking&#8203;(boolean unlimited)`
- `boolean isLocked()`
- `void setLocked&#8203;(boolean locked)`
