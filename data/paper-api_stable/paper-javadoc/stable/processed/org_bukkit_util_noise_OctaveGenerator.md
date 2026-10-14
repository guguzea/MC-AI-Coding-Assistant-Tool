---
title: "org.bukkit.util.noise.OctaveGenerator"
package: "org.bukkit.util.noise"
source: https://jd.papermc.io/paper/26.3/org/bukkit/util/noise/OctaveGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class OctaveGenerator**
`public abstract class OctaveGenerator extends Object`
- `@NotNull protected final @NotNull NoiseGenerator[] octaves`
- `protected double xScale`
- `protected double yScale`
- `protected double zScale`
- `protected OctaveGenerator(@NotNull @NotNull NoiseGenerator @NotNull [] octaves)`
- `public void setScale(double scale)`
- `public double getXScale()`
- `public void setXScale(double scale)`
- `public double getYScale()`
- `public void setYScale(double scale)`
- `public double getZScale()`
- `public void setZScale(double scale)`
- `@NotNull public @NotNull NoiseGenerator @NotNull [] getOctaves()`
- `public double noise(double x, double frequency, double amplitude)`
- `public double noise(double x, double frequency, double amplitude, boolean normalized)`
- `public double noise(double x, double y, double frequency, double amplitude)`
- `public double noise(double x, double y, double frequency, double amplitude, boolean normalized)`
- `public double noise(double x, double y, double z, double frequency, double amplitude)`
- `public double noise(double x, double y, double z, double frequency, double amplitude, boolean normalized)`
