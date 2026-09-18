---
title: "BlockRendererDispatcher"
description: "public class BlockRendererDispatcher extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/renderer"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/BlockRendererDispatcher.html"
sourceType: javadoc
---

# BlockRendererDispatcher

## Class signature

```java
public class BlockRendererDispatcher extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `public BlockRendererDispatcher( BlockModelShapes blockModelShapesIn, GameSettings gameSettingsIn)`

## Methods

- `public BlockModelShapes getBlockModelShapes()`
- `public void renderBlockDamage( IBlockState state, BlockPos pos, TextureAtlasSprite texture, IBlockAccess blockAccess)`
- `public boolean renderBlock( IBlockState state, BlockPos pos, IBlockAccess blockAccess, WorldRenderer worldRendererIn)`
- `public BlockModelRenderer getBlockModelRenderer()`
- `public IBakedModel getModelFromBlockState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public void renderBlockBrightness( IBlockState state, float brightness)`
- `public boolean isRenderTypeChest( Block p_175021_1_, int p_175021_2_)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`
