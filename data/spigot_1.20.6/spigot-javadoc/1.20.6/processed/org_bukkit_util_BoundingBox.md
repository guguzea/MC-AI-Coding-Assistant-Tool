---
title: "org.bukkit.util.BoundingBox"
package: "org.bukkit.util"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.util.BoundingBox implements java.lang.Cloneable,org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public static org.bukkit.util.BoundingBox of(org.bukkit.util.Vector, org.bukkit.util.Vector)`
- `public static org.bukkit.util.BoundingBox of(org.bukkit.Location, org.bukkit.Location)`
- `public static org.bukkit.util.BoundingBox of(org.bukkit.block.Block, org.bukkit.block.Block)`
- `public static org.bukkit.util.BoundingBox of(org.bukkit.block.Block)`
- `public static org.bukkit.util.BoundingBox of(org.bukkit.util.Vector, double, double, double)`
- `public static org.bukkit.util.BoundingBox of(org.bukkit.Location, double, double, double)`
- `public org.bukkit.util.BoundingBox()`
- `public org.bukkit.util.BoundingBox(double, double, double, double, double, double)`
- `public org.bukkit.util.BoundingBox resize(double, double, double, double, double, double)`
- `public double getMinX()`
- `public double getMinY()`
- `public double getMinZ()`
- `public org.bukkit.util.Vector getMin()`
- `public double getMaxX()`
- `public double getMaxY()`
- `public double getMaxZ()`
- `public org.bukkit.util.Vector getMax()`
- `public double getWidthX()`
- `public double getWidthZ()`
- `public double getHeight()`
- `public double getVolume()`
- `public double getCenterX()`
- `public double getCenterY()`
- `public double getCenterZ()`
- `public org.bukkit.util.Vector getCenter()`
- `public org.bukkit.util.BoundingBox copy(org.bukkit.util.BoundingBox)`
- `public org.bukkit.util.BoundingBox expand(double, double, double, double, double, double)`
- `public org.bukkit.util.BoundingBox expand(double, double, double)`
- `public org.bukkit.util.BoundingBox expand(org.bukkit.util.Vector)`
- `public org.bukkit.util.BoundingBox expand(double)`
- `public org.bukkit.util.BoundingBox expand(double, double, double, double)`
- `public org.bukkit.util.BoundingBox expand(org.bukkit.util.Vector, double)`
- `public org.bukkit.util.BoundingBox expand(org.bukkit.block.BlockFace, double)`
- `public org.bukkit.util.BoundingBox expandDirectional(double, double, double)`
- `public org.bukkit.util.BoundingBox expandDirectional(org.bukkit.util.Vector)`
- `public org.bukkit.util.BoundingBox union(double, double, double)`
- `public org.bukkit.util.BoundingBox union(org.bukkit.util.Vector)`
- `public org.bukkit.util.BoundingBox union(org.bukkit.Location)`
- `public org.bukkit.util.BoundingBox union(org.bukkit.util.BoundingBox)`
- `public org.bukkit.util.BoundingBox intersection(org.bukkit.util.BoundingBox)`
- `public org.bukkit.util.BoundingBox shift(double, double, double)`
- `public org.bukkit.util.BoundingBox shift(org.bukkit.util.Vector)`
- `public org.bukkit.util.BoundingBox shift(org.bukkit.Location)`
- `public boolean overlaps(org.bukkit.util.BoundingBox)`
- `public boolean overlaps(org.bukkit.util.Vector, org.bukkit.util.Vector)`
- `public boolean contains(double, double, double)`
- `public boolean contains(org.bukkit.util.Vector)`
- `public boolean contains(org.bukkit.util.BoundingBox)`
- `public boolean contains(org.bukkit.util.Vector, org.bukkit.util.Vector)`
- `public org.bukkit.util.RayTraceResult rayTrace(org.bukkit.util.Vector, org.bukkit.util.Vector, double)`
- `public int hashCode()`
- `public boolean equals(java.lang.Object)`
- `public java.lang.String toString()`
- `public org.bukkit.util.BoundingBox clone()`
- `public java.util.Map<java.lang.String, java.lang.Object> serialize()`
- `public static org.bukkit.util.BoundingBox deserialize(java.util.Map<java.lang.String, java.lang.Object>)`
- `public java.lang.Object clone() throws java.lang.CloneNotSupportedException`
