---
title: "BakedQuad"
description: "public class BakedQuad extends java.lang.Object implements IVertexProducer"
package: "net/minecraft/client/renderer/block/model"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/renderer/block/model/BakedQuad.html"
sourceType: javadoc
---

# BakedQuad

**Inheritance:** java.lang.Object → net.minecraft.client.renderer.block.model.BakedQuad

## Class signature

```java
public class BakedQuad extends java.lang.Object implements IVertexProducer
```

## Constructors

- `@Deprecated BakedQuad(int[] vertexDataIn, int tintIndexIn, EnumFacing faceIn, TextureAtlasSprite spriteIn)`
- `BakedQuad(int[] vertexDataIn, int tintIndexIn, EnumFacing faceIn, TextureAtlasSprite spriteIn, boolean applyDiffuseLighting, VertexFormat format)`

## Methods

- `EnumFacing getFace()`
- `VertexFormat getFormat()`
- `TextureAtlasSprite getSprite()`
- `int getTintIndex()`
- `int[] getVertexData()`
- `boolean hasTintIndex()`
- `void pipe(IVertexConsumer consumer)`
- `boolean shouldApplyDiffuseLighting()`

## Fields

- `protected boolean applyDiffuseLighting`
- `protected EnumFacing face`
- `protected VertexFormat format`
- `protected TextureAtlasSprite sprite`
- `protected int tintIndex`
- `protected int[] vertexData`
