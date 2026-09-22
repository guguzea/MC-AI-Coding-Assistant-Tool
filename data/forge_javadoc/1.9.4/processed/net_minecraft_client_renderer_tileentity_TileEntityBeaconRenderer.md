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
- `static void renderBeamSegment(double p_188204_0_, double p_188204_2_, double p_188204_4_, double p_188204_6_, double p_188204_8_, double p_188204_10_, int p_188204_12_, int p_188204_13_, float[] p_188204_14_)`
- `static void renderBeamSegment(double p_188205_0_, double p_188205_2_, double p_188205_4_, double p_188205_6_, double p_188205_8_, double p_188205_10_, int p_188205_12_, int p_188205_13_, float[] p_188205_14_, double p_188205_15_, double p_188205_17_)`
- `void renderTileEntityAt(TileEntityBeacon te, double x, double y, double z, float partialTicks, int destroyStage)`

## Fields

- `static ResourceLocation TEXTURE_BEACON_BEAM`