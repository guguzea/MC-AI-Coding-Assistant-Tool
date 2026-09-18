---
title: "RenderingRegistry"
description: "Add a new armour prefix to the RenderPlayer"
package: "cpw/mods/fml/client/registry"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/registry/RenderingRegistry.html"
sourceType: javadoc
---

# RenderingRegistry

## Class signature

```java
public class RenderingRegistry extends java.lang.Object
```

## Constructors

- `public RenderingRegistry()`

## Methods

- `public static int addNewArmourRendererPrefix(java.lang.String armor)`
- `public static void registerEntityRenderingHandler(java.lang.Class<? extends Entity > entityClass, Render renderer)`
- `public static void registerBlockHandler( ISimpleBlockRenderingHandler handler)`
- `public static void registerBlockHandler(int renderId, ISimpleBlockRenderingHandler handler)`
- `public static int getNextAvailableRenderId()`
- `@Deprecated public static RenderingRegistry instance()`
- `public boolean renderWorldBlock( RenderBlocks renderer, IBlockAccess world, int x, int y, int z, Block block, int modelId)`
- `public void renderInventoryBlock( RenderBlocks renderer, Block block, int metadata, int modelID)`
- `public boolean renderItemAsFull3DBlock(int modelId)`
- `public void loadEntityRenderers(java.util.Map<java.lang.Class<? extends Entity >, Render > rendererMap)`

## Description

Add a new armour prefix to the RenderPlayer
