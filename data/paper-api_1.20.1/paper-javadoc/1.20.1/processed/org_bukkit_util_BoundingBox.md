---
title: "org.bukkit.util.BoundingBox"
package: "org.bukkit.util"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/util/BoundingBox.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public BoundingBox()`
- `public BoundingBox(double x1, double y1, double z1, double x2, double y2, double z2)`
- `@NotNull public static @NotNull BoundingBox of(@NotNull @NotNull Vector corner1, @NotNull @NotNull Vector corner2)`
- `@NotNull public static @NotNull BoundingBox of(@NotNull @NotNull Location corner1, @NotNull @NotNull Location corner2)`
- `@NotNull public static @NotNull BoundingBox of(@NotNull @NotNull Block corner1, @NotNull @NotNull Block corner2)`
- `@NotNull public static @NotNull BoundingBox of(@NotNull @NotNull Block block)`
- `@NotNull public static @NotNull BoundingBox of(@NotNull @NotNull Vector center, double x, double y, double z)`
- `@NotNull public static @NotNull BoundingBox of(@NotNull @NotNull Location center, double x, double y, double z)`
- `@NotNull public @NotNull BoundingBox resize(double x1, double y1, double z1, double x2, double y2, double z2)`
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
- `@NotNull public @NotNull BoundingBox copy(@NotNull @NotNull BoundingBox other)`
- `@NotNull public @NotNull BoundingBox expand(double negativeX, double negativeY, double negativeZ, double positiveX, double positiveY, double positiveZ)`
- `@NotNull public @NotNull BoundingBox expand(double x, double y, double z)`
- `@NotNull public @NotNull BoundingBox expand(@NotNull @NotNull Vector expansion)`
- `@NotNull public @NotNull BoundingBox expand(double expansion)`
- `@NotNull public @NotNull BoundingBox expand(double dirX, double dirY, double dirZ, double expansion)`
- `@NotNull public @NotNull BoundingBox expand(@NotNull @NotNull Vector direction, double expansion)`
- `@NotNull public @NotNull BoundingBox expand(@NotNull @NotNull BlockFace blockFace, double expansion)`
- `@NotNull public @NotNull BoundingBox expandDirectional(double dirX, double dirY, double dirZ)`
- `@NotNull public @NotNull BoundingBox expandDirectional(@NotNull @NotNull Vector direction)`
- `@NotNull public @NotNull BoundingBox union(double posX, double posY, double posZ)`
- `@NotNull public @NotNull BoundingBox union(@NotNull @NotNull Vector position)`
- `@NotNull public @NotNull BoundingBox union(@NotNull @NotNull Location position)`
- `@NotNull public @NotNull BoundingBox union(@NotNull @NotNull BoundingBox other)`
- `@NotNull public @NotNull BoundingBox intersection(@NotNull @NotNull BoundingBox other)`
- `@NotNull public @NotNull BoundingBox shift(double shiftX, double shiftY, double shiftZ)`
- `@NotNull public @NotNull BoundingBox shift(@NotNull @NotNull Vector shift)`
- `@NotNull public @NotNull BoundingBox shift(@NotNull @NotNull Location shift)`
- `public boolean overlaps(@NotNull @NotNull BoundingBox other)`
- `public boolean overlaps(@NotNull @NotNull Vector min, @NotNull @NotNull Vector max)`
- `public boolean contains(double x, double y, double z)`
- `public boolean contains(@NotNull @NotNull Vector position)`
- `public boolean contains(@NotNull @NotNull BoundingBox other)`
- `public boolean contains(@NotNull @NotNull Vector min, @NotNull @NotNull Vector max)`
- `@Nullable public @Nullable RayTraceResult rayTrace(@NotNull @NotNull Vector start, @NotNull @NotNull Vector direction, double maxDistance)`
- `public int hashCode()`
- `public boolean equals(Object obj)`
- `public String toString()`
- `@NotNull public @NotNull BoundingBox clone()`
- `@NotNull public @NotNull Map<String,Object> serialize()`
- `@NotNull public static @NotNull BoundingBox deserialize(@NotNull @NotNull Map<String,Object> args)`
