---
title: "RenderingRegistry"
description: "public class RenderingRegistry extends java.lang.Object"
package: "cpw/mods/fml/client/registry"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/client/registry/RenderingRegistry.html"
sourceType: javadoc
---

# RenderingRegistry

**Inheritance:** java.lang.Object → cpw.mods.fml.client.registry.RenderingRegistry

## Class signature

```java
public class RenderingRegistry extends java.lang.Object
```

## Constructors

- `RenderingRegistry()`

## Methods

- `static int addNewArmourRendererPrefix(java.lang.String armor)` — Add a new armour prefix to the RenderPlayer
- `static int getNextAvailableRenderId()` — Get the next available renderId from the block render ID list
- `@Deprecated static RenderingRegistry instance()`
- `void loadEntityRenderers(java.util.Map<java.lang.Class<? extends Entity>, Render> rendererMap)`
- `static void registerBlockHandler(int renderId, ISimpleBlockRenderingHandler handler)` — Register the simple block rendering handler This version will not call getRenderId on the passed in handler, instead using the supplied ID, so you can easily re-use the same rendering handler for multiple IDs
- `static void registerBlockHandler(ISimpleBlockRenderingHandler handler)` — Register a simple block rendering handler
- `static void registerEntityRenderingHandler(java.lang.Class<? extends Entity> entityClass, Render renderer)` — Register an entity rendering handler.
- `void renderInventoryBlock(RenderBlocks renderer, Block block, int metadata, int modelID)`
- `boolean renderItemAsFull3DBlock(int modelId)`
- `boolean renderWorldBlock(RenderBlocks renderer, IBlockAccess world, int x, int y, int z, Block block, int modelId)`
