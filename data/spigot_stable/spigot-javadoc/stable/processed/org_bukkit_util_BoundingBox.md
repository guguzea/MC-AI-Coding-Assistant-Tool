---
title: "org.bukkit.util.BoundingBox"
package: "org.bukkit.util"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/util/BoundingBox.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class BoundingBox**
`public class BoundingBox extends Object implements Cloneable, ConfigurationSerializable`
- `public BoundingBox()`
- `public BoundingBox(double x1, double y1, double z1, double x2, double y2, double z2)`
- `@NotNull public static BoundingBox of(@NotNull Vector corner1, @NotNull Vector corner2)`
- `@NotNull public static BoundingBox of(@NotNull Location corner1, @NotNull Location corner2)`
- `@NotNull public static BoundingBox of(@NotNull Block corner1, @NotNull Block corner2)`
- `@NotNull public static BoundingBox of(@NotNull Block block)`
- `@NotNull public static BoundingBox of(@NotNull Vector center, double x, double y, double z)`
- `@NotNull public static BoundingBox of(@NotNull Location center, double x, double y, double z)`
- `@NotNull public BoundingBox resize(double x1, double y1, double z1, double x2, double y2, double z2)`
- `public double getMinX()`
- `public double getMinY()`
- `public double getMinZ()`
- `@NotNull public Vector getMin()`
- `public double getMaxX()`
- `public double getMaxY()`
- `public double getMaxZ()`
- `@NotNull public Vector getMax()`
- `public double getWidthX()`
- `public double getWidthZ()`
- `public double getHeight()`
- `public double getVolume()`
- `public double getCenterX()`
- `public double getCenterY()`
- `public double getCenterZ()`
- `@NotNull public Vector getCenter()`
- `@NotNull public BoundingBox copy(@NotNull BoundingBox other)`
- `@NotNull public BoundingBox expand(double negativeX, double negativeY, double negativeZ, double positiveX, double positiveY, double positiveZ)`
- `@NotNull public BoundingBox expand(double x, double y, double z)`
- `@NotNull public BoundingBox expand(@NotNull Vector expansion)`
- `@NotNull public BoundingBox expand(double expansion)`
- `@NotNull public BoundingBox expand(double dirX, double dirY, double dirZ, double expansion)`
- `@NotNull public BoundingBox expand(@NotNull Vector direction, double expansion)`
- `@NotNull public BoundingBox expand(@NotNull BlockFace blockFace, double expansion)`
- `@NotNull public BoundingBox expandDirectional(double dirX, double dirY, double dirZ)`
- `@NotNull public BoundingBox expandDirectional(@NotNull Vector direction)`
- `@NotNull public BoundingBox union(double posX, double posY, double posZ)`
- `@NotNull public BoundingBox union(@NotNull Vector position)`
- `@NotNull public BoundingBox union(@NotNull Location position)`
- `@NotNull public BoundingBox union(@NotNull BoundingBox other)`
- `@NotNull public BoundingBox intersection(@NotNull BoundingBox other)`
- `@NotNull public BoundingBox shift(double shiftX, double shiftY, double shiftZ)`
- `@NotNull public BoundingBox shift(@NotNull Vector shift)`
- `@NotNull public BoundingBox shift(@NotNull Location shift)`
- `public boolean overlaps(@NotNull BoundingBox other)`
- `public boolean overlaps(@NotNull Vector min, @NotNull Vector max)`
- `public boolean contains(double x, double y, double z)`
- `public boolean contains(@NotNull Vector position)`
- `public boolean contains(@NotNull BoundingBox other)`
- `public boolean contains(@NotNull Vector min, @NotNull Vector max)`
- `@Nullable public RayTraceResult rayTrace(@NotNull Vector start, @NotNull Vector direction, double maxDistance)`
- `public int hashCode()`
- `public boolean equals(Object obj)`
- `public String toString()`
- `@NotNull public BoundingBox clone()`
- `@NotNull public Map<String,Object> serialize()`
- `@NotNull public static BoundingBox deserialize(@NotNull Map<String,Object> args)`
