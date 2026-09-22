---
title: "VertexLighterFlat"
description: "public class VertexLighterFlat extends QuadGatheringTransformer"
package: "net/minecraftforge/client/model/pipeline"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/pipeline/VertexLighterFlat.html"
sourceType: javadoc
---

# VertexLighterFlat

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.pipeline.QuadGatheringTransformer → net.minecraftforge.client.model.pipeline.VertexLighterFlat

## Class signature

```java
public class VertexLighterFlat extends QuadGatheringTransformer
```

## Constructors

- `VertexLighterFlat(BlockColors colors)`

## Methods

- `protected void applyAnaglyph(float[] color)`
- `protected void processQuad()`
- `void resetBlockInfo()`
- `void setApplyDiffuseLighting(boolean diffuse)`
- `void setBlockPos(BlockPos blockPos)`
- `void setParent(IVertexConsumer parent)`
- `void setQuadCulled()`
- `void setQuadOrientation(EnumFacing orientation)`
- `void setQuadTint(int tint)`
- `void setState(IBlockState state)`
- `void setTexture(TextureAtlasSprite texture)`
- `void setVertexFormat(VertexFormat format)`
- `void setWorld(IBlockAccess world)`
- `void updateBlockInfo()`
- `protected void updateColor(float[] normal, float[] color, float x, float y, float z, float tint, int multiplier)`
- `protected void updateLightmap(float[] normal, float[] lightmap, float x, float y, float z)`

## Fields

- `protected VertexFormat baseFormat`
- `protected BlockInfo blockInfo`
- `protected int colorIndex`
- `protected int lightmapIndex`
- `protected static VertexFormatElement NORMAL_4F`
- `protected int normalIndex`
- `protected int posIndex`
