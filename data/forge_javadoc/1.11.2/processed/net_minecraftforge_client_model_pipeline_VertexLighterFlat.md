# VertexLighterFlat

## Class signature

```java
public class VertexLighterFlat extends QuadGatheringTransformer
```

## Constructors

- `public VertexLighterFlat( BlockColors colors)`

## Methods

- `public void setParent( IVertexConsumer parent)`
- `protected void processQuad()`
- `protected void applyAnaglyph(float[] color)`
- `protected void updateLightmap(float[] normal, float[] lightmap, float x, float y, float z)`
- `protected void updateColor(float[] normal, float[] color, float x, float y, float z, float tint, int multiplier)`
- `public void setQuadTint(int tint)`
- `public void setQuadOrientation( EnumFacing orientation)`
- `public void setQuadCulled()`
- `public void setTexture( TextureAtlasSprite texture)`
- `public void setApplyDiffuseLighting(boolean diffuse)`
- `public void setWorld( IBlockAccess world)`
- `public void setState( IBlockState state)`
- `public void setBlockPos( BlockPos blockPos)`
- `public void updateBlockInfo()`