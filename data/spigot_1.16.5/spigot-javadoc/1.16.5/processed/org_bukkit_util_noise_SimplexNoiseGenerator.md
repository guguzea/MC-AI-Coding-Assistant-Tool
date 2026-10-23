---
title: "org.bukkit.util.noise.SimplexNoiseGenerator"
package: "org.bukkit.util.noise"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.util.noise.SimplexNoiseGenerator extends org.bukkit.util.noise.PerlinNoiseGenerator`
- `protected static final double SQRT_3`
- `protected static final double SQRT_5`
- `protected static final double F2`
- `protected static final double G2`
- `protected static final double G22`
- `protected static final double F3`
- `protected static final double G3`
- `protected static final double F4`
- `protected static final double G4`
- `protected static final double G42`
- `protected static final double G43`
- `protected static final double G44`
- `protected static final int[][] grad4`
- `protected static final int[][] simplex`
- `protected double offsetW`
- `protected org.bukkit.util.noise.SimplexNoiseGenerator()`
- `public org.bukkit.util.noise.SimplexNoiseGenerator(org.bukkit.World)`
- `public org.bukkit.util.noise.SimplexNoiseGenerator(long)`
- `public org.bukkit.util.noise.SimplexNoiseGenerator(java.util.Random)`
- `protected static double dot(int[], double, double)`
- `protected static double dot(int[], double, double, double)`
- `protected static double dot(int[], double, double, double, double)`
- `public static double getNoise(double)`
- `public static double getNoise(double, double)`
- `public static double getNoise(double, double, double)`
- `public static double getNoise(double, double, double, double)`
- `public double noise(double, double, double)`
- `public double noise(double, double)`
- `public double noise(double, double, double, double)`
- `public static org.bukkit.util.noise.SimplexNoiseGenerator getInstance()`
