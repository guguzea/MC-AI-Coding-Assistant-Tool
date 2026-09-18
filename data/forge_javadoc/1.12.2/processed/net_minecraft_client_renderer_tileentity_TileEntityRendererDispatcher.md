# TileEntityRendererDispatcher

## Class signature

```java
public class TileEntityRendererDispatcher extends java.lang.Object
```

## Methods

- `public <T extends TileEntity > TileEntitySpecialRenderer <T> getRenderer(java.lang.Class<? extends TileEntity > teClass)`
- `public <T extends TileEntity > TileEntitySpecialRenderer <T> getRenderer( TileEntity tileEntityIn)`
- `public void prepare( World worldIn, TextureManager renderEngineIn, FontRenderer fontRendererIn, Entity entityIn, RayTraceResult cameraHitResultIn, float p_190056_6_)`
- `public void render( TileEntity tileentityIn, float partialTicks, int destroyStage)`
- `public void render( TileEntity tileEntityIn, double x, double y, double z, float partialTicks)`
- `public void render( TileEntity p_192855_1_, double p_192855_2_, double p_192855_4_, double p_192855_6_, float p_192855_8_, float p_192855_9_)`
- `public void render( TileEntity tileEntityIn, double x, double y, double z, float partialTicks, int destroyStage, float p_192854_10_)`
- `public void setWorld( World worldIn)`
- `public FontRenderer getFontRenderer()`
- `public void preDrawBatch()`
- `public void drawBatch(int pass)`

## Description

Render all TESRs batched so far.