---
title: "BlockRendererDispatcher"
description: "public class BlockRendererDispatcher extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/renderer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/BlockRendererDispatcher.html"
sourceType: javadoc
---

# BlockRendererDispatcher

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.BlockRendererDispatcher

## Class signature

```java
public class BlockRendererDispatcher extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `BlockRendererDispatcher(BlockModelShapes blockModelShapesIn, GameSettings gameSettingsIn)`

## Methods

- `BlockModelRenderer getBlockModelRenderer()`
- `BlockModelShapes getBlockModelShapes()`
- `IBakedModel getModelFromBlockState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `boolean isRenderTypeChest(Block p_175021_1_, int p_175021_2_)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `boolean renderBlock(IBlockState state, BlockPos pos, IBlockAccess blockAccess, WorldRenderer worldRendererIn)`
- `void renderBlockBrightness(IBlockState state, float brightness)`
- `void renderBlockDamage(IBlockState state, BlockPos pos, TextureAtlasSprite texture, IBlockAccess blockAccess)`
