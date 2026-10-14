---
title: "org.bukkit.Location"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Location.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Location**
`public class Location extends Object implements Cloneable, ConfigurationSerializable`
- `public Location(@Nullable World world, double x, double y, double z)`
- `public Location(@Nullable World world, double x, double y, double z, float yaw, float pitch)`
- `public void setWorld(@Nullable World world)`
- `public boolean isWorldLoaded()`
- `@Nullable public World getWorld()`
- `@NotNull public Chunk getChunk()`
- `@NotNull public Block getBlock()`
- `public void setX(double x)`
- `public double getX()`
- `public int getBlockX()`
- `public void setY(double y)`
- `public double getY()`
- `public int getBlockY()`
- `public void setZ(double z)`
- `public double getZ()`
- `public int getBlockZ()`
- `public void setYaw(float yaw)`
- `public float getYaw()`
- `public void setPitch(float pitch)`
- `public float getPitch()`
- `@NotNull public Vector getDirection()`
- `@NotNull public Location setDirection(@NotNull Vector vector)`
- `@NotNull public Location add(@NotNull Location vec)`
- `@NotNull public Location add(@NotNull Vector vec)`
- `@NotNull public Location add(double x, double y, double z)`
- `@NotNull public Location subtract(@NotNull Location vec)`
- `@NotNull public Location subtract(@NotNull Vector vec)`
- `@NotNull public Location subtract(double x, double y, double z)`
- `public double length()`
- `public double lengthSquared()`
- `public double distance(@NotNull Location o)`
- `public double distanceSquared(@NotNull Location o)`
- `@NotNull public Location multiply(double m)`
- `@NotNull public Location zero()`
- `public boolean equals(Object obj)`
- `public int hashCode()`
- `public String toString()`
- `@NotNull public Vector toVector()`
- `@NotNull public Location clone()`
- `public void checkFinite() throws IllegalArgumentException`
- `public static int locToBlock(double loc)`
- `@NotNull public Map<String,Object> serialize()`
- `@NotNull public static Location deserialize(@NotNull Map<String,Object> args)`
- `public static float normalizeYaw(float yaw)`
- `public static float normalizePitch(float pitch)`
