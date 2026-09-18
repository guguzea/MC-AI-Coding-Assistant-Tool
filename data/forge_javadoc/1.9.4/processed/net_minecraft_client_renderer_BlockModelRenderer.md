# BlockModelRenderer

## Class signature

```java
public class BlockModelRenderer extends java.lang.Object
```

## Constructors

- `public BlockModelRenderer( BlockColors blockColorsIn)`

## Methods

- `public boolean renderModel( IBlockAccess blockAccessIn, IBakedModel modelIn, IBlockState blockStateIn, BlockPos blockPosIn, VertexBuffer buffer, boolean checkSides)`
- `public boolean renderModel( IBlockAccess worldIn, IBakedModel modelIn, IBlockState stateIn, BlockPos posIn, VertexBuffer buffer, boolean checkSides, long rand)`
- `public boolean renderModelSmooth( IBlockAccess worldIn, IBakedModel modelIn, IBlockState stateIn, BlockPos posIn, VertexBuffer buffer, boolean checkSides, long rand)`
- `public boolean renderModelFlat( IBlockAccess worldIn, IBakedModel modelIn, IBlockState stateIn, BlockPos posIn, VertexBuffer buffer, boolean checkSides, long rand)`
- `public void renderModelBrightnessColor( IBakedModel bakedModel, float p_178262_2_, float red, float green, float blue)`
- `public void renderModelBrightnessColor( IBlockState state, IBakedModel p_187495_2_, float p_187495_3_, float p_187495_4_, float p_187495_5_, float p_187495_6_)`
- `public void renderModelBrightness( IBakedModel model, IBlockState state, float brightness, boolean p_178266_4_)`