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