---
title: "TileEntitySpecialRenderer"
description: "public abstract class TileEntitySpecialRenderer<T extends TileEntity > extends java.lang.Object"
package: "net/minecraft/client/renderer/tileentity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/tileentity/TileEntitySpecialRenderer.html"
sourceType: javadoc
---

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
