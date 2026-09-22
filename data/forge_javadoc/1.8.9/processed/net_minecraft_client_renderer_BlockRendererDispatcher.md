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