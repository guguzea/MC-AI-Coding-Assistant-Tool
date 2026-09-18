---
title: "TileEntityBeaconRenderer"
description: "public class TileEntityBeaconRenderer extends TileEntitySpecialRenderer < TileEntityBeacon >"
package: "net/minecraft/client/renderer/tileentity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/tileentity/TileEntityBeaconRenderer.html"
sourceType: javadoc
---

# TileEntityBeaconRenderer

## Class signature

```java
public class TileEntityBeaconRenderer extends TileEntitySpecialRenderer < TileEntityBeacon >
```

## Constructors

- `public TileEntityBeaconRenderer()`

## Methods

- `public void render( TileEntityBeacon te, double x, double y, double z, float partialTicks, int destroyStage, float alpha)`
- `public void renderBeacon(double x, double y, double z, double partialTicks, double textureScale, java.util.List< TileEntityBeacon.BeamSegment > beamSegments, double totalWorldTime)`
- `public static void renderBeamSegment(double x, double y, double z, double partialTicks, double textureScale, double totalWorldTime, int yOffset, int height, float[] colors)`
- `public static void renderBeamSegment(double x, double y, double z, double partialTicks, double textureScale, double totalWorldTime, int yOffset, int height, float[] colors, double beamRadius, double glowRadius)`
- `public boolean isGlobalRenderer( TileEntityBeacon te)`
