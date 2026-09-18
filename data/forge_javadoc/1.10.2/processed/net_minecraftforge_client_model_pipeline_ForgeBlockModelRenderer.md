# ForgeBlockModelRenderer

## Class signature

```java
public class ForgeBlockModelRenderer extends BlockModelRenderer
```

## Constructors

- `public ForgeBlockModelRenderer( BlockColors colors)`

## Methods

- `public boolean renderModelFlat( IBlockAccess world, IBakedModel model, IBlockState state, BlockPos pos, VertexBuffer buffer, boolean checkSides, long rand)`
- `public boolean renderModelSmooth( IBlockAccess world, IBakedModel model, IBlockState state, BlockPos pos, VertexBuffer buffer, boolean checkSides, long rand)`
- `public static boolean render( VertexLighterFlat lighter, IBlockAccess world, IBakedModel model, IBlockState state, BlockPos pos, VertexBuffer wr, boolean checkSides, long rand)`