---
title: "TileEntityBeaconRenderer"
description: "public class TileEntityBeaconRenderer extends TileEntitySpecialRenderer<TileEntityBeacon>"
package: "net/minecraft/client/renderer/tileentity"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/tileentity/TileEntityBeaconRenderer.html"
sourceType: javadoc
---

# TileEntityBeaconRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.tileentity.TileEntitySpecialRenderer<TileEntityBeacon> → net.minecraft.client.renderer.tileentity.TileEntityBeaconRenderer

## Class signature

```java
public class TileEntityBeaconRenderer extends TileEntitySpecialRenderer<TileEntityBeacon>
```

## Constructors

- `TileEntityBeaconRenderer()`

## Methods

- `boolean isGlobalRenderer(TileEntityBeacon te)`
- `void renderBeacon(double p_188206_1_, double p_188206_3_, double p_188206_5_, double p_188206_7_, double p_188206_9_, java.util.List<TileEntityBeacon.BeamSegment> p_188206_11_, double p_188206_12_)`
- `static void renderBeamSegment(double x, double y, double z, double partialTicks, double textureScale, double totalWorldTime, int yOffset, int height, float[] colors)`
- `static void renderBeamSegment(double x, double y, double z, double partialTicks, double textureScale, double totalWorldTime, int yOffset, int height, float[] colors, double beamRadius, double glowRadius)`
- `void renderTileEntityAt(TileEntityBeacon te, double x, double y, double z, float partialTicks, int destroyStage)`

## Fields

- `static ResourceLocation TEXTURE_BEACON_BEAM`
