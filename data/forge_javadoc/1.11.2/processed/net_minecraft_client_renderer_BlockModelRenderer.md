# BlockModelRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.BlockModelRenderer

## Class signature

```java
public class BlockModelRenderer extends java.lang.Object
```

## Constructors

- `BlockModelRenderer(BlockColors blockColorsIn)`

## Methods

- `boolean renderModel(IBlockAccess blockAccessIn, IBakedModel modelIn, IBlockState blockStateIn, BlockPos blockPosIn, VertexBuffer buffer, boolean checkSides)`
- `boolean renderModel(IBlockAccess worldIn, IBakedModel modelIn, IBlockState stateIn, BlockPos posIn, VertexBuffer buffer, boolean checkSides, long rand)`
- `void renderModelBrightness(IBakedModel model, IBlockState state, float brightness, boolean p_178266_4_)`
- `void renderModelBrightnessColor(IBakedModel bakedModel, float p_178262_2_, float red, float green, float blue)`
- `void renderModelBrightnessColor(IBlockState state, IBakedModel p_187495_2_, float p_187495_3_, float p_187495_4_, float p_187495_5_, float p_187495_6_)`
- `boolean renderModelFlat(IBlockAccess worldIn, IBakedModel modelIn, IBlockState stateIn, BlockPos posIn, VertexBuffer buffer, boolean checkSides, long rand)`
- `boolean renderModelSmooth(IBlockAccess worldIn, IBakedModel modelIn, IBlockState stateIn, BlockPos posIn, VertexBuffer buffer, boolean checkSides, long rand)`