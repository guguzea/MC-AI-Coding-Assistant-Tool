---
title: "VertexBufferConsumer"
description: "Assumes VertexFormatElement is present in the BufferBuilder's vertex format."
package: "net/minecraftforge/client/model/pipeline"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/pipeline/VertexBufferConsumer.html"
sourceType: javadoc
---

# VertexBufferConsumer

## Class signature

```java
public class VertexBufferConsumer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `public VertexBufferConsumer()`
- `public VertexBufferConsumer( BufferBuilder buffer)`

## Methods

- `public VertexFormat getVertexFormat()`
- `public void put(int e, float... data)`
- `public void setBuffer( BufferBuilder buffer)`
- `public void setOffset( BlockPos offset)`
- `public void setQuadTint(int tint)`
- `public void setQuadOrientation( EnumFacing orientation)`
- `public void setApplyDiffuseLighting(boolean diffuse)`
- `public void setTexture( TextureAtlasSprite texture)`

## Description

Assumes VertexFormatElement is present in the BufferBuilder's vertex format.
