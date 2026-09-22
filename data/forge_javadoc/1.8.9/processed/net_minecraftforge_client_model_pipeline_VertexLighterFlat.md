# VertexLighterFlat

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.pipeline.QuadGatheringTransformer → net.minecraftforge.client.model.pipeline.VertexLighterFlat

## Class signature

```java
public class VertexLighterFlat extends QuadGatheringTransformer
```

## Constructors

- `VertexLighterFlat()`

## Methods

- `protected void applyAnaglyph(float[] color)`
- `protected void processQuad()`
- `void setBlock(Block block)`
- `void setBlockPos(BlockPos blockPos)`
- `void setParent(IVertexConsumer parent)`
- `void setQuadColored()`
- `void setQuadCulled()`
- `void setQuadOrientation(EnumFacing orientation)`
- `void setQuadTint(int tint)`
- `void setWorld(IBlockAccess world)`
- `void updateBlockInfo()`
- `protected void updateColor(float[] normal, float[] color, float x, float y, float z, float tint, int multiplier)`
- `protected void updateLightmap(float[] normal, float[] lightmap, float x, float y, float z)`

## Fields

- `protected BlockInfo blockInfo`
- `protected int colorIndex`
- `protected int lightmapIndex`
- `protected int normalIndex`
- `protected int posIndex`