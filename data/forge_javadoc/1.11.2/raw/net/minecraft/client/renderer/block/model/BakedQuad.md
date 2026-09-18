---
title: "BakedQuad"
description: "Deprecated. Use constructor with the format argument."
package: "net/minecraft/client/renderer/block/model"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/renderer/block/model/BakedQuad.html"
sourceType: javadoc
---

# BakedQuad

## Class signature

```java
public class BakedQuad extends java.lang.Object implements IVertexProducer
```

## Constructors

- `public BakedQuad(int[] vertexDataIn, int tintIndexIn, EnumFacing faceIn, TextureAtlasSprite spriteIn, boolean applyDiffuseLighting, VertexFormat format)`

## Methods

- `@Deprecated public BakedQuad(int[] vertexDataIn, int tintIndexIn, EnumFacing faceIn, TextureAtlasSprite spriteIn)`
- `public TextureAtlasSprite getSprite()`
- `public int[] getVertexData()`
- `public boolean hasTintIndex()`
- `public int getTintIndex()`
- `public EnumFacing getFace()`
- `public void pipe( IVertexConsumer consumer)`
- `public VertexFormat getFormat()`
- `public boolean shouldApplyDiffuseLighting()`

## Description

Deprecated. Use constructor with the format argument.
