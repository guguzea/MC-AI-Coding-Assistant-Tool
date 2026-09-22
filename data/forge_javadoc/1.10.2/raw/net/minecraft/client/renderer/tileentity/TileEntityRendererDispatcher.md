---
title: "TileEntityRendererDispatcher"
description: "public class TileEntityRendererDispatcher extends java.lang.Object"
package: "net/minecraft/client/renderer/tileentity"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/tileentity/TileEntityRendererDispatcher.html"
sourceType: javadoc
---

# TileEntityRendererDispatcher

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.tileentity.TileEntityRendererDispatcher

## Class signature

```java
public class TileEntityRendererDispatcher extends java.lang.Object
```

## Methods

- `void drawBatch(int pass)` — Render all TESRs batched so far.
- `FontRenderer getFontRenderer()`
- `<T extends TileEntity> TileEntitySpecialRenderer<T> getSpecialRenderer(TileEntity tileEntityIn)`
- `<T extends TileEntity> TileEntitySpecialRenderer<T> getSpecialRendererByClass(java.lang.Class<? extends TileEntity> teClass)`
- `void preDrawBatch()` — Prepare for a batched TESR rendering.
- `void prepare(World p_190056_1_, TextureManager p_190056_2_, FontRenderer p_190056_3_, Entity p_190056_4_, RayTraceResult p_190056_5_, float p_190056_6_)`
- `void renderTileEntity(TileEntity tileentityIn, float partialTicks, int destroyStage)`
- `void renderTileEntityAt(TileEntity tileEntityIn, double x, double y, double z, float partialTicks)`
- `void renderTileEntityAt(TileEntity tileEntityIn, double x, double y, double z, float partialTicks, int destroyStage)`
- `void setWorld(World worldIn)`

## Fields

- `RayTraceResult cameraHitResult`
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
