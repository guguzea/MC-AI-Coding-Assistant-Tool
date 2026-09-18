---
title: "TileEntityRendererDispatcher"
description: "Render all TESRs batched so far."
package: "net/minecraft/client/renderer/tileentity"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/tileentity/TileEntityRendererDispatcher.html"
sourceType: javadoc
---

# TileEntityRendererDispatcher

## Class signature

```java
public class TileEntityRendererDispatcher extends java.lang.Object
```

## Methods

- `public <T extends TileEntity > TileEntitySpecialRenderer <T> getSpecialRendererByClass(java.lang.Class<? extends TileEntity > teClass)`
- `@Nullable public <T extends TileEntity > TileEntitySpecialRenderer <T> getSpecialRenderer(@Nullable TileEntity tileEntityIn)`
- `public void prepare( World p_190056_1_, TextureManager p_190056_2_, FontRenderer p_190056_3_, Entity p_190056_4_, RayTraceResult p_190056_5_, float p_190056_6_)`
- `public void renderTileEntity( TileEntity tileentityIn, float partialTicks, int destroyStage)`
- `public void renderTileEntityAt( TileEntity tileEntityIn, double x, double y, double z, float partialTicks)`
- `public void renderTileEntityAt( TileEntity tileEntityIn, double x, double y, double z, float partialTicks, int destroyStage)`
- `public void setWorld(@Nullable World worldIn)`
- `public FontRenderer getFontRenderer()`
- `public void preDrawBatch()`
- `public void drawBatch(int pass)`

## Description

Render all TESRs batched so far.
