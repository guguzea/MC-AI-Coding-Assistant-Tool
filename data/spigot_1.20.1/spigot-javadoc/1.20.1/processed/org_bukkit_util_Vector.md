---
title: "org.bukkit.util.Vector"
package: "org.bukkit.util"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.util.Vector implements java.lang.Cloneable,org.bukkit.configuration.serialization.ConfigurationSerializable`
- `protected double x`
- `protected double y`
- `protected double z`
- `public org.bukkit.util.Vector()`
- `public org.bukkit.util.Vector(int, int, int)`
- `public org.bukkit.util.Vector(double, double, double)`
- `public org.bukkit.util.Vector(float, float, float)`
- `public org.bukkit.util.Vector add(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector subtract(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector multiply(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector divide(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector copy(org.bukkit.util.Vector)`
- `public double length()`
- `public double lengthSquared()`
- `public double distance(org.bukkit.util.Vector)`
- `public double distanceSquared(org.bukkit.util.Vector)`
- `public float angle(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector midpoint(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector getMidpoint(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector multiply(int)`
- `public org.bukkit.util.Vector multiply(double)`
- `public org.bukkit.util.Vector multiply(float)`
- `public double dot(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector crossProduct(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector getCrossProduct(org.bukkit.util.Vector)`
- `public org.bukkit.util.Vector normalize()`
- `public org.bukkit.util.Vector zero()`
- `public boolean isZero()`
- `public boolean isInAABB(org.bukkit.util.Vector, org.bukkit.util.Vector)`
- `public boolean isInSphere(org.bukkit.util.Vector, double)`
- `public boolean isNormalized()`
- `public org.bukkit.util.Vector rotateAroundX(double)`
- `public org.bukkit.util.Vector rotateAroundY(double)`
- `public org.bukkit.util.Vector rotateAroundZ(double)`
- `public org.bukkit.util.Vector rotateAroundAxis(org.bukkit.util.Vector, double) throws java.lang.IllegalArgumentException`
- `public org.bukkit.util.Vector rotateAroundNonUnitAxis(org.bukkit.util.Vector, double) throws java.lang.IllegalArgumentException`
- `public double getX()`
- `public int getBlockX()`
- `public double getY()`
- `public int getBlockY()`
- `public double getZ()`
- `public int getBlockZ()`
- `public org.bukkit.util.Vector setX(int)`
- `public org.bukkit.util.Vector setX(double)`
- `public org.bukkit.util.Vector setX(float)`
- `public org.bukkit.util.Vector setY(int)`
- `public org.bukkit.util.Vector setY(double)`
- `public org.bukkit.util.Vector setY(float)`
- `public org.bukkit.util.Vector setZ(int)`
- `public org.bukkit.util.Vector setZ(double)`
- `public org.bukkit.util.Vector setZ(float)`
- `public boolean equals(java.lang.Object)`
- `public int hashCode()`
- `public org.bukkit.util.Vector clone()`
- `public java.lang.String toString()`
- `public org.bukkit.Location toLocation(org.bukkit.World)`
- `public org.bukkit.Location toLocation(org.bukkit.World, float, float)`
- `public org.bukkit.util.BlockVector toBlockVector()`
- `public org.joml.Vector3f toVector3f()`
- `public org.joml.Vector3d toVector3d()`
- `public org.joml.Vector3i toVector3i(int)`
- `public org.joml.Vector3i toVector3i()`
- `public void checkFinite() throws java.lang.IllegalArgumentException`
- `public static double getEpsilon()`
- `public static org.bukkit.util.Vector getMinimum(org.bukkit.util.Vector, org.bukkit.util.Vector)`
- `public static org.bukkit.util.Vector getMaximum(org.bukkit.util.Vector, org.bukkit.util.Vector)`
- `public static org.bukkit.util.Vector getRandom()`
- `public static org.bukkit.util.Vector fromJOML(org.joml.Vector3f)`
- `public static org.bukkit.util.Vector fromJOML(org.joml.Vector3d)`
- `public static org.bukkit.util.Vector fromJOML(org.joml.Vector3i)`
- `public java.util.Map<java.lang.String, java.lang.Object> serialize()`
- `public static org.bukkit.util.Vector deserialize(java.util.Map<java.lang.String, java.lang.Object>)`
- `public java.lang.Object clone() throws java.lang.CloneNotSupportedException`
