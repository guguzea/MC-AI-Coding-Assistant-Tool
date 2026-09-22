---
title: "UnpackedBakedQuad"
description: "public class UnpackedBakedQuad extends BakedQuad"
package: "net/minecraftforge/client/model/pipeline"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/model/pipeline/UnpackedBakedQuad.html"
sourceType: javadoc
---

# UnpackedBakedQuad

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.BakedQuad → net.minecraftforge.client.model.pipeline.UnpackedBakedQuad

## Class signature

```java
public class UnpackedBakedQuad extends BakedQuad
```

## Constructors

- `UnpackedBakedQuad(float[][][] unpackedData, int tint, EnumFacing orientation, TextureAtlasSprite texture, boolean applyDiffuseLighting, VertexFormat format)`

## Methods

- `int[] getVertexData()`
- `void pipe(IVertexConsumer consumer)`

## Fields

- `protected VertexFormat format`
- `protected boolean packed`
- `protected float[][][] unpackedData`
