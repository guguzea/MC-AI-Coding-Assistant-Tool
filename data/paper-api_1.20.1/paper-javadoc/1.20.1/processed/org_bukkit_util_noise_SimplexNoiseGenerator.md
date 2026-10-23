---
title: "org.bukkit.util.noise.SimplexNoiseGenerator"
package: "org.bukkit.util.noise"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/util/noise/SimplexNoiseGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

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
- `public SimplexNoiseGenerator(@NotNull @NotNull World world)`
- `public SimplexNoiseGenerator(long seed)`
- `public SimplexNoiseGenerator(@NotNull @NotNull Random rand)`
- `protected static double dot(@NotNull @org.jetbrains.annotations.NotNull int[] g, double x, double y)`
- `protected static double dot(@NotNull @org.jetbrains.annotations.NotNull int[] g, double x, double y, double z)`
- `protected static double dot(@NotNull @org.jetbrains.annotations.NotNull int[] g, double x, double y, double z, double w)`
- `public static double getNoise(double xin)`
- `public static double getNoise(double xin, double yin)`
- `public static double getNoise(double xin, double yin, double zin)`
- `public static double getNoise(double x, double y, double z, double w)`
- `public double noise(double xin, double yin, double zin)`
- `public double noise(double xin, double yin)`
- `public double noise(double x, double y, double z, double w)`
- `@NotNull public static @NotNull SimplexNoiseGenerator getInstance()`
