---
title: "org.bukkit.Location"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.Location implements java.lang.Cloneable,org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public org.bukkit.Location(org.bukkit.World, double, double, double)`
- `public org.bukkit.Location(org.bukkit.World, double, double, double, float, float)`
- `public void setWorld(org.bukkit.World)`
- `public boolean isWorldLoaded()`
- `public org.bukkit.World getWorld()`
- `public org.bukkit.Chunk getChunk()`
- `public org.bukkit.block.Block getBlock()`
- `public void setX(double)`
- `public double getX()`
- `public int getBlockX()`
- `public void setY(double)`
- `public double getY()`
- `public int getBlockY()`
- `public void setZ(double)`
- `public double getZ()`
- `public int getBlockZ()`
- `public void setYaw(float)`
- `public float getYaw()`
- `public void setPitch(float)`
- `public float getPitch()`
- `public org.bukkit.util.Vector getDirection()`
- `public org.bukkit.Location setDirection(org.bukkit.util.Vector)`
- `public org.bukkit.Location add(org.bukkit.Location)`
- `public org.bukkit.Location add(org.bukkit.util.Vector)`
- `public org.bukkit.Location add(double, double, double)`
- `public org.bukkit.Location subtract(org.bukkit.Location)`
- `public org.bukkit.Location subtract(org.bukkit.util.Vector)`
- `public org.bukkit.Location subtract(double, double, double)`
- `public double length()`
- `public double lengthSquared()`
- `public double distance(org.bukkit.Location)`
- `public double distanceSquared(org.bukkit.Location)`
- `public org.bukkit.Location multiply(double)`
- `public org.bukkit.Location zero()`
- `public boolean equals(java.lang.Object)`
- `public int hashCode()`
- `public java.lang.String toString()`
- `public org.bukkit.util.Vector toVector()`
- `public org.bukkit.Location clone()`
- `public void checkFinite() throws java.lang.IllegalArgumentException`
- `public static int locToBlock(double)`
- `public java.util.Map<java.lang.String, java.lang.Object> serialize()`
- `public static org.bukkit.Location deserialize(java.util.Map<java.lang.String, java.lang.Object>)`
- `public static float normalizeYaw(float)`
- `public static float normalizePitch(float)`
- `public java.lang.Object clone() throws java.lang.CloneNotSupportedException`
