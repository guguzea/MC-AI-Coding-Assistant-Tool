# ForgeBlockModelRenderer

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.BlockModelRenderer → net.minecraftforge.client.model.pipeline.ForgeBlockModelRenderer

## Class signature

```java
public class ForgeBlockModelRenderer extends BlockModelRenderer
```

## Constructors

- `ForgeBlockModelRenderer(BlockColors colors)`

## Methods

- `static boolean render(VertexLighterFlat lighter, IBlockAccess world, IBakedModel model, IBlockState state, BlockPos pos, VertexBuffer wr, boolean checkSides, long rand)`
- `boolean renderModelFlat(IBlockAccess world, IBakedModel model, IBlockState state, BlockPos pos, VertexBuffer buffer, boolean checkSides, long rand)`
- `boolean renderModelSmooth(IBlockAccess world, IBakedModel model, IBlockState state, BlockPos pos, VertexBuffer buffer, boolean checkSides, long rand)`