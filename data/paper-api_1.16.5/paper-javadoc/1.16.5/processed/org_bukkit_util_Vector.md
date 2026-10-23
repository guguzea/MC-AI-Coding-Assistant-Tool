---
title: "org.bukkit.util.Vector"
package: "org.bukkit.util"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/util/Vector.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected double x`
- `protected double y`
- `protected double z`
- `public Vector()`
- `public Vector&#8203;(int x, int y, int z)`
- `public Vector&#8203;(double x, double y, double z)`
- `public Vector&#8203;(float x, float y, float z)`
- `@NotNull public @NotNull Vector add&#8203;(@NotNull @NotNull Vector vec)`
- `@NotNull public @NotNull Vector subtract&#8203;(@NotNull @NotNull Vector vec)`
- `@NotNull public @NotNull Vector multiply&#8203;(@NotNull @NotNull Vector vec)`
- `@NotNull public @NotNull Vector divide&#8203;(@NotNull @NotNull Vector vec)`
- `@NotNull public @NotNull Vector copy&#8203;(@NotNull @NotNull Vector vec)`
- `public double length()`
- `public double lengthSquared()`
- `public double distance&#8203;(@NotNull @NotNull Vector o)`
- `public double distanceSquared&#8203;(@NotNull @NotNull Vector o)`
- `public float angle&#8203;(@NotNull @NotNull Vector other)`
- `@NotNull public @NotNull Vector midpoint&#8203;(@NotNull @NotNull Vector other)`
- `@NotNull public @NotNull Vector getMidpoint&#8203;(@NotNull @NotNull Vector other)`
- `@NotNull public @NotNull Vector multiply&#8203;(int m)`
- `@NotNull public @NotNull Vector multiply&#8203;(double m)`
- `@NotNull public @NotNull Vector multiply&#8203;(float m)`
- `public double dot&#8203;(@NotNull @NotNull Vector other)`
- `@NotNull public @NotNull Vector crossProduct&#8203;(@NotNull @NotNull Vector o)`
- `@NotNull public @NotNull Vector getCrossProduct&#8203;(@NotNull @NotNull Vector o)`
- `@NotNull public @NotNull Vector normalize()`
- `@NotNull public @NotNull Vector zero()`
- `public boolean isInAABB&#8203;(@NotNull @NotNull Vector min, @NotNull @NotNull Vector max)`
- `public boolean isInSphere&#8203;(@NotNull @NotNull Vector origin, double radius)`
- `public boolean isNormalized()`
- `@NotNull public @NotNull Vector rotateAroundX&#8203;(double angle)`
- `@NotNull public @NotNull Vector rotateAroundY&#8203;(double angle)`
- `@NotNull public @NotNull Vector rotateAroundZ&#8203;(double angle)`
- `@NotNull public @NotNull Vector rotateAroundAxis&#8203;(@NotNull @NotNull Vector axis, double angle) throws IllegalArgumentException`
- `@NotNull public @NotNull Vector rotateAroundNonUnitAxis&#8203;(@NotNull @NotNull Vector axis, double angle) throws IllegalArgumentException`
- `public double getX()`
- `public int getBlockX()`
- `public double getY()`
- `public int getBlockY()`
- `public double getZ()`
- `public int getBlockZ()`
- `@NotNull public @NotNull Vector setX&#8203;(int x)`
- `@NotNull public @NotNull Vector setX&#8203;(double x)`
- `@NotNull public @NotNull Vector setX&#8203;(float x)`
- `@NotNull public @NotNull Vector setY&#8203;(int y)`
- `@NotNull public @NotNull Vector setY&#8203;(double y)`
- `@NotNull public @NotNull Vector setY&#8203;(float y)`
- `@NotNull public @NotNull Vector setZ&#8203;(int z)`
- `@NotNull public @NotNull Vector setZ&#8203;(double z)`
- `@NotNull public @NotNull Vector setZ&#8203;(float z)`
- `public boolean equals&#8203;(Object obj)`
- `public int hashCode()`
- `@NotNull public @NotNull Vector clone()`
- `public String toString()`
- `@NotNull public @NotNull Location toLocation&#8203;(@NotNull @NotNull World world)`
- `@NotNull public @NotNull Location toLocation&#8203;(@NotNull @NotNull World world, float yaw, float pitch)`
- `@NotNull public @NotNull BlockVector toBlockVector()`
- `public void checkFinite() throws IllegalArgumentException`
- `public static double getEpsilon()`
- `@NotNull public static @NotNull Vector getMinimum&#8203;(@NotNull @NotNull Vector v1, @NotNull @NotNull Vector v2)`
- `@NotNull public static @NotNull Vector getMaximum&#8203;(@NotNull @NotNull Vector v1, @NotNull @NotNull Vector v2)`
- `@NotNull public static @NotNull Vector getRandom()`
- `@NotNull public @NotNull Map<String,&#8203;Object> serialize()`
- `@NotNull public static @NotNull Vector deserialize&#8203;(@NotNull @NotNull Map<String,&#8203;Object> args)`
