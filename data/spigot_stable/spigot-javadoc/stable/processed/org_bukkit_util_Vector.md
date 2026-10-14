---
title: "org.bukkit.util.Vector"
package: "org.bukkit.util"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/util/Vector.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Vector**
`public class Vector extends Object implements Cloneable, ConfigurationSerializable`
- `protected double x`
- `protected double y`
- `protected double z`
- `public Vector()`
- `public Vector(int x, int y, int z)`
- `public Vector(double x, double y, double z)`
- `public Vector(float x, float y, float z)`
- `@NotNull public Vector add(@NotNull Vector vec)`
- `@NotNull public Vector subtract(@NotNull Vector vec)`
- `@NotNull public Vector multiply(@NotNull Vector vec)`
- `@NotNull public Vector divide(@NotNull Vector vec)`
- `@NotNull public Vector copy(@NotNull Vector vec)`
- `public double length()`
- `public double lengthSquared()`
- `public double distance(@NotNull Vector o)`
- `public double distanceSquared(@NotNull Vector o)`
- `public float angle(@NotNull Vector other)`
- `@NotNull public Vector midpoint(@NotNull Vector other)`
- `@NotNull public Vector getMidpoint(@NotNull Vector other)`
- `@NotNull public Vector multiply(int m)`
- `@NotNull public Vector multiply(double m)`
- `@NotNull public Vector multiply(float m)`
- `public double dot(@NotNull Vector other)`
- `@NotNull public Vector crossProduct(@NotNull Vector o)`
- `@NotNull public Vector getCrossProduct(@NotNull Vector o)`
- `@NotNull public Vector normalize()`
- `@NotNull public Vector zero()`
- `public boolean isZero()`
- `public boolean isInAABB(@NotNull Vector min, @NotNull Vector max)`
- `public boolean isInSphere(@NotNull Vector origin, double radius)`
- `public boolean isNormalized()`
- `@NotNull public Vector rotateAroundX(double angle)`
- `@NotNull public Vector rotateAroundY(double angle)`
- `@NotNull public Vector rotateAroundZ(double angle)`
- `@NotNull public Vector rotateAroundAxis(@NotNull Vector axis, double angle) throws IllegalArgumentException`
- `@NotNull public Vector rotateAroundNonUnitAxis(@NotNull Vector axis, double angle) throws IllegalArgumentException`
- `public double getX()`
- `public int getBlockX()`
- `public double getY()`
- `public int getBlockY()`
- `public double getZ()`
- `public int getBlockZ()`
- `@NotNull public Vector setX(int x)`
- `@NotNull public Vector setX(double x)`
- `@NotNull public Vector setX(float x)`
- `@NotNull public Vector setY(int y)`
- `@NotNull public Vector setY(double y)`
- `@NotNull public Vector setY(float y)`
- `@NotNull public Vector setZ(int z)`
- `@NotNull public Vector setZ(double z)`
- `@NotNull public Vector setZ(float z)`
- `public boolean equals(Object obj)`
- `public int hashCode()`
- `@NotNull public Vector clone()`
- `public String toString()`
- `@NotNull public Location toLocation(@NotNull World world)`
- `@NotNull public Location toLocation(@NotNull World world, float yaw, float pitch)`
- `@NotNull public BlockVector toBlockVector()`
- `@NotNull public org.joml.Vector3f toVector3f()`
- `@NotNull public org.joml.Vector3d toVector3d()`
- `@NotNull public org.joml.Vector3i toVector3i(int roundingMode)`
- `@NotNull public org.joml.Vector3i toVector3i()`
- `public void checkFinite() throws IllegalArgumentException`
- `public static double getEpsilon()`
- `@NotNull public static Vector getMinimum(@NotNull Vector v1, @NotNull Vector v2)`
- `@NotNull public static Vector getMaximum(@NotNull Vector v1, @NotNull Vector v2)`
- `@NotNull public static Vector getRandom()`
- `@NotNull public static Vector fromJOML(@NotNull org.joml.Vector3f vector)`
- `@NotNull public static Vector fromJOML(@NotNull org.joml.Vector3d vector)`
- `@NotNull public static Vector fromJOML(@NotNull org.joml.Vector3i vector)`
- `@NotNull public static Vector fromJOML(@NotNull org.joml.Vector3fc vector)`
- `@NotNull public static Vector fromJOML(@NotNull org.joml.Vector3dc vector)`
- `@NotNull public static Vector fromJOML(@NotNull org.joml.Vector3ic vector)`
- `@NotNull public Map<String,Object> serialize()`
- `@NotNull public static Vector deserialize(@NotNull Map<String,Object> args)`
