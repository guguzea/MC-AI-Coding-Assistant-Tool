# TileEntityBeaconRenderer

## Class signature

```java
public class TileEntityBeaconRenderer extends TileEntitySpecialRenderer < TileEntityBeacon >
```

## Constructors

- `public TileEntityBeaconRenderer()`

## Methods

- `public void renderTileEntityAt( TileEntityBeacon te, double x, double y, double z, float partialTicks, int destroyStage)`
- `public void renderBeacon(double p_188206_1_, double p_188206_3_, double p_188206_5_, double p_188206_7_, double p_188206_9_, java.util.List< TileEntityBeacon.BeamSegment > p_188206_11_, double p_188206_12_)`
- `public static void renderBeamSegment(double x, double y, double z, double partialTicks, double textureScale, double totalWorldTime, int yOffset, int height, float[] colors)`
- `public static void renderBeamSegment(double x, double y, double z, double partialTicks, double textureScale, double totalWorldTime, int yOffset, int height, float[] colors, double beamRadius, double glowRadius)`
- `public boolean isGlobalRenderer( TileEntityBeacon te)`