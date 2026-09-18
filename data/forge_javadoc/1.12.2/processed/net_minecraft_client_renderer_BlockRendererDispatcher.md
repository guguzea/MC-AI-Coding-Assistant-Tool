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
- `public boolean renderBlock( IBlockState state, BlockPos pos, IBlockAccess blockAccess, BufferBuilder bufferBuilderIn)`
- `public BlockModelRenderer getBlockModelRenderer()`
- `public IBakedModel getModelForState( IBlockState state)`
- `public void renderBlockBrightness( IBlockState state, float brightness)`
- `public void onResourceManagerReload( IResourceManager resourceManager)`