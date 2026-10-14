---
title: "org.bukkit.util.noise.NoiseGenerator"
package: "org.bukkit.util.noise"
source: https://jd.papermc.io/paper/26.3/org/bukkit/util/noise/NoiseGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class NoiseGenerator**
`public abstract class NoiseGenerator extends Object`
- `protected final int[] perm`
- `protected double offsetX`
- `protected double offsetY`
- `protected double offsetZ`
- `public NoiseGenerator()`
- `public static int floor(double x)`
- `protected static double fade(double x)`
- `protected static double lerp(double x, double y, double z)`
- `protected static double grad(int hash, double x, double y, double z)`
- `public double noise(double x)`
- `public double noise(double x, double y)`
- `public abstract double noise(double x, double y, double z)`
- `public double noise(double x, int octaves, double frequency, double amplitude)`
- `public double noise(double x, int octaves, double frequency, double amplitude, boolean normalized)`
- `public double noise(double x, double y, int octaves, double frequency, double amplitude)`
- `public double noise(double x, double y, int octaves, double frequency, double amplitude, boolean normalized)`
- `public double noise(double x, double y, double z, int octaves, double frequency, double amplitude)`
- `public double noise(double x, double y, double z, int octaves, double frequency, double amplitude, boolean normalized)`
