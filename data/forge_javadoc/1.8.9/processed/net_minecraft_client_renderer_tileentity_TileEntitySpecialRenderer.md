# TileEntitySpecialRenderer

## Class signature

```java
public abstract class TileEntitySpecialRenderer<T extends TileEntity > extends java.lang.Object
```

## Constructors

- `public TileEntitySpecialRenderer()`

## Methods

- `public abstract void renderTileEntityAt( T te, double x, double y, double z, float partialTicks, int destroyStage)`
- `protected void bindTexture( ResourceLocation location)`
- `protected World getWorld()`
- `public void setRendererDispatcher( TileEntityRendererDispatcher rendererDispatcherIn)`
- `public FontRenderer getFontRenderer()`
- `public boolean func_181055_a()`
- `public void renderTileEntityFast( T te, double x, double y, double z, float partialTicks, int destroyStage, WorldRenderer worldRenderer)`