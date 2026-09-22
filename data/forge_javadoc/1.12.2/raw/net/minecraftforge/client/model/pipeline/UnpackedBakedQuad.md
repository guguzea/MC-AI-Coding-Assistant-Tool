---
title: "UnpackedBakedQuad"
description: "public class UnpackedBakedQuad extends BakedQuad"
package: "net/minecraftforge/client/model/pipeline"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/pipeline/UnpackedBakedQuad.html"
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
