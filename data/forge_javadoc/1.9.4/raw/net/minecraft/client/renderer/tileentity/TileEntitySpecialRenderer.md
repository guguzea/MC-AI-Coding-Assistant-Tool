---
title: "TileEntitySpecialRenderer"
description: "public abstract class TileEntitySpecialRenderer<T extends TileEntity > extends java.lang.Object"
package: "net/minecraft/client/renderer/tileentity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/tileentity/TileEntitySpecialRenderer.html"
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
- `public boolean isGlobalRenderer( T te)`
- `public void renderTileEntityFast( T te, double x, double y, double z, float partialTicks, int destroyStage, VertexBuffer buffer)`
