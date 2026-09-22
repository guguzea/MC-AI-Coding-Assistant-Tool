---
title: "BakedQuad"
description: "public class BakedQuad extends java.lang.Object implements IVertexProducer"
package: "net/minecraft/client/renderer/block/model"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/renderer/block/model/BakedQuad.html"
sourceType: javadoc
---

# BakedQuad

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.BakedQuad

## Class signature

```java
public class BakedQuad extends java.lang.Object implements IVertexProducer
```

## Constructors

- `BakedQuad(int[] vertexDataIn, int tintIndexIn, EnumFacing faceIn)`

## Methods

- `EnumFacing getFace()`
- `int getTintIndex()`
- `int[] getVertexData()`
- `boolean hasTintIndex()`
- `void pipe(IVertexConsumer consumer)` — Joined 4 vertex records, each has 7 fields (x, y, z, shadeColor, u, v, ), see FaceBakery.storeVertexData()

## Fields

- `protected EnumFacing face`
- `protected int tintIndex`
- `protected int[] vertexData`
