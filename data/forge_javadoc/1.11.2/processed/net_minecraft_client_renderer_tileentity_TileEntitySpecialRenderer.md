# TileEntitySpecialRenderer

## Class signature

```java
public abstract class TileEntitySpecialRenderer<T extends TileEntity > extends java.lang.Object
```

## Constructors

- `public TileEntitySpecialRenderer()`

## Methods

- `public void renderTileEntityAt( T te, double x, double y, double z, float partialTicks, int destroyStage)`
- `protected void setLightmapDisabled(boolean disabled)`
- `protected void bindTexture( ResourceLocation location)`
- `protected World getWorld()`
- `public void setRendererDispatcher( TileEntityRendererDispatcher rendererDispatcherIn)`
- `public FontRenderer getFontRenderer()`
- `public boolean isGlobalRenderer( T te)`
- `public void renderTileEntityFast( T te, double x, double y, double z, float partialTicks, int destroyStage, VertexBuffer buffer)`
- `protected void drawNameplate( T te, java.lang.String str, double x, double y, double z, int maxDistance)`