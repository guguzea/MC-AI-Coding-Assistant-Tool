---
title: "VertexLighterFlat"
description: "public class VertexLighterFlat extends QuadGatheringTransformer"
package: "net/minecraftforge/client/model/pipeline"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/client/model/pipeline/VertexLighterFlat.html"
sourceType: javadoc
---

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
- `public void setApplyDiffuseLighting(boolean diffuse)`
- `public void setWorld( IBlockAccess world)`
- `public void setState( IBlockState state)`
- `public void setBlockPos( BlockPos blockPos)`
- `public void updateBlockInfo()`
