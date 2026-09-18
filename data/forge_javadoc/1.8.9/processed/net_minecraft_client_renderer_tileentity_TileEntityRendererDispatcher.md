# TileEntityRendererDispatcher

## Class signature

```java
public class TileEntityRendererDispatcher extends java.lang.Object
```

## Methods

- `public <T extends TileEntity > TileEntitySpecialRenderer <T> getSpecialRendererByClass(java.lang.Class<? extends TileEntity > teClass)`
- `public <T extends TileEntity > TileEntitySpecialRenderer <T> getSpecialRenderer( TileEntity tileEntityIn)`
- `public void cacheActiveRenderInfo( World worldIn, TextureManager textureManagerIn, FontRenderer fontrendererIn, Entity entityIn, float partialTicks)`
- `public void renderTileEntity( TileEntity tileentityIn, float partialTicks, int destroyStage)`
- `public void renderTileEntityAt( TileEntity tileEntityIn, double x, double y, double z, float partialTicks)`
- `public void renderTileEntityAt( TileEntity tileEntityIn, double x, double y, double z, float partialTicks, int destroyStage)`
- `public void setWorld( World worldIn)`
- `public FontRenderer getFontRenderer()`
- `public void preDrawBatch()`
- `public void drawBatch(int pass)`

## Description

The player's current X position (same as playerX)