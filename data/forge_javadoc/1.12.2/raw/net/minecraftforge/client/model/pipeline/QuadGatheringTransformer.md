---
title: "QuadGatheringTransformer"
description: "public abstract class QuadGatheringTransformer extends java.lang.Object implements IVertexConsumer"
package: "net/minecraftforge/client/model/pipeline"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/model/pipeline/QuadGatheringTransformer.html"
sourceType: javadoc
---

# QuadGatheringTransformer

**Inheritance:** java.lang.Object → net.minecraftforge.client.model.pipeline.QuadGatheringTransformer

## Class signature

```java
public abstract class QuadGatheringTransformer extends java.lang.Object implements IVertexConsumer
```

## Constructors

- `QuadGatheringTransformer()`

## Methods

- `VertexFormat getVertexFormat()`
- `protected abstract void processQuad()`
- `void put(int element, float... data)`
- `void setParent(IVertexConsumer parent)`
- `void setVertexFormat(VertexFormat format)`

## Fields

- `protected byte[] dataLength`
- `protected VertexFormat format`
- `protected IVertexConsumer parent`
- `protected float[][][] quadData`
- `protected int vertices`
