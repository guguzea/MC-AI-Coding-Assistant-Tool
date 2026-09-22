---
title: "TileEntityRendererDispatcher"
description: "public class TileEntityRendererDispatcher extends java.lang.Object"
package: "net/minecraft/client/renderer/tileentity"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/renderer/tileentity/TileEntityRendererDispatcher.html"
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
- `<T extends TileEntity> TileEntitySpecialRenderer<T> getRenderer(java.lang.Class<? extends TileEntity> teClass)`
- `<T extends TileEntity> TileEntitySpecialRenderer<T> getRenderer(TileEntity tileEntityIn)`
- `void preDrawBatch()` — Prepare for a batched TESR rendering.
- `void prepare(World worldIn, TextureManager renderEngineIn, FontRenderer fontRendererIn, Entity entityIn, RayTraceResult cameraHitResultIn, float p_190056_6_)`
- `void render(TileEntity tileEntityIn, double x, double y, double z, float partialTicks)`
- `void render(TileEntity p_192855_1_, double p_192855_2_, double p_192855_4_, double p_192855_6_, float p_192855_8_, float p_192855_9_)`
- `void render(TileEntity tileEntityIn, double x, double y, double z, float partialTicks, int destroyStage, float p_192854_10_)`
- `void render(TileEntity tileentityIn, float partialTicks, int destroyStage)`
- `void setWorld(World worldIn)`

## Fields

- `RayTraceResult cameraHitResult`
- `Entity entity`
- `float entityPitch`
- `double entityX`
- `double entityY`
- `float entityYaw`
- `double entityZ`
- `FontRenderer fontRenderer`
- `static TileEntityRendererDispatcher instance`
- `TextureManager renderEngine`
- `java.util.Map<java.lang.Class<? extends TileEntity>, TileEntitySpecialRenderer<? extends TileEntity>> renderers`
- `static double staticPlayerX`
- `static double staticPlayerY`
- `static double staticPlayerZ`
- `World world`
