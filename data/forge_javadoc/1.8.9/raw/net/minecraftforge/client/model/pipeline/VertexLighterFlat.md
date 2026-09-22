---
title: "VertexLighterFlat"
description: "public class VertexLighterFlat extends QuadGatheringTransformer"
package: "net/minecraftforge/client/model/pipeline"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/pipeline/VertexLighterFlat.html"
sourceType: javadoc
---

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
