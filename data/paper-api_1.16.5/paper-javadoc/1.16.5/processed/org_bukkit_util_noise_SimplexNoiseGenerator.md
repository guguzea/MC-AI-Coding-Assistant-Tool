---
title: "org.bukkit.util.noise.SimplexNoiseGenerator"
package: "org.bukkit.util.noise"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/util/noise/SimplexNoiseGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
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
- `public SimplexNoiseGenerator&#8203;(@NotNull @NotNull World world)`
- `public SimplexNoiseGenerator&#8203;(long seed)`
- `public SimplexNoiseGenerator&#8203;(@NotNull @NotNull Random rand)`
- `protected static double dot&#8203;(@NotNull @org.jetbrains.annotations.NotNull int[] g, double x, double y)`
- `protected static double dot&#8203;(@NotNull @org.jetbrains.annotations.NotNull int[] g, double x, double y, double z)`
- `protected static double dot&#8203;(@NotNull @org.jetbrains.annotations.NotNull int[] g, double x, double y, double z, double w)`
- `public static double getNoise&#8203;(double xin)`
- `public static double getNoise&#8203;(double xin, double yin)`
- `public static double getNoise&#8203;(double xin, double yin, double zin)`
- `public static double getNoise&#8203;(double x, double y, double z, double w)`
- `public double noise&#8203;(double xin, double yin, double zin)`
- `public double noise&#8203;(double xin, double yin)`
- `public double noise&#8203;(double x, double y, double z, double w)`
- `@NotNull public static @NotNull SimplexNoiseGenerator getInstance()`
