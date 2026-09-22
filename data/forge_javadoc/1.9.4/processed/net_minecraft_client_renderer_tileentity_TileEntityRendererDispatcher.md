# TileEntityRendererDispatcher

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.tileentity.TileEntityRendererDispatcher

## Class signature

```java
public class TileEntityRendererDispatcher extends java.lang.Object
```

## Methods

- `void cacheActiveRenderInfo(World worldIn, TextureManager textureManagerIn, FontRenderer fontrendererIn, Entity entityIn, float partialTicks)`
- `void drawBatch(int pass)` — Render all TESRs batched so far.
- `FontRenderer getFontRenderer()`
- `<T extends TileEntity> TileEntitySpecialRenderer<T> getSpecialRenderer(TileEntity tileEntityIn)`
- `<T extends TileEntity> TileEntitySpecialRenderer<T> getSpecialRendererByClass(java.lang.Class<? extends TileEntity> teClass)`
- `void preDrawBatch()` — Prepare for a batched TESR rendering.
- `void renderTileEntity(TileEntity tileentityIn, float partialTicks, int destroyStage)`
- `void renderTileEntityAt(TileEntity tileEntityIn, double x, double y, double z, float partialTicks)`
- `void renderTileEntityAt(TileEntity tileEntityIn, double x, double y, double z, float partialTicks, int destroyStage)`
- `void setWorld(World worldIn)`

## Fields

- `Entity entity`
- `float entityPitch`
- `double entityX`
- `double entityY`
- `float entityYaw`
- `double entityZ`
- `static TileEntityRendererDispatcher instance`
- `java.util.Map<java.lang.Class<? extends TileEntity>, TileEntitySpecialRenderer<? extends TileEntity>> mapSpecialRenderers`
- `TextureManager renderEngine`
- `static double staticPlayerX`
- `static double staticPlayerY`
- `static double staticPlayerZ`
- `World worldObj`