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
- `void render(TileEntityBeacon te, double x, double y, double z, float partialTicks, int destroyStage, float alpha)`
- `void renderBeacon(double x, double y, double z, double partialTicks, double textureScale, java.util.List<TileEntityBeacon.BeamSegment> beamSegments, double totalWorldTime)`
- `static void renderBeamSegment(double x, double y, double z, double partialTicks, double textureScale, double totalWorldTime, int yOffset, int height, float[] colors)`
- `static void renderBeamSegment(double x, double y, double z, double partialTicks, double textureScale, double totalWorldTime, int yOffset, int height, float[] colors, double beamRadius, double glowRadius)`

## Fields

- `static ResourceLocation TEXTURE_BEACON_BEAM`