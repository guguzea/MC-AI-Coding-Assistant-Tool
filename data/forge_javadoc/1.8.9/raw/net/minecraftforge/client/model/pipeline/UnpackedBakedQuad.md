---
title: "UnpackedBakedQuad"
description: "public class UnpackedBakedQuad extends BakedQuad"
package: "net/minecraftforge/client/model/pipeline"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/client/model/pipeline/UnpackedBakedQuad.html"
sourceType: javadoc
---

# UnpackedBakedQuad

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.BakedQuad → net.minecraftforge.client.model.pipeline.UnpackedBakedQuad

## Class signature

```java
public class UnpackedBakedQuad extends BakedQuad
```

## Constructors

- `UnpackedBakedQuad(float[][][] unpackedData, int tint, EnumFacing orientation, VertexFormat format)`

## Methods

- `int[] getVertexData()`
- `void pipe(IVertexConsumer consumer)` — Joined 4 vertex records, each has 7 fields (x, y, z, shadeColor, u, v, ), see FaceBakery.storeVertexData()

## Fields

- `protected VertexFormat format`
- `protected boolean packed`
- `protected float[][][] unpackedData`
