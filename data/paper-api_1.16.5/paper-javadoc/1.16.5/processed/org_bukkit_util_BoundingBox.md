---
title: "org.bukkit.util.BoundingBox"
package: "org.bukkit.util"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/util/BoundingBox.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public BoundingBox()`
- `public BoundingBox&#8203;(double x1, double y1, double z1, double x2, double y2, double z2)`
- `@NotNull public static @NotNull BoundingBox of&#8203;(@NotNull @NotNull Vector corner1, @NotNull @NotNull Vector corner2)`
- `@NotNull public static @NotNull BoundingBox of&#8203;(@NotNull @NotNull Location corner1, @NotNull @NotNull Location corner2)`
- `@NotNull public static @NotNull BoundingBox of&#8203;(@NotNull @NotNull Block corner1, @NotNull @NotNull Block corner2)`
- `@NotNull public static @NotNull BoundingBox of&#8203;(@NotNull @NotNull Block block)`
- `@NotNull public static @NotNull BoundingBox of&#8203;(@NotNull @NotNull Vector center, double x, double y, double z)`
- `@NotNull public static @NotNull BoundingBox of&#8203;(@NotNull @NotNull Location center, double x, double y, double z)`
- `@NotNull public @NotNull BoundingBox resize&#8203;(double x1, double y1, double z1, double x2, double y2, double z2)`
- `public double getMinX()`
- `public double getMinY()`
- `public double getMinZ()`
- `@NotNull public @NotNull Vector getMin()`
- `public double getMaxX()`
- `public double getMaxY()`
- `public double getMaxZ()`
- `@NotNull public @NotNull Vector getMax()`
- `public double getWidthX()`
- `public double getWidthZ()`
- `public double getHeight()`
- `public double getVolume()`
- `public double getCenterX()`
- `public double getCenterY()`
- `public double getCenterZ()`
- `@NotNull public @NotNull Vector getCenter()`
- `@NotNull public @NotNull BoundingBox copy&#8203;(@NotNull @NotNull BoundingBox other)`
- `@NotNull public @NotNull BoundingBox expand&#8203;(double negativeX, double negativeY, double negativeZ, double positiveX, double positiveY, double positiveZ)`
- `@NotNull public @NotNull BoundingBox expand&#8203;(double x, double y, double z)`
- `@NotNull public @NotNull BoundingBox expand&#8203;(@NotNull @NotNull Vector expansion)`
- `@NotNull public @NotNull BoundingBox expand&#8203;(double expansion)`
- `@NotNull public @NotNull BoundingBox expand&#8203;(double dirX, double dirY, double dirZ, double expansion)`
- `@NotNull public @NotNull BoundingBox expand&#8203;(@NotNull @NotNull Vector direction, double expansion)`
- `@NotNull public @NotNull BoundingBox expand&#8203;(@NotNull @NotNull BlockFace blockFace, double expansion)`
- `@NotNull public @NotNull BoundingBox expandDirectional&#8203;(double dirX, double dirY, double dirZ)`
- `@NotNull public @NotNull BoundingBox expandDirectional&#8203;(@NotNull @NotNull Vector direction)`
- `@NotNull public @NotNull BoundingBox union&#8203;(double posX, double posY, double posZ)`
- `@NotNull public @NotNull BoundingBox union&#8203;(@NotNull @NotNull Vector position)`
- `@NotNull public @NotNull BoundingBox union&#8203;(@NotNull @NotNull Location position)`
- `@NotNull public @NotNull BoundingBox union&#8203;(@NotNull @NotNull BoundingBox other)`
- `@NotNull public @NotNull BoundingBox intersection&#8203;(@NotNull @NotNull BoundingBox other)`
- `@NotNull public @NotNull BoundingBox shift&#8203;(double shiftX, double shiftY, double shiftZ)`
- `@NotNull public @NotNull BoundingBox shift&#8203;(@NotNull @NotNull Vector shift)`
- `@NotNull public @NotNull BoundingBox shift&#8203;(@NotNull @NotNull Location shift)`
- `public boolean overlaps&#8203;(@NotNull @NotNull BoundingBox other)`
- `public boolean overlaps&#8203;(@NotNull @NotNull Vector min, @NotNull @NotNull Vector max)`
- `public boolean contains&#8203;(double x, double y, double z)`
- `public boolean contains&#8203;(@NotNull @NotNull Vector position)`
- `public boolean contains&#8203;(@NotNull @NotNull BoundingBox other)`
- `public boolean contains&#8203;(@NotNull @NotNull Vector min, @NotNull @NotNull Vector max)`
- `@Nullable public @Nullable RayTraceResult rayTrace&#8203;(@NotNull @NotNull Vector start, @NotNull @NotNull Vector direction, double maxDistance)`
- `public int hashCode()`
- `public boolean equals&#8203;(Object obj)`
- `public String toString()`
- `@NotNull public @NotNull BoundingBox clone()`
- `@NotNull public @NotNull Map<String,&#8203;Object> serialize()`
- `@NotNull public static @NotNull BoundingBox deserialize&#8203;(@NotNull @NotNull Map<String,&#8203;Object> args)`
