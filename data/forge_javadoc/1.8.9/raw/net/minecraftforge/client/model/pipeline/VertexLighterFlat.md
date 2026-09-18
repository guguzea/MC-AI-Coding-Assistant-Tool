---
title: "VertexLighterFlat"
description: "public class VertexLighterFlat extends QuadGatheringTransformer"
package: "net/minecraftforge/client/model/pipeline"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/pipeline/VertexLighterFlat.html"
sourceType: javadoc
---

# VertexLighterFlat

## Class signature

```java
public class VertexLighterFlat extends QuadGatheringTransformer
```

## Constructors

- `public VertexLighterFlat()`

## Methods

- `public void setParent( IVertexConsumer parent)`
- `protected void processQuad()`
- `protected void applyAnaglyph(float[] color)`
- `protected void updateLightmap(float[] normal, float[] lightmap, float x, float y, float z)`
- `protected void updateColor(float[] normal, float[] color, float x, float y, float z, float tint, int multiplier)`
- `public void setQuadTint(int tint)`
- `public void setQuadOrientation( EnumFacing orientation)`
- `public void setQuadCulled()`
- `public void setQuadColored()`
- `public void setWorld( IBlockAccess world)`
- `public void setBlock( Block block)`
- `public void setBlockPos( BlockPos blockPos)`
- `public void updateBlockInfo()`
