---
title: "org.bukkit.util.noise.OctaveGenerator"
package: "org.bukkit.util.noise"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/util/noise/OctaveGenerator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class OctaveGenerator**
`public abstract class OctaveGenerator extends Object`
- `@NotNull protected final NoiseGenerator[] octaves`
- `protected double xScale`
- `protected double yScale`
- `protected double zScale`
- `protected OctaveGenerator(@NotNull NoiseGenerator[] octaves)`
- `public void setScale(double scale)`
- `public double getXScale()`
- `public void setXScale(double scale)`
- `public double getYScale()`
- `public void setYScale(double scale)`
- `public double getZScale()`
- `public void setZScale(double scale)`
- `@NotNull public NoiseGenerator[] getOctaves()`
- `public double noise(double x, double frequency, double amplitude)`
- `public double noise(double x, double frequency, double amplitude, boolean normalized)`
- `public double noise(double x, double y, double frequency, double amplitude)`
- `public double noise(double x, double y, double frequency, double amplitude, boolean normalized)`
- `public double noise(double x, double y, double z, double frequency, double amplitude)`
- `public double noise(double x, double y, double z, double frequency, double amplitude, boolean normalized)`
