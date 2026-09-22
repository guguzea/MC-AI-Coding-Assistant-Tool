---
title: "TileEntitySpecialRenderer"
description: "public abstract class TileEntitySpecialRenderer<T extends TileEntity> extends java.lang.Object"
package: "net/minecraft/client/renderer/tileentity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/tileentity/TileEntitySpecialRenderer.html"
sourceType: javadoc
---

# TileEntitySpecialRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.tileentity.TileEntitySpecialRenderer<T>

## Class signature

```java
public abstract class TileEntitySpecialRenderer<T extends TileEntity> extends java.lang.Object
```

## Constructors

- `TileEntitySpecialRenderer()`

## Methods

- `protected void bindTexture(ResourceLocation location)`
- `boolean func_181055_a()`
- `FontRenderer getFontRenderer()`
- `protected World getWorld()`
- `abstract void renderTileEntityAt(T te, double x, double y, double z, float partialTicks, int destroyStage)`
- `void renderTileEntityFast(T te, double x, double y, double z, float partialTicks, int destroyStage, WorldRenderer worldRenderer)`
- `void setRendererDispatcher(TileEntityRendererDispatcher rendererDispatcherIn)`

## Fields

- `protected static ResourceLocation [] DESTROY_STAGES`
- `protected TileEntityRendererDispatcher rendererDispatcher`
