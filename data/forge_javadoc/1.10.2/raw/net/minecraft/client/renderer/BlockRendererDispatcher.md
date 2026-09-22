---
title: "BlockRendererDispatcher"
description: "public class BlockRendererDispatcher extends java.lang.Object implements IResourceManagerReloadListener"
package: "net/minecraft/client/renderer"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/BlockRendererDispatcher.html"
sourceType: javadoc
---

# BlockRendererDispatcher

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.BlockRendererDispatcher

## Class signature

```java
public class BlockRendererDispatcher extends java.lang.Object implements IResourceManagerReloadListener
```

## Constructors

- `BlockRendererDispatcher(BlockModelShapes p_i46577_1_, BlockColors p_i46577_2_)`

## Methods

- `BlockModelRenderer getBlockModelRenderer()`
- `BlockModelShapes getBlockModelShapes()`
- `IBakedModel getModelForState(IBlockState state)`
- `boolean isEntityBlockAnimated(Block blockIn)`
- `void onResourceManagerReload(IResourceManager resourceManager)`
- `boolean renderBlock(IBlockState state, BlockPos pos, IBlockAccess blockAccess, VertexBuffer worldRendererIn)`
- `void renderBlockBrightness(IBlockState state, float brightness)`
- `void renderBlockDamage(IBlockState state, BlockPos pos, TextureAtlasSprite texture, IBlockAccess blockAccess)`
