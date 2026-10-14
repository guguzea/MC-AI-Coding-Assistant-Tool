---
title: "org.bukkit.util.noise.SimplexNoiseGenerator"
package: "org.bukkit.util.noise"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/util/noise/SimplexNoiseGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class SimplexNoiseGenerator**
`public class SimplexNoiseGenerator extends PerlinNoiseGenerator`
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
- `protected SimplexNoiseGenerator()`
- `public SimplexNoiseGenerator(@NotNull World world)`
- `public SimplexNoiseGenerator(long seed)`
- `public SimplexNoiseGenerator(@NotNull Random rand)`
- `protected static double dot(@NotNull int[] g, double x, double y)`
- `protected static double dot(@NotNull int[] g, double x, double y, double z)`
- `protected static double dot(@NotNull int[] g, double x, double y, double z, double w)`
- `public static double getNoise(double xin)`
- `public static double getNoise(double xin, double yin)`
- `public static double getNoise(double xin, double yin, double zin)`
- `public static double getNoise(double x, double y, double z, double w)`
- `public double noise(double xin, double yin, double zin)`
- `public double noise(double xin, double yin)`
- `public double noise(double x, double y, double z, double w)`
- `@NotNull public static SimplexNoiseGenerator getInstance()`
