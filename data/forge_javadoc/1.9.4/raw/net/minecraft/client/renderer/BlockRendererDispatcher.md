---
title: "BlockRendererDispatcher"
description: "public class BlockRendererDispatcher extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/renderer"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/client/renderer/BlockRendererDispatcher.html"
sourceType: javadoc
---

# BlockRendererDispatcher

## Class signature

```java
public class BlockRendererDispatcher extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public BlockRendererDispatcher( BlockModelShapes p_i46577_1_, BlockColors p_i46577_2_)`

## Methods

- `public BlockModelShapes getBlockModelShapes()`
- `public void renderBlockDamage( IBlockState state, BlockPos pos, TextureAtlasSprite texture, IBlockAccess blockAccess)`
- `public boolean renderBlock( IBlockState state, BlockPos pos, IBlockAccess blockAccess, VertexBuffer worldRendererIn)`
- `public BlockModelRenderer getBlockModelRenderer()`
- `public IBakedModel getModelForState( IBlockState state)`
- `public void renderBlockBrightness( IBlockState state, float brightness)`
- `public boolean isEntityBlockAnimated( Block blockIn)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`
